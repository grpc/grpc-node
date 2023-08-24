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

import { LoadBalancingConfig, experimental, logVerbosity } from "@grpc/grpc-js";
import { LoadBalancingPolicy__Output } from "./generated/envoy/config/cluster/v3/LoadBalancingPolicy";
import { TypedExtensionConfig__Output } from "./generated/envoy/config/core/v3/TypedExtensionConfig";

const TRACER_NAME = 'lb_policy_registry';
function trace(text: string) {
  experimental.trace(logVerbosity.DEBUG, TRACER_NAME, text);
}

const MAX_RECURSION_DEPTH = 16;

/**
 * Parse a protoPolicy to a LoadBalancingConfig. A null return value indicates
 * that parsing failed, but that it should not be treated as an error, and
 * instead the next policy should be used.
 */
interface ProtoLbPolicyConverter {
  (protoPolicy: TypedExtensionConfig__Output, selectChildPolicy: (childPolicy: LoadBalancingPolicy__Output) => LoadBalancingConfig): LoadBalancingConfig | null;
}

interface RegisteredLbPolicy {
  convertToLoadBalancingPolicy: ProtoLbPolicyConverter;
}

const registry: {[typeUrl: string]: RegisteredLbPolicy} = {}

export function registerLbPolicy(typeUrl: string, converter: ProtoLbPolicyConverter) {
  registry[typeUrl] = {convertToLoadBalancingPolicy: converter};
}

export function convertToLoadBalancingConfig(protoPolicy: LoadBalancingPolicy__Output, recursionDepth = 0): LoadBalancingConfig {
  trace('Registry entries: [' + Object.keys(registry) + ']');
  if (recursionDepth > MAX_RECURSION_DEPTH) {
    throw new Error(`convertToLoadBalancingConfig: Max recursion depth ${MAX_RECURSION_DEPTH} reached`);
  }
  for (const policyCandidate of protoPolicy.policies) {
    trace('Attempting to parse config ' + JSON.stringify(policyCandidate));
    const extensionConfig = policyCandidate.typed_extension_config;
    if (!extensionConfig?.typed_config) {
      continue;
    }
    const typeUrl = extensionConfig.typed_config.type_url;
    trace('Attempting to parse config with type_url=' + typeUrl);
    let parseResult: LoadBalancingConfig | null;
    if (typeUrl in registry) {
      try {
        parseResult = registry[typeUrl].convertToLoadBalancingPolicy(extensionConfig, childPolicy => convertToLoadBalancingConfig(childPolicy, recursionDepth + 1));
      } catch (e) {
        throw new Error(`Error parsing ${typeUrl} LoadBalancingPolicy named ${extensionConfig.name}: ${(e as Error).message}`);
      }
      if (parseResult) {
        return parseResult;
      } else {
        continue;
      }
    }
  }
  throw new Error('No registered LB policy found in list');
}
