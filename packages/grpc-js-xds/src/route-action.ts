/*
 * Copyright 2021 gRPC authors.
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
 */

import { Metadata, MethodConfig, experimental } from '@grpc/grpc-js';
import Duration = experimental.Duration;
import Filter = experimental.Filter;
import FilterFactory = experimental.FilterFactory;
import { RE2 } from 're2-wasm';
import { xxhashApi } from './xxhash';

export interface ClusterResult {
  name: string;
  methodConfig: MethodConfig;
  dynamicFilterFactories: FilterFactory<Filter>[];
}

export interface RouteAction {
  toString(): string;
  getCluster(): ClusterResult;
  getHash(metadata: Metadata, channelId: number): bigint;
}

function durationToLogString(duration: Duration) {
  const millis = Math.floor(duration.nanos / 1_000_000);
  if (millis > 0) {
    return duration.seconds + '.' + millis;
  } else {
    return '' + duration.seconds;
  }
}

export interface HashPolicy {
  type: 'HEADER' | 'CHANNEL_ID';
  terminal: boolean;
  headerName?: string;
  regex?: RE2;
  regexSubstitution?: string;
}

/**
 * Must be called only after xxhash.loadXxhashApi() resolves.
 * @param hashPolicies
 * @param metadata
 * @param channelId
 */
function getHash(hashPolicies: HashPolicy[], metadata: Metadata, channelId: number): bigint {
  let hash: bigint | null = null;
  for (const policy of hashPolicies) {
    let newHash: bigint | null = null;
    switch (policy.type) {
      case 'CHANNEL_ID':
        newHash = xxhashApi!.h64(`${channelId}`, 0n);
        break;
      case 'HEADER': {
        if (!policy.headerName) {
          break;
        }
        if (policy.headerName.endsWith('-bin')) {
          break;
        }
        let headerString: string;
        if (policy.headerName === 'content-type') {
          headerString = 'application/grpc';
        } else {
          const headerValues = metadata.get(policy.headerName);
          if (headerValues.length === 0) {
            break;
          }
          headerString = headerValues.join(',');
        }
        let rewrittenHeaderString = headerString;
        if (policy.regex && policy.regexSubstitution) {
          /* The JS string replace method uses $-prefixed patterns to produce
           * other strings. See
           * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace#specifying_a_string_as_the_replacement
           * RE2-based regex substitutions use \n where n is a number to refer
           * to capture group n, and they otherwise have no special replacement
           * patterns. See
           * https://github.com/envoyproxy/envoy/blob/2443032526cf6e50d63d35770df9473dd0460fc0/api/envoy/type/matcher/v3/regex.proto#L79-L87
           * We convert an RE2 regex substitution into a string substitution by
           * first replacing each "$" with "$$" (which produces "$" in the
           * output), and then replace each "\n" for any whole number n with
           * "$n". */
          const regexSubstitution = policy.regexSubstitution.replace(/\$/g, '$$$$').replace(/\\(\d+)/g, '$$$1');
          rewrittenHeaderString = headerString.replace(policy.regex, regexSubstitution);
        }
        newHash = xxhashApi!.h64(rewrittenHeaderString, 0n);
        break;
      }
    }
    if (hash === null) {
      hash = newHash;
    } else if (newHash !== null) {
      hash = ((hash << 1n) | (hash >> 63n)) ^ newHash;
    }
    if (policy.terminal && hash !== null) {
      break;
    }
  }
  if (hash === null) {
    return xxhashApi!.h64(`${Math.random()}`, 0n);
  } else {
    return hash;
  }
}

export class SingleClusterRouteAction implements RouteAction {
  constructor(private cluster: string, private methodConfig: MethodConfig, private extraFilterFactories: FilterFactory<Filter>[], private hashPolicies: HashPolicy[]) {}

  getCluster() {
    return {
      name: this.cluster,
      methodConfig: this.methodConfig,
      dynamicFilterFactories: this.extraFilterFactories
    };
  }

  getHash(metadata: Metadata, channelId: number): bigint {
    return getHash(this.hashPolicies, metadata, channelId);
  }

  toString() {
    return 'SingleCluster(' + this.cluster + ', ' + JSON.stringify(this.methodConfig) + ')';
  }
}

export interface WeightedCluster {
  name: string;
  weight: number;
  dynamicFilterFactories: FilterFactory<Filter>[];
}

interface ClusterChoice {
  name: string;
  numerator: number;
  dynamicFilterFactories: FilterFactory<Filter>[];
}

export class WeightedClusterRouteAction implements RouteAction {
  /**
   * The weighted cluster choices represented as a CDF
   */
  private clusterChoices: ClusterChoice[];
  constructor(private clusters: WeightedCluster[], private totalWeight: number, private methodConfig: MethodConfig, private hashPolicies: HashPolicy[]) {
    this.clusterChoices = [];
    let lastNumerator = 0;
    for (const clusterWeight of clusters) {
      lastNumerator += clusterWeight.weight;
      this.clusterChoices.push({name: clusterWeight.name, numerator: lastNumerator, dynamicFilterFactories: clusterWeight.dynamicFilterFactories});
    }
  }

  getCluster() {
    const randomNumber = Math.random() * this.totalWeight;
    for (const choice of this.clusterChoices) {
      if (randomNumber < choice.numerator) {
        return {
          name: choice.name,
          methodConfig: this.methodConfig,
          dynamicFilterFactories: choice.dynamicFilterFactories
        };
      }
    }
    // This should be prevented by the validation rules
    return {name: '', methodConfig: this.methodConfig, dynamicFilterFactories: []};
  }

  getHash(metadata: Metadata, channelId: number): bigint {
    return getHash(this.hashPolicies, metadata, channelId);
  }

  toString() {
    const clusterListString = this.clusters.map(({name, weight}) => '(' + name + ':' + weight + ')').join(', ')
    return 'WeightedCluster(' + clusterListString + ', ' + JSON.stringify(this.methodConfig) + ')';
  }
}
