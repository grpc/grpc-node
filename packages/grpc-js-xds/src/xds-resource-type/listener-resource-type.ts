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

import { logVerbosity, experimental } from "@grpc/grpc-js";
import { EXPERIMENTAL_FAULT_INJECTION } from "../environment";
import { Listener__Output } from "../generated/envoy/config/listener/v3/Listener";
import { Any__Output } from "../generated/google/protobuf/Any";
import { DOWNSTREAM_TLS_CONTEXT_TYPE_URL, HTTP_CONNECTION_MANGER_TYPE_URL, LDS_TYPE_URL, decodeSingleResource } from "../resources";
import { ValidationResult, XdsDecodeContext, XdsDecodeResult, XdsResourceType } from "./xds-resource-type";
import { getTopLevelFilterUrl, validateTopLevelFilter } from "../http-filter";
import { RouteConfigurationResourceType } from "./route-config-resource-type";
import { Watcher, XdsClient } from "../xds-client";
import { CidrRange, cidrRangeEqual, cidrRangeMessageToCidrRange, normalizeCidrRange } from "../cidr";
import { FilterChainMatch__Output, _envoy_config_listener_v3_FilterChainMatch_ConnectionSourceType } from "../generated/envoy/config/listener/v3/FilterChainMatch";
import { crossProduct } from "../cross-product";
import { FilterChain__Output } from "../generated/envoy/config/listener/v3/FilterChain";
import { HttpConnectionManager__Output } from "../generated/envoy/extensions/filters/network/http_connection_manager/v3/HttpConnectionManager";
import { CertificateValidationContext__Output } from "../generated/envoy/extensions/transport_sockets/tls/v3/CertificateValidationContext";
import { TransportSocket__Output } from "../generated/envoy/config/core/v3/TransportSocket";

const TRACER_NAME = 'xds_client';

function trace(text: string): void {
  experimental.trace(logVerbosity.DEBUG, TRACER_NAME, text);
}

const ROUTER_FILTER_URL = 'type.googleapis.com/envoy.extensions.filters.http.router.v3.Router';

type ConnectionSourceType = keyof typeof _envoy_config_listener_v3_FilterChainMatch_ConnectionSourceType;

interface NormalizedFilterChainMatch {
  destinationPort?: number;
  prefixRange?: CidrRange;
  sourceType: ConnectionSourceType;
  sourcePrefixRange?: CidrRange;
  sourcePort?: number;
  serverName?: string;
  transportProtocol: string;
  applicationProtocol?: string;
}

function normalizedFilterChainMatchEquals(first: NormalizedFilterChainMatch, second: NormalizedFilterChainMatch) {
  return (
    first.destinationPort === second.destinationPort &&
    cidrRangeEqual(first.prefixRange, second.prefixRange) &&
    first.sourceType === second.sourceType &&
    cidrRangeEqual(first.sourcePrefixRange, second.sourcePrefixRange) &&
    first.sourcePort === second.sourcePort &&
    first.serverName === second.serverName &&
    first.transportProtocol === second.transportProtocol &&
    first.applicationProtocol === second.applicationProtocol
  );
}

function normalizeFilterChainMatch(filterChainMatch: FilterChainMatch__Output): NormalizedFilterChainMatch[] {
  const prefixRanges = filterChainMatch.prefix_ranges.map(cidrRangeMessageToCidrRange).map(normalizeCidrRange);
  const sourcePrefixRanges = filterChainMatch.source_prefix_ranges.map(cidrRangeMessageToCidrRange).map(normalizeCidrRange);
  const sourcePorts = filterChainMatch.source_ports;
  const serverNames = filterChainMatch.server_names;
  const applicationProtocols = filterChainMatch.application_protocols;
  const fieldCrossProduct = crossProduct([prefixRanges, sourcePrefixRanges, sourcePorts, serverNames, applicationProtocols] as [CidrRange[], CidrRange[], number[], string[], string[]]);
  return fieldCrossProduct.map(([prefixRange, sourcePrefixRange, sourcePort, serverName, applicationProtocol]) => ({
    destinationPort: filterChainMatch.destination_port?.value,
    prefixRange,
    sourceType: filterChainMatch.source_type,
    sourcePrefixRange,
    sourcePort,
    serverName,
    transportProtocol: filterChainMatch.transport_protocol,
    applicationProtocol: applicationProtocol
  }));
}

