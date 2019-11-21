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
  Deadline,
  Call,
  Http2CallStream,
  CallStreamOptions,
} from './call-stream';
import { ChannelCredentials } from './channel-credentials';
import { ChannelOptions } from './channel-options';
import { ResolvingLoadBalancer } from './resolving-load-balancer';
import { SubchannelPool, getSubchannelPool } from './subchannel-pool';
import { ChannelControlHelper } from './load-balancer';
import { UnavailablePicker, Picker, PickResultType } from './picker';
import { Metadata } from './metadata';
import { Status, LogVerbosity } from './constants';
import { FilterStackFactory } from './filter-stack';
import { CallCredentialsFilterFactory } from './call-credentials-filter';
import { DeadlineFilterFactory } from './deadline-filter';
import { MetadataStatusFilterFactory } from './metadata-status-filter';
import { CompressionFilterFactory } from './compression-filter';
import { getDefaultAuthority } from './resolver';
import { LoadBalancingConfig } from './load-balancing-config';
import { ServiceConfig, validateServiceConfig } from './service-config';
import { trace } from './logging';

export enum ConnectivityState {
  CONNECTING,
  READY,
  TRANSIENT_FAILURE,
  IDLE,
  SHUTDOWN,
}

/**
 * An interface that represents a communication channel to a server specified
 * by a given address.
 */
export interface Channel {
  /**
   * Close the channel. This has the same functionality as the existing
   * grpc.Client.prototype.close
   */
  close(): void;
  /**
   * Return the target that this channel connects to
   */
  getTarget(): string;
  /**
   * Get the channel's current connectivity state. This method is here mainly
   * because it is in the existing internal Channel class, and there isn't
   * another good place to put it.
   * @param tryToConnect If true, the channel will start connecting if it is
   *     idle. Otherwise, idle channels will only start connecting when a
   *     call starts.
   */
  getConnectivityState(tryToConnect: boolean): ConnectivityState;
  /**
   * Watch for connectivity state changes. This is also here mainly because
   * it is in the existing external Channel class.
   * @param currentState The state to watch for transitions from. This should
   *     always be populated by calling getConnectivityState immediately
   *     before.
   * @param deadline A deadline for waiting for a state change
   * @param callback Called with no error when a state change, or with an
   *     error if the deadline passes without a state change.
   */
  watchConnectivityState(
    currentState: ConnectivityState,
    deadline: Date | number,
    callback: (error?: Error) => void
  ): void;
  /**
   * Create a call object. Call is an opaque type that is used by the Client
   * class. This function is called by the gRPC library when starting a
   * request. Implementers should return an instance of Call that is returned
   * from calling createCall on an instance of the provided Channel class.
   * @param method The full method string to request.
   * @param deadline The call deadline
   * @param host A host string override for making the request
   * @param parentCall A server call to propagate some information from
   * @param propagateFlags A bitwise combination of elements of grpc.propagate
   *     that indicates what information to propagate from parentCall.
   */
  createCall(
    method: string,
    deadline: Deadline | null | undefined,
    host: string | null | undefined,
    parentCall: Call | null | undefined,
    propagateFlags: number | null | undefined
  ): Call;
}

interface ConnectivityStateWatcher {
  currentState: ConnectivityState;
  timer: NodeJS.Timeout;
  callback: (error?: Error) => void;
}

export class ChannelImplementation implements Channel {
  private resolvingLoadBalancer: ResolvingLoadBalancer;
  private subchannelPool: SubchannelPool;
  private connectivityState: ConnectivityState = ConnectivityState.IDLE;
  private currentPicker: Picker = new UnavailablePicker();
  private pickQueue: Array<{
    callStream: Http2CallStream;
    callMetadata: Metadata;
  }> = [];
  private connectivityStateWatchers: ConnectivityStateWatcher[] = [];
  private defaultAuthority: string;
  private filterStackFactory: FilterStackFactory;
  constructor(
    private target: string,
    private readonly credentials: ChannelCredentials,
    private readonly options: ChannelOptions
  ) {
    // TODO(murgatroid99): check channel arg for getting a private pool
    this.subchannelPool = getSubchannelPool(true);
    const channelControlHelper: ChannelControlHelper = {
      createSubchannel: (
        subchannelAddress: string,
        subchannelArgs: ChannelOptions
      ) => {
        return this.subchannelPool.getOrCreateSubchannel(
          this.target,
          subchannelAddress,
          Object.assign({}, this.options, subchannelArgs),
          this.credentials
        );
      },
      updateState: (connectivityState: ConnectivityState, picker: Picker) => {
        this.currentPicker = picker;
        const queueCopy = this.pickQueue.slice();
        this.pickQueue = [];
        for (const { callStream, callMetadata } of queueCopy) {
          this.tryPick(callStream, callMetadata);
        }
        this.updateState(connectivityState);
      },
      requestReresolution: () => {
        // This should never be called.
        throw new Error(
          'Resolving load balancer should never call requestReresolution'
        );
      },
    };
    // TODO(murgatroid99): check channel arg for default service config
    let defaultServiceConfig: ServiceConfig = {
      loadBalancingConfig: [],
      methodConfig: [],
    };
    if (options['grpc.service_config']) {
      defaultServiceConfig = validateServiceConfig(
        JSON.parse(options['grpc.service_config']!)
      );
    }
    this.resolvingLoadBalancer = new ResolvingLoadBalancer(
      target,
      channelControlHelper,
      defaultServiceConfig
    );
    this.filterStackFactory = new FilterStackFactory([
      new CallCredentialsFilterFactory(this),
      new DeadlineFilterFactory(this),
      new MetadataStatusFilterFactory(this),
      new CompressionFilterFactory(this),
    ]);
    // TODO(murgatroid99): Add more centralized handling of channel options
    if (this.options['grpc.default_authority']) {
      this.defaultAuthority = this.options['grpc.default_authority'] as string;
    } else {
      this.defaultAuthority = getDefaultAuthority(target);
    }
  }

