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

import {
  LoadBalancer,
  ChannelControlHelper,
  registerLoadBalancerType,
  LoadBalancingConfig
} from './load-balancer';
import { ConnectivityState } from './channel';
import {
  QueuePicker,
  Picker,
  PickArgs,
  CompletePickResult,
  PickResultType,
  UnavailablePicker,
} from './picker';
import {
  Subchannel,
  ConnectivityStateListener,
  SubchannelAddress,
  subchannelAddressToString,
} from './subchannel';
import * as logging from './logging';
import { LogVerbosity } from './constants';

const TRACER_NAME = 'round_robin';

function trace(text: string): void {
  logging.trace(LogVerbosity.DEBUG, TRACER_NAME, text);
}

function getTargetConnectionCount(): number {
  const connectionCountEnv = process.env.GRPC_EXPERIMENTAL_ROUNDROBIN_RANDOM_MAX_CONNECTIONS;
  if (connectionCountEnv === undefined) {
    return Infinity;
  }
  trace('Read environment variable GRPC_EXPERIMENTAL_ROUNDROBIN_RANDOM_MAX_CONNECTIONS=' + connectionCountEnv);
  const parsedConnectionCount = Number.parseInt(connectionCountEnv);
  if (isNaN(parsedConnectionCount) || parsedConnectionCount <= 0) {
    return Infinity;
  }
  return parsedConnectionCount;
}

const TARGET_CONNECTION_COUNT = getTargetConnectionCount();

function subchannelIsReadyOrTryingToConnect(subchannel: Subchannel): boolean {
  const subchannelState = subchannel.getConnectivityState();
  return (subchannelState === ConnectivityState.READY) ||
    (subchannelState === ConnectivityState.CONNECTING) ||
    (subchannelState === ConnectivityState.TRANSIENT_FAILURE && subchannel.getContinueConnectingFlag());
}

/**
 * Chooses a random subset of array of size equal to count. If
 * count >= array.length, return array. The order of the output is
 * independent of the order of the input.
 * @param array 
 * @param count 
 */
function chooseRandomSubset<T>(array: T[], count: number): T[] {
  // Copy the array, because the shuffle is destructive
  const arrayCopy = array.slice(0);
  if (arrayCopy.length <= count) {
    return arrayCopy;
  }
  // Optimize a couple of common cases
  if (count <= 0) {
    return [];
  }
  if (count === 1) {
    return [arrayCopy[Math.trunc(Math.random() * arrayCopy.length)]]
  }
  // Fisher-Yates shuffle, implemented based on Wikipeda pseudocode
  for (let i = arrayCopy.length - 1; i > 0; i--) {
    // j ← random integer such that 0 ≤ j ≤ i
    const j = Math.trunc(Math.random() * (i + 1));
    // Swap arrayCopy[i] and arrayCopy[j]
    const temp = arrayCopy[i];
    arrayCopy[i] = arrayCopy[j];
    arrayCopy[j] = temp;
  }
  // Return the first count elements of the shuffled array
  return arrayCopy.slice(0, count);
}

const TYPE_NAME = 'round_robin';

class RoundRobinLoadBalancingConfig implements LoadBalancingConfig {
  getLoadBalancerName(): string {
    return TYPE_NAME;
  }

  constructor() {}

  toJsonObject(): object {
    return {
      [TYPE_NAME]: {}
    };
  }

  static createFromJson(obj: any) {
    return new RoundRobinLoadBalancingConfig();
  }
}

class RoundRobinPicker implements Picker {
  constructor(
    private readonly subchannelList: Subchannel[],
    private nextIndex = 0
  ) {}

  pick(pickArgs: PickArgs): CompletePickResult {
    const pickedSubchannel = this.subchannelList[this.nextIndex];
    this.nextIndex = (this.nextIndex + 1) % this.subchannelList.length;
    return {
      pickResultType: PickResultType.COMPLETE,
      subchannel: pickedSubchannel,
      status: null,
      extraFilterFactory: null,
      onCallStarted: null,
    };
  }

  /**
   * Check what the next subchannel returned would be. Used by the load
   * balancer implementation to preserve this part of the picker state if
   * possible when a subchannel connects or disconnects.
   */
  peekNextSubchannel(): Subchannel {
    return this.subchannelList[this.nextIndex];
  }
}

export class RoundRobinLoadBalancer implements LoadBalancer {
  private subchannels: Subchannel[] = [];

  private currentState: ConnectivityState = ConnectivityState.IDLE;

  private subchannelStateListener: ConnectivityStateListener;

  private currentReadyPicker: RoundRobinPicker | null = null;

