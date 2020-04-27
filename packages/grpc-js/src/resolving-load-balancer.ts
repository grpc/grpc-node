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
  ChannelControlHelper,
  LoadBalancer,
  isLoadBalancerNameRegistered,
  createLoadBalancer,
} from './load-balancer';
import { ServiceConfig } from './service-config';
import { ConnectivityState } from './channel';
import { createResolver, Resolver } from './resolver';
import { ServiceError } from './call';
import { ChannelOptions } from './channel-options';
import { Picker, UnavailablePicker, QueuePicker } from './picker';
import { LoadBalancingConfig } from './load-balancing-config';
import { BackoffTimeout } from './backoff-timeout';
import { Status } from './constants';
import { StatusObject } from './call-stream';
import { Metadata } from './metadata';
import * as logging from './logging';
import { LogVerbosity } from './constants';
import { SubchannelAddress } from './subchannel';
import { GrpcUri, uriToString } from './uri-parser';

const TRACER_NAME = 'resolving_load_balancer';

function trace(text: string): void {
  logging.trace(LogVerbosity.DEBUG, TRACER_NAME, text);
}

const DEFAULT_LOAD_BALANCER_NAME = 'pick_first';

export class ResolvingLoadBalancer implements LoadBalancer {
  /**
   * The resolver class constructed for the target address.
   */
  private innerResolver: Resolver;
  /**
   * Current internal load balancer used for handling calls.
   * Invariant: innerLoadBalancer === null => pendingReplacementLoadBalancer === null.
   */
  private innerLoadBalancer: LoadBalancer | null = null;
  /**
   * The load balancer instance that will be used in place of the current
   * `innerLoadBalancer` once either that load balancer loses its connection
   * or this one establishes a connection. For use when a new name resolution
   * result comes in with a different load balancing configuration, and the
   * current `innerLoadBalancer` is still connected.
   */
  private pendingReplacementLoadBalancer: LoadBalancer | null = null;
  /**
   * This resolving load balancer's current connectivity state.
   */
  private currentState: ConnectivityState = ConnectivityState.IDLE;
  /**
   * The service config object from the last successful resolution, if
   * available. A value of undefined indicates that there has not yet
   * been a successful resolution. A value of null indicates that the last
   * successful resolution explicitly provided a null service config.
   */
  private previousServiceConfig: ServiceConfig | null | undefined = undefined;
  /**
   * The most recently reported connectivity state of the `innerLoadBalancer`.
   */
  private innerBalancerState: ConnectivityState = ConnectivityState.IDLE;

  private innerBalancerPicker: Picker = new UnavailablePicker();

  /**
   * The most recent reported state of the pendingReplacementLoadBalancer.
   * Starts at IDLE for type simplicity. This should get updated as soon as the
   * pendingReplacementLoadBalancer gets constructed.
   */
  private replacementBalancerState: ConnectivityState = ConnectivityState.IDLE;
  /**
   * The picker associated with the replacementBalancerState. Starts as an
   * UnavailablePicker for type simplicity. This should get updated as soon as
   * the pendingReplacementLoadBalancer gets constructed.
   */
  private replacementBalancerPicker: Picker = new UnavailablePicker();

  /**
   * ChannelControlHelper for the innerLoadBalancer.
   */
  private readonly innerChannelControlHelper: ChannelControlHelper;
  /**
   * ChannelControlHelper for the pendingReplacementLoadBalancer.
   */
  private readonly replacementChannelControlHelper: ChannelControlHelper;

  /**
   * The backoff timer for handling name resolution failures.
   */
  private readonly backoffTimeout: BackoffTimeout;

  /**
   * Indicates whether we should attempt to resolve again after the backoff
   * timer runs out.
   */
  private continueResolving = false;

