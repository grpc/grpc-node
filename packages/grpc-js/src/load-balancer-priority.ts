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

import {
  LoadBalancer,
  ChannelControlHelper,
  getFirstUsableConfig,
  registerLoadBalancerType,
} from './load-balancer';
import { SubchannelAddress } from './subchannel';
import {
  LoadBalancingConfig,
  isPriorityLoadBalancingConfig,
} from './load-balancing-config';
import { ConnectivityState } from './channel';
import { Picker, QueuePicker, UnavailablePicker } from './picker';
import { ChildLoadBalancerHandler } from './load-balancer-child-handler';
import { ChannelOptions } from './channel-options';
import { Status } from './constants';
import { Metadata } from './metadata';

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
  cancelFailoverTimer(): void;
  isFailoverTimerPending(): boolean;
  getConnectivityState(): ConnectivityState;
  getPicker(): Picker;
  getName(): string;
  destroy(): void;
}

interface UpdateArgs {
  subchannelAddress: SubchannelAddress[];
  lbConfig: LoadBalancingConfig;
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
    constructor(private parent: PriorityLoadBalancer, private name: string) {
      this.childBalancer = new ChildLoadBalancerHandler({
        createSubchannel: (
          subchannelAddress: SubchannelAddress,
          subchannelArgs: ChannelOptions
        ) => {
          return this.parent.channelControlHelper.createSubchannel(
            subchannelAddress,
            subchannelArgs
          );
        },
        updateState: (connectivityState: ConnectivityState, picker: Picker) => {
          this.updateState(connectivityState, picker);
        },
        requestReresolution: () => {
          this.parent.channelControlHelper.requestReresolution();
        },
      });
      this.picker = new QueuePicker(this.childBalancer);
    }

    private updateState(connectivityState: ConnectivityState, picker: Picker) {
      this.connectivityState = connectivityState;
      this.picker = picker;
      this.parent.onChildStateChange(this);
    }

