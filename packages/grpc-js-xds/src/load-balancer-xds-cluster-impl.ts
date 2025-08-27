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

import { experimental, logVerbosity, status as Status, Metadata, connectivityState, ChannelOptions } from "@grpc/grpc-js";
import { validateXdsServerConfig, XdsServerConfig } from "./xds-bootstrap";
import { getSingletonXdsClient, XdsClient, XdsClusterDropStats, XdsClusterLocalityStats } from "./xds-client";
import { LocalityEndpoint } from "./load-balancer-priority";

import LoadBalancer = experimental.LoadBalancer;
import registerLoadBalancerType = experimental.registerLoadBalancerType;
import Endpoint = experimental.Endpoint;
import endpointHasAddress = experimental.endpointHasAddress;
import subchannelAddressToString = experimental.subchannelAddressToString;
import Picker = experimental.Picker;
import PickArgs = experimental.PickArgs;
import PickResult = experimental.PickResult;
import PickResultType = experimental.PickResultType;
import ChannelControlHelper = experimental.ChannelControlHelper;
import ChildLoadBalancerHandler = experimental.ChildLoadBalancerHandler;
import createChildChannelControlHelper = experimental.createChildChannelControlHelper;
import TypedLoadBalancingConfig = experimental.TypedLoadBalancingConfig;
import selectLbConfigFromList = experimental.selectLbConfigFromList;
import SubchannelInterface = experimental.SubchannelInterface;
import BaseSubchannelWrapper = experimental.BaseSubchannelWrapper;
import UnavailablePicker = experimental.UnavailablePicker;
import StatusOr = experimental.StatusOr;
import { Locality__Output } from "./generated/envoy/config/core/v3/Locality";
import { ClusterConfig, XdsConfig } from "./xds-dependency-manager";
import { CdsUpdate } from "./xds-resource-type/cluster-resource-type";
import { XDS_CLIENT_KEY, XDS_CONFIG_KEY } from "./resolver-xds";

const TRACER_NAME = 'xds_cluster_impl';

function trace(text: string): void {
  experimental.trace(logVerbosity.DEBUG, TRACER_NAME, text);
}

const TYPE_NAME = 'xds_cluster_impl';

const DEFAULT_MAX_CONCURRENT_REQUESTS = 1024;

export interface DropCategory {
  category: string;
  requests_per_million: number;
}

class XdsClusterImplLoadBalancingConfig implements TypedLoadBalancingConfig {
  getLoadBalancerName(): string {
    return TYPE_NAME;
  }
  toJsonObject(): object {
    const jsonObj: {[key: string]: any} = {
      cluster: this.cluster,
      child_policy: [this.childPolicy.toJsonObject()],
    };
    return {
      [TYPE_NAME]: jsonObj
    };
  }

  constructor(private cluster: string, private childPolicy: TypedLoadBalancingConfig) {}

  getCluster() {
    return this.cluster;
  }

  getChildPolicy() {
    return this.childPolicy;
  }

  static createFromJson(obj: any): XdsClusterImplLoadBalancingConfig {
    if (!('cluster' in obj && typeof obj.cluster === 'string')) {
      throw new Error('xds_cluster_impl config must have a string field cluster');
    }
    if (!('child_policy' in obj && Array.isArray(obj.child_policy))) {
      throw new Error('xds_cluster_impl config must have an array field child_policy');
    }
    const childConfig = selectLbConfigFromList(obj.child_policy);
    if (!childConfig) {
      throw new Error('xds_cluster_impl config child_policy parsing failed');
    }
    return new XdsClusterImplLoadBalancingConfig(obj.cluster, childConfig);
  }
}

class CallCounterMap {
  private callCounters = new Map<string, number>();

  startCall(key: string) {
    const currentValue = this.callCounters.get(key) ?? 0;
    this.callCounters.set(key, currentValue + 1);
  }

  endCall(key: string) {
    const currentValue = this.callCounters.get(key) ?? 0;
    if (currentValue - 1 <= 0) {
      this.callCounters.delete(key);
    } else {
      this.callCounters.set(key, currentValue - 1);
    }
  }

  getConcurrentRequests(key: string) {
    return this.callCounters.get(key) ?? 0;
  }
}

const callCounterMap = new CallCounterMap();

