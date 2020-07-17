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

/* This file is an implementation of gRFC A24:
 * https://github.com/grpc/proposal/blob/master/A24-lb-policy-config.md. Each
 * function here takes an object with unknown structure and returns its
 * specific object type if the input has the right structure, and throws an
 * error otherwise. */

/* The any type is purposely used here. All functions validate their input at
 * runtime */
/* eslint-disable @typescript-eslint/no-explicit-any */

export type PickFirstConfig = {};

export type RoundRobinConfig = {};

export interface XdsConfig {
  balancerName: string;
  childPolicy: LoadBalancingConfig[];
  fallbackPolicy: LoadBalancingConfig[];
}

export interface GrpcLbConfig {
  childPolicy: LoadBalancingConfig[];
}

export interface PriorityChild {
  config: LoadBalancingConfig[];
}

export interface PriorityLbConfig {
  children: Map<string, PriorityChild>;
  priorities: string[];
}

export interface WeightedTarget {
  weight: number;
  child_policy: LoadBalancingConfig[];
}

export interface WeightedTargetLbConfig {
  targets: Map<string, WeightedTarget>;
}

export interface EdsLbConfig {
  cluster: string;
  edsServiceName?: string;
  lrsLoadReportingServerName?: string;
  /**
   * This policy's config is expected to be in the format used by the
   * weighted_target policy. Defaults to weighted_target if not specified.
   *
   * This is currently not used because there is currently no other config
   * that has the same format as weighted_target.
   */
  localityPickingPolicy: LoadBalancingConfig[];
  /**
   * Defaults to round_robin if not specified.
   */
  endpointPickingPolicy: LoadBalancingConfig[];
}

export interface PickFirstLoadBalancingConfig {
  name: 'pick_first';
  pick_first: PickFirstConfig;
}

export interface RoundRobinLoadBalancingConfig {
  name: 'round_robin';
  round_robin: RoundRobinConfig;
}

export interface XdsLoadBalancingConfig {
  name: 'xds';
  xds: XdsConfig;
}

export interface GrpcLbLoadBalancingConfig {
  name: 'grpclb';
  grpclb: GrpcLbConfig;
}

export interface PriorityLoadBalancingConfig {
  name: 'priority';
  priority: PriorityLbConfig;
}

export interface WeightedTargetLoadBalancingConfig {
  name: 'weighted_target';
  weighted_target: WeightedTargetLbConfig;
}

export interface EdsLoadBalancingConfig {
  name: 'eds';
  eds: EdsLbConfig;
}

export type LoadBalancingConfig =
  | PickFirstLoadBalancingConfig
  | RoundRobinLoadBalancingConfig
  | XdsLoadBalancingConfig
  | GrpcLbLoadBalancingConfig
  | PriorityLoadBalancingConfig
  | WeightedTargetLoadBalancingConfig
  | EdsLoadBalancingConfig;

export function isRoundRobinLoadBalancingConfig(
  lbconfig: LoadBalancingConfig
): lbconfig is RoundRobinLoadBalancingConfig {
  return lbconfig.name === 'round_robin';
}

export function isXdsLoadBalancingConfig(
  lbconfig: LoadBalancingConfig
): lbconfig is XdsLoadBalancingConfig {
  return lbconfig.name === 'xds';
}

export function isGrpcLbLoadBalancingConfig(
  lbconfig: LoadBalancingConfig
): lbconfig is GrpcLbLoadBalancingConfig {
  return lbconfig.name === 'grpclb';
}

export function isPriorityLoadBalancingConfig(
  lbconfig: LoadBalancingConfig
): lbconfig is PriorityLoadBalancingConfig {
  return lbconfig.name === 'priority';
}

export function isWeightedTargetLoadBalancingConfig(
  lbconfig: LoadBalancingConfig
): lbconfig is WeightedTargetLoadBalancingConfig {
  return lbconfig.name === 'weighted_target';
}

export function isEdsLoadBalancingConfig(
  lbconfig: LoadBalancingConfig
): lbconfig is EdsLoadBalancingConfig {
  return lbconfig.name === 'eds';
}

/* In these functions we assume the input came from a JSON object. Therefore we
 * expect that the prototype is uninteresting and that `in` can be used
 * effectively */

function validateXdsConfig(xds: any): XdsConfig {
  if (!('balancerName' in xds) || typeof xds.balancerName !== 'string') {
    throw new Error('Invalid xds config: invalid balancerName');
  }
  const xdsConfig: XdsConfig = {
    balancerName: xds.balancerName,
    childPolicy: [],
    fallbackPolicy: [],
  };
  if ('childPolicy' in xds) {
    if (!Array.isArray(xds.childPolicy)) {
      throw new Error('Invalid xds config: invalid childPolicy');
    }
    for (const policy of xds.childPolicy) {
      xdsConfig.childPolicy.push(validateConfig(policy));
    }
  }
  if ('fallbackPolicy' in xds) {
    if (!Array.isArray(xds.fallbackPolicy)) {
      throw new Error('Invalid xds config: invalid fallbackPolicy');
    }
    for (const policy of xds.fallbackPolicy) {
      xdsConfig.fallbackPolicy.push(validateConfig(policy));
    }
  }
  return xdsConfig;
}

function validateGrpcLbConfig(grpclb: any): GrpcLbConfig {
  const grpcLbConfig: GrpcLbConfig = {
    childPolicy: [],
  };
  if ('childPolicy' in grpclb) {
    if (!Array.isArray(grpclb.childPolicy)) {
      throw new Error('Invalid xds config: invalid childPolicy');
    }
    for (const policy of grpclb.childPolicy) {
      grpcLbConfig.childPolicy.push(validateConfig(policy));
    }
  }
  return grpcLbConfig;
}

export function validateConfig(obj: any): LoadBalancingConfig {
  if ('round_robin' in obj) {
    if ('xds' in obj || 'grpclb' in obj) {
      throw new Error('Multiple load balancing policies configured');
    }
    if (obj['round_robin'] instanceof Object) {
      return {
        name: 'round_robin',
        round_robin: {},
      };
    }
  }
  if ('xds' in obj) {
    if ('grpclb' in obj) {
      throw new Error('Multiple load balancing policies configured');
    }
    return {
      name: 'xds',
      xds: validateXdsConfig(obj.xds),
    };
  }
  if ('grpclb' in obj) {
    return {
      name: 'grpclb',
      grpclb: validateGrpcLbConfig(obj.grpclb),
    };
  }
  throw new Error('No recognized load balancing policy configured');
}
