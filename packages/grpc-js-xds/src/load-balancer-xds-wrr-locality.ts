/*
 * Copyright 2023 gRPC authors.
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

import { LoadBalancingConfig, experimental, logVerbosity } from "@grpc/grpc-js";
import { WeightedTargetRaw } from "./load-balancer-weighted-target";
import { isLocalitySubchannelAddress } from "./load-balancer-priority";
import { localityToName } from "./load-balancer-xds-cluster-resolver";
import TypedLoadBalancingConfig = experimental.TypedLoadBalancingConfig;
import LoadBalancer = experimental.LoadBalancer;
import ChannelControlHelper = experimental.ChannelControlHelper;
import ChildLoadBalancerHandler = experimental.ChildLoadBalancerHandler;
import SubchannelAddress = experimental.SubchannelAddress;
import parseLoadBalancingConfig = experimental.parseLoadBalancingConfig;
import registerLoadBalancerType = experimental.registerLoadBalancerType;

const TRACER_NAME = 'xds_wrr_locality';

function trace(text: string): void {
  experimental.trace(logVerbosity.DEBUG, TRACER_NAME, text);
}

const TYPE_NAME = 'xds_wrr_locality';

class XdsWrrLocalityLoadBalancingConfig implements TypedLoadBalancingConfig {
  getLoadBalancerName(): string {
    return TYPE_NAME;
  }
  toJsonObject(): object {
    return {
      [TYPE_NAME]: {
        child_policy: this.childPolicy
      }
    }
  }

  constructor(private childPolicy: LoadBalancingConfig[]) {}

  getChildPolicy() {
    return this.childPolicy;
  }

  static createFromJson(obj: any): XdsWrrLocalityLoadBalancingConfig {
    if (!('child_policy' in obj && Array.isArray(obj.child_policy))) {
      throw new Error('xds_wrr_locality config must have a child_policy array');
    }
    return new XdsWrrLocalityLoadBalancingConfig(
      obj.child_policy
    );
  }
}

class XdsWrrLocalityLoadBalancer implements LoadBalancer {
  private childBalancer: ChildLoadBalancerHandler;
  constructor(private readonly channelControlHelper: ChannelControlHelper) {
    this.childBalancer = new ChildLoadBalancerHandler(channelControlHelper);
  }
  updateAddressList(addressList: SubchannelAddress[], lbConfig: TypedLoadBalancingConfig, attributes: { [key: string]: unknown; }): void {
    if (!(lbConfig instanceof XdsWrrLocalityLoadBalancingConfig)) {
      trace('Discarding address list update with unrecognized config ' + JSON.stringify(lbConfig, undefined, 2));
      return;
    }
    const targets: {[localityName: string]: WeightedTargetRaw} = {};
    for (const address of addressList) {
      if (!isLocalitySubchannelAddress(address)) {
        return;
      }
      const localityName = localityToName(address.locality);
      if (!(localityName in targets)) {
        targets[localityName] = {
          child_policy: lbConfig.getChildPolicy(),
          weight: address.weight
        };
      }
    }
    const childConfig = {
      weighted_target: {
        targets: targets
      }
    };
    this.childBalancer.updateAddressList(addressList, parseLoadBalancingConfig(childConfig), attributes);
  }
  exitIdle(): void {
    this.childBalancer.exitIdle();
  }
  resetBackoff(): void {
    this.childBalancer.resetBackoff();
  }
  destroy(): void {
    this.childBalancer.destroy();
  }
  getTypeName(): string {
    return TYPE_NAME;
  }
}

export function setup() {
  registerLoadBalancerType(TYPE_NAME, XdsWrrLocalityLoadBalancer, XdsWrrLocalityLoadBalancingConfig);
}