class LocalitySubchannelWrapper extends BaseSubchannelWrapper implements SubchannelInterface {
  constructor(child: SubchannelInterface, private statsObject: XdsClusterLocalityStats | null) {
    super(child);
  }

  getStatsObject() {
    return this.statsObject;
  }

  getWrappedSubchannel(): SubchannelInterface {
    return this.child;
  }
}

/**
 * This picker is responsible for implementing the drop configuration, and for
 * recording drop stats and per-locality stats.
 */
class XdsClusterImplPicker implements Picker {
  constructor(private originalPicker: Picker, private callCounterMapKey: string, private maxConcurrentRequests: number, private dropCategories: DropCategory[], private clusterDropStats: XdsClusterDropStats | null) {}

  private checkForMaxConcurrentRequestsDrop(): boolean {
    return callCounterMap.getConcurrentRequests(this.callCounterMapKey) >= this.maxConcurrentRequests;
  }

  private checkForDrop(): string | null {
    for (const dropCategory of this.dropCategories) {
      if (Math.random() * 1_000_000 < dropCategory.requests_per_million) {
        return dropCategory.category;
      }
    }
    return null;
  }

  pick(pickArgs: PickArgs): PickResult {
    let details: string | null = null;
    if (this.checkForMaxConcurrentRequestsDrop()) {
      details = 'Call dropped by load balancing policy.';
      this.clusterDropStats?.addUncategorizedCallDropped();
    } else {
      const category = this.checkForDrop();
      if (category !== null) {
        details = `Call dropped by load balancing policy. Category: ${category}`;
        this.clusterDropStats?.addCallDropped(category);
      }
    }
    if (details === null) {
      const originalPick = this.originalPicker.pick(pickArgs);
      const pickSubchannel = originalPick.subchannel ? (originalPick.subchannel as LocalitySubchannelWrapper) : null;
      return {
        pickResultType: originalPick.pickResultType,
        status: originalPick.status,
        subchannel: pickSubchannel?.getWrappedSubchannel?.() ?? null,
        onCallStarted: () => {
          originalPick.onCallStarted?.();
          pickSubchannel?.getStatsObject()?.addCallStarted();
          callCounterMap.startCall(this.callCounterMapKey);
        },
        onCallEnded: (status, details, metadata) => {
          originalPick.onCallEnded?.(status, details, metadata);
          pickSubchannel?.getStatsObject()?.addCallFinished(status !== Status.OK)
          callCounterMap.endCall(this.callCounterMapKey);
        }
      };
    } else {
      return {
        pickResultType: PickResultType.DROP,
        status: {
          code: Status.UNAVAILABLE,
          details: details,
          metadata: new Metadata(),
        },
        subchannel: null,
        onCallEnded: null,
        onCallStarted: null
      };
    }
  }
}

function getCallCounterMapKey(cluster: string, edsServiceName?: string): string {
  return `{${cluster},${edsServiceName ?? ''}}`;
}

class XdsClusterImplBalancer implements LoadBalancer {
  private childBalancer: ChildLoadBalancerHandler;
  private lastestEndpointList: StatusOr<Endpoint[]> | null = null;
  private latestConfig: XdsClusterImplLoadBalancingConfig | null = null;
  private clusterDropStats: XdsClusterDropStats | null = null;
  private xdsClient: XdsClient | null = null;
  private latestClusterConfig: ClusterConfig | null = null;