  /**
   * Check the picker output for the given call and corresponding metadata,
   * and take any relevant actions. Should not be called while iterating
   * over pickQueue.
   * @param callStream
   * @param callMetadata
   */
  private tryPick(callStream: Http2CallStream, callMetadata: Metadata) {
    const pickResult = this.currentPicker.pick({ metadata: callMetadata });
    switch (pickResult.pickResultType) {
      case PickResultType.COMPLETE:
        if (pickResult.subchannel === null) {
          callStream.cancelWithStatus(
            Status.UNAVAILABLE,
            'Request dropped by load balancing policy'
          );
          // End the call with an error
        } else {
          /* If the subchannel disconnects between calling pick and getting
           * the filter stack metadata, the call will end with an error. */
          callStream.filterStack
            .sendMetadata(Promise.resolve(callMetadata))
            .then(
              finalMetadata => {
                if (
                  pickResult.subchannel!.getConnectivityState() ===
                  ConnectivityState.READY
                ) {
                  try {
                    pickResult.subchannel!.startCallStream(
                      finalMetadata,
                      callStream
                    );
                  } catch (error) {
                    callStream.cancelWithStatus(
                      Status.UNAVAILABLE,
                      'Failed to start call on picked subchannel'
                    );
                  }
                } else {
                  callStream.cancelWithStatus(
                    Status.UNAVAILABLE,
                    'Connection dropped while starting call'
                  );
                }
              },
              (error: Error & { code: number }) => {
                // We assume the error code isn't 0 (Status.OK)
                callStream.cancelWithStatus(
                  error.code || Status.UNKNOWN,
                  `Getting metadata from plugin failed with error: ${error.message}`
                );
              }
            );
        }
        break;
      case PickResultType.QUEUE:
        this.pickQueue.push({ callStream, callMetadata });
        break;
      case PickResultType.TRANSIENT_FAILURE:
        if (callMetadata.getOptions().waitForReady) {
          this.pickQueue.push({ callStream, callMetadata });
        } else {
          callStream.cancelWithStatus(
            pickResult.status!.code,
            pickResult.status!.details
          );
        }
        break;
      default:
        throw new Error(
          `Invalid state: unknown pickResultType ${pickResult.pickResultType}`
        );
    }
  }

  private removeConnectivityStateWatcher(
    watcherObject: ConnectivityStateWatcher
  ) {
    const watcherIndex = this.connectivityStateWatchers.findIndex(
      value => value === watcherObject
    );
    if (watcherIndex >= 0) {
      this.connectivityStateWatchers.splice(watcherIndex, 1);
    }
  }

  private updateState(newState: ConnectivityState): void {
    trace(
      LogVerbosity.DEBUG,
      'connectivity_state',
      this.target +
        ' ' +
        ConnectivityState[this.connectivityState] +
        ' -> ' +
        ConnectivityState[newState]
    );
    this.connectivityState = newState;
    const watchersCopy = this.connectivityStateWatchers.slice();
    for (const watcherObject of watchersCopy) {
      if (newState !== watcherObject.currentState) {
        watcherObject.callback();
        clearTimeout(watcherObject.timer);
        this.removeConnectivityStateWatcher(watcherObject);
      }
    }
  }

  _startCallStream(stream: Http2CallStream, metadata: Metadata) {
    this.tryPick(stream, metadata.clone());
  }

  close() {
    this.resolvingLoadBalancer.destroy();
    this.updateState(ConnectivityState.SHUTDOWN);

    this.subchannelPool.unrefUnusedSubchannels();
  }

  getTarget() {
    return this.target;
  }

  getConnectivityState(tryToConnect: boolean) {
    const connectivityState = this.connectivityState;
    if (tryToConnect) {
      this.resolvingLoadBalancer.exitIdle();
    }
    return connectivityState;
  }

  watchConnectivityState(
    currentState: ConnectivityState,
    deadline: Date | number,
    callback: (error?: Error) => void
  ): void {
    const deadlineDate: Date =
      deadline instanceof Date ? deadline : new Date(deadline);
    const now = new Date();
    if (deadlineDate <= now) {
      process.nextTick(
        callback,
        new Error('Deadline passed without connectivity state change')
      );
      return;
    }
    const watcherObject = {
      currentState,
      callback,
      timer: setTimeout(() => {
        this.removeConnectivityStateWatcher(watcherObject);
        callback(
          new Error('Deadline passed without connectivity state change')
        );
      }, deadlineDate.getTime() - now.getTime()),
    };
    this.connectivityStateWatchers.push(watcherObject);
  }

  createCall(
    method: string,
    deadline: Deadline | null | undefined,
    host: string | null | undefined,
    parentCall: Call | null | undefined,
    propagateFlags: number | null | undefined
  ): Call {
    if (this.connectivityState === ConnectivityState.SHUTDOWN) {
      throw new Error('Channel has been shut down');
    }
    const finalOptions: CallStreamOptions = {
      deadline:
        deadline === null || deadline === undefined ? Infinity : deadline,
      flags: propagateFlags || 0,
      host: host || this.defaultAuthority,
      parentCall: parentCall || null,
    };
    const stream: Http2CallStream = new Http2CallStream(
      method,
      this,
      finalOptions,
      this.filterStackFactory,
      this.credentials._getCallCredentials()
    );
    return stream;
  }
}