/**
 * @param httpConnectionManager
 * @param
 * @returns A list of validation errors, if there are any. An empty list indicates success
 */
function validateHttpConnectionManager(httpConnectionManager: HttpConnectionManager__Output, client: boolean): string[] {
  const errors: string[] = [];
  if (EXPERIMENTAL_FAULT_INJECTION) {
    const filterNames = new Set<string>();
    for (const [index, httpFilter] of httpConnectionManager.http_filters.entries()) {
      if (filterNames.has(httpFilter.name)) {
        errors.push(`duplicate HTTP filter name: ${httpFilter.name}`);
      }
      filterNames.add(httpFilter.name);
      if (!validateTopLevelFilter(httpFilter, client)) {
        errors.push(`${httpFilter.name} filter validation failed`);
      }
      /* Validate that the last filter, and only the last filter, is the
       * router filter. */
      const filterUrl = getTopLevelFilterUrl(httpFilter.typed_config!)
      if (index < httpConnectionManager.http_filters.length - 1) {
        if (filterUrl === ROUTER_FILTER_URL) {
          errors.push('router filter is before the end of the list');
        }
      } else {
        if (filterUrl !== ROUTER_FILTER_URL) {
          errors.push(`final filter is ${filterUrl}`);
        }
      }
    }
  }
  switch (httpConnectionManager.route_specifier) {
    case 'rds':
      if (!httpConnectionManager.rds?.config_source?.ads && !httpConnectionManager.rds?.config_source?.self) {
        errors.push('rds.config_source.ads and rds.config_source.self both unset');
      }
      break;
    case 'route_config': {
      const routeConfigValidationResult = RouteConfigurationResourceType.get().validateResource(httpConnectionManager.route_config!);
      if (!routeConfigValidationResult.valid) {
        errors.push(...routeConfigValidationResult.errors.map(error => `route_config: ${error}`));
      }
      break;
    }
    default:
      errors.push(`unexpected route_specifier ${httpConnectionManager.route_specifier}`);
  }
  return errors;
}

/**
 * @param context
 * @param transportSocket A list of validation errors, if there are any. An empty list indicates success
 */
