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

import { connectivityState as ConnectivityState, status as Status, Metadata, logVerbosity, experimental, LoadBalancingConfig, ChannelOptions } from "@grpc/grpc-js";
import { isLocalityEndpoint, LocalityEndpoint } from "./load-balancer-priority";
import TypedLoadBalancingConfig = experimental.TypedLoadBalancingConfig;
import LoadBalancer = experimental.LoadBalancer;
import ChannelControlHelper = experimental.ChannelControlHelper;
import registerLoadBalancerType = experimental.registerLoadBalancerType;
import ChildLoadBalancerHandler = experimental.ChildLoadBalancerHandler;
import Picker = experimental.Picker;
import PickResult = experimental.PickResult;
import PickArgs = experimental.PickArgs;
import QueuePicker = experimental.QueuePicker;
import UnavailablePicker = experimental.UnavailablePicker;
import Endpoint = experimental.Endpoint;
import endpointToString = experimental.endpointToString;
import selectLbConfigFromList = experimental.selectLbConfigFromList;

const TRACER_NAME = 'weighted_target';

function trace(text: string): void {
  experimental.trace(logVerbosity.DEBUG, TRACER_NAME, text);
}

const TYPE_NAME = 'weighted_target';

const DEFAULT_RETENTION_INTERVAL_MS = 15 * 60 * 1000;

/**
 * Type of the config for an individual child in the JSON representation of
 * a weighted target LB policy config.
 */
export interface WeightedTargetRaw {
  weight: number;
  child_policy: LoadBalancingConfig[];
}

/**
 * The JSON representation of the config for the weighted target LB policy. The
 * LoadBalancingConfig for a weighted target policy should have the form
 * { weighted_target: WeightedTargetRawConfig }
 */
export interface WeightedTargetRawConfig {
  targets: {[name: string]: WeightedTargetRaw };
}

interface WeightedTarget {
  weight: number;
  child_policy: TypedLoadBalancingConfig;
}

class WeightedTargetLoadBalancingConfig implements TypedLoadBalancingConfig {
  getLoadBalancerName(): string {
    return TYPE_NAME;
  }

  constructor(private targets: Map<string, WeightedTarget>) {
  }

  getTargets() {
    return this.targets;
  }

  toJsonObject(): object {
    const targetsField: {[key: string]: object} = {};
    for (const [targetName, targetValue] of this.targets.entries()) {
      targetsField[targetName] = {
        weight: targetValue.weight,
        child_policy: [targetValue.child_policy.toJsonObject()]
      };
    }
    return {
      [TYPE_NAME]: {
        targets: targetsField
      }
    }
  }

  static createFromJson(obj: any): WeightedTargetLoadBalancingConfig {
    const targetsMap: Map<string, WeightedTarget> = new Map<string, WeightedTarget>();
    if (!('targets' in obj && obj.targets !== null && typeof obj.targets === 'object')) {
      throw new Error('Weighted target config must have a targets map');
    }
    for (const key of Object.keys(obj.targets)) {
      const targetObj = obj.targets[key];
      if (!('weight' in targetObj && typeof targetObj.weight === 'number')) {
        throw new Error(`Weighted target ${key} must have a numeric weight`);
      }
      if (!('child_policy' in targetObj && Array.isArray(targetObj.child_policy))) {
        throw new Error(`Weighted target ${key} must have a child_policy array`);
      }
      const childConfig = selectLbConfigFromList(targetObj.child_policy);
      if (!childConfig) {
        throw new Error(`Weighted target ${key} config parsing failed`);
      }
      const validatedTarget: WeightedTarget = {
        weight: targetObj.weight,
        child_policy: childConfig
      }
      targetsMap.set(key, validatedTarget);
    }
    return new WeightedTargetLoadBalancingConfig(targetsMap);
  }
}

/**
 * Represents a picker and a subinterval of a larger interval used for randomly
 * selecting an element of a list of these objects.
 */
interface WeightedPicker {
  picker: Picker;
  /**
   * The exclusive end of the interval associated with this element. The start
   * of the interval is implicitly the rangeEnd of the previous element in the
   * list, or 0 for the first element in the list.
   */
  rangeEnd: number;
}

