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

import { experimental, logVerbosity } from "@grpc/grpc-js";
import { registerLoadBalancerType } from "@grpc/grpc-js/build/src/load-balancer";
import { EXPERIMENTAL_OUTLIER_DETECTION } from "./environment";
import { Locality__Output } from "./generated/envoy/config/core/v3/Locality";
import { ClusterLoadAssignment__Output } from "./generated/envoy/config/endpoint/v3/ClusterLoadAssignment";
import { LrsLoadBalancingConfig } from "./load-balancer-lrs";
import { LocalitySubchannelAddress, PriorityChild, PriorityLoadBalancingConfig } from "./load-balancer-priority";
import { WeightedTarget, WeightedTargetLoadBalancingConfig } from "./load-balancer-weighted-target";
import { getSingletonXdsClient, Watcher, XdsClient } from "./xds-client";
import { DropCategory, XdsClusterImplLoadBalancingConfig } from "./load-balancer-xds-cluster-impl";

import LoadBalancingConfig = experimental.LoadBalancingConfig;
import validateLoadBalancingConfig = experimental.validateLoadBalancingConfig;
import LoadBalancer = experimental.LoadBalancer;
import Resolver = experimental.Resolver;
import SubchannelAddress = experimental.SubchannelAddress;
import ChildLoadBalancerHandler = experimental.ChildLoadBalancerHandler;
import createResolver = experimental.createResolver;
import ChannelControlHelper = experimental.ChannelControlHelper;
import OutlierDetectionLoadBalancingConfig = experimental.OutlierDetectionLoadBalancingConfig;
import subchannelAddressToString = experimental.subchannelAddressToString;
import { serverConfigEqual, validateXdsServerConfig, XdsServerConfig } from "./xds-bootstrap";
import { EndpointResourceType } from "./xds-resource-type/endpoint-resource-type";

const TRACER_NAME = 'xds_cluster_resolver';

function trace(text: string): void {
  experimental.trace(logVerbosity.DEBUG, TRACER_NAME, text);
}

export interface DiscoveryMechanism {
  cluster: string;
  lrs_load_reporting_server?: XdsServerConfig;
  max_concurrent_requests?: number;
  type: 'EDS' | 'LOGICAL_DNS';
  eds_service_name?: string;
  dns_hostname?: string;
  outlier_detection?: OutlierDetectionLoadBalancingConfig;
}

function validateDiscoveryMechanism(obj: any): DiscoveryMechanism {
  if (!('cluster' in obj && typeof obj.cluster === 'string')) {
    throw new Error('discovery_mechanisms entry must have a string field cluster');
  }
  if (!('type' in obj && (obj.type === 'EDS' || obj.type === 'LOGICAL_DNS'))) {
    throw new Error('discovery_mechanisms entry must have a field "type" with the value "EDS" or "LOGICAL_DNS"');
  }
  if ('max_concurrent_requests' in obj && typeof obj.max_concurrent_requests !== "number") {
    throw new Error('discovery_mechanisms entry max_concurrent_requests field must be a number if provided');
  }
  if ('eds_service_name' in obj && typeof obj.eds_service_name !== 'string') {
    throw new Error('discovery_mechanisms entry eds_service_name field must be a string if provided');
  }
  if ('dns_hostname' in obj && typeof obj.dns_hostname !== 'string') {
    throw new Error('discovery_mechanisms entry dns_hostname field must be a string if provided');
  }
  if (EXPERIMENTAL_OUTLIER_DETECTION) {
    const outlierDetectionConfig = validateLoadBalancingConfig(obj.outlier_detection);
    if (!(outlierDetectionConfig instanceof OutlierDetectionLoadBalancingConfig)) {
      throw new Error('eds config outlier_detection must be a valid outlier detection config if provided');
    }
    return {...obj, lrs_load_reporting_server: validateXdsServerConfig(obj.lrs_load_reporting_server), outlier_detection: outlierDetectionConfig};
  }
  return obj;
}

const TYPE_NAME = 'xds_cluster_resolver';

