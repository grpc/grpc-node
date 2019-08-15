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
import { Subchannel, ConnectivityStateListener } from './subchannel';

const TYPE_NAME = 'pick_first';

/**
 * Delay after starting a connection on a subchannel before starting a
 * connection on the next subchannel in the list, for Happy Eyeballs algorithm.
 */
const CONNECTION_DELAY_INTERVAL_MS = 250;

/**
 * Picker for a `PickFirstLoadBalancer` in the READY state. Always returns the
 * picked subchannel.
 */
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
  /**
   * The list of backend addresses most recently passed to `updateAddressList`.
   */
  private latestAddressList: string[] = [];
  /**
   * The list of subchannels this load balancer is currently attempting to
   * connect to.
   */
  private subchannels: Subchannel[] = [];
  /**
   * The current connectivity state of the load balancer.
   */
  private currentState: ConnectivityState = ConnectivityState.IDLE;
  /**
   * The index within the `subchannels` array of the subchannel with the most
   * recently started connection attempt.
   */
  private currentSubchannelIndex: number = 0;
  /**
   * The number of subchannels in the `subchannels` list currently in the
   * CONNECTING state. Used to determine the overall load balancer state.
   */
  private subchannelConnectingCount: number = 0;
  /**
   * The currently picked subchannel used for making calls. Populated if
   * and only if the load balancer's current state is READY. In that case,
   * the subchannel's current state is also READY.
   */
  private currentPick: Subchannel | null = null;
  /**
   * Listener callback attached to each subchannel in the `subchannels` list
   * while establishing a connection.
   */
  private subchannelStateListener: ConnectivityStateListener;
  /**
   * Listener callback attached to the current picked subchannel.
   */
  private pickedSubchannelStateListener: ConnectivityStateListener;
  /**
   * Timer reference for the timer tracking when to start 
   */
  private connectionDelayTimeout: NodeJS.Timeout;

  private triedAllSubchannels: boolean = false;

  /**
   * Load balancer that attempts to connect to each backend in the address list
   * in order, and picks the first one that connects, using it for every
   * request.
   * @param channelControlHelper `ChannelControlHelper` instance provided by
   *     this load balancer's owner.
   */
  constructor(private channelControlHelper: ChannelControlHelper) {
    this.updateState(ConnectivityState.IDLE, new QueuePicker(this));
    this.subchannelStateListener = (subchannel: Subchannel, previousState: ConnectivityState, newState: ConnectivityState) => {
      if (previousState === ConnectivityState.CONNECTING) {
        this.subchannelConnectingCount -= 1;
      }
      if (newState === ConnectivityState.CONNECTING) {
        this.subchannelConnectingCount += 1;
      }
      if (newState === ConnectivityState.READY) {
        this.pickSubchannel(subchannel);
        return;
      } else {
        if (this.currentPick === null) {
          if (newState === ConnectivityState.TRANSIENT_FAILURE || newState === ConnectivityState.IDLE) {
            process.nextTick(() => {
              subchannel.startConnecting();
            });
          }
          if (this.triedAllSubchannels) {
            const newLBState = this.subchannelConnectingCount > 0 ? ConnectivityState.CONNECTING : ConnectivityState.TRANSIENT_FAILURE;
            if (newLBState !== this.currentState) {
              if (newLBState === ConnectivityState.TRANSIENT_FAILURE) {
                this.updateState(newLBState, new UnavailablePicker());
              } else {
                this.updateState(newLBState, new QueuePicker(this));
              }
            }
          } else {
            this.updateState(ConnectivityState.CONNECTING, new QueuePicker(this));
          }
        }
      }
    };
    this.pickedSubchannelStateListener = (subchannel: Subchannel, previousState: ConnectivityState, newState: ConnectivityState) => {
      if (newState !== ConnectivityState.READY) {
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

  /**
   * Have a single subchannel in the `subchannels` list start connecting.
   * @param subchannelIndex The index into the `subchannels` list.
   */
  private startConnecting(subchannelIndex: number) {
    clearTimeout(this.connectionDelayTimeout);
    this.currentSubchannelIndex = subchannelIndex;
    if (this.subchannels[subchannelIndex].getConnectivityState() === ConnectivityState.IDLE) {
      process.nextTick(() => {
        this.subchannels[subchannelIndex].startConnecting();
      });
    }
    this.connectionDelayTimeout = setTimeout(() => {
      for (const [index, subchannel] of this.subchannels.entries()) {
        if (index > subchannelIndex) {
          const subchannelState = subchannel.getConnectivityState();
          if (subchannelState === ConnectivityState.IDLE || subchannelState === ConnectivityState.CONNECTING) {
            this.startConnecting(index);
            return;
          }
        }
      }
      this.triedAllSubchannels = true;
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
      subchannel.removeConnectivityStateListener(this.subchannelStateListener);
      subchannel.unref();
    }
    this.currentSubchannelIndex = 0;
    this.subchannelConnectingCount = 0;
    this.subchannels = [];
    this.triedAllSubchannels = false;
  }

  /**
   * Start connecting to the address list most recently passed to
   * `updateAddressList`.
   */
  private connectToAddressList(): void {
    this.resetSubchannelList();
    this.subchannels = this.latestAddressList.map((address) => this.channelControlHelper.createSubchannel(address, {}));
    for (const subchannel of this.subchannels) {
      subchannel.ref();
    }
    for (const subchannel of this.subchannels) {
      subchannel.addConnectivityStateListener(this.subchannelStateListener);
      if (subchannel.getConnectivityState() === ConnectivityState.READY) {
        this.pickSubchannel(subchannel);
        this.updateState(ConnectivityState.READY, new PickFirstPicker(subchannel));
        this.resetSubchannelList();
        return;
      }
    }
    for (const [index, subchannel] of this.subchannels.entries()) {
      const subchannelState = subchannel.getConnectivityState();
      if (subchannelState === ConnectivityState.IDLE || subchannelState === ConnectivityState.CONNECTING) {
        this.startConnecting(index);
        this.updateState(ConnectivityState.CONNECTING, new QueuePicker(this));
        return;
      }
    }
    // If the code reaches this point, every subchannel must be in TRANSIENT_FAILURE
    this.updateState(ConnectivityState.TRANSIENT_FAILURE, new UnavailablePicker());
  }

  updateAddressList(addressList: string[], lbConfig: LoadBalancingConfig | null): void {
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
    /* The pick first load balancer does not have a connection backoff, so this
     * does nothing */
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

  replaceChannelControlHelper(channelControlHelper: ChannelControlHelper) {
    this.channelControlHelper = channelControlHelper;
  }
}

export function setup(): void {
  registerLoadBalancerType(TYPE_NAME, PickFirstLoadBalancer);
}