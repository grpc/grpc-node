/*
 * Copyright 2019 gRPC authors.
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

import { LoadBalancer, ChannelControlHelper, registerLoadBalancerType } from './load-balancer';
import { ConnectivityState } from './channel';
import { QueuePicker, Picker, PickArgs, CompletePickResult, PickResultType, UnavailablePicker } from './picker';
import { LoadBalancingConfig } from './load-balancing-config';
import { Subchannel, SubchannelConnectivityState, ConnectivityStateListener } from './subchannel';

const TYPE_NAME = 'pick_first';

const CONNECTION_DELAY_INTERVAL_MS = 250;

class PickFirstPicker implements Picker {
  constructor(private subchannel: Subchannel) {}

  pick(pickArgs: PickArgs) : CompletePickResult {
    return {
      pickResultType: PickResultType.COMPLETE,
      subchannel: this.subchannel,
      status: null
    }
  }
}

export class PickFirstLoadBalancer implements LoadBalancer {
  private latestAddressList: string[] = [];
  private subchannels: Subchannel[] = [];
  private currentState: ConnectivityState = ConnectivityState.IDLE;
  private currentSubchannelIndex: number = 0;
  private subchannelConnectingCount: number = 0;
  private currentPick: Subchannel | null = null;
  private subchannelStateListener: ConnectivityStateListener;
  private pickedSubchannelStateListener: ConnectivityStateListener;
  private connectionDelayTimeout: NodeJS.Timeout;

  constructor(private channelControlHelper: ChannelControlHelper) {
    this.updateState(ConnectivityState.IDLE, new QueuePicker(this));
    this.subchannelStateListener = (subchannel: Subchannel, previousState: SubchannelConnectivityState, newState: SubchannelConnectivityState) => {
      if (previousState === SubchannelConnectivityState.CONNECTING) {
        this.subchannelConnectingCount -= 1;
      }
      if (newState === SubchannelConnectivityState.CONNECTING) {
        this.subchannelConnectingCount += 1;
      }
      if (newState === SubchannelConnectivityState.READY) {
        this.pickSubchannel(subchannel);
        return;
      } else {
        if (this.currentPick === null) {
          if (newState === SubchannelConnectivityState.TRANSIENT_FAILURE || newState === SubchannelConnectivityState.IDLE) {
            subchannel.startConnecting();
          }
          const newLBState = this.subchannelConnectingCount > 0 ? ConnectivityState.CONNECTING : ConnectivityState.TRANSIENT_FAILURE;
          if (newLBState !== this.currentState) {
            if (newLBState === ConnectivityState.TRANSIENT_FAILURE) {
              this.updateState(newLBState, new UnavailablePicker());
            } else {
              this.updateState(newLBState, new QueuePicker(this));
            }
          }
        }
      }
    };
    this.pickedSubchannelStateListener = (subchannel: Subchannel, previousState: SubchannelConnectivityState, newState: SubchannelConnectivityState) => {
      if (newState !== SubchannelConnectivityState.READY) {
        subchannel.unref();
        subchannel.removeConnectivityStateListener(this.pickedSubchannelStateListener);
        if (this.subchannels.length > 0) {
          const newLBState = this.subchannelConnectingCount > 0 ? ConnectivityState.CONNECTING : ConnectivityState.TRANSIENT_FAILURE;
          if (newLBState === ConnectivityState.TRANSIENT_FAILURE) {
            this.updateState(newLBState, new UnavailablePicker());
          } else {
            this.updateState(newLBState, new QueuePicker(this));
          }
        } else {
          this.connectToAddressList();
          this.channelControlHelper.requestReresolution();
        }
      }
    };
    this.connectionDelayTimeout = setTimeout(() => {}, 0);
    clearTimeout(this.connectionDelayTimeout);
  }

  private startConnecting(subchannelIndex: number) {
    if (this.subchannels[subchannelIndex].getConnectivityState() === SubchannelConnectivityState.IDLE) {
      this.subchannels[subchannelIndex].startConnecting();
    }
    this.connectionDelayTimeout = setTimeout(() => {
      for (const [index, subchannel] of this.subchannels.entries()) {
        if (index > subchannelIndex) {
          const subchannelState = subchannel.getConnectivityState();
          if (subchannelState === SubchannelConnectivityState.IDLE || subchannelState === SubchannelConnectivityState.CONNECTING) {
            this.startConnecting(index);
            return;
          }
        }
      }
    }, CONNECTION_DELAY_INTERVAL_MS)
  }

  private pickSubchannel(subchannel: Subchannel) {
    if (this.currentPick !== null) {
      this.currentPick.unref();
      this.currentPick.removeConnectivityStateListener(this.pickedSubchannelStateListener);
    }
    this.currentPick = subchannel;
    this.updateState(ConnectivityState.READY, new PickFirstPicker(subchannel));
    subchannel.addConnectivityStateListener(this.pickedSubchannelStateListener);
    subchannel.ref();
    this.resetSubchannelList();
    clearTimeout(this.connectionDelayTimeout);
  }

  private updateState(newState: ConnectivityState, picker: Picker) {
    this.currentState = newState;
    this.channelControlHelper.updateState(newState, picker);
  }

  private resetSubchannelList() {
    for (const subchannel of this.subchannels) {
      subchannel.unref();
      subchannel.removeConnectivityStateListener(this.subchannelStateListener);
    }
    this.currentSubchannelIndex = 0;
    this.subchannelConnectingCount = 0;
    this.subchannels = [];
  }

  private connectToAddressList(): void {
    this.resetSubchannelList();
    this.subchannels = this.latestAddressList.map((address) => this.channelControlHelper.createSubchannel(address, {}));
    for (const subchannel of this.subchannels) {
      subchannel.addConnectivityStateListener(this.subchannelStateListener);
      if (subchannel.getConnectivityState() === SubchannelConnectivityState.READY) {
        this.pickSubchannel(subchannel);
        this.updateState(ConnectivityState.READY, new PickFirstPicker(subchannel));
        this.resetSubchannelList();
        return;
      }
    }
    for (const [index, subchannel] of this.subchannels.entries()) {
      const subchannelState = subchannel.getConnectivityState();
      if (subchannelState === SubchannelConnectivityState.IDLE || subchannelState === SubchannelConnectivityState.CONNECTING) {
        this.startConnecting(index);
      }
    }
  }

  updateAddressList(addressList: string[], lbConfig?: LoadBalancingConfig): void {
    // lbConfig has no useful information for pick first load balancing
    this.latestAddressList = addressList;
    this.connectToAddressList();
  }

  exitIdle() {
    if (this.currentState === ConnectivityState.IDLE) {
      if (this.latestAddressList.length > 0) {
        this.connectToAddressList();
      }
    }
  }

  resetBackoff() {
    // I'm not actually sure what this is supposed to do
  }

  destroy() {
    this.resetSubchannelList();
    if (this.currentPick !== null) {
      this.currentPick.unref();
      this.currentPick.removeConnectivityStateListener(this.pickedSubchannelStateListener);
    }
  }

  getTypeName(): string {
    return TYPE_NAME;
  }
}

export function setup(): void {
  registerLoadBalancerType(TYPE_NAME, PickFirstLoadBalancer);
}