export class XdsClusterResolverLoadBalancingConfig implements LoadBalancingConfig {
  getLoadBalancerName(): string {
    return TYPE_NAME;
  }
  toJsonObject(): object {
    return {
      [TYPE_NAME]: {
        discovery_mechanisms: this.discoveryMechanisms.map(mechanism => ({...mechanism, outlier_detection: mechanism.outlier_detection?.toJsonObject()})),
        locality_picking_policy: this.localityPickingPolicy.map(policy => policy.toJsonObject()),
        endpoint_picking_policy: this.endpointPickingPolicy.map(policy => policy.toJsonObject())
      }
    }
  }
  
  constructor(private discoveryMechanisms: DiscoveryMechanism[], private localityPickingPolicy: LoadBalancingConfig[], private endpointPickingPolicy: LoadBalancingConfig[]) {}

  getDiscoveryMechanisms() {
    return this.discoveryMechanisms;
  }

  getLocalityPickingPolicy() {
    return this.localityPickingPolicy;
  }

  getEndpointPickingPolicy() {
    return this.endpointPickingPolicy;
  }

  static createFromJson(obj: any): XdsClusterResolverLoadBalancingConfig {
    if (!('discovery_mechanisms' in obj && Array.isArray(obj.discovery_mechanisms))) {
      throw new Error('xds_cluster_resolver config must have a discovery_mechanisms array');
    }
    if (!('locality_picking_policy' in obj && Array.isArray(obj.locality_picking_policy))) {
      throw new Error('xds_cluster_resolver config must have a locality_picking_policy array');
    }
    if (!('endpoint_picking_policy' in obj && Array.isArray(obj.endpoint_picking_policy))) {
      throw new Error('xds_cluster_resolver config must have a endpoint_picking_policy array');
    }
    return new XdsClusterResolverLoadBalancingConfig(
      obj.discovery_mechanisms.map(validateDiscoveryMechanism),
      obj.locality_picking_policy.map(validateLoadBalancingConfig),
      obj.endpoint_picking_policy.map(validateLoadBalancingConfig)
    );
  }
}

interface LocalityEntry {
  locality: Locality__Output;
  weight: number;
  addresses: SubchannelAddress[];
}

interface PriorityEntry {
  localities: LocalityEntry[];
  dropCategories: DropCategory[];
}

interface DiscoveryMechanismEntry {
  discoveryMechanism: DiscoveryMechanism;
  localityPriorities: Map<string, number>;
  priorityNames: string[];
  nextPriorityChildNumber: number;
  watcher?: Watcher<ClusterLoadAssignment__Output>;
  resolver?: Resolver;
  latestUpdate?: PriorityEntry[];
}

function getEdsPriorities(edsUpdate: ClusterLoadAssignment__Output): PriorityEntry[] {
  const result: PriorityEntry[] = [];
  const dropCategories: DropCategory[] = [];
  if (edsUpdate.policy) {
    for (const dropOverload of edsUpdate.policy.drop_overloads) {
      if (!dropOverload.drop_percentage) {
        continue;
      }
      let requestsPerMillion: number;
      switch (dropOverload.drop_percentage.denominator) {
        case 'HUNDRED':
          requestsPerMillion = dropOverload.drop_percentage.numerator * 10_000;
          break;
        case 'TEN_THOUSAND':
          requestsPerMillion = dropOverload.drop_percentage.numerator * 100;
          break;
        case 'MILLION':
          requestsPerMillion = dropOverload.drop_percentage.numerator;
          break;
      }
      dropCategories.push({
        category: dropOverload.category,
        requests_per_million: requestsPerMillion
      });
    }
  }
  for (const endpoint of edsUpdate.endpoints) {
    if (!endpoint.load_balancing_weight) {
      continue;
    }
    const addresses: SubchannelAddress[] = endpoint.lb_endpoints.filter(lbEndpoint => lbEndpoint.health_status === 'UNKNOWN' || lbEndpoint.health_status === 'HEALTHY').map(
      (lbEndpoint) => {
        /* The validator in the XdsClient class ensures that each endpoint has
         * a socket_address with an IP address and a port_value. */
        const socketAddress = lbEndpoint.endpoint!.address!.socket_address!;
        return {
          host: socketAddress.address!,
          port: socketAddress.port_value!,
        };
      }
    );
    if (addresses.length === 0) {
      continue;
    }
    let priorityEntry: PriorityEntry;
    if (result[endpoint.priority]) {
      priorityEntry = result[endpoint.priority];
    } else {
      priorityEntry = {
        localities: [],
        dropCategories: dropCategories
      };
      result[endpoint.priority] = priorityEntry;
    }
    priorityEntry.localities.push({
      locality: endpoint.locality!,
      addresses: addresses,
      weight: endpoint.load_balancing_weight.value
    });
  }
  // Collapse spaces in sparse array
  return result.filter(priority => priority);
}

