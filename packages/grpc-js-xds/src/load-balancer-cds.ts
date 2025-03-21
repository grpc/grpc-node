/*
 * Copyright 2020 gRPC authors.
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

import { connectivityState, status, Metadata, logVerbosity, experimental, LoadBalancingConfig, ChannelOptions } from '@grpc/grpc-js';
import { getSingletonXdsClient, Watcher, XdsClient } from './xds-client';
import { Cluster__Output } from './generated/envoy/config/cluster/v3/Cluster';
import Endpoint = experimental.Endpoint;
import UnavailablePicker = experimental.UnavailablePicker;
import ChildLoadBalancerHandler = experimental.ChildLoadBalancerHandler;
import LoadBalancer = experimental.LoadBalancer;
import ChannelControlHelper = experimental.ChannelControlHelper;
import registerLoadBalancerType = experimental.registerLoadBalancerType;
import TypedLoadBalancingConfig = experimental.TypedLoadBalancingConfig;
import parseLoadBalancingConfig = experimental.parseLoadBalancingConfig;
import StatusOr = experimental.StatusOr;
import statusOrFromValue = experimental.statusOrFromValue;
import { XdsConfig } from './xds-dependency-manager';
import { LocalityEndpoint, PriorityChildRaw } from './load-balancer-priority';
import { Locality__Output } from './generated/envoy/config/core/v3/Locality';
import { AGGREGATE_CLUSTER_BACKWARDS_COMPAT, EXPERIMENTAL_OUTLIER_DETECTION } from './environment';
import { XDS_CLIENT_KEY, XDS_CONFIG_KEY } from './resolver-xds';
import { ContainsValueMatcher, Matcher, PrefixValueMatcher, RejectValueMatcher, SafeRegexValueMatcher, SuffixValueMatcher, ValueMatcher } from './matcher';
import { StringMatcher__Output } from './generated/envoy/type/matcher/v3/StringMatcher';
import { isIPv6 } from 'net';
import { formatIPv6, parseIPv6 } from './cidr';

const TRACER_NAME = 'cds_balancer';

function trace(text: string): void {
  experimental.trace(logVerbosity.DEBUG, TRACER_NAME, text);
}

const TYPE_NAME = 'cds';

class CdsLoadBalancingConfig implements TypedLoadBalancingConfig {
  getLoadBalancerName(): string {
    return TYPE_NAME;
  }

  toJsonObject(): object {
    return {
      [TYPE_NAME]: {
        cluster: this.cluster
      }
    }
  }

  constructor(private cluster: string) {}

  getCluster() {
    return this.cluster;
  }

  static createFromJson(obj: any): CdsLoadBalancingConfig {
    if (!('cluster' in obj && typeof obj.cluster === 'string')) {
      throw new Error('cds config must have a string field cluster');
    }
    return new CdsLoadBalancingConfig(obj.cluster);
  }
}

type SupportedSanType = 'DNS' | 'URI' | 'email' | 'IP Address';

function isSupportedSanType(type: string): type is SupportedSanType {
  return ['DNS', 'URI', 'email', 'IP Address'].includes(type);
}

class DnsExactValueMatcher implements ValueMatcher {
  constructor(private targetValue: string, private ignoreCase: boolean) {
    if (ignoreCase) {
      this.targetValue = this.targetValue.toLowerCase();
    }
  }
  apply(entry: string): boolean {
    const colonIndex = entry.indexOf(':');
    if (colonIndex < 0) {
      return false;
    }
    const type = entry.substring(0, colonIndex);
    let value = entry.substring(colonIndex + 1);
    if (!isSupportedSanType(type)) {
      return false;
    }
    if (this.ignoreCase) {
      value = value.toLowerCase();
    }
    if (type === 'DNS' && value.startsWith('*.') && this.targetValue.includes('.', 1)) {
      return value.substring(2) === this.targetValue.substring(this.targetValue.indexOf('.') + 1);
    } else {
      return value === this.targetValue;
    }
  }

  toString() {
    return 'DnsExact(' + this.targetValue + ', ignore_case=' + this.ignoreCase + ')';
  }
}

function canonicalizeSanEntryValue(type: SupportedSanType, value: string): string {
  if (type === 'IP Address' && isIPv6(value)) {
    return formatIPv6(parseIPv6(value));
  }
  return value;
}

class SanEntryMatcher implements ValueMatcher {
  private childMatcher: ValueMatcher;
  constructor(matcherConfig: StringMatcher__Output) {
    const ignoreCase = matcherConfig.ignore_case;
    switch(matcherConfig.match_pattern) {
      case 'exact':
        throw new Error('Unexpected exact matcher in SAN entry matcher');
      case 'prefix':
        this.childMatcher = new PrefixValueMatcher(matcherConfig.prefix!, ignoreCase);
        break;
      case 'suffix':
        this.childMatcher = new SuffixValueMatcher(matcherConfig.suffix!, ignoreCase);
        break;
      case 'safe_regex':
        this.childMatcher = new SafeRegexValueMatcher(matcherConfig.safe_regex!.regex);
        break;
      case 'contains':
        this.childMatcher = new ContainsValueMatcher(matcherConfig.contains!, ignoreCase);
        break;
      default:
        this.childMatcher = new RejectValueMatcher();
    }
  }
  apply(entry: string): boolean {
    const colonIndex = entry.indexOf(':');
    if (colonIndex < 0) {
      return false;
    }
    const type = entry.substring(0, colonIndex);
    let value = entry.substring(colonIndex + 1);
    if (!isSupportedSanType(type)) {
      return false;
    }
    value = canonicalizeSanEntryValue(type, value);
    return this.childMatcher.apply(value);
  }
  toString(): string {
    return this.childMatcher.toString();
  }

}

export class SanMatcher implements ValueMatcher {
  private childMatchers: ValueMatcher[];
  constructor(matcherConfigs: StringMatcher__Output[]) {
    this.childMatchers = matcherConfigs.map(config => {
      if (config.match_pattern === 'exact') {
        return new DnsExactValueMatcher(config.exact!, config.ignore_case);
      } else {
        return new SanEntryMatcher(config);
      }
    });
  }
  apply(value: string): boolean {
    if (this.childMatchers.length === 0) {
      return true;
    }
    for (const entry of value.split(', ')) {
      for (const matcher of this.childMatchers) {
        const checkResult = matcher.apply(entry);
        if (checkResult) {
          return true;
        }
      }
    }
    return false;
  }
  toString(): string {
    return 'SanMatcher(' + this.childMatchers.map(matcher => matcher.toString()).sort().join(', ') + ')';
  }

  equals(other: SanMatcher): boolean {
    return this.toString() === other.toString();
  }
}

export const CA_CERT_PROVIDER_KEY = 'grpc.internal.ca_cert_provider';
export const IDENTITY_CERT_PROVIDER_KEY = 'grpc.internal.identity_cert_provider';
export const SAN_MATCHER_KEY = 'grpc.internal.san_matcher';

const RECURSION_DEPTH_LIMIT = 15;

function getLeafClusters(xdsConfig: XdsConfig, rootCluster: string, depth = 0): string[] {
  if (depth > RECURSION_DEPTH_LIMIT) {
    throw new Error(`aggregate cluster graph exceeds max depth of ${RECURSION_DEPTH_LIMIT}`);
  }
  const maybeClusterConfig = xdsConfig.clusters.get(rootCluster);
  if (!maybeClusterConfig) {
    return [];
  }
  if (!maybeClusterConfig.ok) {
    return [rootCluster];
  }
  if (maybeClusterConfig.value.children.type === 'aggregate') {
    return ([] as string[]).concat(...maybeClusterConfig.value.children.leafClusters.map(childCluster => getLeafClusters(xdsConfig, childCluster, depth + 1)))
  } else {
    return [rootCluster];
  }
}

export function localityToName(locality: Locality__Output) {
  return `{region=${locality.region},zone=${locality.zone},sub_zone=${locality.sub_zone}}`;
}

export const ROOT_CLUSTER_KEY = 'grpc.internal.root_cluster';

export class CdsLoadBalancer implements LoadBalancer {
  private childBalancer: ChildLoadBalancerHandler;

  private latestConfig: CdsLoadBalancingConfig | null = null;
  private localityPriorities: Map<string, number> = new Map();
  private priorityNames: string[] = [];
  private nextPriorityChildNumber = 0;

  private latestSanMatcher: SanMatcher | null = null;

  constructor(private readonly channelControlHelper: ChannelControlHelper) {
    this.childBalancer = new ChildLoadBalancerHandler(channelControlHelper);
  }

  private getNextPriorityName(cluster: string) {
    return `cluster=${cluster}, child_number=${this.nextPriorityChildNumber++}`;
  }

  updateAddressList(
    endpointList: StatusOr<Endpoint[]>,
    lbConfig: TypedLoadBalancingConfig,
    options: ChannelOptions,
    resolutionNote: string
  ): boolean {
    if (!(lbConfig instanceof CdsLoadBalancingConfig)) {
      trace('Discarding address list update with unrecognized config ' + JSON.stringify(lbConfig, undefined, 2));
      return false;
    }
    trace('Received update with config ' + JSON.stringify(lbConfig, undefined, 2));
    const xdsConfig = options[XDS_CONFIG_KEY] as XdsConfig;
    const clusterName = lbConfig.getCluster();
    const maybeClusterConfig = xdsConfig.clusters.get(clusterName);
    if (!maybeClusterConfig) {
      trace('Received update with no config for cluster ' + clusterName);
      return false;
    }
    if (!maybeClusterConfig.ok) {
      this.childBalancer.destroy();
      this.channelControlHelper.updateState(connectivityState.TRANSIENT_FAILURE, new UnavailablePicker(maybeClusterConfig.error), maybeClusterConfig.error.details);
      return true;
    }
    const clusterConfig = maybeClusterConfig.value;

    if (clusterConfig.children.type === 'aggregate') {
      let leafClusters: string[];
      try {
        leafClusters = getLeafClusters(xdsConfig, clusterName);
      } catch (e) {
        trace('xDS config parsing failed with error ' + (e as Error).message);
        const errorMessage = `xDS config parsing failed with error ${(e as Error).message}`;
        this.channelControlHelper.updateState(connectivityState.TRANSIENT_FAILURE, new UnavailablePicker({code: status.UNAVAILABLE, details: `${errorMessage} Resolution note: ${resolutionNote}`}), errorMessage);
        return true;
      }
      const priorityChildren: {[name: string]: PriorityChildRaw} = {};
      for (const cluster of leafClusters) {
        priorityChildren[cluster] = {
          config: [{
            cds: {
              cluster: cluster
            }
          }],
          ignore_reresolution_requests: false
        };
      }
      const childConfig = {
        priority: {
          children: priorityChildren,
          priorities: leafClusters
        }
      };
      let typedChildConfig: TypedLoadBalancingConfig;
      try {
        typedChildConfig = parseLoadBalancingConfig(childConfig);
      } catch (e) {
        trace('LB policy config parsing failed with error ' + (e as Error).message);
        const errorMessage = `LB policy config parsing failed with error ${(e as Error).message}`;
        this.channelControlHelper.updateState(connectivityState.TRANSIENT_FAILURE, new UnavailablePicker({code: status.UNAVAILABLE, details: `${errorMessage} Resolution note: ${resolutionNote}`}), errorMessage);
        return true;
      }
      this.childBalancer.updateAddressList(endpointList, typedChildConfig, {...options, [ROOT_CLUSTER_KEY]: clusterName}, resolutionNote);
    } else {
      if (!clusterConfig.children.endpoints) {
        trace('Received update with no resolved endpoints for cluster ' + clusterName);
        const errorMessage = `Cluster ${clusterName} resolution failed: ${clusterConfig.children.resolutionNote}`;
        this.channelControlHelper.updateState(connectivityState.TRANSIENT_FAILURE, new UnavailablePicker({code: status.UNAVAILABLE, details: errorMessage}), errorMessage);
        return false;
      }
      const newPriorityNames: string[] = [];
      const newLocalityPriorities = new Map<string, number>();
      const priorityChildren: {[name: string]: PriorityChildRaw} = {};
      const childEndpointList: LocalityEndpoint[] = [];
      let endpointPickingPolicy: LoadBalancingConfig[];
      if (clusterConfig.cluster.type === 'EDS') {
        endpointPickingPolicy = clusterConfig.cluster.lbPolicyConfig;
        if (AGGREGATE_CLUSTER_BACKWARDS_COMPAT) {
          if (typeof options[ROOT_CLUSTER_KEY] === 'string') {
            const maybeRootClusterConfig = xdsConfig.clusters.get(options[ROOT_CLUSTER_KEY]);
            if (maybeRootClusterConfig?.ok) {
              endpointPickingPolicy = maybeRootClusterConfig.value.cluster.lbPolicyConfig;
            }
          }
        }
      } else {
        endpointPickingPolicy = [{ pick_first: {} }];
      }
      for (const [priority, priorityEntry] of clusterConfig.children.endpoints.priorities.entries()) {
        /**
         * Highest (smallest number) priority value that any of the localities in
         * this locality array had a in the previous mapping.
         */
        let highestOldPriority = Infinity;
        for (const localityObj of priorityEntry.localities) {
          const oldPriority = this.localityPriorities.get(
            localityToName(localityObj.locality)
          );
          if (
            oldPriority !== undefined &&
            oldPriority >= priority &&
            oldPriority < highestOldPriority
          ) {
            highestOldPriority = oldPriority;
          }
        }
        let newPriorityName: string;
        if (highestOldPriority === Infinity) {
          /* No existing priority at or below the same number as the priority we
           * are looking at had any of the localities in this priority. So, we
           * use a new name. */
          newPriorityName = this.getNextPriorityName(clusterName);
        } else {
          const newName = this.priorityNames[highestOldPriority];
          if (newPriorityNames.indexOf(newName) < 0) {
            newPriorityName = newName;
          } else {
            newPriorityName = this.getNextPriorityName(clusterName);
          }
        }
        newPriorityNames[priority] = newPriorityName;

        for (const localityObj of priorityEntry.localities) {
          for (const weightedEndpoint of localityObj.endpoints) {
            childEndpointList.push({
              localityPath: [
                newPriorityName,
                localityToName(localityObj.locality),
              ],
              locality: localityObj.locality,
              localityWeight: localityObj.weight,
              endpointWeight: localityObj.weight * weightedEndpoint.weight,
              ...weightedEndpoint.endpoint
            });
          }
          newLocalityPriorities.set(localityToName(localityObj.locality), priority);
        }

        priorityChildren[newPriorityName] = {
          config: endpointPickingPolicy,
          ignore_reresolution_requests: clusterConfig.cluster.type === 'EDS'
        };
      }
      this.localityPriorities = newLocalityPriorities;
      this.priorityNames = newPriorityNames;
      const xdsClusterImplConfig = {
        xds_cluster_impl: {
          cluster: clusterName,
          child_policy: [{
            priority: {
              children: priorityChildren,
              priorities: newPriorityNames
            }
          }]
        }
      };
      let childConfig: LoadBalancingConfig;
      if (EXPERIMENTAL_OUTLIER_DETECTION) {
        childConfig = {
          outlier_detection: {
            ...clusterConfig.cluster.outlierDetectionUpdate,
            child_policy: [xdsClusterImplConfig]
          }
        }
      } else {
        childConfig = xdsClusterImplConfig;
      }
      let typedChildConfig: TypedLoadBalancingConfig;
      try {
        typedChildConfig = parseLoadBalancingConfig(childConfig);
      } catch (e) {
        trace('LB policy config parsing failed with error ' + (e as Error).message);
        const errorMessage = `LB policy config parsing failed with error ${(e as Error).message}. Resolution note: ${resolutionNote}`;
        this.channelControlHelper.updateState(connectivityState.TRANSIENT_FAILURE, new UnavailablePicker({code: status.UNAVAILABLE, details: errorMessage}), errorMessage);
        return false;
      }
      const childOptions: ChannelOptions = {...options};
      if (clusterConfig.cluster.securityUpdate) {
        const securityUpdate = clusterConfig.cluster.securityUpdate;
        const xdsClient = options[XDS_CLIENT_KEY] as XdsClient;
        const caCertProvider = xdsClient.getCertificateProvider(securityUpdate.caCertificateProviderInstance);
        if (!caCertProvider) {
          const errorMessage = `Cluster ${clusterName} configured with CA certificate provider ${securityUpdate.caCertificateProviderInstance} not in bootstrap. Resolution note: ${resolutionNote}`;
          this.channelControlHelper.updateState(connectivityState.TRANSIENT_FAILURE, new UnavailablePicker({code: status.UNAVAILABLE, details: errorMessage}), errorMessage);
          return false;
        }
        if (securityUpdate.identityCertificateProviderInstance) {
          const identityCertProvider = xdsClient.getCertificateProvider(securityUpdate.identityCertificateProviderInstance);
          if (!identityCertProvider) {
            const errorMessage = `Cluster ${clusterName} configured with identity certificate provider ${securityUpdate.identityCertificateProviderInstance} not in bootstrap. Resolution note: ${resolutionNote}`;
            this.channelControlHelper.updateState(connectivityState.TRANSIENT_FAILURE, new UnavailablePicker({code: status.UNAVAILABLE, details: errorMessage}), errorMessage);
            return false;
          }
          childOptions[IDENTITY_CERT_PROVIDER_KEY] = identityCertProvider;
        }
        childOptions[CA_CERT_PROVIDER_KEY] = caCertProvider;
        const sanMatcher = new SanMatcher(securityUpdate.subjectAltNameMatchers);
        if (this.latestSanMatcher === null || !this.latestSanMatcher.equals(sanMatcher)) {
          this.latestSanMatcher = sanMatcher;
        }
        trace('Configured subject alternative name matcher: ' + sanMatcher);
        childOptions[SAN_MATCHER_KEY] = this.latestSanMatcher;
      }
      this.childBalancer.updateAddressList(statusOrFromValue(childEndpointList), typedChildConfig, childOptions, resolutionNote);
    }
    return true;
  }
  exitIdle(): void {
    this.childBalancer.exitIdle();
  }
  resetBackoff(): void {
    this.childBalancer.resetBackoff();
  }
  destroy(): void {
    trace('Destroying load balancer rooted at cluster named ' + this.latestConfig?.getCluster());
    this.childBalancer.destroy();
  }
  getTypeName(): string {
    return TYPE_NAME;
  }
}

export function setup() {
  registerLoadBalancerType(TYPE_NAME, CdsLoadBalancer, CdsLoadBalancingConfig);
}
