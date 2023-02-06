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

import { connectivityState as ConnectivityState, status as Status, Metadata, logVerbosity as LogVerbosity, experimental, ChannelOptions } from '@grpc/grpc-js';
import validateLoadBalancingConfig = experimental.validateLoadBalancingConfig;
import LoadBalancer = experimental.LoadBalancer;
import ChannelControlHelper = experimental.ChannelControlHelper;
import getFirstUsableConfig = experimental.getFirstUsableConfig;
import registerLoadBalancerType = experimental.registerLoadBalancerType;
import SubchannelAddress = experimental.SubchannelAddress;
import subchannelAddressToString = experimental.subchannelAddressToString;
import LoadBalancingConfig = experimental.LoadBalancingConfig;
import Picker = experimental.Picker;
import QueuePicker = experimental.QueuePicker;
import UnavailablePicker = experimental.UnavailablePicker;
import ChildLoadBalancerHandler = experimental.ChildLoadBalancerHandler;

const TRACER_NAME = 'priority';

function trace(text: string): void {
  experimental.trace(LogVerbosity.DEBUG, TRACER_NAME, text);
}

const TYPE_NAME = 'priority';

const DEFAULT_FAILOVER_TIME_MS = 10_000;
const DEFAULT_RETENTION_INTERVAL_MS = 15 * 60 * 1000;

export type LocalitySubchannelAddress = SubchannelAddress & {
  localityPath: string[];
};

export function isLocalitySubchannelAddress(
  address: SubchannelAddress
): address is LocalitySubchannelAddress {
  return Array.isArray((address as LocalitySubchannelAddress).localityPath);
}

export interface PriorityChild {
  config: LoadBalancingConfig[];
  ignore_reresolution_requests: boolean;
}

export class PriorityLoadBalancingConfig implements LoadBalancingConfig {
  getLoadBalancerName(): string {
    return TYPE_NAME;
  }
  toJsonObject(): object {
    const childrenField: {[key: string]: object} = {}
    for (const [childName, childValue] of this.children.entries()) {
      childrenField[childName] = {
        config: childValue.config.map(value => value.toJsonObject())
      };
    }
    return {
      [TYPE_NAME]: {
        children: childrenField,
        priorities: this.priorities
      }
    }
  }

  constructor(private children: Map<string, PriorityChild>, private priorities: string[]) {
  }

  getChildren() {
    return this.children;
  }

  getPriorities() {
    return this.priorities;
  }

  static createFromJson(obj: any): PriorityLoadBalancingConfig {
    if (!('children' in obj && obj.children !== null && typeof obj.children === 'object')) {
      throw new Error('Priority config must have a children map');
    }
    if (!('priorities' in obj && Array.isArray(obj.priorities) && (obj.priorities as any[]).every(value => typeof value === 'string'))) {
      throw new Error('Priority config must have a priorities list');
    }
    const childrenMap: Map<string, PriorityChild> = new Map<string, PriorityChild>();
    for (const childName of obj.children) {
      const childObj = obj.children[childName]
      if (!('config' in childObj && Array.isArray(childObj.config))) {
        throw new Error(`Priority child ${childName} must have a config list`);
      }
      if (!('ignore_reresolution_requests' in childObj && typeof childObj.ignore_reresolution_requests === 'boolean')) {
        throw new Error(`Priority child ${childName} must have a boolean field ignore_reresolution_requests`);
      }
      childrenMap.set(childName, {
        config: childObj.config.map(validateLoadBalancingConfig),
        ignore_reresolution_requests: childObj.ignore_reresolution_requests
      });
    }
    return new PriorityLoadBalancingConfig(childrenMap, obj.priorities);
  }
}

