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

import { connectivityState as ConnectivityState, status as Status, experimental, logVerbosity, Metadata, status, ChannelOptions } from "@grpc/grpc-js/";

import TypedLoadBalancingConfig = experimental.TypedLoadBalancingConfig;
import LoadBalancer = experimental.LoadBalancer;
import Picker = experimental.Picker;
import PickResult = experimental.PickResult;
import PickArgs = experimental.PickArgs;
import PickResultType = experimental.PickResultType;
import UnavailablePicker = experimental.UnavailablePicker;
import QueuePicker = experimental.QueuePicker;
import Endpoint = experimental.Endpoint;
import ChildLoadBalancerHandler = experimental.ChildLoadBalancerHandler;
import ChannelControlHelper = experimental.ChannelControlHelper;
import selectLbConfigFromList = experimental.selectLbConfigFromList;
import registerLoadBalancerType = experimental.registerLoadBalancerType;

const TRACER_NAME = 'xds_cluster_manager';

function trace(text: string): void {
  experimental.trace(logVerbosity.DEBUG, TRACER_NAME, text);
}

const TYPE_NAME = 'xds_cluster_manager';

class XdsClusterManagerLoadBalancingConfig implements TypedLoadBalancingConfig {
  getLoadBalancerName(): string {
    return TYPE_NAME;
  }

  constructor(private children: Map<string, TypedLoadBalancingConfig>) {}

  getChildren() {
    return this.children;
  }

  toJsonObject(): object {
    const childrenField: {[key: string]: object} = {};
    for (const [childName, childPolicy] of this.children.entries()) {
      childrenField[childName] = {
        child_policy: [childPolicy.toJsonObject()]
      };
    }
    return {
      [TYPE_NAME]: {
        children: childrenField
      }
    }
  }

  static createFromJson(obj: any): XdsClusterManagerLoadBalancingConfig {
    const childrenMap: Map<string, TypedLoadBalancingConfig> = new Map<string, TypedLoadBalancingConfig>();
    if (!('children' in obj && obj.children !== null && typeof obj.children === 'object')) {
      throw new Error('xds_cluster_manager config must have a children map');
    }
    for (const key of Object.keys(obj.children)) {
      const childObj = obj.children[key];
      if (!('child_policy' in childObj && Array.isArray(childObj.child_policy))) {
        throw new Error(`xds_cluster_manager child ${key} must have a child_policy array`);
      }
      const childPolicy = selectLbConfigFromList(childObj.child_policy);
      if (childPolicy === null) {
        throw new Error(`xds_cluster_mananger child ${key} has no recognized sucessfully parsed child_policy`);
      }
      childrenMap.set(key, childPolicy);
    }
    return new XdsClusterManagerLoadBalancingConfig(childrenMap);
  }
}

class XdsClusterManagerPicker implements Picker {
  constructor(private childPickers: Map<string, Picker>) {}

  pick(pickArgs: PickArgs): PickResult {
    /* extraPickInfo.cluster should be set for all calls by the config selector
     * corresponding to the service config that specified the use of this LB
     * policy. */
    const cluster = pickArgs.extraPickInfo.cluster ?? '';
    if (this.childPickers.has(cluster)) {
      return this.childPickers.get(cluster)!.pick(pickArgs);
    } else {
      return {
        pickResultType: PickResultType.TRANSIENT_FAILURE,
        status: {
          code: status.INTERNAL,
          details: `Requested cluster ${cluster} not found`,
          metadata: new Metadata(),
        },
        subchannel: null,
        onCallStarted: null,
        onCallEnded: null
      };
    }
  }
}

interface XdsClusterManagerChild {
  updateAddressList(endpointList: Endpoint[], childConfig: TypedLoadBalancingConfig, attributes: { [key: string]: unknown; }): void;
  exitIdle(): void;
  resetBackoff(): void;
  destroy(): void;
  getConnectivityState(): ConnectivityState;
  getPicker(): Picker;

}