  /**
   * Wrapper class that behaves like a `LoadBalancer` and also handles name
   * resolution internally.
   * @param target The address of the backend to connect to.
   * @param channelControlHelper `ChannelControlHelper` instance provided by
   *     this load balancer's owner.
   * @param defaultServiceConfig The default service configuration to be used
   *     if none is provided by the name resolver. A `null` value indicates
   *     that the default behavior should be the default unconfigured behavior.
   *     In practice, that means using the "pick first" load balancer
   *     implmentation
   */
  constructor(
    private target: GrpcUri,
    private channelControlHelper: ChannelControlHelper,
    private defaultServiceConfig: ServiceConfig | null
  ) {
    this.updateState(ConnectivityState.IDLE, new QueuePicker(this));
    this.innerResolver = createResolver(target, {
      onSuccessfulResolution: (
        addressList: SubchannelAddress[],
        serviceConfig: ServiceConfig | null,
        serviceConfigError: ServiceError | null,
        attributes: { [key: string]: unknown }
      ) => {
        let workingServiceConfig: ServiceConfig | null = null;
        /* This first group of conditionals implements the algorithm described
         * in https://github.com/grpc/proposal/blob/master/A21-service-config-error-handling.md
         * in the section called "Behavior on receiving a new gRPC Config".
         */
        if (serviceConfig === null) {
          // Step 4 and 5
          if (serviceConfigError === null) {
            // Step 5
            this.previousServiceConfig = serviceConfig;
            workingServiceConfig = this.defaultServiceConfig;
          } else {
            // Step 4
            if (this.previousServiceConfig === undefined) {
              // Step 4.ii
              if (this.defaultServiceConfig === null) {
                // Step 4.ii.b
                this.handleResolutionFailure(serviceConfigError);
              } else {
                // Step 4.ii.a
                workingServiceConfig = this.defaultServiceConfig;
              }
            } else {
              // Step 4.i
              workingServiceConfig = this.previousServiceConfig;
            }
          }
        } else {
          // Step 3
          workingServiceConfig = serviceConfig;
          this.previousServiceConfig = serviceConfig;
        }
        let loadBalancerName: string | null = null;
        let loadBalancingConfig: LoadBalancingConfig | null = null;
        if (
          workingServiceConfig === null ||
          workingServiceConfig.loadBalancingConfig.length === 0
        ) {
          loadBalancerName = DEFAULT_LOAD_BALANCER_NAME;
        } else {
          for (const lbConfig of workingServiceConfig.loadBalancingConfig) {
            // Iterating through a oneof looking for whichever one is populated
            for (const key in lbConfig) {
              if (Object.prototype.hasOwnProperty.call(lbConfig, key)) {
                if (isLoadBalancerNameRegistered(key)) {
                  loadBalancerName = key;
                  loadBalancingConfig = lbConfig;
                  break;
                }
              }
            }
            if (loadBalancerName !== null) {
              break;
            }
          }
          if (loadBalancerName === null) {
            // There were load balancing configs but none are supported. This counts as a resolution failure
            this.handleResolutionFailure({
              code: Status.UNAVAILABLE,
              details:
                'All load balancer options in service config are not compatible',
              metadata: new Metadata(),
            });
            return;
          }
        }
        if (this.innerLoadBalancer === null) {
          this.innerLoadBalancer = createLoadBalancer(
            loadBalancerName,
            this.innerChannelControlHelper
          )!;
          this.innerLoadBalancer.updateAddressList(
            addressList,
            loadBalancingConfig,
            attributes
          );
        } else if (this.innerLoadBalancer.getTypeName() === loadBalancerName) {
          this.innerLoadBalancer.updateAddressList(
            addressList,
            loadBalancingConfig,
            attributes
          );
        } else {
          if (
            this.pendingReplacementLoadBalancer === null ||
            this.pendingReplacementLoadBalancer.getTypeName() !==
              loadBalancerName
          ) {
            if (this.pendingReplacementLoadBalancer !== null) {
              this.pendingReplacementLoadBalancer.destroy();
            }
            this.pendingReplacementLoadBalancer = createLoadBalancer(
              loadBalancerName,
              this.replacementChannelControlHelper
            )!;
          }
          this.pendingReplacementLoadBalancer.updateAddressList(
            addressList,
            loadBalancingConfig,
            attributes
          );
        }
      },
      onError: (error: StatusObject) => {
        this.handleResolutionFailure(error);
      },
    });

    this.innerChannelControlHelper = {
      createSubchannel: (
        subchannelAddress: SubchannelAddress,
        subchannelArgs: ChannelOptions
      ) => {
        return this.channelControlHelper.createSubchannel(
          subchannelAddress,
          subchannelArgs
        );
      },
      updateState: (connectivityState: ConnectivityState, picker: Picker) => {
        this.innerBalancerState = connectivityState;
        if (connectivityState === ConnectivityState.IDLE) {
          picker = new QueuePicker(this);
        }
        this.innerBalancerPicker = picker;
        if (
          connectivityState !== ConnectivityState.READY &&
          this.pendingReplacementLoadBalancer !== null
        ) {
          this.switchOverReplacementBalancer();
        } else {
          if (connectivityState === ConnectivityState.IDLE) {
            if (this.innerLoadBalancer) {
              this.innerLoadBalancer.destroy();
              this.innerLoadBalancer = null;
            }
          }
          this.updateState(connectivityState, picker);
        }
      },
      requestReresolution: () => {
        if (this.pendingReplacementLoadBalancer === null) {
          /* If the backoffTimeout is running, we're still backing off from
           * making resolve requests, so we shouldn't make another one here.
           * In that case, the backoff timer callback will call
           * updateResolution */
          if (this.backoffTimeout.isRunning()) {
            this.continueResolving = true;
          } else {
            this.updateResolution();
          }
        }
      },
    };

    this.replacementChannelControlHelper = {
      createSubchannel: (
        subchannelAddress: SubchannelAddress,
        subchannelArgs: ChannelOptions
      ) => {
        return this.channelControlHelper.createSubchannel(
          subchannelAddress,
          subchannelArgs
        );
      },
      updateState: (connectivityState: ConnectivityState, picker: Picker) => {
        if (connectivityState === ConnectivityState.IDLE) {
          picker = new QueuePicker(this);
        }
        this.replacementBalancerState = connectivityState;
        this.replacementBalancerPicker = picker;
        if (connectivityState === ConnectivityState.READY) {
          this.switchOverReplacementBalancer();
        } else if (connectivityState === ConnectivityState.IDLE) {
          if (this.pendingReplacementLoadBalancer) {
            this.pendingReplacementLoadBalancer.destroy();
            this.pendingReplacementLoadBalancer = null;
          }
        }
      },
      requestReresolution: () => {
        /* If the backoffTimeout is running, we're still backing off from
         * making resolve requests, so we shouldn't make another one here.
         * In that case, the backoff timer callback will call
         * updateResolution */
        if (this.backoffTimeout.isRunning()) {
          this.continueResolving = true;
        } else {
          this.updateResolution();
        }
      },
    };

    this.backoffTimeout = new BackoffTimeout(() => {
      if (this.continueResolving) {
        this.updateResolution();
        this.continueResolving = false;
      } else {
        if (this.innerLoadBalancer === null) {
          this.updateState(ConnectivityState.IDLE, new QueuePicker(this));
        } else {
          this.updateState(this.innerBalancerState, this.innerBalancerPicker);
        }
      }
    });
  }