  constructor(private readonly channelControlHelper: ChannelControlHelper) {
    this.subchannelStateListener = (
      subchannel: Subchannel,
      previousState: ConnectivityState,
      newState: ConnectivityState
    ) => {
      this.calculateAndUpdateState();
      /* In this context, this should generally choose 0 subchannels if this
       * subchannel is READY or CONNECTING, and 1 otherwise. Doing that
       * explicitly could be more efficient, doing it this way is defense in
       * depth to ensure that the target is reached consistently. */
      this.connectToRandomSubchannels();
      if (newState === ConnectivityState.IDLE || 
          newState === ConnectivityState.TRANSIENT_FAILURE) {
        this.channelControlHelper.requestReresolution();
      }
    };
  }

  private calculateAndUpdateState() {
    let anyReady = false;
    let anyConnecting = false;
    let anyTransientFailure = false;
    for (const subchannel of this.subchannels) {
      switch (subchannel.getConnectivityState()) {
        case ConnectivityState.READY:
          anyReady = true;
          break;
        case ConnectivityState.CONNECTING:
          anyConnecting = true;
          break;
        case ConnectivityState.TRANSIENT_FAILURE:
          anyTransientFailure = true;
          break;
        default:
          break;
      }
    }
    if (anyReady) {
      const readySubchannels = this.subchannels.filter(
        (subchannel) =>
          subchannel.getConnectivityState() === ConnectivityState.READY
      );
      let index = 0;
      if (this.currentReadyPicker !== null) {
        index = readySubchannels.indexOf(
          this.currentReadyPicker.peekNextSubchannel()
        );
        if (index < 0) {
          index = 0;
        }
      }
      this.updateState(
        ConnectivityState.READY,
        new RoundRobinPicker(readySubchannels, index)
      );
    } else if (anyConnecting) {
      this.updateState(ConnectivityState.CONNECTING, new QueuePicker(this));
    } else if (anyTransientFailure) {
      this.updateState(
        ConnectivityState.TRANSIENT_FAILURE,
        new UnavailablePicker()
      );
    } else {
      this.updateState(ConnectivityState.IDLE, new QueuePicker(this));
    }
  }

  private updateState(newState: ConnectivityState, picker: Picker) {
    trace(
      ConnectivityState[this.currentState] +
        ' -> ' +
        ConnectivityState[newState]
    );
    if (newState === ConnectivityState.READY) {
      this.currentReadyPicker = picker as RoundRobinPicker;
    } else {
      this.currentReadyPicker = null;
    }
    this.currentState = newState;
    this.channelControlHelper.updateState(newState, picker);
  }

  private resetSubchannelList() {
    for (const subchannel of this.subchannels) {
      subchannel.removeConnectivityStateListener(this.subchannelStateListener);
      subchannel.unref();
    }
    this.subchannels = [];
  }

  /**
   * Connect to a randomly selected subset of the subchannels that are not
   * ready or trying to connect, so that the total number of subchannels that
   * are ready or trying to connect is greater than or equal to
   * TARGET_CONNECTION_COUNT.
   */
  private connectToRandomSubchannels() {
    const readyOrConnectingCount = this.subchannels.filter(subchannelIsReadyOrTryingToConnect).length;
    if (readyOrConnectingCount < TARGET_CONNECTION_COUNT) {
      const notReadyOrConnecting = this.subchannels.filter(subchannel => !subchannelIsReadyOrTryingToConnect(subchannel));
      const subchannelsToConnect = chooseRandomSubset(notReadyOrConnecting, TARGET_CONNECTION_COUNT - readyOrConnectingCount);
      for (const subchannel of subchannelsToConnect) {
        subchannel.startConnecting();
      }
    }
  }

  updateAddressList(
    addressList: SubchannelAddress[],
    lbConfig: LoadBalancingConfig
  ): void {
    this.resetSubchannelList();
    trace(
      'Connect to address list ' +
        addressList.map((address) => subchannelAddressToString(address))
    );
    this.subchannels = addressList.map((address) =>
      this.channelControlHelper.createSubchannel(address, {})
    );
    for (const subchannel of this.subchannels) {
      subchannel.ref();
      subchannel.addConnectivityStateListener(this.subchannelStateListener);
    }
    this.connectToRandomSubchannels();
    this.calculateAndUpdateState();
  }

  exitIdle(): void {
    for (const subchannel of this.subchannels) {
      subchannel.startConnecting();
    }
  }
  resetBackoff(): void {
    /* The pick first load balancer does not have a connection backoff, so this
     * does nothing */
  }
  destroy(): void {
    this.resetSubchannelList();
  }
  getTypeName(): string {
    return TYPE_NAME;
  }
}

export function setup() {
  registerLoadBalancerType(TYPE_NAME, RoundRobinLoadBalancer, RoundRobinLoadBalancingConfig);
}
