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

import { connectivityState, status, Metadata, logVerbosity, experimental, LoadBalancingConfig, ChannelOptions, ChannelCredentials } from '@grpc/grpc-js';
import Endpoint = experimental.Endpoint;
import UnavailablePicker = experimental.UnavailablePicker;
import ChildLoadBalancerHandler = experimental.ChildLoadBalancerHandler;
import LoadBalancer = experimental.LoadBalancer;
import ChannelControlHelper = experimental.ChannelControlHelper;
import registerLoadBalancerType = experimental.registerLoadBalancerType;
import TypedLoadBalancingConfig = experimental.TypedLoadBalancingConfig;
import parseLoadBalancingConfig = experimental.parseLoadBalancingConfig;
import { XdsConfig } from './xds-dependency-manager';
import { LocalityEndpoint, PriorityChildRaw } from './load-balancer-priority';
import { Locality__Output } from './generated/envoy/config/core/v3/Locality';
import { AGGREGATE_CLUSTER_BACKWARDS_COMPAT, EXPERIMENTAL_OUTLIER_DETECTION } from './environment';

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


const RECURSION_DEPTH_LIMIT = 15;

function getLeafClusters(xdsConfig: XdsConfig, rootCluster: string, depth = 0): string[] {
  if (depth > RECURSION_DEPTH_LIMIT) {
    throw new Error(`aggregate cluster graph exceeds max depth of ${RECURSION_DEPTH_LIMIT}`);
  }
  const maybeClusterConfig = xdsConfig.clusters.get(rootCluster);
  if (!maybeClusterConfig) {
    return [];
  }
  if (!maybeClusterConfig.success) {
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

export class CdsLoadBalancer implements LoadBalancer {
  private childBalancer: ChildLoadBalancerHandler;

  private latestConfig: CdsLoadBalancingConfig | null = null;
  private localityPriorities: Map<string, number> = new Map();
  private priorityNames: string[] = [];
  private nextPriorityChildNumber = 0;

  constructor(private readonly channelControlHelper: ChannelControlHelper, credentials: ChannelCredentials, options: ChannelOptions) {
    this.childBalancer = new ChildLoadBalancerHandler(channelControlHelper, credentials, options);
  }

  private getNextPriorityName(cluster: string) {
    return `cluster=${cluster}, child_number=${this.nextPriorityChildNumber++}`;
  }

  updateAddressList(
    endpointList: Endpoint[],
    lbConfig: TypedLoadBalancingConfig,
    attributes: { [key: string]: unknown }
  ): void {
    if (!(lbConfig instanceof CdsLoadBalancingConfig)) {
      trace('Discarding address list update with unrecognized config ' + JSON.stringify(lbConfig, undefined, 2));
      return;
    }
    trace('Received update with config ' + JSON.stringify(lbConfig, undefined, 2));
    const xdsConfig = attributes.xdsConfig as XdsConfig;
    const clusterName = lbConfig.getCluster();
    const maybeClusterConfig = xdsConfig.clusters.get(clusterName);
    if (!maybeClusterConfig) {
      trace('Received update with no config for cluster ' + clusterName);
      return;
    }
    if (!maybeClusterConfig.success) {
      this.childBalancer.destroy();
      this.channelControlHelper.updateState(connectivityState.TRANSIENT_FAILURE, new UnavailablePicker(maybeClusterConfig.error));
      return;
    }
    const clusterConfig = maybeClusterConfig.value;

    if (clusterConfig.children.type === 'aggregate') {
      let leafClusters: string[];
      try {
        leafClusters = getLeafClusters(xdsConfig, clusterName);
      } catch (e) {
        trace('xDS config parsing failed with error ' + (e as Error).message);
        this.channelControlHelper.updateState(connectivityState.TRANSIENT_FAILURE, new UnavailablePicker({code: status.UNAVAILABLE, details: `xDS config parsing failed with error ${(e as Error).message}`, metadata: new Metadata()}));
        return;
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
        this.channelControlHelper.updateState(connectivityState.TRANSIENT_FAILURE, new UnavailablePicker({code: status.UNAVAILABLE, details: `LB policy config parsing failed with error ${(e as Error).message}`, metadata: new Metadata()}));
        return;
      }
      this.childBalancer.updateAddressList(endpointList, typedChildConfig, {...attributes, rootCluster: clusterName});
    } else {
      if (!clusterConfig.children.endpoints) {
        trace('Received update with no resolved endpoints for cluster ' + clusterName);
        this.channelControlHelper.updateState(connectivityState.TRANSIENT_FAILURE, new UnavailablePicker({code: status.UNAVAILABLE, details: `Cluster ${clusterName} resolution failed: ${clusterConfig.children.resolutionNote}`}));
        return;
      }
      const newPriorityNames: string[] = [];
      const newLocalityPriorities = new Map<string, number>();
      const priorityChildren: {[name: string]: PriorityChildRaw} = {};
      const childEndpointList: LocalityEndpoint[] = [];
      let endpointPickingPolicy: LoadBalancingConfig[];
      if (clusterConfig.cluster.type === 'EDS') {
        endpointPickingPolicy = clusterConfig.cluster.lbPolicyConfig;
        if (AGGREGATE_CLUSTER_BACKWARDS_COMPAT) {
          if (typeof attributes.rootCluster === 'string') {
            const maybeRootClusterConfig = xdsConfig.clusters.get(attributes.rootCluster);
            if (maybeRootClusterConfig?.success) {
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
      trace(JSON.stringify(childConfig, undefined, 2));
      let typedChildConfig: TypedLoadBalancingConfig;
      try {
        typedChildConfig = parseLoadBalancingConfig(childConfig);
      } catch (e) {
        trace('LB policy config parsing failed with error ' + (e as Error).message);
        this.channelControlHelper.updateState(connectivityState.TRANSIENT_FAILURE, new UnavailablePicker({code: status.UNAVAILABLE, details: `LB policy config parsing failed with error ${(e as Error).message}`, metadata: new Metadata()}));
        return;
      }
      trace(JSON.stringify(typedChildConfig.toJsonObject(), undefined, 2));
      this.childBalancer.updateAddressList(childEndpointList, typedChildConfig, attributes);
    }
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