  private updateResolution() {
    this.innerResolver.updateResolution();
    if (
      this.innerLoadBalancer === null ||
      this.innerBalancerState === ConnectivityState.IDLE
    ) {
      this.updateState(ConnectivityState.CONNECTING, new QueuePicker(this));
    }
  }

  private updateState(connectivitystate: ConnectivityState, picker: Picker) {
    trace(
      uriToString(this.target) +
        ' ' +
        ConnectivityState[this.currentState] +
        ' -> ' +
        ConnectivityState[connectivitystate]
    );
    this.currentState = connectivitystate;
    this.channelControlHelper.updateState(connectivitystate, picker);
  }

  /**
   * Stop using the current innerLoadBalancer and replace it with the
   * pendingReplacementLoadBalancer. Must only be called if both of
   * those are currently not null.
   */
  private switchOverReplacementBalancer() {
    this.innerLoadBalancer!.destroy();
    this.innerLoadBalancer = this.pendingReplacementLoadBalancer!;
    this.innerLoadBalancer.replaceChannelControlHelper(
      this.innerChannelControlHelper
    );
    this.pendingReplacementLoadBalancer = null;
    this.innerBalancerState = this.replacementBalancerState;
    this.innerBalancerPicker = this.replacementBalancerPicker;
    this.updateState(
      this.replacementBalancerState,
      this.replacementBalancerPicker
    );
  }

  private handleResolutionFailure(error: StatusObject) {
    if (
      this.innerLoadBalancer === null ||
      this.innerBalancerState === ConnectivityState.IDLE
    ) {
      this.updateState(
        ConnectivityState.TRANSIENT_FAILURE,
        new UnavailablePicker(error)
      );
    }
    this.backoffTimeout.runOnce();
  }

  exitIdle() {
    if (this.innerLoadBalancer !== null) {
      this.innerLoadBalancer.exitIdle();
    }
    if (this.currentState === ConnectivityState.IDLE) {
      if (this.backoffTimeout.isRunning()) {
        this.continueResolving = true;
      } else {
        this.updateResolution();
      }
      this.updateState(ConnectivityState.CONNECTING, new QueuePicker(this));
    }
  }

  updateAddressList(
    addressList: SubchannelAddress[],
    lbConfig: LoadBalancingConfig | null
  ) {
    throw new Error('updateAddressList not supported on ResolvingLoadBalancer');
  }

  resetBackoff() {
    this.backoffTimeout.reset();
    if (this.innerLoadBalancer !== null) {
      this.innerLoadBalancer.resetBackoff();
    }
    if (this.pendingReplacementLoadBalancer !== null) {
      this.pendingReplacementLoadBalancer.resetBackoff();
    }
  }

  destroy() {
    if (this.innerLoadBalancer !== null) {
      this.innerLoadBalancer.destroy();
      this.innerLoadBalancer = null;
    }
    if (this.pendingReplacementLoadBalancer !== null) {
      this.pendingReplacementLoadBalancer.destroy();
      this.pendingReplacementLoadBalancer = null;
    }
    this.updateState(ConnectivityState.SHUTDOWN, new UnavailablePicker());
  }

  getTypeName() {
    return 'resolving_load_balancer';
  }

  replaceChannelControlHelper(channelControlHelper: ChannelControlHelper) {
    this.channelControlHelper = channelControlHelper;
  }
}