function validateTransportSocket(context: XdsDecodeContext, transportSocket: TransportSocket__Output): string[] {
  const errors: string[] = []
  if (transportSocket.name !== 'envoy.transport_sockets.tls') {
    errors.push(`Unexpected transport_socket.name: ${transportSocket.name}`);
  }
  if (!transportSocket.typed_config) {
    errors.push('transport_socket.typed_config missing');
    return errors;
  }
  if (transportSocket.typed_config.type_url !== DOWNSTREAM_TLS_CONTEXT_TYPE_URL) {
    errors.push(`Unexpected transport_socket.typed_config.type_url: ${transportSocket.typed_config.type_url}`);
    return errors;
  }
  const downstreamTlsContext = decodeSingleResource(DOWNSTREAM_TLS_CONTEXT_TYPE_URL, transportSocket.typed_config.value);
  trace('Decoded DownstreamTlsContext: ' + JSON.stringify(downstreamTlsContext, undefined, 2));
  if (downstreamTlsContext.require_sni?.value) {
    errors.push(`DownstreamTlsContext.require_sni set`);
  }
  if (downstreamTlsContext.ocsp_staple_policy !== 'LENIENT_STAPLING') {
    errors.push(`Unsupported DownstreamTlsContext.ocsp_staple_policy: ${downstreamTlsContext.ocsp_staple_policy}`);
  }
  if (!downstreamTlsContext.common_tls_context) {
    errors.push('Missing DownstreamTlsContext.common_tls_context');
    return errors;
  }
  const commonTlsContext = downstreamTlsContext.common_tls_context;
  let validationContext: CertificateValidationContext__Output | null = null;
  if (commonTlsContext.validation_context_type) {
    switch (commonTlsContext.validation_context_type) {
      case 'validation_context_sds_secret_config':
        errors.push('Unexpected DownstreamTlsContext.common_tls_context.validation_context_sds_secret_config');
        break;
      case 'validation_context':
        if (!commonTlsContext.validation_context) {
          errors.push('Empty DownstreamTlsContext.common_tls_context.validation_context');
          break;
        }
        validationContext = commonTlsContext.validation_context;
        break;
      case 'combined_validation_context':
        if (!commonTlsContext.combined_validation_context) {
          errors.push('Empty DownstreamTlsContext.common_tls_context.combined_validation_context')
          break;
        }
        validationContext = commonTlsContext.combined_validation_context.default_validation_context;
        break;
      default:
        errors.push(`Unsupported DownstreamTlsContext.common_tls_context.validation_context_type: ${commonTlsContext.validation_context_type}`);
    }
  }
  if (downstreamTlsContext.require_client_certificate && !validationContext) {
    errors.push('DownstreamTlsContext.require_client_certificate set without any validationContext');
  }
  if (validationContext) {
    if (validationContext.ca_certificate_provider_instance && !(validationContext.ca_certificate_provider_instance.instance_name in context.bootstrap.certificateProviders)) {
      errors.push(`Unmatched CertificateValidationContext.ca_certificate_provider.instance_name: ${validationContext.ca_certificate_provider_instance.instance_name}`);
    }
    if (validationContext.verify_certificate_spki.length > 0) {
      errors.push('CertificateValidationContext.verify_certificate_spki populated');
    }
    if (validationContext.verify_certificate_hash.length > 0) {
      errors.push('CertificateValidationContext.verify_certificate_hash populated');
    }
    if (validationContext.require_signed_certificate_timestamp) {
      errors.push('CertificateValidationContext.require_signed_certificate_timestamp set');
    }
    if (validationContext.crl) {
      errors.push('CertificateValidationContext.crl set');
    }
    if (validationContext.custom_validator_config) {
      errors.push('CertificateValidationContext.custom_validator_config set');
    }
  }
  if (commonTlsContext.tls_certificate_provider_instance) {
    if (!(commonTlsContext.tls_certificate_provider_instance.instance_name in context.bootstrap.certificateProviders)) {
      errors.push(`Unmatched DownstreamTlsContext.tls_certificate_provider_instance.instance_name: ${commonTlsContext.tls_certificate_provider_instance.instance_name}`);
    }
  } else {
    errors.push('DownstreamTlsContext.common_tls_context.tls_certificate_provider_instance');
  }
  if (commonTlsContext.tls_params) {
    errors.push('DownstreamTlsContext.common_tls_context.tls_params set');
  }
  if (commonTlsContext.custom_handshaker) {
    errors.push('DownstreamTlsContext.common_tls_context.custom_handshaker set');
  }
  return errors;
}

/**
 * @param context
 * @param filterChain
 * @returns A list of validation errors, if there are any. An empty list indicates success
 */
function validateFilterChain(context: XdsDecodeContext, filterChain: FilterChain__Output): string[] {
  const errors: string[] = [];
  if (filterChain.filters.length === 1) {
    if (filterChain.filters[0].typed_config?.type_url === HTTP_CONNECTION_MANGER_TYPE_URL) {
      const httpConnectionManager = decodeSingleResource(HTTP_CONNECTION_MANGER_TYPE_URL, filterChain.filters[0].typed_config.value);
      errors.push(...validateHttpConnectionManager(httpConnectionManager, false).map(error => `filters[0].typed_config: ${error}`));
    } else {
      errors.push(`Unexpected value of filters[0].typed_config.type_url: ${filterChain.filters[0].typed_config?.type_url}`);
    }
  } else {
    errors.push(`Incorrect filters length: ${filterChain.filters.length}`);
  }
  if (filterChain.transport_socket) {
    errors.push(...validateTransportSocket(context, filterChain.transport_socket));
  }
  return errors;
}

