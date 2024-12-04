/*
 * Copyright 2023 gRPC authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

import { CDS_TYPE_URL, CLUSTER_CONFIG_TYPE_URL, decodeSingleResource, UPSTREAM_TLS_CONTEXT_TYPE_URL } from "../resources";
import { XdsDecodeContext, XdsDecodeResult, XdsResourceType } from "./xds-resource-type";
import { LoadBalancingConfig, experimental, logVerbosity } from "@grpc/grpc-js";
import { XdsServerConfig } from "../xds-bootstrap";
import { Duration__Output } from "../generated/google/protobuf/Duration";
import { OutlierDetection__Output } from "../generated/envoy/config/cluster/v3/OutlierDetection";
import { EXPERIMENTAL_CUSTOM_LB_CONFIG, EXPERIMENTAL_OUTLIER_DETECTION, EXPERIMENTAL_RING_HASH } from "../environment";
import { Cluster__Output } from "../generated/envoy/config/cluster/v3/Cluster";
import { UInt32Value__Output } from "../generated/google/protobuf/UInt32Value";
import { Any__Output } from "../generated/google/protobuf/Any";
import { Watcher, XdsClient } from "../xds-client";
import { protoDurationToDuration } from "../duration";
import { convertToLoadBalancingConfig } from "../lb-policy-registry";
import SuccessRateEjectionConfig = experimental.SuccessRateEjectionConfig;
import FailurePercentageEjectionConfig = experimental.FailurePercentageEjectionConfig;
import parseLoadBalancingConfig = experimental.parseLoadBalancingConfig;
import { StringMatcher__Output } from "../generated/envoy/type/matcher/v3/StringMatcher";
import { CertificateValidationContext__Output } from "../generated/envoy/extensions/transport_sockets/tls/v3/CertificateValidationContext";

const TRACER_NAME = 'xds_client';

function trace(text: string): void {
  experimental.trace(logVerbosity.DEBUG, TRACER_NAME, text);
}

export interface SecurityUpdate {
  caCertificateProviderInstance: string;
  identityCertificateProviderInstance?: string;
  subjectAltNameMatchers: StringMatcher__Output[];
}

export interface CdsUpdate {
  type: 'AGGREGATE' | 'EDS' | 'LOGICAL_DNS';
  name: string;
  aggregateChildren: string[];
  lrsLoadReportingServer?: XdsServerConfig;
  maxConcurrentRequests?: number;
  edsServiceName?: string;
  dnsHostname?: string;
  lbPolicyConfig: LoadBalancingConfig[];
  outlierDetectionUpdate?: experimental.OutlierDetectionRawConfig;
  securityUpdate?: SecurityUpdate;
}

function convertOutlierDetectionUpdate(outlierDetection: OutlierDetection__Output | null): experimental.OutlierDetectionRawConfig | undefined {
  if (!EXPERIMENTAL_OUTLIER_DETECTION) {
    return undefined;
  }
  if (!outlierDetection) {
    /* No-op outlier detection config, with all fields unset. */
    return {
      child_policy: []
    };
  }
  let successRateConfig: Partial<SuccessRateEjectionConfig> | undefined = undefined;
  /* Success rate ejection is enabled by default, so we only disable it if
   * enforcing_success_rate is set and it has the value 0 */
  if (!outlierDetection.enforcing_success_rate || outlierDetection.enforcing_success_rate.value > 0) {
    successRateConfig = {
      enforcement_percentage: outlierDetection.enforcing_success_rate?.value,
      minimum_hosts: outlierDetection.success_rate_minimum_hosts?.value,
      request_volume: outlierDetection.success_rate_request_volume?.value,
      stdev_factor: outlierDetection.success_rate_stdev_factor?.value
    };
  }
  let failurePercentageConfig: Partial<FailurePercentageEjectionConfig> | undefined = undefined;
  /* Failure percentage ejection is disabled by default, so we only enable it
   * if enforcing_failure_percentage is set and it has a value greater than 0 */
  if (outlierDetection.enforcing_failure_percentage && outlierDetection.enforcing_failure_percentage.value > 0) {
    failurePercentageConfig = {
      enforcement_percentage: outlierDetection.enforcing_failure_percentage.value,
      minimum_hosts: outlierDetection.failure_percentage_minimum_hosts?.value,
      request_volume: outlierDetection.failure_percentage_request_volume?.value,
      threshold: outlierDetection.failure_percentage_threshold?.value
    }
  }
  return {
    interval: outlierDetection.interval ? protoDurationToDuration(outlierDetection.interval) : undefined,
    base_ejection_time: outlierDetection.base_ejection_time ? protoDurationToDuration(outlierDetection.base_ejection_time) : undefined,
    max_ejection_time: outlierDetection.max_ejection_time ? protoDurationToDuration(outlierDetection.max_ejection_time) : undefined,
    max_ejection_percent: outlierDetection.max_ejection_percent?.value,
    success_rate_ejection: successRateConfig,
    failure_percentage_ejection: failurePercentageConfig,
    child_policy: []
  };
}