function getDnsPriorities(addresses: SubchannelAddress[]): PriorityEntry[] {
  return [{
    localities: [{
      locality: {
        region: '',
        zone: '',
        sub_zone: ''
      },
      weight: 1,
      addresses: addresses
    }],
    dropCategories: []
  }];
}

function localityToName(locality: Locality__Output) {
  return `{region=${locality.region},zone=${locality.zone},sub_zone=${locality.sub_zone}}`;
}

function getNextPriorityName(entry: DiscoveryMechanismEntry): string {
  return `cluster=${entry.discoveryMechanism.cluster}, child_number=${entry.nextPriorityChildNumber++}`;
}

export class XdsClusterResolver implements LoadBalancer {
  private discoveryMechanismList: DiscoveryMechanismEntry[] = [];
  private latestConfig: XdsClusterResolverLoadBalancingConfig | null = null;
  private latestAttributes: { [key: string]: unknown; } = {};
  private xdsClient: XdsClient | null = null;
  private childBalancer: ChildLoadBalancerHandler;

  constructor(private readonly channelControlHelper: ChannelControlHelper) {
    this.childBalancer = new ChildLoadBalancerHandler(experimental.createChildChannelControlHelper(channelControlHelper, {
      requestReresolution: () => {
        for (const entry of this.discoveryMechanismList) {
          entry.resolver?.updateResolution();
        }
      }
    }));
  }