class WeightedTargetPicker implements Picker {
  private rangeTotal: number;
  constructor(private readonly pickerList: WeightedPicker[]) {
    this.rangeTotal = pickerList[pickerList.length - 1].rangeEnd;
  }
  pick(pickArgs: PickArgs): PickResult {
    // num | 0 is equivalent to floor(num)
    const selection = (Math.random() * this.rangeTotal) | 0;

    for (const entry of this.pickerList) {
      if (selection < entry.rangeEnd) {
        return entry.picker.pick(pickArgs);
      }
    }

    /* Default to first element if the iteration doesn't find anything for some
     * reason. */
    return this.pickerList[0].picker.pick(pickArgs);
  }
}

interface WeightedChild {
  updateAddressList(endpointList: Endpoint[], lbConfig: WeightedTarget, attributes: { [key: string]: unknown; }): void;
  exitIdle(): void;
  resetBackoff(): void;
  destroy(): void;
  deactivate(): void;
  maybeReactivate(): void;
  getConnectivityState(): ConnectivityState;
  getPicker(): Picker;
  getWeight(): number;
}

export class WeightedTargetLoadBalancer implements LoadBalancer {
  private WeightedChildImpl = class implements WeightedChild {
    private connectivityState: ConnectivityState = ConnectivityState.IDLE;
    private picker: Picker;
    private childBalancer: ChildLoadBalancerHandler;
    private deactivationTimer: NodeJS.Timer | null = null;
    private weight: number = 0;

    constructor(private parent: WeightedTargetLoadBalancer, private name: string) {
      this.childBalancer = new ChildLoadBalancerHandler(experimental.createChildChannelControlHelper(this.parent.channelControlHelper, {
        updateState: (connectivityState: ConnectivityState, picker: Picker) => {
          this.updateState(connectivityState, picker);
        },
      }), parent.options);

      this.picker = new QueuePicker(this.childBalancer);
    }

    private updateState(connectivityState: ConnectivityState, picker: Picker) {
      trace('Target ' + this.name + ' ' + ConnectivityState[this.connectivityState] + ' -> ' + ConnectivityState[connectivityState]);
      this.connectivityState = connectivityState;
      this.picker = picker;
      this.parent.maybeUpdateState();
    }

    updateAddressList(endpointList: Endpoint[], lbConfig: WeightedTarget, attributes: { [key: string]: unknown; }): void {
      this.weight = lbConfig.weight;
      this.childBalancer.updateAddressList(endpointList, lbConfig.child_policy, attributes);
    }
    exitIdle(): void {
      this.childBalancer.exitIdle();
    }
    resetBackoff(): void {
      this.childBalancer.resetBackoff();
    }
    destroy(): void {
      this.childBalancer.destroy();
      if (this.deactivationTimer !== null) {
        clearTimeout(this.deactivationTimer);
      }
    }
    deactivate(): void {
      if (this.deactivationTimer === null) {
        this.deactivationTimer = setTimeout(() => {
          this.parent.targets.delete(this.name);
          this.deactivationTimer = null;
        }, DEFAULT_RETENTION_INTERVAL_MS);
      }
    }
    maybeReactivate(): void {
      if (this.deactivationTimer !== null) {
        clearTimeout(this.deactivationTimer);
        this.deactivationTimer = null;
      }
    }
    getConnectivityState(): ConnectivityState {
      return this.connectivityState;
    }
    getPicker(): Picker {
      return this.picker;
    }
    getWeight(): number {
      return this.weight;
    }
  }
  // end of WeightedChildImpl

  /**
   * Map of target names to target children. Includes current targets and
   * previous targets with deactivation timers that have not yet triggered.
   */
  private targets: Map<string, WeightedChild> = new Map<string, WeightedChild>();
  /**
   * List of current target names.
   */
  private targetList: string[] = [];
  private updatesPaused = false;

  constructor(private channelControlHelper: ChannelControlHelper, private options: ChannelOptions) {}

  private maybeUpdateState() {
    if (!this.updatesPaused) {
      this.updateState()
    }
  }

