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
import QueuePicker = experimental.QueuePicker;
import parseLoadBalancingConfig = experimental.parseLoadBalancingConfig;
import { DiscoveryMechanism, XdsClusterResolverChildPolicyHandler } from './load-balancer-xds-cluster-resolver';
import { CdsUpdate, ClusterResourceType } from './xds-resource-type/cluster-resource-type';

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

interface ClusterEntry {
  watcher: Watcher<CdsUpdate>;
  latestUpdate?: CdsUpdate;
  children: string[];
}

interface ClusterTree {
  [name: string]: ClusterEntry;
}

function isClusterTreeFullyUpdated(tree: ClusterTree, root: string): boolean {
  const toCheck: string[] = [root];
  const visited = new Set<string>();
  while (toCheck.length > 0) {
    const next = toCheck.shift()!;
    if (visited.has(next)) {
      continue;
    }
    visited.add(next);
    if (!tree[next] || !tree[next].latestUpdate) {
      return false;
    }
    toCheck.push(...tree[next].children);
  }
  return true;
}

function generateDiscoverymechanismForCdsUpdate(config: CdsUpdate): DiscoveryMechanism {
  if (config.type === 'AGGREGATE') {
    throw new Error('Cannot generate DiscoveryMechanism for AGGREGATE cluster');
  }
  return {
    cluster: config.name,
    lrs_load_reporting_server: config.lrsLoadReportingServer,
    max_concurrent_requests: config.maxConcurrentRequests,
    type: config.type,
    eds_service_name: config.edsServiceName,
    dns_hostname: config.dnsHostname,
    outlier_detection: config.outlierDetectionUpdate
  };
}

const RECURSION_DEPTH_LIMIT = 15;

/**
 * Prerequisite: isClusterTreeFullyUpdated(tree, root)
 * @param tree
 * @param root
 */
function getDiscoveryMechanismList(tree: ClusterTree, root: string): DiscoveryMechanism[] {
  const visited = new Set<string>();
  function getDiscoveryMechanismListHelper(node: string, depth: number): DiscoveryMechanism[] {
    if (depth > RECURSION_DEPTH_LIMIT) {
      throw new Error('aggregate cluster graph exceeds max depth');
    }
    if (visited.has(node)) {
      return [];
    }
    visited.add(node);
    if (tree[node].children.length > 0) {
      trace('Visit ' + node + ' children: [' + tree[node].children + ']');
      // Aggregate cluster
      const result = [];
      for (const child of tree[node].children) {
        result.push(...getDiscoveryMechanismListHelper(child, depth + 1));
      }
      return result;
    } else {
      trace('Visit leaf ' + node);
      // individual cluster
      const config = tree[node].latestUpdate!;
      return [generateDiscoverymechanismForCdsUpdate(config)];
    }
  }
  return getDiscoveryMechanismListHelper(root, 0);
}

export class CdsLoadBalancer implements LoadBalancer {
  private childBalancer: ChildLoadBalancerHandler;

  private latestCdsUpdate: Cluster__Output | null = null;

  private latestConfig: CdsLoadBalancingConfig | null = null;
  private latestAttributes: { [key: string]: unknown } = {};
  private xdsClient: XdsClient | null = null;

  private clusterTree: ClusterTree = {};

  private updatedChild = false;

  constructor(private readonly channelControlHelper: ChannelControlHelper, options: ChannelOptions) {
    this.childBalancer = new XdsClusterResolverChildPolicyHandler(channelControlHelper, options);
  }

  private reportError(errorMessage: string) {
    trace('CDS cluster reporting error ' + errorMessage);
    this.channelControlHelper.updateState(connectivityState.TRANSIENT_FAILURE, new UnavailablePicker({code: status.UNAVAILABLE, details: errorMessage, metadata: new Metadata()}));
  }