  private maybeUpdateChild() {
    if (!this.latestConfig) {
      return;
    }
    for (const entry of this.discoveryMechanismList) {
      if (!entry.latestUpdate) {
        return;
      }
    }
    const fullPriorityList: string[] = [];
    const priorityChildren = new Map<string, PriorityChild>();
    const addressList: LocalitySubchannelAddress[] = [];
    for (const entry of this.discoveryMechanismList) {
      const newPriorityNames: string[] = [];
      const newLocalityPriorities = new Map<string, number>();
      const defaultEndpointPickingPolicy = entry.discoveryMechanism.type === 'EDS' ? validateLoadBalancingConfig({ round_robin: {} }) : validateLoadBalancingConfig({ pick_first: {} });
      const endpointPickingPolicy: LoadBalancingConfig[] = [
        ...this.latestConfig.getEndpointPickingPolicy(),
        defaultEndpointPickingPolicy
      ];
      for (const [priority, priorityEntry] of entry.latestUpdate!.entries()) {
        /**
         * Highest (smallest number) priority value that any of the localities in
         * this locality array had a in the previous mapping.
         */
        let highestOldPriority = Infinity;
        for (const localityObj of priorityEntry.localities) {
          const oldPriority = entry.localityPriorities.get(
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
          newPriorityName = getNextPriorityName(entry);
        } else {
          const newName = entry.priorityNames[highestOldPriority];
          if (newPriorityNames.indexOf(newName) < 0) {
            newPriorityName = newName;
          } else {
            newPriorityName = getNextPriorityName(entry);
          }
        }
        newPriorityNames[priority] = newPriorityName;

        const childTargets = new Map<string, WeightedTarget>();
        for (const localityObj of priorityEntry.localities) {
          let childPolicy: LoadBalancingConfig[];
          if (entry.discoveryMechanism.lrs_load_reporting_server !== undefined) {
            childPolicy = [new LrsLoadBalancingConfig(entry.discoveryMechanism.cluster, entry.discoveryMechanism.eds_service_name ?? '', entry.discoveryMechanism.lrs_load_reporting_server, localityObj.locality, endpointPickingPolicy)];
          } else {
            childPolicy = endpointPickingPolicy;
          }
          childTargets.set(localityToName(localityObj.locality), {
            weight: localityObj.weight,
            child_policy: childPolicy,
          });
          for (const address of localityObj.addresses) {
            addressList.push({
              localityPath: [
                newPriorityName,
                localityToName(localityObj.locality),
              ],
              ...address,
            });
          }
          newLocalityPriorities.set(localityToName(localityObj.locality), priority);
        }
        const weightedTargetConfig = new WeightedTargetLoadBalancingConfig(childTargets);
        const xdsClusterImplConfig = new XdsClusterImplLoadBalancingConfig(entry.discoveryMechanism.cluster, priorityEntry.dropCategories, [weightedTargetConfig], entry.discoveryMechanism.eds_service_name, entry.discoveryMechanism.lrs_load_reporting_server, entry.discoveryMechanism.max_concurrent_requests);
        let outlierDetectionConfig: OutlierDetectionLoadBalancingConfig | undefined;
        if (EXPERIMENTAL_OUTLIER_DETECTION) {
          outlierDetectionConfig = entry.discoveryMechanism.outlier_detection?.copyWithChildPolicy([xdsClusterImplConfig]);
        }
        const priorityChildConfig = outlierDetectionConfig ?? xdsClusterImplConfig;
  
        priorityChildren.set(newPriorityName, {
          config: [priorityChildConfig],
          ignore_reresolution_requests: entry.discoveryMechanism.type === 'EDS'
        });
      }
      entry.localityPriorities = newLocalityPriorities;
      entry.priorityNames = newPriorityNames;
      fullPriorityList.push(...newPriorityNames);
    }
    const childConfig: PriorityLoadBalancingConfig = new PriorityLoadBalancingConfig(priorityChildren, fullPriorityList);
    trace('Child update addresses: ' + addressList.map(address => '(' + subchannelAddressToString(address) + ' path=' + address.localityPath + ')'));
    trace('Child update priority config: ' + JSON.stringify(childConfig.toJsonObject(), undefined, 2));
    this.childBalancer.updateAddressList(
      addressList,
      childConfig,
      this.latestAttributes
    );
  }

  updateAddressList(addressList: SubchannelAddress[], lbConfig: LoadBalancingConfig, attributes: { [key: string]: unknown; }): void {
    if (!(lbConfig instanceof XdsClusterResolverLoadBalancingConfig)) {
      trace('Discarding address list update with unrecognized config ' + JSON.stringify(lbConfig, undefined, 2));
      return;
    }
    trace('Received update with config ' + JSON.stringify(lbConfig, undefined, 2));
    this.latestConfig = lbConfig;
    this.latestAttributes = attributes;
    this.xdsClient = attributes.xdsClient as XdsClient;
    if (this.discoveryMechanismList.length === 0) {
      for (const mechanism of lbConfig.getDiscoveryMechanisms()) {
        const mechanismEntry: DiscoveryMechanismEntry = {
          discoveryMechanism: mechanism,
          localityPriorities: new Map(),
          priorityNames: [],
          nextPriorityChildNumber: 0
        };
        if (mechanism.type === 'EDS') {
          const edsServiceName = mechanism.eds_service_name ?? mechanism.cluster;
          const watcher: Watcher<ClusterLoadAssignment__Output> = new Watcher<ClusterLoadAssignment__Output>({
            onResourceChanged: update => {
              mechanismEntry.latestUpdate = getEdsPriorities(update);
              this.maybeUpdateChild();
            },
            onResourceDoesNotExist: () => {
              trace('Resource does not exist: ' + edsServiceName);
              mechanismEntry.latestUpdate = [{localities: [], dropCategories: []}];
            },
            onError: error => {
              if (!mechanismEntry.latestUpdate) {
                trace('xDS request failed with error ' + error);
                mechanismEntry.latestUpdate = [{localities: [], dropCategories: []}];
              }
            }
          });
          mechanismEntry.watcher = watcher;
          if (this.xdsClient) {
            EndpointResourceType.startWatch(this.xdsClient, edsServiceName, watcher);
          }
        } else {
          const resolver = createResolver({scheme: 'dns', path: mechanism.dns_hostname!}, {
            onSuccessfulResolution: addressList => {
              mechanismEntry.latestUpdate = getDnsPriorities(addressList);
              this.maybeUpdateChild();
            },
            onError: error => {
              if (!mechanismEntry.latestUpdate) {
                trace('DNS resolution for ' + mechanism.dns_hostname + ' failed with error ' + error);
                mechanismEntry.latestUpdate = [{localities: [], dropCategories: []}];
              }
            }
          }, {'grpc.service_config_disable_resolution': 1});
          mechanismEntry.resolver = resolver;
          resolver.updateResolution();
        }
        this.discoveryMechanismList.push(mechanismEntry);
      }
    } else {
      /* The ChildLoadBalancerHandler subclass guarantees that each discovery
       * mechanism in the new update corresponds to the same entry in the
       * existing discoveryMechanismList, and that any differences will not
       * result in changes to the watcher/resolver. */
      for (let i = 0; i < this.discoveryMechanismList.length; i++) {
        this.discoveryMechanismList[i].discoveryMechanism = lbConfig.getDiscoveryMechanisms()[i];
      }
      this.maybeUpdateChild();
    }
  }
  exitIdle(): void {
    this.childBalancer.exitIdle();
  }
  resetBackoff(): void {
    this.childBalancer.resetBackoff();
  }
  destroy(): void {
    for (const mechanismEntry of this.discoveryMechanismList) {
      if (mechanismEntry.watcher) {
        const edsServiceName = mechanismEntry.discoveryMechanism.eds_service_name ?? mechanismEntry.discoveryMechanism.cluster;
        if (this.xdsClient) {
          EndpointResourceType.cancelWatch(this.xdsClient, edsServiceName, mechanismEntry.watcher);
        }
      }
      mechanismEntry.resolver?.destroy();
    }
    this.discoveryMechanismList = [];
    this.childBalancer.destroy();
  }
  getTypeName(): string {
    return TYPE_NAME;
  }
}

function maybeServerConfigEqual(config1: XdsServerConfig | undefined, config2: XdsServerConfig | undefined) {
  if (config1 !== undefined && config2 !== undefined) {
    return serverConfigEqual(config1, config2);
  } else {
    return config1 === config2;
  }
}

export class XdsClusterResolverChildPolicyHandler extends ChildLoadBalancerHandler {
  protected configUpdateRequiresNewPolicyInstance(oldConfig: LoadBalancingConfig, newConfig: LoadBalancingConfig): boolean {
    if (!(oldConfig instanceof XdsClusterResolverLoadBalancingConfig && newConfig instanceof XdsClusterResolverLoadBalancingConfig)) {
      return super.configUpdateRequiresNewPolicyInstance(oldConfig, newConfig);
    }
    if (oldConfig.getDiscoveryMechanisms().length !== newConfig.getDiscoveryMechanisms().length) {
      return true;
    }
    for (let i = 0; i < oldConfig.getDiscoveryMechanisms().length; i++) {
      const oldDiscoveryMechanism = oldConfig.getDiscoveryMechanisms()[i];
      const newDiscoveryMechanism = newConfig.getDiscoveryMechanisms()[i];
      if (oldDiscoveryMechanism.type !== newDiscoveryMechanism.type ||
          oldDiscoveryMechanism.cluster !== newDiscoveryMechanism.cluster ||
          oldDiscoveryMechanism.eds_service_name !== newDiscoveryMechanism.eds_service_name ||
          oldDiscoveryMechanism.dns_hostname !== newDiscoveryMechanism.dns_hostname ||
          !maybeServerConfigEqual(oldDiscoveryMechanism.lrs_load_reporting_server, newDiscoveryMechanism.lrs_load_reporting_server)) {
        return true;
      }
    }
    return false;
  }
}

export function setup() {
  registerLoadBalancerType(TYPE_NAME, XdsClusterResolver, XdsClusterResolverLoadBalancingConfig);
}