export class ClusterResourceType extends XdsResourceType {
  private static singleton: ClusterResourceType = new ClusterResourceType();

  private constructor() {
    super();
  }

  static get() {
    return ClusterResourceType.singleton;
  }

  getTypeUrl(): string {
    return 'envoy.config.cluster.v3.Cluster';
  }

  private validateNonnegativeDuration(duration: Duration__Output | null): boolean {
    if (!duration) {
      return true;
    }
    /* The maximum values here come from the official Protobuf documentation:
     * https://developers.google.com/protocol-buffers/docs/reference/google.protobuf#google.protobuf.Duration
     */
    return Number(duration.seconds) >= 0 &&
           Number(duration.seconds) <= 315_576_000_000 &&
           duration.nanos >= 0 &&
           duration.nanos <= 999_999_999;
  }

  private validatePercentage(percentage: UInt32Value__Output | null): boolean {
    if (!percentage) {
      return true;
    }
    return percentage.value >=0 && percentage.value <= 100;
  }

  private validateResource(context: XdsDecodeContext, message: Cluster__Output): CdsUpdate | null {
    let lbPolicyConfig: LoadBalancingConfig;
    if (EXPERIMENTAL_CUSTOM_LB_CONFIG && message.load_balancing_policy) {
      try {
        lbPolicyConfig = convertToLoadBalancingConfig(message.load_balancing_policy);
      } catch (e) {
        trace('LB policy config parsing failed with error ' + e);
        return null;
      }
      try {
        parseLoadBalancingConfig(lbPolicyConfig);
      } catch (e) {
        trace('LB policy config parsing failed with error ' + e);
        return null;
      }
    } else if (message.lb_policy === 'ROUND_ROBIN') {
      lbPolicyConfig = {
        xds_wrr_locality: {
          child_policy: [{round_robin: {}}]
        }
      };
    } else if(EXPERIMENTAL_RING_HASH && message.lb_policy === 'RING_HASH') {
      if (message.ring_hash_lb_config && message.ring_hash_lb_config.hash_function !== 'XX_HASH') {
        return null;
      }
      const minRingSize = message.ring_hash_lb_config?.minimum_ring_size ? Number(message.ring_hash_lb_config.minimum_ring_size.value) : 1024;
      if (minRingSize > 8_388_608) {
        return null;
      }
      const maxRingSize = message.ring_hash_lb_config?.maximum_ring_size ? Number(message.ring_hash_lb_config.maximum_ring_size.value) : 8_388_608;
      if (maxRingSize > 8_388_608) {
        return null;
      }
      lbPolicyConfig = {
        ring_hash: {
          min_ring_size: minRingSize,
          max_ring_size: maxRingSize
        }
      };
    } else {
      return null;
    }
    if (message.lrs_server) {
      if (!message.lrs_server.self) {
        return null;
      }
    }
    if (EXPERIMENTAL_OUTLIER_DETECTION) {
      if (message.outlier_detection) {
        if (!this.validateNonnegativeDuration(message.outlier_detection.interval)) {
          return null;
        }
        if (!this.validateNonnegativeDuration(message.outlier_detection.base_ejection_time)) {
          return null;
        }
        if (!this.validateNonnegativeDuration(message.outlier_detection.max_ejection_time)) {
          return null;
        }
        if (!this.validatePercentage(message.outlier_detection.max_ejection_percent)) {
          return null;
        }
        if (!this.validatePercentage(message.outlier_detection.enforcing_success_rate)) {
          return null;
        }
        if (!this.validatePercentage(message.outlier_detection.failure_percentage_threshold)) {
          return null;
        }
        if (!this.validatePercentage(message.outlier_detection.enforcing_failure_percentage)) {
          return null;
        }
      }
    }
    let securityUpdate: SecurityUpdate | undefined = undefined;
    if (message.transport_socket) {
      const transportSocket = message.transport_socket;
      if (!transportSocket.typed_config) {
        trace('transportSocket.typed_config missing');
        return null;
      }
      if (transportSocket.typed_config.type_url !== UPSTREAM_TLS_CONTEXT_TYPE_URL) {
        trace('Incorrect transportSocket.typed_config.type_url: ' + transportSocket.typed_config.type_url)
        return null;
      }
      const upstreamTlsContext = decodeSingleResource(UPSTREAM_TLS_CONTEXT_TYPE_URL, transportSocket.typed_config.value);
      if (!upstreamTlsContext.common_tls_context) {
        trace('Could not decode UpstreamTlsContext');
        return null;
      }
      trace('Decoded UpstreamTlsContext: ' + JSON.stringify(upstreamTlsContext, undefined, 2));
      const commonTlsContext = upstreamTlsContext.common_tls_context;
      let validationContext: CertificateValidationContext__Output;
      switch (commonTlsContext.validation_context_type) {
        case 'validation_context_sds_secret_config':
          return null;
        case 'validation_context':
          if (!commonTlsContext.validation_context) {
            return null;
          }
          validationContext = commonTlsContext.validation_context;
          break;
        case 'combined_validation_context':
          if (!commonTlsContext.combined_validation_context?.default_validation_context) {
            return null;
          }
          validationContext = commonTlsContext.combined_validation_context.default_validation_context;
          break;
        default:
          return null;
      }
      if (!validationContext.ca_certificate_provider_instance) {
        return null;
      }
      if (!(validationContext.ca_certificate_provider_instance.instance_name in context.bootstrap.certificateProviders)) {
        return null;
      }
      if (validationContext.verify_certificate_spki.length > 0) {
        return null;
      }
      if (validationContext.verify_certificate_hash.length > 0) {
        return null;
      }
      if (validationContext.require_signed_certificate_timestamp) {
        return null;
      }
      if (validationContext.crl) {
        return null;
      }
      if (validationContext.custom_validator_config) {
        return null;
      }
      if (commonTlsContext.tls_certificate_provider_instance) {
        if (!(commonTlsContext.tls_certificate_provider_instance.instance_name in context.bootstrap.certificateProviders)) {
          return null;
        }
      } else {
        if (commonTlsContext.tls_certificates.length > 0 || commonTlsContext.tls_certificate_sds_secret_configs.length > 0) {
          return null;
        }
      }
      if (commonTlsContext.tls_params) {
        return null;
      }
      if (commonTlsContext.custom_handshaker) {
        return null;
      }
      securityUpdate = {
        caCertificateProviderInstance: validationContext.ca_certificate_provider_instance.instance_name,
        identityCertificateProviderInstance: commonTlsContext.tls_certificate_provider_instance?.instance_name,
        subjectAltNameMatchers: validationContext.match_subject_alt_names
      }
    }
    if (message.cluster_discovery_type === 'cluster_type') {
      if (!(message.cluster_type?.typed_config && message.cluster_type.typed_config.type_url === CLUSTER_CONFIG_TYPE_URL)) {
        return null;
      }
      const clusterConfig = decodeSingleResource(CLUSTER_CONFIG_TYPE_URL, message.cluster_type.typed_config.value);
      if (clusterConfig.clusters.length === 0) {
        return null;
      }
      return {
        type: 'AGGREGATE',
        name: message.name,
        aggregateChildren: clusterConfig.clusters,
        outlierDetectionUpdate: convertOutlierDetectionUpdate(null),
        lbPolicyConfig: [lbPolicyConfig],
        securityUpdate: securityUpdate
      };
    } else {
      let maxConcurrentRequests: number | undefined = undefined;
      for (const threshold of message.circuit_breakers?.thresholds ?? []) {
        if (threshold.priority === 'DEFAULT') {
          maxConcurrentRequests = threshold.max_requests?.value;
        }
      }
      if (message.type === 'EDS') {
        if (!message.eds_cluster_config?.eds_config?.ads && !message.eds_cluster_config?.eds_config?.self) {
          return null;
        }
        if (message.name.startsWith('xdstp:') && message.eds_cluster_config.service_name === '') {
          return null;
        }
        return {
          type: 'EDS',
          name: message.name,
          aggregateChildren: [],
          maxConcurrentRequests: maxConcurrentRequests,
          edsServiceName: message.eds_cluster_config.service_name === '' ? undefined : message.eds_cluster_config.service_name,
          lrsLoadReportingServer: message.lrs_server ? context.server : undefined,
          outlierDetectionUpdate: convertOutlierDetectionUpdate(message.outlier_detection),
          lbPolicyConfig: [lbPolicyConfig],
          securityUpdate: securityUpdate
        }
      } else if (message.type === 'LOGICAL_DNS') {
        if (!message.load_assignment) {
          return null;
        }
        if (message.load_assignment.endpoints.length !== 1) {
          return null;
        }
        if (message.load_assignment.endpoints[0].lb_endpoints.length !== 1) {
          return null;
        }
        const socketAddress = message.load_assignment.endpoints[0].lb_endpoints[0].endpoint?.address?.socket_address;
        if (!socketAddress) {
          return null;
        }
        if (socketAddress.address === '') {
          return null;
        }
        if (socketAddress.port_specifier !== 'port_value') {
          return null;
        }
        return {
          type: 'LOGICAL_DNS',
          name: message.name,
          aggregateChildren: [],
          maxConcurrentRequests: maxConcurrentRequests,
          dnsHostname: `${socketAddress.address}:${socketAddress.port_value}`,
          lrsLoadReportingServer: message.lrs_server ? context.server : undefined,
          outlierDetectionUpdate: convertOutlierDetectionUpdate(message.outlier_detection),
          lbPolicyConfig: [lbPolicyConfig],
          securityUpdate: securityUpdate
        };
      }
    }
    return null;
  }

  decode(context:XdsDecodeContext, resource: Any__Output): XdsDecodeResult {
    if (resource.type_url !== CDS_TYPE_URL) {
      throw new Error(
        `ADS Error: Invalid resource type ${resource.type_url}, expected ${CDS_TYPE_URL}`
      );
    }
    const message = decodeSingleResource(CDS_TYPE_URL, resource.value);
    trace('Decoded raw resource of type ' + CDS_TYPE_URL + ': ' + JSON.stringify(message, undefined, 2));
    const validatedMessage = this.validateResource(context, message);
    if (validatedMessage) {
      return {
        name: validatedMessage.name,
        value: validatedMessage
      };
    } else {
      return {
        name: message.name,
        error: 'Cluster message validation failed'
      };
    }
  }

  allResourcesRequiredInSotW(): boolean {
    return true;
  }

  static startWatch(client: XdsClient, name: string, watcher: Watcher<CdsUpdate>) {
    client.watchResource(ClusterResourceType.get(), name, watcher);
  }

  static cancelWatch(client: XdsClient, name: string, watcher: Watcher<CdsUpdate>) {
    client.cancelResourceWatch(ClusterResourceType.get(), name, watcher);
  }
}