    private startFailoverTimer() {
      if (this.failoverTimer === null) {
        this.failoverTimer = setTimeout(() => {
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
      this.startFailoverTimer();
    }

    exitIdle() {
      if (this.connectivityState === ConnectivityState.IDLE) {
        this.startFailoverTimer();
      }
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

    cancelFailoverTimer() {
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
  /**
   * After an update, this preserves the currently selected child from before
   * the update. We continue to use that child until it disconnects, or
   * another higher-priority child connects, or it is deleted because it is not
   * in the new priority list at all and its retention interval has expired, or
   * we try and fail to connect to every child in the new priority list.
   */
  private currentChildFromBeforeUpdate: PriorityChildBalancer | null = null;

  constructor(private channelControlHelper: ChannelControlHelper) {}

  private updateState(state: ConnectivityState, picker: Picker) {
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
    if (child === this.currentChildFromBeforeUpdate) {
      if (
        childState === ConnectivityState.READY ||
        childState === ConnectivityState.IDLE
      ) {
        this.updateState(childState, child.getPicker());
      } else {
        this.currentChildFromBeforeUpdate = null;
        this.tryNextPriority(true);
      }
      return;
    }
    const childPriority = this.priorities.indexOf(child.getName());
    if (childPriority < 0) {
      // child is not in the priority list, ignore updates
      return;
    }
    if (this.currentPriority !== null && childPriority > this.currentPriority) {
      // child is lower priority than the currently selected child, ignore updates
      return;
    }
    if (childState === ConnectivityState.TRANSIENT_FAILURE) {
      /* Report connecting if and only if the currently selected child is the
       * one entering TRANSIENT_FAILURE */
      this.tryNextPriority(childPriority === this.currentPriority);
      return;
    }
    if (this.currentPriority === null || childPriority < this.currentPriority) {
      /* In this case, either there is no currently selected child or this
       * child is higher priority than the currently selected child, so we want
       * to switch to it if it is READY or IDLE. */
      if (
        childState === ConnectivityState.READY ||
        childState === ConnectivityState.IDLE
      ) {
        this.selectPriority(childPriority);
      }
      return;
    }
    /* The currently selected child has updated state to something other than
     * TRANSIENT_FAILURE, so we pass that update along */
    this.updateState(childState, child.getPicker());
  }

  private deleteChild(child: PriorityChildBalancer) {
    if (child === this.currentChildFromBeforeUpdate) {
      this.currentChildFromBeforeUpdate = null;
      /* If we get to this point, the currentChildFromBeforeUpdate was still in
       * use, so we are still trying to connect to the specified priorities */
      this.tryNextPriority(true);
    }
  }

  /**
   * Select the child at the specified priority, and report that child's state
   * as this balancer's state until that child disconnects or a higher-priority
   * child connects.
   * @param priority
   */
  private selectPriority(priority: number) {
    this.currentPriority = priority;
    const chosenChild = this.children.get(this.priorities[priority])!;
    this.updateState(
      chosenChild.getConnectivityState(),
      chosenChild.getPicker()
    );
    this.currentChildFromBeforeUpdate = null;
    // Deactivate each child of lower priority than the chosen child
    for (let i = priority + 1; i < this.priorities.length; i++) {
      this.children.get(this.priorities[i])?.deactivate();
    }
  }

  /**
   * Check each child in priority order until we find one to use
   * @param reportConnecting Whether we should report a CONNECTING state if we
   *     stop before picking a specific child. This should be true when we have
   *     not already selected a child.
   */
  private tryNextPriority(reportConnecting: boolean) {
    for (const [index, childName] of this.priorities.entries()) {
      let child = this.children.get(childName);
      /* If the child doesn't already exist, create it and update it.  */
      if (child === undefined) {
        if (reportConnecting) {
          this.updateState(ConnectivityState.CONNECTING, new QueuePicker(this));
        }
        child = new this.PriorityChildImpl(this, childName);
        this.children.set(childName, child);
        const childUpdate = this.latestUpdates.get(childName);
        if (childUpdate !== undefined) {
          child.updateAddressList(
            childUpdate.subchannelAddress,
            childUpdate.lbConfig,
            this.latestAttributes
          );
        }
      }
      /* We're going to try to use this child, so reactivate it if it has been
       * deactivated */
      child.maybeReactivate();
      if (
        child.getConnectivityState() === ConnectivityState.READY ||
        child.getConnectivityState() === ConnectivityState.IDLE
      ) {
        this.selectPriority(index);
        return;
      }
      if (child.isFailoverTimerPending()) {
        /* This child is still trying to connect. Wait until its failover timer
         * has ended to continue to the next one */
        if (reportConnecting) {
          this.updateState(ConnectivityState.CONNECTING, new QueuePicker(this));
        }
        return;
      }
    }
    this.currentPriority = null;
    this.currentChildFromBeforeUpdate = null;
    this.updateState(
      ConnectivityState.TRANSIENT_FAILURE,
      new UnavailablePicker({
        code: Status.UNAVAILABLE,
        details: 'No ready priority',
        metadata: new Metadata(),
      })
    );
  }

  updateAddressList(
    addressList: SubchannelAddress[],
    lbConfig: LoadBalancingConfig,
    attributes: { [key: string]: unknown }
  ): void {
    if (!isPriorityLoadBalancingConfig(lbConfig)) {
      // Reject a config of the wrong type
      return;
    }
    const priorityConfig = lbConfig.priority;
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
    if (this.currentPriority !== null) {
      this.currentChildFromBeforeUpdate = this.children.get(
        this.priorities[this.currentPriority]
      )!;
      this.currentPriority = null;
    }
    this.latestAttributes = attributes;
    this.latestUpdates.clear();
    this.priorities = priorityConfig.priorities;
    /* Pair up the new child configs with the corresponding address lists, and
     * update all existing children with their new configs */
    for (const [childName, childConfig] of priorityConfig.children) {
      const chosenChildConfig = getFirstUsableConfig(childConfig.config);
      if (chosenChildConfig !== null) {
        const childAddresses = childAddressMap.get(childName) ?? [];
        this.latestUpdates.set(childName, {
          subchannelAddress: childAddresses,
          lbConfig: chosenChildConfig,
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
        child.deactivate();
      }
    }
    // Only report connecting if there are no existing children
    this.tryNextPriority(this.children.size === 0);
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
    this.currentChildFromBeforeUpdate?.destroy();
    this.currentChildFromBeforeUpdate = null;
  }
  getTypeName(): string {
    return TYPE_NAME;
  }
}

export function setup() {
  registerLoadBalancerType(TYPE_NAME, PriorityLoadBalancer);
}