  private updateState() {
    const pickerList: WeightedPicker[] = [];
    let end = 0;

    let connectingCount = 0;
    let idleCount = 0;
    let transientFailureCount = 0;
    for (const targetName of this.targetList) {
      const target = this.targets.get(targetName);
      if (target === undefined) {
        continue;
      }
      switch (target.getConnectivityState()) {
        case ConnectivityState.READY:
          end += target.getWeight();
          pickerList.push({
            picker: target.getPicker(),
            rangeEnd: end
          });
          break;
        case ConnectivityState.CONNECTING:
          connectingCount += 1;
          break;
        case ConnectivityState.IDLE:
          idleCount += 1;
          break;
        case ConnectivityState.TRANSIENT_FAILURE:
          transientFailureCount += 1;
          break;
        default:
          // Ignore the other possiblity, SHUTDOWN
      }
    }

    let connectivityState: ConnectivityState;
    if (pickerList.length > 0) {
      connectivityState = ConnectivityState.READY;
    } else if (connectingCount > 0) {
      connectivityState = ConnectivityState.CONNECTING;
    } else if (idleCount > 0) {
      connectivityState = ConnectivityState.IDLE;
    } else {
      connectivityState = ConnectivityState.TRANSIENT_FAILURE;
    }

    let picker: Picker;
    switch (connectivityState) {
      case ConnectivityState.READY:
        picker = new WeightedTargetPicker(pickerList);
        break;
      case ConnectivityState.CONNECTING:
      case ConnectivityState.IDLE:
        picker = new QueuePicker(this);
        break;
      default:
        picker = new UnavailablePicker({
          code: Status.UNAVAILABLE,
          details: 'weighted_target: all children report state TRANSIENT_FAILURE',
          metadata: new Metadata()
        });
    }
    trace(
        'Transitioning to ' +
        ConnectivityState[connectivityState]
    );
    this.channelControlHelper.updateState(connectivityState, picker);
  }

  updateAddressList(addressList: Endpoint[], lbConfig: TypedLoadBalancingConfig, attributes: { [key: string]: unknown; }): void {
    if (!(lbConfig instanceof WeightedTargetLoadBalancingConfig)) {
      // Reject a config of the wrong type
      trace('Discarding address list update with unrecognized config ' + JSON.stringify(lbConfig.toJsonObject(), undefined, 2));
      return;
    }

    /* For each address, the first element of its localityPath array determines
     * which child it belongs to. So we bucket those addresses by that first
     * element, and pass along the rest of the localityPath for that child
     * to use. */
    const childEndpointMap = new Map<string, LocalityEndpoint[]>();
    for (const address of addressList) {
      if (!isLocalityEndpoint(address)) {
        // Reject address that cannot be associated with targets
        return;
      }
      if (address.localityPath.length < 1) {
        // Reject address that cannot be associated with targets
        return;
      }
      const childName = address.localityPath[0];
      const childAddress: LocalityEndpoint = {
        ...address,
        localityPath: address.localityPath.slice(1),
      };
      let childAddressList = childEndpointMap.get(childName);
      if (childAddressList === undefined) {
        childAddressList = [];
        childEndpointMap.set(childName, childAddressList);
      }
      childAddressList.push(childAddress);
    }

    this.updatesPaused = true;
    this.targetList = Array.from(lbConfig.getTargets().keys());
    for (const [targetName, targetConfig] of lbConfig.getTargets()) {
      let target = this.targets.get(targetName);
      if (target === undefined) {
        target = new this.WeightedChildImpl(this, targetName);
        this.targets.set(targetName, target);
      } else {
        target.maybeReactivate();
      }
      const targetEndpoints = childEndpointMap.get(targetName) ?? [];
      trace('Assigning target ' + targetName + ' address list ' + targetEndpoints.map(endpoint => '(' + endpointToString(endpoint) + ' path=' + endpoint.localityPath + ')'));
      target.updateAddressList(targetEndpoints, targetConfig, attributes);
    }

    // Deactivate targets that are not in the new config
    for (const [targetName, target] of this.targets) {
      if (this.targetList.indexOf(targetName) < 0) {
        trace('Deactivating target ' + targetName);
        target.deactivate();
      }
    }
    this.updatesPaused = false;

    this.updateState();
  }
  exitIdle(): void {
    for (const targetName of this.targetList) {
      this.targets.get(targetName)?.exitIdle();
    }
  }
  resetBackoff(): void {
    for (const targetName of this.targetList) {
      this.targets.get(targetName)?.resetBackoff();
    }
  }
  destroy(): void {
    for (const target of this.targets.values()) {
      target.destroy();
    }
    this.targets.clear();
  }
  getTypeName(): string {
    return TYPE_NAME;
  }
}

export function setup() {
  registerLoadBalancerType(TYPE_NAME, WeightedTargetLoadBalancer, WeightedTargetLoadBalancingConfig);
}