interface PriorityChildBalancer {
  updateAddressList(
    addressList: SubchannelAddress[],
    lbConfig: LoadBalancingConfig,
    attributes: { [key: string]: unknown }
  ): void;
  exitIdle(): void;
  resetBackoff(): void;
  deactivate(): void;
  maybeReactivate(): void;
  isFailoverTimerPending(): boolean;
  getConnectivityState(): ConnectivityState;
  getPicker(): Picker;
  getName(): string;
  destroy(): void;
}

interface UpdateArgs {
  subchannelAddress: SubchannelAddress[];
  lbConfig: LoadBalancingConfig;
  ignoreReresolutionRequests: boolean;
}

export class PriorityLoadBalancer implements LoadBalancer {
  /**
   * Inner class for holding a child priority and managing associated timers.
   */
  private PriorityChildImpl = class implements PriorityChildBalancer {
    private connectivityState: ConnectivityState = ConnectivityState.IDLE;
    private picker: Picker;
    private childBalancer: ChildLoadBalancerHandler;
    private failoverTimer: NodeJS.Timer | null = null;
    private deactivationTimer: NodeJS.Timer | null = null;
    private seenReadyOrIdleSinceTransientFailure = false;
    constructor(private parent: PriorityLoadBalancer, private name: string, ignoreReresolutionRequests: boolean) {
      this.childBalancer = new ChildLoadBalancerHandler(experimental.createChildChannelControlHelper(this.parent.channelControlHelper, {
        updateState: (connectivityState: ConnectivityState, picker: Picker) => {
          this.updateState(connectivityState, picker);
        },
        requestReresolution: () => {
          if (!ignoreReresolutionRequests) {
            this.parent.channelControlHelper.requestReresolution();
          }
        }
      }));
      this.picker = new QueuePicker(this.childBalancer);
      this.startFailoverTimer();
    }

    private updateState(connectivityState: ConnectivityState, picker: Picker) {
      trace('Child ' + this.name + ' ' + ConnectivityState[this.connectivityState] + ' -> ' + ConnectivityState[connectivityState]);
      this.connectivityState = connectivityState;
      this.picker = picker;
      if (connectivityState === ConnectivityState.CONNECTING) {
        if (this.seenReadyOrIdleSinceTransientFailure && this.failoverTimer === null) {
          this.startFailoverTimer();
        }
      } else if (connectivityState === ConnectivityState.READY || connectivityState === ConnectivityState.IDLE) {
        this.seenReadyOrIdleSinceTransientFailure = true;
        this.cancelFailoverTimer();
      } else if (connectivityState === ConnectivityState.TRANSIENT_FAILURE) {
        this.seenReadyOrIdleSinceTransientFailure = false;
        this.cancelFailoverTimer();
      }
      this.parent.onChildStateChange(this);
    }

    private startFailoverTimer() {
      if (this.failoverTimer === null) {
        trace('Starting failover timer for child ' + this.name);
        this.failoverTimer = setTimeout(() => {
          trace('Failover timer triggered for child ' + this.name);
          this.failoverTimer = null;
          this.updateState(
            ConnectivityState.TRANSIENT_FAILURE,
            new UnavailablePicker()
          );
        }, DEFAULT_FAILOVER_TIME_MS);
      }
    }

    updateAddressList(
      addressList: SubchannelAddress[],
      lbConfig: LoadBalancingConfig,
      attributes: { [key: string]: unknown }
    ): void {
      this.childBalancer.updateAddressList(addressList, lbConfig, attributes);
    }

    exitIdle() {
      this.childBalancer.exitIdle();
    }

    resetBackoff() {
      this.childBalancer.resetBackoff();
    }

    deactivate() {
      if (this.deactivationTimer === null) {
        this.deactivationTimer = setTimeout(() => {
          this.parent.deleteChild(this);
          this.childBalancer.destroy();
        }, DEFAULT_RETENTION_INTERVAL_MS);
      }
    }

    maybeReactivate() {
      if (this.deactivationTimer !== null) {
        clearTimeout(this.deactivationTimer);
        this.deactivationTimer = null;
      }
    }

    private cancelFailoverTimer() {
      if (this.failoverTimer !== null) {
        clearTimeout(this.failoverTimer);
        this.failoverTimer = null;
      }
    }

    isFailoverTimerPending() {
      return this.failoverTimer !== null;
    }

    getConnectivityState() {
      return this.connectivityState;
    }

    getPicker() {
      return this.picker;
    }

    getName() {
      return this.name;
    }

    destroy() {
      this.childBalancer.destroy();
    }
  };
  // End of inner class PriorityChildImpl

