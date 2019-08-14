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

import { ChannelControlHelper, LoadBalancer, isLoadBalancerNameRegistered, createLoadBalancer } from "./load-balancer";
import { ServiceConfig } from "./service-config";
import { ConnectivityState } from "./channel";
import { createResolver, Resolver } from "./resolver";
import { ServiceError } from "./call";
import { ChannelOptions } from "./channel-options";
import { Picker, UnavailablePicker, QueuePicker } from "./picker";
import { LoadBalancingConfig } from "./load-balancing-config";

const DEFAULT_LOAD_BALANCER_NAME = 'pick_first';

export class ResolvingLoadBalancer implements LoadBalancer {
  private innerResolver: Resolver;
  /**
   * Current internal load balancer used for handling calls.
   * Invariant: innerLoadBalancer === null => pendingReplacementLoadBalancer === null.
   */
  private innerLoadBalancer: LoadBalancer | null = null;
  private pendingReplacementLoadBalancer: LoadBalancer | null = null;
  private currentState: ConnectivityState = ConnectivityState.IDLE;
  /**
   * The service config object from the last successful resolution, if
   * available. A value of undefined indicates that there has not yet
   * been a successful resolution. A value of null indicates that the last
   * successful resolution explicitly provided a null service config.
   */
  private previousServiceConfig: ServiceConfig | null | undefined = undefined;

  private innerBalancerState: ConnectivityState = ConnectivityState.IDLE;

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

  constructor (private target: string, private channelControlHelper: ChannelControlHelper, private defaultServiceConfig: ServiceConfig | null) {
    this.channelControlHelper.updateState(ConnectivityState.IDLE, new QueuePicker(this));
    this.innerResolver = createResolver(target, {
      onSuccessfulResolution: (addressList: string[], serviceConfig: ServiceConfig | null, serviceConfigError: ServiceError | null) => {
        let workingServiceConfig: ServiceConfig | null = null;
        if (serviceConfig === null) {
          if (serviceConfigError === null) {
            this.previousServiceConfig = serviceConfig;
            workingServiceConfig = this.defaultServiceConfig;
          } else {
            if (this.defaultServiceConfig === undefined) {
              // resolution actually failed
            } else {
              workingServiceConfig = this.defaultServiceConfig;
            }
          }
        } else {
          workingServiceConfig = serviceConfig;
          this.previousServiceConfig = serviceConfig;
        }
        let loadBalancerName: string | null = null;
        let loadBalancingConfig: LoadBalancingConfig | null = null;
        if (workingServiceConfig === null || workingServiceConfig.loadBalancingConfig.length === 0) {
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
            // TODO: handle error
            return;
          }
        }
        if (this.innerLoadBalancer === null) {
          this.innerLoadBalancer = createLoadBalancer(loadBalancerName, this.innerChannelControlHelper)!;
          this.innerLoadBalancer.updateAddressList(addressList, loadBalancingConfig);
        } else if (this.innerLoadBalancer.getTypeName() === loadBalancerName) {
          this.innerLoadBalancer.updateAddressList(addressList, loadBalancingConfig);
        } else {
          if (this.pendingReplacementLoadBalancer === null || this.pendingReplacementLoadBalancer.getTypeName() !== loadBalancerName) {
            if (this.pendingReplacementLoadBalancer !== null) {
              this.pendingReplacementLoadBalancer.destroy();
            }
            this.pendingReplacementLoadBalancer = createLoadBalancer(loadBalancerName, this.replacementChannelControlHelper)!;
          }
          this.pendingReplacementLoadBalancer.updateAddressList(addressList, loadBalancingConfig);
        }
      },
      onError: (error: ServiceError) => {
        this.handleResolutionFailure(error);
      }
    });

    this.innerChannelControlHelper = {
      createSubchannel: (subchannelAddress: string, subchannelArgs: ChannelOptions) => {
        return this.channelControlHelper.createSubchannel(subchannelAddress, subchannelArgs);
      },
      updateState: (connectivityState: ConnectivityState, picker: Picker) => {
        this.innerBalancerState = connectivityState;
        if (connectivityState === ConnectivityState.TRANSIENT_FAILURE && this.pendingReplacementLoadBalancer !== null) {
          this.switchOverReplacementBalancer();
        } else {
          this.channelControlHelper.updateState(connectivityState, picker);
        }
      },
      requestReresolution: () => {
        if (this.pendingReplacementLoadBalancer === null) {
          this.innerResolver.updateResolution();
        }
      }
    }

    this.replacementChannelControlHelper = {
      createSubchannel: (subchannelAddress: string, subchannelArgs: ChannelOptions) => {
        return this.channelControlHelper.createSubchannel(subchannelAddress, subchannelArgs);
      },
      updateState: (connectivityState: ConnectivityState, picker: Picker) => {
        this.replacementBalancerState = connectivityState;
        this.replacementBalancerPicker = picker;
        if (connectivityState === ConnectivityState.READY) {
          this.switchOverReplacementBalancer();
        }
      },
      requestReresolution: () => {
        this.innerResolver.updateResolution();
      }
    };
  }

  /**
   * Stop using the current innerLoadBalancer and replace it with the
   * pendingReplacementLoadBalancer. Must only be called if both of
   * those are currently not null.
   */
  private switchOverReplacementBalancer() {
    this.innerLoadBalancer!.destroy();
    this.innerLoadBalancer = this.pendingReplacementLoadBalancer!;
    this.innerLoadBalancer.replaceChannelControlHelper(this.innerChannelControlHelper);
    this.pendingReplacementLoadBalancer = null;
    this.innerBalancerState = this.replacementBalancerState;
    this.channelControlHelper.updateState(this.replacementBalancerState, this.replacementBalancerPicker);
  }

  private handleResolutionFailure(error: ServiceError) {

  }

  exitIdle() {
    this.innerResolver.updateResolution();
    if (this.innerLoadBalancer !== null) {
      this.innerLoadBalancer.exitIdle();
    }
  }

  updateAddressList(addressList: string[], lbConfig: LoadBalancingConfig | null) {
    throw new Error('updateAddressList not supported on ResolvingLoadBalancer');
  }

  resetBackoff() {
    // TODO
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
    // Go to another state?
  }

  getTypeName() {
    return 'resolving_load_balancer';
  }

  replaceChannelControlHelper(channelControlHelper: ChannelControlHelper) {
    this.channelControlHelper = channelControlHelper;
  }
}