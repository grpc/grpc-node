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

import { experimental } from '@grpc/grpc-js';
import Duration = experimental.Duration;
import Filter = experimental.Filter;
import FilterFactory = experimental.FilterFactory;
import MethodConfig = experimental.MethodConfig;

export interface ClusterResult {
  name: string;
  methodConfig: MethodConfig;
  dynamicFilterFactories: FilterFactory<Filter>[];
}

export interface RouteAction {
  toString(): string;
  getCluster(): ClusterResult;
}

function durationToLogString(duration: Duration) {
  const millis = Math.floor(duration.nanos / 1_000_000);
  if (millis > 0) {
    return duration.seconds + '.' + millis;
  } else {
    return '' + duration.seconds;
  }
}

export class SingleClusterRouteAction implements RouteAction {
  constructor(private cluster: string, private methodConfig: MethodConfig, private extraFilterFactories: FilterFactory<Filter>[]) {}

  getCluster() {
    return {
      name: this.cluster,
      methodConfig: this.methodConfig,
      dynamicFilterFactories: this.extraFilterFactories
    };
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
  constructor(private clusters: WeightedCluster[], private totalWeight: number, private methodConfig: MethodConfig) {
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

  toString() {
    const clusterListString = this.clusters.map(({name, weight}) => '(' + name + ':' + weight + ')').join(', ')
    return 'WeightedCluster(' + clusterListString + ', ' + JSON.stringify(this.methodConfig) + ')';
  }
}