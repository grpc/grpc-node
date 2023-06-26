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

import { ClusterLoadAssignment } from "../src/generated/envoy/config/endpoint/v3/ClusterLoadAssignment";
import { Cluster } from "../src/generated/envoy/config/cluster/v3/Cluster";
import { Backend } from "./backend";
import { Locality } from "../src/generated/envoy/config/core/v3/Locality";
import { RouteConfiguration } from "../src/generated/envoy/config/route/v3/RouteConfiguration";
import { Route } from "../src/generated/envoy/config/route/v3/Route";
import { Listener } from "../src/generated/envoy/config/listener/v3/Listener";
import { HttpConnectionManager } from "../src/generated/envoy/extensions/filters/network/http_connection_manager/v3/HttpConnectionManager";
import { AnyExtension } from "@grpc/proto-loader";
import { CLUSTER_CONFIG_TYPE_URL, HTTP_CONNECTION_MANGER_TYPE_URL } from "../src/resources";
import { LocalityLbEndpoints } from "../src/generated/envoy/config/endpoint/v3/LocalityLbEndpoints";
import { LbEndpoint } from "../src/generated/envoy/config/endpoint/v3/LbEndpoint";
import { ClusterConfig } from "../src/generated/envoy/extensions/clusters/aggregate/v3/ClusterConfig";

interface Endpoint {
  locality: Locality;
  backends: Backend[];
  weight?: number;
  priority?: number;
}

function getLbEndpoint(backend: Backend): LbEndpoint {
  return {
    health_status: "HEALTHY",
    endpoint: {
      address: {
        socket_address: {
          address: '::1',
          port_value: backend.getPort()
        }
      }
    }
  };
}

function getLocalityLbEndpoints(endpoint: Endpoint): LocalityLbEndpoints {
  return {
    lb_endpoints: endpoint.backends.map(getLbEndpoint),
    locality: endpoint.locality,
    load_balancing_weight: {value: endpoint.weight ?? 1},
    priority: endpoint.priority ?? 0
  }
}

export interface FakeCluster {
  getClusterConfig(): Cluster;
  getAllClusterConfigs(): Cluster[];
  getName(): string;
  startAllBackends(): Promise<any>;
  haveAllBackendsReceivedTraffic(): boolean;
  waitForAllBackendsToReceiveTraffic(): Promise<void>;
}

export class FakeEdsCluster implements FakeCluster {
  constructor(private clusterName: string, private endpointName: string, private endpoints: Endpoint[]) {}

  getEndpointConfig(): ClusterLoadAssignment {
    return {
      cluster_name: this.endpointName,
      endpoints: this.endpoints.map(getLocalityLbEndpoints)
    };
  }

  getClusterConfig(): Cluster {
    return {
      name: this.clusterName,
      type: 'EDS',
      eds_cluster_config: {eds_config: {ads: {}}, service_name: this.endpointName},
      lb_policy: 'ROUND_ROBIN'
    }
  }

  getAllClusterConfigs(): Cluster[] {
    return [this.getClusterConfig()];
  }

  getName() {
    return this.clusterName;
  }

  startAllBackends(): Promise<any> {
    return Promise.all(this.endpoints.map(endpoint => Promise.all(endpoint.backends.map(backend => backend.startAsync()))));
  }

  haveAllBackendsReceivedTraffic(): boolean {
    for (const endpoint of this.endpoints) {
      for (const backend of endpoint.backends) {
        if (backend.getCallCount() < 1) {
          return false;
        }
      }
    }
    return true;
  }

  waitForAllBackendsToReceiveTraffic(): Promise<void> {
    for (const endpoint of this.endpoints) {
      for (const backend of endpoint.backends) {
        backend.resetCallCount();
      }
    }
    return new Promise((resolve, reject) => {
      let finishedPromise = false;
      for (const endpoint of this.endpoints) {
        for (const backend of endpoint.backends) {
          backend.onCall(() => {
            if (finishedPromise) {
              return;
            }
            if (this.haveAllBackendsReceivedTraffic()) {
              finishedPromise = true;
              resolve();
            }
          });
        }
      }
    });
  }
}

export class FakeDnsCluster implements FakeCluster {
  constructor(private name: string, private backend: Backend) {}