  private addCluster(cluster: string) {
    if (cluster in this.clusterTree) {
      return;
    }
    trace('Adding watcher for cluster ' + cluster);
    const watcher: Watcher<CdsUpdate> = new Watcher<CdsUpdate>({
      onResourceChanged: (update) => {
        this.clusterTree[cluster].latestUpdate = update;
        if (update.type === 'AGGREGATE') {
          const children = update.aggregateChildren
          trace('Received update for aggregate cluster ' + cluster + ' with children [' + children + ']');
          this.clusterTree[cluster].children = children;
          children.forEach(child => this.addCluster(child));
        }
        if (isClusterTreeFullyUpdated(this.clusterTree, this.latestConfig!.getCluster())) {
          let discoveryMechanismList: DiscoveryMechanism[];
          try {
            discoveryMechanismList = getDiscoveryMechanismList(this.clusterTree, this.latestConfig!.getCluster());
          } catch (e) {
            this.reportError((e as Error).message);
            return;
          }
          const rootClusterUpdate = this.clusterTree[this.latestConfig!.getCluster()].latestUpdate!;
          const clusterResolverConfig: LoadBalancingConfig = {
            xds_cluster_resolver: {
              discovery_mechanisms: discoveryMechanismList,
              xds_lb_policy: rootClusterUpdate.lbPolicyConfig
            }
          };
          let parsedClusterResolverConfig: TypedLoadBalancingConfig;
          try {
            parsedClusterResolverConfig = parseLoadBalancingConfig(clusterResolverConfig);
          } catch (e) {
            this.reportError(`CDS cluster ${this.latestConfig?.getCluster()} child config parsing failed with error ${(e as Error).message}`);
            return;
          }
          trace('Child update config: ' + JSON.stringify(clusterResolverConfig));
          this.updatedChild = true;
          this.childBalancer.updateAddressList(
            [],
            parsedClusterResolverConfig,
            this.latestAttributes
          );
        }
      },
      onResourceDoesNotExist: () => {
        trace('Received onResourceDoesNotExist update for cluster ' + cluster);
        if (cluster in this.clusterTree) {
          this.clusterTree[cluster].latestUpdate = undefined;
          this.clusterTree[cluster].children = [];
        }
        this.reportError(`CDS resource ${cluster} does not exist`);
        this.childBalancer.destroy();
      },
      onError: (statusObj) => {
        if (!this.updatedChild) {
          trace('Transitioning to transient failure due to onError update for cluster' + cluster);
          this.reportError(`xDS request failed with error ${statusObj.details}`);
        }
      }
    });
    this.clusterTree[cluster] = {
      watcher: watcher,
      children: []
    };
    if (this.xdsClient) {
      ClusterResourceType.startWatch(this.xdsClient, cluster, watcher);
    }
  }

  private removeCluster(cluster: string) {
    if (!(cluster in this.clusterTree)) {
      return;
    }
    if (this.xdsClient) {
      ClusterResourceType.cancelWatch(this.xdsClient, cluster, this.clusterTree[cluster].watcher);
    }
    delete this.clusterTree[cluster];
  }

  private clearClusterTree() {
    for (const cluster of Object.keys(this.clusterTree)) {
      this.removeCluster(cluster);
    }
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
    this.latestAttributes = attributes;
    this.xdsClient = attributes.xdsClient as XdsClient;

    /* If the cluster is changing, disable the old watcher before adding the new
     * one */
    if (
      this.latestConfig && this.latestConfig.getCluster() !== lbConfig.getCluster()
    ) {
      trace('Removing old cluster watchers rooted at ' + this.latestConfig.getCluster());
      this.clearClusterTree();
      this.updatedChild = false;
    }

    if (!this.latestConfig) {
      this.channelControlHelper.updateState(connectivityState.CONNECTING, new QueuePicker(this));
    }

    this.latestConfig = lbConfig;

    this.addCluster(lbConfig.getCluster());
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
    this.clearClusterTree();
  }
  getTypeName(): string {
    return TYPE_NAME;
  }
}

export function setup() {
  registerLoadBalancerType(TYPE_NAME, CdsLoadBalancer, CdsLoadBalancingConfig);
}