export class ListenerResourceType extends XdsResourceType {
  private static singleton: ListenerResourceType = new ListenerResourceType();
  private constructor() {
    super();
  }

  static get() {
    return ListenerResourceType.singleton;
  }
  getTypeUrl(): string {
    return 'envoy.config.listener.v3.Listener';
  }

  private validateResource(context: XdsDecodeContext, message: Listener__Output): ValidationResult<Listener__Output> {
    const errors: string[] = [];
    if (message.api_listener?.api_listener) {
      if (
        message.api_listener.api_listener.type_url === HTTP_CONNECTION_MANGER_TYPE_URL
      ) {
        const httpConnectionManager = decodeSingleResource(HTTP_CONNECTION_MANGER_TYPE_URL, message.api_listener!.api_listener.value);
        errors.push(...validateHttpConnectionManager(httpConnectionManager, true).map(error => `api_listener.api_listener: ${error}`));
      } else {
        errors.push(`api_listener.api_listener.type_url != ${HTTP_CONNECTION_MANGER_TYPE_URL}`);
      }
    }
    if (message.listener_filters.length > 0) {
      errors.push('listener_filters populated');
    }
    if (message.use_original_dst?.value === true) {
      errors.push('use_original_dst.value == true');
    }
    const seenMatches: NormalizedFilterChainMatch[] = [];
    for (const filterChain of message.filter_chains) {
      if (filterChain.filter_chain_match) {
        const normalizedMatches = normalizeFilterChainMatch(filterChain.filter_chain_match);
        for (const match of normalizedMatches) {
          if (seenMatches.some(prevMatch => normalizedFilterChainMatchEquals(match, prevMatch))) {
            errors.push(`duplicate filter_chain_match entry in filter chain ${filterChain.name}`);
          }
          seenMatches.push(match);
        }
      }
      errors.push(...validateFilterChain(context, filterChain).map(error => `filter_chains[${filterChain.name}]: ${error}`));
    }
    if (message.default_filter_chain) {
      errors.push(...validateFilterChain(context, message.default_filter_chain).map(error => `default_filter_chain: ${error}`));
    }
    if (!message.api_listener && !message.default_filter_chain && message.filter_chains.length === 0) {
      errors.push('No api_listener and no filter_chains and no default_filter_chain');
    }
    if (errors.length === 0) {
      return {
        valid: true,
        result: message
      };
    } else {
      return {
        valid: false,
        errors
      };
    }
  }

  decode(context: XdsDecodeContext, resource: Any__Output): XdsDecodeResult {
    if (resource.type_url !== LDS_TYPE_URL) {
      throw new Error(
        `ADS Error: Invalid resource type ${resource.type_url}, expected ${LDS_TYPE_URL}`
      );
    }
    const message = decodeSingleResource(LDS_TYPE_URL, resource.value);
    trace('Decoded raw resource of type ' + LDS_TYPE_URL + ': ' + JSON.stringify(message, (key, value) => (value && value.type === 'Buffer' && Array.isArray(value.data)) ? (value.data as Number[]).map(n => n.toString(16)).join('') : value, 2));
    const validationResult = this.validateResource(context, message);
    if (validationResult.valid) {
      return {
        name: validationResult.result.name,
        value: validationResult.result
      };
    } else {
      return {
        name: message.name,
        error: `Listener message validation failed: [${validationResult.errors}]`
      };
    }
  }

  allResourcesRequiredInSotW(): boolean {
    return true;
  }

  static startWatch(client: XdsClient, name: string, watcher: Watcher<Listener__Output>) {
    client.watchResource(ListenerResourceType.get(), name, watcher);
  }

  static cancelWatch(client: XdsClient, name: string, watcher: Watcher<Listener__Output>) {
    client.cancelResourceWatch(ListenerResourceType.get(), name, watcher);
  }
}