  getClusterConfig(): Cluster {
    return {
      name: this.name,
      type: 'LOGICAL_DNS',
      lb_policy: 'ROUND_ROBIN',
      load_assignment: {
        endpoints: [{
          lb_endpoints: [{
            endpoint: {
              address: {
                socket_address: {
                  address: 'localhost',
                  port_value: this.backend.getPort()
                }
              }
            }
          }]
        }]
      }
    };
  }
  getAllClusterConfigs(): Cluster[] {
    return [this.getClusterConfig()];
  }
  getName(): string {
    return this.name;
  }
  startAllBackends(): Promise<any> {
    return this.backend.startAsync();
  }
  haveAllBackendsReceivedTraffic(): boolean {
    return this.backend.getCallCount() > 0;
  }
  waitForAllBackendsToReceiveTraffic(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.backend.onCall(resolve);
    });
  }
}

export class FakeAggregateCluster implements FakeCluster {
  constructor(private name: string, private children: FakeCluster[]) {}

  getClusterConfig(): Cluster {
    const clusterConfig: ClusterConfig & AnyExtension = {
      '@type': CLUSTER_CONFIG_TYPE_URL,
      clusters: this.children.map(child => child.getName())
    };
    return {
      name: this.name,
      lb_policy: 'ROUND_ROBIN',
      cluster_type: {
        typed_config: clusterConfig
      }
    }
  }
  getAllClusterConfigs(): Cluster[] {
    const allConfigs = [this.getClusterConfig()];
    for (const child of this.children) {
      allConfigs.push(...child.getAllClusterConfigs());
    }
    return allConfigs;
  }
  getName(): string {
    return this.name;
  }
  startAllBackends(): Promise<any> {
    return Promise.all(this.children.map(child => child.startAllBackends()));
  }
  haveAllBackendsReceivedTraffic(): boolean {
    for (const child of this.children) {
      if (!child.haveAllBackendsReceivedTraffic()) {
        return false;
      }
    }
    return true;
  }
  waitForAllBackendsToReceiveTraffic(): Promise<void> {
    return Promise.all(this.children.map(child => child.waitForAllBackendsToReceiveTraffic())).then(() => {});
  }
}

interface FakeRoute {
  cluster?: FakeCluster;
  weightedClusters?: [{cluster: FakeCluster, weight: number}];
}

function createRouteConfig(route: FakeRoute): Route {
  if (route.cluster) {
    return {
      match: {
        prefix: ''
      },
      route: {
        cluster: route.cluster.getName()
      }
    };
  } else {
    return {
      match: {
        prefix: ''
      },
      route: {
        weighted_clusters: {
          clusters: route.weightedClusters!.map(clusterWeight => ({
            name: clusterWeight.cluster.getName(),
            weight: {value: clusterWeight.weight}
          }))
        }
      }
    }
  }
}

export class FakeRouteGroup {
  constructor(private listenerName: string, private routeName: string, private routes: FakeRoute[]) {}

  getRouteConfiguration(): RouteConfiguration {
    return {
      name: this.routeName,
      virtual_hosts: [{
        domains: ['*'],
        routes: this.routes.map(createRouteConfig)
      }]
    };
  }

  getListener(): Listener {
    const httpConnectionManager: HttpConnectionManager & AnyExtension = {
      '@type': HTTP_CONNECTION_MANGER_TYPE_URL,
      rds: {
        route_config_name: this.routeName,
        config_source: {ads: {}}
      }
    }
    return {
      name: this.listenerName,
      api_listener: {
        api_listener: httpConnectionManager
      }
    };
  }

  startAllBackends(): Promise<any> {
    return Promise.all(this.routes.map(route => {
      if (route.cluster) {
        return route.cluster.startAllBackends();
      } else if (route.weightedClusters) {
        return Promise.all(route.weightedClusters.map(clusterWeight => clusterWeight.cluster.startAllBackends()));
      } else {
        return Promise.resolve();
      }
    }));
  }

  haveAllBackendsReceivedTraffic(): boolean {
    for (const route of this.routes) {
      if (route.cluster) {
        return route.cluster.haveAllBackendsReceivedTraffic();
      } else if (route.weightedClusters) {
        for (const weightedCluster of route.weightedClusters) {
          if (!weightedCluster.cluster.haveAllBackendsReceivedTraffic()) {
            return false;
          }
        }
      }
    }
    return true;
  }

  waitForAllBackendsToReceiveTraffic(): Promise<any> {
    return Promise.all(this.routes.map(route => {
      if (route.cluster) {
        return route.cluster.waitForAllBackendsToReceiveTraffic();
      } else if (route.weightedClusters) {
        return Promise.all(route.weightedClusters.map(clusterWeight => clusterWeight.cluster.waitForAllBackendsToReceiveTraffic())).then(() => {});
      } else {
        return Promise.resolve();
      }
    }));
  }
}