  constructor(private readonly channelControlHelper: ChannelControlHelper) {
      this.childBalancer = new ChildLoadBalancerHandler(createChildChannelControlHelper(channelControlHelper, {
        createSubchannel: (subchannelAddress, subchannelArgs) => {
          if (!this.xdsClient || !this.latestConfig || !this.lastestEndpointList || !this.lastestEndpointList.ok || !this.latestClusterConfig) {
            throw new Error('xds_cluster_impl: invalid state: createSubchannel called with xdsClient or latestConfig not populated or with resolver error');
          }
          const wrapperChild = channelControlHelper.createSubchannel(subchannelAddress, subchannelArgs);
          let locality: Locality__Output | null = null;
          for (const endpoint of this.lastestEndpointList.value) {
            if (endpointHasAddress(endpoint, subchannelAddress)) {
              locality = (endpoint as LocalityEndpoint).locality;
            }
          }
          if (locality === null) {
            trace('Not reporting load for address ' + subchannelAddressToString(subchannelAddress) + ' because it has unknown locality.');
            return wrapperChild;
          }
          const lrsServer = this.latestClusterConfig.cluster.lrsLoadReportingServer;
          let statsObj: XdsClusterLocalityStats | null = null;
          if (lrsServer) {
            statsObj = this.xdsClient.addClusterLocalityStats(
              lrsServer,
              this.latestConfig.getCluster(),
              this.latestClusterConfig.cluster.edsServiceName ?? '',
              locality
            );
          }
          return new LocalitySubchannelWrapper(wrapperChild, statsObj);
        },
        updateState: (connectivityState, originalPicker, errorMessage) => {
          if (this.latestConfig === null || this.latestClusterConfig === null || this.latestClusterConfig.children.type === 'aggregate' || !this.latestClusterConfig.children.endpoints) {
            channelControlHelper.updateState(connectivityState, originalPicker, errorMessage);
          } else {
            const picker = new XdsClusterImplPicker(originalPicker, getCallCounterMapKey(this.latestConfig.getCluster(), this.latestClusterConfig.cluster.edsServiceName), this.latestClusterConfig.cluster.maxConcurrentRequests ?? DEFAULT_MAX_CONCURRENT_REQUESTS, this.latestClusterConfig.children.endpoints.dropCategories, this.clusterDropStats);
            channelControlHelper.updateState(connectivityState, picker, errorMessage);
          }
        }
      }));
    }
  updateAddressList(endpointList: StatusOr<Endpoint[]>, lbConfig: TypedLoadBalancingConfig, options: ChannelOptions, resolutionNote: string): boolean {
    if (!(lbConfig instanceof XdsClusterImplLoadBalancingConfig)) {
      trace('Discarding address list update with unrecognized config ' + JSON.stringify(lbConfig.toJsonObject(), undefined, 2));
      return false;
    }
    trace('Received update with config: ' + JSON.stringify(lbConfig.toJsonObject(), undefined, 2));
    const xdsConfig = options[XDS_CONFIG_KEY] as XdsConfig;
    const maybeClusterConfig = xdsConfig.clusters.get(lbConfig.getCluster());
    if (!maybeClusterConfig) {
      trace('Received update with no config for cluster ' + lbConfig.getCluster());
      return false;
    }
    if (!maybeClusterConfig.ok) {
      this.latestClusterConfig = null;
      this.childBalancer.destroy();
      this.channelControlHelper.updateState(connectivityState.TRANSIENT_FAILURE, new UnavailablePicker(maybeClusterConfig.error), maybeClusterConfig.error.details);
      return false;
    }
    const clusterConfig = maybeClusterConfig.value;
    if (clusterConfig.children.type === 'aggregate') {
      trace('Received update for aggregate cluster ' + lbConfig.getCluster());
      return false;
    }
    if (!clusterConfig.children.endpoints) {
      this.childBalancer.destroy();
      this.channelControlHelper.updateState(connectivityState.TRANSIENT_FAILURE, new UnavailablePicker({details: clusterConfig.children.resolutionNote}), clusterConfig.children.resolutionNote ?? null);

    }
    this.lastestEndpointList = endpointList;
    this.latestConfig = lbConfig;
    this.latestClusterConfig = clusterConfig;
    this.xdsClient = options[XDS_CLIENT_KEY] as XdsClient;
    if (clusterConfig.cluster.lrsLoadReportingServer) {
      this.clusterDropStats = this.xdsClient.addClusterDropStats(
        clusterConfig.cluster.lrsLoadReportingServer,
        lbConfig.getCluster(),
        clusterConfig.cluster.edsServiceName ?? ''
      );
    }

    this.childBalancer.updateAddressList(endpointList, lbConfig.getChildPolicy(), options, resolutionNote);
    return true;
  }
  exitIdle(): void {
    this.childBalancer.exitIdle();
  }
  resetBackoff(): void {
    this.childBalancer.resetBackoff();
  }
  destroy(): void {
    this.childBalancer.destroy();
  }
  getTypeName(): string {
    return TYPE_NAME;
  }
}

export function setup() {
  registerLoadBalancerType(TYPE_NAME, XdsClusterImplBalancer, XdsClusterImplLoadBalancingConfig);
}
