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

import { experimental, logVerbosity, status as Status, Metadata, connectivityState } from "@grpc/grpc-js";
import { validateXdsServerConfig, XdsServerConfig } from "./xds-bootstrap";
import { getSingletonXdsClient, XdsClient, XdsClusterDropStats } from "./xds-client";

import LoadBalancingConfig = experimental.LoadBalancingConfig;
import validateLoadBalancingConfig = experimental.validateLoadBalancingConfig;
import LoadBalancer = experimental.LoadBalancer;
import registerLoadBalancerType = experimental.registerLoadBalancerType;
import SubchannelAddress = experimental.SubchannelAddress;
import Picker = experimental.Picker;
import PickArgs = experimental.PickArgs;
import PickResult = experimental.PickResult;
import PickResultType = experimental.PickResultType;
import ChannelControlHelper = experimental.ChannelControlHelper;
import ChildLoadBalancerHandler = experimental.ChildLoadBalancerHandler;
import createChildChannelControlHelper = experimental.createChildChannelControlHelper;
import getFirstUsableConfig = experimental.getFirstUsableConfig;

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

export class XdsClusterImplLoadBalancingConfig implements LoadBalancingConfig {
  private maxConcurrentRequests: number;
  getLoadBalancerName(): string {
    return TYPE_NAME;
  }
  toJsonObject(): object {
    const jsonObj: {[key: string]: any} = {
      cluster: this.cluster,
      drop_categories: this.dropCategories,
      child_policy: this.childPolicy.map(policy => policy.toJsonObject()),
      max_concurrent_requests: this.maxConcurrentRequests
    };
    if (this.edsServiceName !== undefined) {
      jsonObj.eds_service_name = this.edsServiceName;
    }
    if (this.lrsLoadReportingServer !== undefined) {
      jsonObj.lrs_load_reporting_server_name = this.lrsLoadReportingServer;
    }
    return {
      [TYPE_NAME]: jsonObj
    };
  }

  constructor(private cluster: string, private dropCategories: DropCategory[], private childPolicy: LoadBalancingConfig[], private edsServiceName?: string, private lrsLoadReportingServer?: XdsServerConfig, maxConcurrentRequests?: number) {
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
    if ('eds_service_name' in obj && !(obj.eds_service_name === undefined || typeof obj.eds_service_name === 'string')) {
      throw new Error('xds_cluster_impl config eds_service_name field must be a string if provided');
    }
    if ('max_concurrent_requests' in obj && (!obj.max_concurrent_requests === undefined || typeof obj.max_concurrent_requests === 'number')) {
      throw new Error('xds_cluster_impl config max_concurrent_requests must be a number if provided');
    }
    if (!('drop_categories' in obj && Array.isArray(obj.drop_categories))) {
      throw new Error('xds_cluster_impl config must have an array field drop_categories');
    }
    if (!('child_policy' in obj && Array.isArray(obj.child_policy))) {
      throw new Error('xds_cluster_impl config must have an array field child_policy');
    }
    return new XdsClusterImplLoadBalancingConfig(obj.cluster, obj.drop_categories.map(validateDropCategory), obj.child_policy.map(validateLoadBalancingConfig), obj.eds_service_name, obj.lrs_load_reporting_server ? validateXdsServerConfig(obj.lrs_load_reporting_server) : undefined, obj.max_concurrent_requests);
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

class DropPicker implements Picker {
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
      return {
        pickResultType: originalPick.pickResultType,
        status: originalPick.status,
        subchannel: originalPick.subchannel,
        onCallStarted: () => {
          originalPick.onCallStarted?.();
          callCounterMap.startCall(this.callCounterMapKey);
        },
        onCallEnded: status => {
          originalPick.onCallEnded?.(status);
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
  private latestConfig: XdsClusterImplLoadBalancingConfig | null = null;
  private clusterDropStats: XdsClusterDropStats | null = null;
  private xdsClient: XdsClient | null = null;

  constructor(private readonly channelControlHelper: ChannelControlHelper) {
      this.childBalancer = new ChildLoadBalancerHandler(createChildChannelControlHelper(channelControlHelper, {
        updateState: (connectivityState, originalPicker) => {
          if (this.latestConfig === null) {
            channelControlHelper.updateState(connectivityState, originalPicker);
          } else {
            const picker = new DropPicker(originalPicker, getCallCounterMapKey(this.latestConfig.getCluster(), this.latestConfig.getEdsServiceName()), this.latestConfig.getMaxConcurrentRequests(), this.latestConfig.getDropCategories(), this.clusterDropStats);
            channelControlHelper.updateState(connectivityState, picker);
          }
        }
      }));
    }
  updateAddressList(addressList: SubchannelAddress[], lbConfig: LoadBalancingConfig, attributes: { [key: string]: unknown; }): void {
    if (!(lbConfig instanceof XdsClusterImplLoadBalancingConfig)) {
      trace('Discarding address list update with unrecognized config ' + JSON.stringify(lbConfig.toJsonObject(), undefined, 2));
      return;
    }
    trace('Received update with config: ' + JSON.stringify(lbConfig, undefined, 2));
    this.latestConfig = lbConfig;
    this.xdsClient = attributes.xdsClient as XdsClient;

    if (lbConfig.getLrsLoadReportingServer()) {
      this.clusterDropStats = this.xdsClient.addClusterDropStats(
        lbConfig.getLrsLoadReportingServer()!,
        lbConfig.getCluster(),
        lbConfig.getEdsServiceName() ?? ''
      );
    }

    this.childBalancer.updateAddressList(addressList, getFirstUsableConfig(lbConfig.getChildPolicy(), true), attributes);
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
