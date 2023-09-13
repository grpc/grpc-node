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

// https://github.com/grpc/proposal/blob/master/A52-xds-custom-lb-policies.md

import { ChannelOptions, LoadBalancingConfig, experimental, logVerbosity } from "@grpc/grpc-js";
import { loadProtosWithOptionsSync } from "@grpc/proto-loader/build/src/util";
import { WeightedTargetRaw } from "./load-balancer-weighted-target";
import { isLocalityEndpoint } from "./load-balancer-priority";
import { localityToName } from "./load-balancer-xds-cluster-resolver";
import TypedLoadBalancingConfig = experimental.TypedLoadBalancingConfig;
import LoadBalancer = experimental.LoadBalancer;
import ChannelControlHelper = experimental.ChannelControlHelper;
import ChildLoadBalancerHandler = experimental.ChildLoadBalancerHandler;
import Endpoint = experimental.Endpoint;
import parseLoadBalancingConfig = experimental.parseLoadBalancingConfig;
import registerLoadBalancerType = experimental.registerLoadBalancerType;
import { Any__Output } from "./generated/google/protobuf/Any";
import { WrrLocality__Output } from "./generated/envoy/extensions/load_balancing_policies/wrr_locality/v3/WrrLocality";
import { TypedExtensionConfig__Output } from "./generated/envoy/config/core/v3/TypedExtensionConfig";
import { LoadBalancingPolicy__Output } from "./generated/envoy/config/cluster/v3/LoadBalancingPolicy";
import { registerLbPolicy } from "./lb-policy-registry";

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
  constructor(private readonly channelControlHelper: ChannelControlHelper, options: ChannelOptions) {
    this.childBalancer = new ChildLoadBalancerHandler(channelControlHelper, options);
  }
  updateAddressList(endpointList: Endpoint[], lbConfig: TypedLoadBalancingConfig, attributes: { [key: string]: unknown; }): void {
    if (!(lbConfig instanceof XdsWrrLocalityLoadBalancingConfig)) {
      trace('Discarding address list update with unrecognized config ' + JSON.stringify(lbConfig, undefined, 2));
      return;
    }
    const targets: {[localityName: string]: WeightedTargetRaw} = {};
    for (const address of endpointList) {
      if (!isLocalityEndpoint(address)) {
        return;
      }
      const localityName = localityToName(address.locality);
      if (!(localityName in targets)) {
        targets[localityName] = {
          child_policy: lbConfig.getChildPolicy(),
          weight: address.localityWeight
        };
      }
    }
    const childConfig = {
      weighted_target: {
        targets: targets
      }
    };
    this.childBalancer.updateAddressList(endpointList, parseLoadBalancingConfig(childConfig), attributes);
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

const WRR_LOCALITY_TYPE_URL = 'type.googleapis.com/envoy.extensions.load_balancing_policies.wrr_locality.v3.WrrLocality';

const resourceRoot = loadProtosWithOptionsSync([
  'envoy/extensions/load_balancing_policies/wrr_locality/v3/wrr_locality.proto'], {
    keepCase: true,
    includeDirs: [
      // Paths are relative to src/build
      __dirname + '/../../deps/envoy-api/',
      __dirname + '/../../deps/xds/',
      __dirname + '/../../deps/protoc-gen-validate'
    ],
  }
);

const toObjectOptions = {
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
}

function decodeWrrLocality(message: Any__Output): WrrLocality__Output {
  const name = message.type_url.substring(message.type_url.lastIndexOf('/') + 1);
  const type = resourceRoot.lookup(name);
  if (type) {
    const decodedMessage = (type as any).decode(message.value);
    return decodedMessage.$type.toObject(decodedMessage, toObjectOptions) as WrrLocality__Output;
  } else {
    throw new Error(`TypedStruct parsing error: unexpected type URL ${message.type_url}`);
  }
}

function convertToLoadBalancingPolicy(protoPolicy: TypedExtensionConfig__Output, selectChildPolicy: (childPolicy: LoadBalancingPolicy__Output) => LoadBalancingConfig): LoadBalancingConfig {
  if (protoPolicy.typed_config?.type_url !== WRR_LOCALITY_TYPE_URL) {
    throw new Error(`WRR Locality LB policy parsing error: unexpected type URL ${protoPolicy.typed_config?.type_url}`);
  }
  const wrrLocalityMessage = decodeWrrLocality(protoPolicy.typed_config);
  if (!wrrLocalityMessage.endpoint_picking_policy) {
    throw new Error('WRR Locality LB parsing error: no endpoint_picking_policy specified');
  }
  return {
    [TYPE_NAME]: {
      child_policy: [selectChildPolicy(wrrLocalityMessage.endpoint_picking_policy)]
    }
  };
}

export function setup() {
  registerLoadBalancerType(TYPE_NAME, XdsWrrLocalityLoadBalancer, XdsWrrLocalityLoadBalancingConfig);
  registerLbPolicy(WRR_LOCALITY_TYPE_URL, convertToLoadBalancingPolicy);
}