class XdsClusterManager implements LoadBalancer {
  private XdsClusterManagerChildImpl = class implements XdsClusterManagerChild {
    private connectivityState: ConnectivityState = ConnectivityState.IDLE;
    private picker: Picker;
    private childBalancer: ChildLoadBalancerHandler;

    constructor(private parent: XdsClusterManager, private name: string) {
      this.childBalancer = new ChildLoadBalancerHandler(experimental.createChildChannelControlHelper(this.parent.channelControlHelper, {
        updateState: (connectivityState: ConnectivityState, picker: Picker) => {
          this.updateState(connectivityState, picker);
        },
      }), parent.options);

      this.picker = new QueuePicker(this.childBalancer);
    }

    private updateState(connectivityState: ConnectivityState, picker: Picker) {
      trace('Child ' + this.name + ' ' + ConnectivityState[this.connectivityState] + ' -> ' + ConnectivityState[connectivityState]);
      this.connectivityState = connectivityState;
      this.picker = picker;
      this.parent.maybeUpdateState();
    }
    updateAddressList(endpointList: Endpoint[], childConfig: TypedLoadBalancingConfig, attributes: { [key: string]: unknown; }): void {
      this.childBalancer.updateAddressList(endpointList, childConfig, attributes);
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
    getConnectivityState(): ConnectivityState {
      return this.connectivityState;
    }
    getPicker(): Picker {
      return this.picker;
    }
  }
  // End of XdsClusterManagerChildImpl

  private children: Map<string, XdsClusterManagerChild> = new Map<string, XdsClusterManagerChild>();
  // Shutdown is a placeholder value that will never appear in normal operation.
  private currentState: ConnectivityState = ConnectivityState.SHUTDOWN;
  private updatesPaused = false;
  constructor(private channelControlHelper: ChannelControlHelper, private options: ChannelOptions) {}

  private maybeUpdateState() {
    if (!this.updatesPaused) {
      this.updateState();
    }
  }

  private updateState() {
    const pickerMap: Map<string, Picker> = new Map<string, Picker>();
    let anyReady = false;
    let anyConnecting = false;
    let anyIdle = false;
    for (const [name, child] of this.children.entries()) {
      pickerMap.set(name, child.getPicker());
      switch (child.getConnectivityState()) {
        case ConnectivityState.READY:
          anyReady = true;
          break;
        case ConnectivityState.CONNECTING:
          anyConnecting = true;
          break;
        case ConnectivityState.IDLE:
          anyIdle = true;
          break;
      }
    }
    let connectivityState: ConnectivityState;
    if (anyReady) {
      connectivityState = ConnectivityState.READY;
    } else if (anyConnecting) {
      connectivityState = ConnectivityState.CONNECTING;
    } else if (anyIdle) {
      connectivityState = ConnectivityState.IDLE;
    } else {
      connectivityState = ConnectivityState.TRANSIENT_FAILURE;
    }
    this.channelControlHelper.updateState(connectivityState, new XdsClusterManagerPicker(pickerMap));
  }

  updateAddressList(endpointList: Endpoint[], lbConfig: TypedLoadBalancingConfig, attributes: { [key: string]: unknown; }): void {
    if (!(lbConfig instanceof XdsClusterManagerLoadBalancingConfig)) {
      // Reject a config of the wrong type
      trace('Discarding address list update with unrecognized config ' + JSON.stringify(lbConfig.toJsonObject(), undefined, 2));
      return;
    }
    trace('Received update with config: ' + JSON.stringify(lbConfig.toJsonObject(), undefined, 2));
    const configChildren = lbConfig.getChildren();
    // Delete children that are not in the new config
    const namesToRemove: string[] = [];
    for (const name of this.children.keys()) {
      if (!configChildren.has(name)) {
        namesToRemove.push(name);
      }
    }
    this.updatesPaused = true;
    for (const name of namesToRemove) {
      this.children.get(name)!.destroy();
      this.children.delete(name);
    }
    // Add new children that were not in the previous config
    for (const [name, childConfig] of configChildren.entries()) {
      if (!this.children.has(name)) {
        const newChild = new this.XdsClusterManagerChildImpl(this, name);
        newChild.updateAddressList(endpointList, childConfig, attributes);
        this.children.set(name, newChild);
      }
    }
    this.updatesPaused = false;
    this.updateState();
  }
  exitIdle(): void {
    for (const child of this.children.values()) {
      child.exitIdle();
    }
  }
  resetBackoff(): void {
    for (const child of this.children.values()) {
      child.resetBackoff();
    }
  }
  destroy(): void {
    for (const child of this.children.values()) {
      child.destroy();
    }
    this.children.clear();
  }
  getTypeName(): string {
    return TYPE_NAME;
  }
}

export function setup() {
  registerLoadBalancerType(TYPE_NAME, XdsClusterManager, XdsClusterManagerLoadBalancingConfig);
}
