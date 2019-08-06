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

import { ChannelControlHelper, LoadBalancer, isLoadBalancerNameRegistered } from "./load-balancer";
import { ServiceConfig } from "./service-config";
import { ConnectivityState } from "./channel";
import { createResolver, Resolver } from "./resolver";
import { ServiceError } from "./call";

const DEFAULT_LOAD_BALANCER_NAME = 'pick_first';

export class ResolvingLoadBalancer {
  private innerResolver: Resolver;
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

  constructor (private target: string, private channelControlHelper: ChannelControlHelper, private defaultServiceConfig: ServiceConfig | null) {

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
        if (workingServiceConfig === null || workingServiceConfig.loadBalancingConfig.length === 0) {
          loadBalancerName = DEFAULT_LOAD_BALANCER_NAME;
        } else {
          for (const lbConfig of workingServiceConfig.loadBalancingConfig) {
            for (const key in lbConfig) {
              if (Object.prototype.hasOwnProperty.call(lbConfig, key)) {
                if (isLoadBalancerNameRegistered(key)) {
                  loadBalancerName = key;
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
      },
      onError: (error: ServiceError) => {
        this.handleResolutionFailure(error);
      }
    });
  }

  private handleResolutionFailure(error: ServiceError) {

  }
}