  private children: Map<string, PriorityChildBalancer> = new Map<
    string,
    PriorityChildBalancer
  >();
  /**
   * The priority order of child names from the latest config update.
   */
  private priorities: string[] = [];
  /**
   * The attributes object from the latest update, saved to be passed along to
   * each new child as they are created
   */
  private latestAttributes: { [key: string]: unknown } = {};
  /**
   * The latest load balancing policies and address lists for each child from
   * the latest update
   */
  private latestUpdates: Map<string, UpdateArgs> = new Map<
    string,
    UpdateArgs
  >();
  /**
   * Current chosen priority that requests are sent to
   */
  private currentPriority: number | null = null;

  private updatesPaused = false;

  constructor(private channelControlHelper: ChannelControlHelper) {}

  private updateState(state: ConnectivityState, picker: Picker) {
    trace(
        'Transitioning to ' +
        ConnectivityState[state]
    );
    /* If switching to IDLE, use a QueuePicker attached to this load balancer
     * so that when the picker calls exitIdle, that in turn calls exitIdle on
     * the PriorityChildImpl, which will start the failover timer. */
    if (state === ConnectivityState.IDLE) {
      picker = new QueuePicker(this);
    }
    this.channelControlHelper.updateState(state, picker);
  }

  private onChildStateChange(child: PriorityChildBalancer) {
    const childState = child.getConnectivityState();
    trace('Child ' + child.getName() + ' transitioning to ' + ConnectivityState[childState]);
    if (this.updatesPaused) {
      return;
    }
    this.choosePriority();
  }

  private deleteChild(child: PriorityChildBalancer) {
    this.children.delete(child.getName());
  }

  /**
   * Select the child at the specified priority, and report that child's state
   * as this balancer's state until that child disconnects or a higher-priority
   * child connects.
   * @param priority
   */
  private selectPriority(priority: number, deactivateLowerPriorities: boolean) {
    this.currentPriority = priority;
    const chosenChild = this.children.get(this.priorities[priority])!;
    this.updateState(
      chosenChild.getConnectivityState(),
      chosenChild.getPicker()
    );
    if (deactivateLowerPriorities) {
      for (let i = priority + 1; i < this.priorities.length; i++) {
        this.children.get(this.priorities[i])?.deactivate();
      }
    }
  }

  private choosePriority() {
    if (this.priorities.length === 0) {
      this.updateState(ConnectivityState.TRANSIENT_FAILURE, new UnavailablePicker({code: Status.UNAVAILABLE, details: 'priority policy has empty priority list', metadata: new Metadata()}));
      return;
    }

    for (const [priority, childName] of this.priorities.entries()) {
      trace('Trying priority ' + priority + ' child ' + childName);
      let child = this.children.get(childName);
      /* If the child doesn't already exist, create it and update it.  */
      if (child === undefined) {
        const childUpdate = this.latestUpdates.get(childName);
        if (childUpdate === undefined) {
          continue;
        }
        child = new this.PriorityChildImpl(this, childName, childUpdate.ignoreReresolutionRequests);
        this.children.set(childName, child);
        child.updateAddressList(
          childUpdate.subchannelAddress,
          childUpdate.lbConfig,
          this.latestAttributes
        );
      } else {
        /* We're going to try to use this child, so reactivate it if it has been
         * deactivated */
        child.maybeReactivate();
      }
      if (
        child.getConnectivityState() === ConnectivityState.READY ||
        child.getConnectivityState() === ConnectivityState.IDLE
      ) {
        this.selectPriority(priority, true);
        return;
      }
      if (child.isFailoverTimerPending()) {
        this.selectPriority(priority, false);
        /* This child is still trying to connect. Wait until its failover timer
          * has ended to continue to the next one */
        return;
      }
    }

    /* If we didn't find any priority to try, pick the first one in the state
     * CONNECTING */
    for (const [priority, childName] of this.priorities.entries()) {
      let child = this.children.get(childName)!;
      if (child.getConnectivityState() === ConnectivityState.CONNECTING) {
        this.selectPriority(priority, false);
        return;
      }
    }

    // Did not find any child in CONNECTING, delegate to last child
    this.selectPriority(this.priorities.length - 1, false);
  }

