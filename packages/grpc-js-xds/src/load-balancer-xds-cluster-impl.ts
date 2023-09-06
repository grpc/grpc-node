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
import { Locality__Output } from "./generated/envoy/config/core/v3/Locality";

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

function validateDropCategory(obj: any): DropCategory {
  if (!('category' in obj && typeof obj.category === 'string')) {
    throw new Error('xds_cluster_impl config drop_categories entry must have a string field category');
  }
  if (!('requests_per_million' in obj && typeof obj.requests_per_million === 'number')) {
    throw new Error('xds_cluster_impl config drop_categories entry must have a number field requests_per_million');
  }
  return obj;
}

class XdsClusterImplLoadBalancingConfig implements TypedLoadBalancingConfig {
  private maxConcurrentRequests: number;
  getLoadBalancerName(): string {
    return TYPE_NAME;
  }
  toJsonObject(): object {
    const jsonObj: {[key: string]: any} = {
      cluster: this.cluster,
      drop_categories: this.dropCategories,
      child_policy: [this.childPolicy.toJsonObject()],
      max_concurrent_requests: this.maxConcurrentRequests,
      eds_service_name: this.edsServiceName,
      lrs_load_reporting_server: this.lrsLoadReportingServer,
    };
    return {
      [TYPE_NAME]: jsonObj
    };
  }

  constructor(private cluster: string, private dropCategories: DropCategory[], private childPolicy: TypedLoadBalancingConfig, private edsServiceName: string, private lrsLoadReportingServer?: XdsServerConfig, maxConcurrentRequests?: number) {
    this.maxConcurrentRequests = maxConcurrentRequests ?? DEFAULT_MAX_CONCURRENT_REQUESTS;
  }

  getCluster() {
    return this.cluster;
  }

  getEdsServiceName() {
    return this.edsServiceName;
  }

  getLrsLoadReportingServer() {
    return this.lrsLoadReportingServer;
  }

  getMaxConcurrentRequests() {
    return this.maxConcurrentRequests;
  }

  getDropCategories() {
    return this.dropCategories;
  }

  getChildPolicy() {
    return this.childPolicy;
  }

  static createFromJson(obj: any): XdsClusterImplLoadBalancingConfig {
    if (!('cluster' in obj && typeof obj.cluster === 'string')) {
      throw new Error('xds_cluster_impl config must have a string field cluster');
    }
    if (!('eds_service_name' in obj && typeof obj.eds_service_name === 'string')) {
      throw new Error('xds_cluster_impl config must have a string field eds_service_name');
    }
    if ('max_concurrent_requests' in obj && !(obj.max_concurrent_requests === undefined || typeof obj.max_concurrent_requests === 'number')) {
      throw new Error('xds_cluster_impl config max_concurrent_requests must be a number if provided');
    }
    if (!('drop_categories' in obj && Array.isArray(obj.drop_categories))) {
      throw new Error('xds_cluster_impl config must have an array field drop_categories');
    }
    if (!('child_policy' in obj && Array.isArray(obj.child_policy))) {
      throw new Error('xds_cluster_impl config must have an array field child_policy');
    }
    const childConfig = selectLbConfigFromList(obj.child_policy);
    if (!childConfig) {
      throw new Error('xds_cluster_impl config child_policy parsing failed');
    }
    let lrsServer: XdsServerConfig | undefined = undefined;
    if (obj.lrs_load_reporting_server) {
      lrsServer = validateXdsServerConfig(obj.lrs_load_reporting_server)
    }
    return new XdsClusterImplLoadBalancingConfig(obj.cluster, obj.drop_categories.map(validateDropCategory), childConfig, obj.eds_service_name, lrsServer, obj.max_concurrent_requests);
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
        subchannel: pickSubchannel?.getWrappedSubchannel() ?? null,
        onCallStarted: () => {
          originalPick.onCallStarted?.();
          pickSubchannel?.getStatsObject()?.addCallStarted();
          callCounterMap.startCall(this.callCounterMapKey);
        },
        onCallEnded: status => {
          originalPick.onCallEnded?.(status);
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
  private lastestEndpointList: Endpoint[] | null = null;
  private latestConfig: XdsClusterImplLoadBalancingConfig | null = null;
  private clusterDropStats: XdsClusterDropStats | null = null;
  private xdsClient: XdsClient | null = null;

  constructor(private readonly channelControlHelper: ChannelControlHelper, options: ChannelOptions) {
      this.childBalancer = new ChildLoadBalancerHandler(createChildChannelControlHelper(channelControlHelper, {
        createSubchannel: (subchannelAddress, subchannelArgs) => {
          if (!this.xdsClient || !this.latestConfig || !this.lastestEndpointList) {
            throw new Error('xds_cluster_impl: invalid state: createSubchannel called with xdsClient or latestConfig not populated');
          }
          const wrapperChild = channelControlHelper.createSubchannel(subchannelAddress, subchannelArgs);
          let locality: Locality__Output | null = null;
          for (const endpoint of this.lastestEndpointList) {
            if (endpointHasAddress(endpoint, subchannelAddress)) {
              locality = (endpoint as LocalityEndpoint).locality;
            }
          }
          if (locality === null) {
            trace('Not reporting load for address ' + subchannelAddressToString(subchannelAddress) + ' because it has unknown locality.');
            return wrapperChild;
          }
          const lrsServer = this.latestConfig.getLrsLoadReportingServer();
          let statsObj: XdsClusterLocalityStats | null = null;
          if (lrsServer) {
            statsObj = this.xdsClient.addClusterLocalityStats(
              lrsServer,
              this.latestConfig.getCluster(),
              this.latestConfig.getEdsServiceName(),
              locality
            );
          }
          return new LocalitySubchannelWrapper(wrapperChild, statsObj);
        },
        updateState: (connectivityState, originalPicker) => {
          if (this.latestConfig === null) {
            channelControlHelper.updateState(connectivityState, originalPicker);
          } else {
            const picker = new XdsClusterImplPicker(originalPicker, getCallCounterMapKey(this.latestConfig.getCluster(), this.latestConfig.getEdsServiceName()), this.latestConfig.getMaxConcurrentRequests(), this.latestConfig.getDropCategories(), this.clusterDropStats);
            channelControlHelper.updateState(connectivityState, picker);
          }
        }
      }), options);
    }
  updateAddressList(endpointList: Endpoint[], lbConfig: TypedLoadBalancingConfig, attributes: { [key: string]: unknown; }): void {
    if (!(lbConfig instanceof XdsClusterImplLoadBalancingConfig)) {
      trace('Discarding address list update with unrecognized config ' + JSON.stringify(lbConfig.toJsonObject(), undefined, 2));
      return;
    }
    trace('Received update with config: ' + JSON.stringify(lbConfig, undefined, 2));
    this.lastestEndpointList = endpointList;
    this.latestConfig = lbConfig;
    this.xdsClient = attributes.xdsClient as XdsClient;
    if (lbConfig.getLrsLoadReportingServer()) {
      this.clusterDropStats = this.xdsClient.addClusterDropStats(
        lbConfig.getLrsLoadReportingServer()!,
        lbConfig.getCluster(),
        lbConfig.getEdsServiceName() ?? ''
      );
    }

    this.childBalancer.updateAddressList(endpointList, lbConfig.getChildPolicy(), attributes);
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
