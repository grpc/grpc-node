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

import { LoadBalancer, ChannelControlHelper, getFirstUsableConfig, registerLoadBalancerType } from "./load-balancer";
import { SubchannelAddress } from "./subchannel";
import { LoadBalancingConfig, WeightedTarget, isWeightedTargetLoadBalancingConfig } from "./load-balancing-config";
import { Picker, PickResult, PickArgs, QueuePicker, UnavailablePicker } from "./picker";
import { ConnectivityState } from "./channel";
import { ChildLoadBalancerHandler } from "./load-balancer-child-handler";
import { Status } from "./constants";
import { Metadata } from "./metadata";
import { isLocalitySubchannelAddress, LocalitySubchannelAddress } from "./load-balancer-priority";

const TYPE_NAME = 'weighted_target';

const DEFAULT_RETENTION_INTERVAL_MS = 15 * 60 * 1000;

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
    
    /* Binary search for the element of the list such that
     * pickerList[index - 1].rangeEnd <= selection < pickerList[index].rangeEnd
     */
    let mid = 0;
    let startIndex = 0;
    let endIndex = this.pickerList.length - 1;
    let index = 0;
    while (endIndex > startIndex) {
      mid = ((startIndex + endIndex) / 2) | 0;
      if (this.pickerList[mid].rangeEnd > selection) {
        endIndex = mid;
      } else if (this.pickerList[mid].rangeEnd < selection) {
        startIndex = mid + 1;
      } else {
        // + 1 here because the range is exclusive at the top end
        index = mid + 1;
        break;
      }
    }
    if (index === 0) {
      index = startIndex;
    }

    return this.pickerList[index].picker.pick(pickArgs);
  }
}

interface WeightedChild {
  updateAddressList(addressList: SubchannelAddress[], lbConfig: WeightedTarget, attributes: { [key: string]: unknown; }): void;
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
      this.childBalancer = new ChildLoadBalancerHandler({
        createSubchannel: (subchannelAddress, subchannelOptions) => {
          return this.parent.channelControlHelper.createSubchannel(subchannelAddress, subchannelOptions);
        },
        updateState: (connectivityState, picker) => {
          this.updateState(connectivityState, picker);
        },
        requestReresolution: () => {
          this.parent.channelControlHelper.requestReresolution();
        }
      });

      this.picker = new QueuePicker(this.childBalancer);
    }

    private updateState(connectivityState: ConnectivityState, picker: Picker) {
      this.connectivityState = connectivityState;
      this.picker = picker;
      this.parent.updateState();
    }

    updateAddressList(addressList: SubchannelAddress[], lbConfig: WeightedTarget, attributes: { [key: string]: unknown; }): void {
      this.weight = lbConfig.weight;
      const childConfig = getFirstUsableConfig(lbConfig.child_policy);
      if (childConfig !== null) {
        this.childBalancer.updateAddressList(addressList, childConfig, attributes);
      }
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

  constructor(private channelControlHelper: ChannelControlHelper) {}

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
      case ConnectivityState.READY:
        picker = new QueuePicker(this);
        break;
      default:
        picker = new UnavailablePicker({
          code: Status.UNAVAILABLE,
          details: 'weighted_target: all children report state TRANSIENT_FAILURE',
          metadata: new Metadata()
        });
    }
    this.channelControlHelper.updateState(connectivityState, picker);
  }

  updateAddressList(addressList: SubchannelAddress[], lbConfig: LoadBalancingConfig, attributes: { [key: string]: unknown; }): void {
    if (!isWeightedTargetLoadBalancingConfig(lbConfig)) {
      // Reject a config of the wrong type
      return;
    }

    /* For each address, the first element of its localityPath array determines
     * which child it belongs to. So we bucket those addresses by that first
     * element, and pass along the rest of the localityPath for that child
     * to use. */
    const childAddressMap = new Map<string, SubchannelAddress[]>();
    for (const address of addressList) {
      if (!isLocalitySubchannelAddress(address)) {
        // Reject address that cannot be associated with targets
        return;
      }
      if (address.localityPath.length < 1) {
        // Reject address that cannot be associated with targets
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

    this.targetList = Array.from(lbConfig.weighted_target.targets.keys());
    for (const [targetName, targetConfig] of lbConfig.weighted_target.targets) {
      let target = this.targets.get(targetName);
      if (target === undefined) {
        target = new this.WeightedChildImpl(this, targetName);
        this.targets.set(targetName, target);
      } else {
        target.maybeReactivate();
      }
      target.updateAddressList(childAddressMap.get(targetName) ?? [], targetConfig, attributes);
    }

    // Deactivate targets that are not in the new config
    for (const [targetName, target] of this.targets) {
      if (this.targetList.indexOf(targetName) < 0) {
        target.deactivate();
      }
    }

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
  registerLoadBalancerType(TYPE_NAME, WeightedTargetLoadBalancer);
}