  updateAddressList(
    addressList: SubchannelAddress[],
    lbConfig: LoadBalancingConfig,
    attributes: { [key: string]: unknown }
  ): void {
    if (!(lbConfig instanceof PriorityLoadBalancingConfig)) {
      // Reject a config of the wrong type
      trace('Discarding address list update with unrecognized config ' + JSON.stringify(lbConfig.toJsonObject(), undefined, 2));
      return;
    }
    /* For each address, the first element of its localityPath array determines
     * which child it belongs to. So we bucket those addresses by that first
     * element, and pass along the rest of the localityPath for that child
     * to use. */
    const childAddressMap: Map<string, LocalitySubchannelAddress[]> = new Map<
      string,
      LocalitySubchannelAddress[]
    >();
    for (const address of addressList) {
      if (!isLocalitySubchannelAddress(address)) {
        // Reject address that cannot be prioritized
        return;
      }
      if (address.localityPath.length < 1) {
        // Reject address that cannot be prioritized
        return;
      }
      const childName = address.localityPath[0];
      const childAddress: LocalitySubchannelAddress = {
        ...address,
        localityPath: address.localityPath.slice(1),
      };
      let childAddressList = childAddressMap.get(childName);
      if (childAddressList === undefined) {
        childAddressList = [];
        childAddressMap.set(childName, childAddressList);
      }
      childAddressList.push(childAddress);
    }
    this.latestAttributes = attributes;
    this.latestUpdates.clear();
    this.priorities = lbConfig.getPriorities();
    this.updatesPaused = true;
    /* Pair up the new child configs with the corresponding address lists, and
     * update all existing children with their new configs */
    for (const [childName, childConfig] of lbConfig.getChildren()) {
      const chosenChildConfig = getFirstUsableConfig(childConfig.config);
      if (chosenChildConfig !== null) {
        const childAddresses = childAddressMap.get(childName) ?? [];
        trace('Assigning child ' + childName + ' address list ' + childAddresses.map(address => '(' + subchannelAddressToString(address) + ' path=' + address.localityPath + ')'))
        this.latestUpdates.set(childName, {
          subchannelAddress: childAddresses,
          lbConfig: chosenChildConfig,
          ignoreReresolutionRequests: childConfig.ignore_reresolution_requests
        });
        const existingChild = this.children.get(childName);
        if (existingChild !== undefined) {
          existingChild.updateAddressList(
            childAddresses,
            chosenChildConfig,
            attributes
          );
        }
      }
    }
    // Deactivate all children that are no longer in the priority list
    for (const [childName, child] of this.children) {
      if (this.priorities.indexOf(childName) < 0) {
        trace('Deactivating child ' + childName);
        child.deactivate();
      }
    }
    this.updatesPaused = false;
    this.choosePriority();
  }
  exitIdle(): void {
    if (this.currentPriority !== null) {
      this.children.get(this.priorities[this.currentPriority])?.exitIdle();
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
  registerLoadBalancerType(TYPE_NAME, PriorityLoadBalancer, PriorityLoadBalancingConfig);
}
