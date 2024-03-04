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

import { register } from "../src";
import assert = require("assert");
import { ControlPlaneServer } from "./xds-server";
import { XdsTestClient } from "./client";
import { FakeAggregateCluster, FakeDnsCluster, FakeEdsCluster, FakeRouteGroup, FakeServerRoute } from "./framework";
import { Backend, createBackends } from "./backend";

register();

describe('Cluster types', () => {
  let xdsServer: ControlPlaneServer;
  let client: XdsTestClient;
  beforeEach(done => {
    xdsServer = new ControlPlaneServer();
    xdsServer.startServer(error => {
      done(error);
    });
  });
  afterEach(() => {
    client?.close();
    xdsServer?.shutdownServer();
  });
  describe('Logical DNS Clusters', () => {
    it('Should successfully make RPCs', done => {
      createBackends(1).then(([backend]) => {
        const cluster = new FakeDnsCluster('dnsCluster', backend);
        const routeGroup = new FakeRouteGroup('listener1', 'route1', [{cluster: cluster}]);
        const serverRoute = new FakeServerRoute(backend.getPort(), 'serverRoute');
        xdsServer.setRdsResource(serverRoute.getRouteConfiguration());
        xdsServer.setLdsResource(serverRoute.getListener());
        xdsServer.addResponseListener((typeUrl, responseState) => {
          if (responseState.state === 'NACKED') {
            assert.fail(`Client NACKED ${typeUrl} resource with message ${responseState.errorMessage}`);
          }
        });
        routeGroup.startAllBackends(xdsServer).then(() => {
          xdsServer.setCdsResource(cluster.getClusterConfig());
          xdsServer.setRdsResource(routeGroup.getRouteConfiguration());
          xdsServer.setLdsResource(routeGroup.getListener());
          client = XdsTestClient.createFromServer('listener1', xdsServer);
          client.sendOneCall(error => {
            done(error);
          });
        }, reason => done(reason));
      }, reason => done(reason));
    });
  });
  /* These tests pass on Node 18 fail on Node 16, probably because of
   * https://github.com/nodejs/node/issues/42713 */
  describe.skip('Aggregate DNS Clusters', () => {
    it('Should result in prioritized clusters', async () => {
      const [backend1, backend2] = await createBackends(2, false);
      const cluster1 = new FakeEdsCluster('cluster1', 'endpoint1', [{backends: [backend1], locality:{region: 'region1'}}]);
      const cluster2 = new FakeEdsCluster('cluster2', 'endpoint2', [{backends: [backend2], locality:{region: 'region2'}}]);
      const aggregateCluster = new FakeAggregateCluster('aggregateCluster', [cluster1, cluster2]);
      const routeGroup = new FakeRouteGroup('listener1', 'route1', [{cluster: aggregateCluster}]);
      const serverRoute1 = new FakeServerRoute(backend1.getPort(), 'serverRoute1');
      xdsServer.setRdsResource(serverRoute1.getRouteConfiguration());
      xdsServer.setLdsResource(serverRoute1.getListener());
      const serverRoute2 = new FakeServerRoute(backend2.getPort(), 'serverRoute2');
      xdsServer.setRdsResource(serverRoute2.getRouteConfiguration());
      xdsServer.setLdsResource(serverRoute2.getListener());
      xdsServer.addResponseListener((typeUrl, responseState) => {
        if (responseState.state === 'NACKED') {
          client.stopCalls();
          assert.fail(`Client NACKED ${typeUrl} resource with message ${responseState.errorMessage}`);
        }
      });
      return routeGroup.startAllBackends(xdsServer).then(() => {
        xdsServer.setEdsResource(cluster1.getEndpointConfig());
        xdsServer.setCdsResource(cluster1.getClusterConfig());
        xdsServer.setEdsResource(cluster2.getEndpointConfig());
        xdsServer.setCdsResource(cluster2.getClusterConfig());
        xdsServer.setCdsResource(aggregateCluster.getClusterConfig());
        xdsServer.setRdsResource(routeGroup.getRouteConfiguration());
        xdsServer.setLdsResource(routeGroup.getListener());
        client = XdsTestClient.createFromServer('listener1', xdsServer);
        client.startCalls(100);
        return cluster1.waitForAllBackendsToReceiveTraffic();
      }).then(() => backend1.shutdownAsync()
      ).then(() => cluster2.waitForAllBackendsToReceiveTraffic()
      ).then(() => backend1.startAsync(xdsServer)
      ).then(() => cluster1.waitForAllBackendsToReceiveTraffic());
    });
    it('Should handle a diamond dependency', async () => {
      const [backend1, backend2] = await createBackends(2);
      const cluster1 = new FakeEdsCluster('cluster1', 'endpoint1', [{backends: [backend1], locality:{region: 'region1'}}]);
      const cluster2 = new FakeEdsCluster('cluster2', 'endpoint2', [{backends: [backend2], locality:{region: 'region2'}}]);
      const aggregateCluster1 = new FakeAggregateCluster('aggregateCluster1', [cluster1, cluster2]);
      const aggregateCluster2 = new FakeAggregateCluster('aggregateCluster2', [cluster1, aggregateCluster1]);
      const routeGroup = new FakeRouteGroup('listener1', 'route1', [{cluster: aggregateCluster2}]);
      const serverRoute1 = new FakeServerRoute(backend1.getPort(), 'serverRoute1');
      xdsServer.setRdsResource(serverRoute1.getRouteConfiguration());
      xdsServer.setLdsResource(serverRoute1.getListener());
      const serverRoute2 = new FakeServerRoute(backend2.getPort(), 'serverRoute2');
      xdsServer.setRdsResource(serverRoute2.getRouteConfiguration());
      xdsServer.setLdsResource(serverRoute2.getListener());
      xdsServer.addResponseListener((typeUrl, responseState) => {
        if (responseState.state === 'NACKED') {
          client.stopCalls();
          assert.fail(`Client NACKED ${typeUrl} resource with message ${responseState.errorMessage}`);
        }
      });
      return Promise.all([backend1.startAsync(xdsServer), backend2.startAsync(xdsServer)]).then(() => {
        xdsServer.setEdsResource(cluster1.getEndpointConfig());
        xdsServer.setCdsResource(cluster1.getClusterConfig());
        xdsServer.setEdsResource(cluster2.getEndpointConfig());
        xdsServer.setCdsResource(cluster2.getClusterConfig());
        xdsServer.setCdsResource(aggregateCluster1.getClusterConfig());
        xdsServer.setCdsResource(aggregateCluster2.getClusterConfig());
        xdsServer.setRdsResource(routeGroup.getRouteConfiguration());
        xdsServer.setLdsResource(routeGroup.getListener());
        client = XdsTestClient.createFromServer('listener1', xdsServer);
        client.startCalls(100);
        return cluster1.waitForAllBackendsToReceiveTraffic();
      }).then(() => backend1.shutdownAsync()
      ).then(() => cluster2.waitForAllBackendsToReceiveTraffic()
      ).then(() => backend1.startAsync(xdsServer)
      ).then(() => cluster1.waitForAllBackendsToReceiveTraffic());
    });
    it('Should handle EDS then DNS cluster order', async () => {
      const [backend1, backend2] = await createBackends(2);
      const cluster1 = new FakeEdsCluster('cluster1', 'endpoint1', [{backends: [backend1], locality:{region: 'region1'}}]);
      const cluster2 = new FakeDnsCluster('cluster2', backend2);
      const aggregateCluster = new FakeAggregateCluster('aggregateCluster', [cluster1, cluster2]);
      const routeGroup = new FakeRouteGroup('listener1', 'route1', [{cluster: aggregateCluster}]);
      const serverRoute1 = new FakeServerRoute(backend1.getPort(), 'serverRoute1');
      xdsServer.setRdsResource(serverRoute1.getRouteConfiguration());
      xdsServer.setLdsResource(serverRoute1.getListener());
      const serverRoute2 = new FakeServerRoute(backend2.getPort(), 'serverRoute2');
      xdsServer.setRdsResource(serverRoute2.getRouteConfiguration());
      xdsServer.setLdsResource(serverRoute2.getListener());
      return routeGroup.startAllBackends(xdsServer).then(() => {
        xdsServer.setEdsResource(cluster1.getEndpointConfig());
        xdsServer.setCdsResource(cluster1.getClusterConfig());
        xdsServer.setCdsResource(cluster2.getClusterConfig());
        xdsServer.setCdsResource(aggregateCluster.getClusterConfig());
        xdsServer.setRdsResource(routeGroup.getRouteConfiguration());
        xdsServer.setLdsResource(routeGroup.getListener());
        client = XdsTestClient.createFromServer('listener1', xdsServer);
        client.startCalls(100);
        return cluster1.waitForAllBackendsToReceiveTraffic();
      }).then(() => backend1.shutdownAsync()
      ).then(() => cluster2.waitForAllBackendsToReceiveTraffic()
      ).then(() => backend1.startAsync(xdsServer)
      ).then(() => cluster1.waitForAllBackendsToReceiveTraffic());
    });
    it('Should handle DNS then EDS cluster order', async () => {
      const [backend1, backend2] = await createBackends(2);
      const cluster1 = new FakeDnsCluster('cluster1', backend1);
      const cluster2 = new FakeEdsCluster('cluster2', 'endpoint2', [{backends: [backend2], locality:{region: 'region2'}}]);
      const aggregateCluster = new FakeAggregateCluster('aggregateCluster', [cluster1, cluster2]);
      const routeGroup = new FakeRouteGroup('listener1', 'route1', [{cluster: aggregateCluster}]);
      const serverRoute1 = new FakeServerRoute(backend1.getPort(), 'serverRoute1');
      xdsServer.setRdsResource(serverRoute1.getRouteConfiguration());
      xdsServer.setLdsResource(serverRoute1.getListener());
      const serverRoute2 = new FakeServerRoute(backend2.getPort(), 'serverRoute2');
      xdsServer.setRdsResource(serverRoute2.getRouteConfiguration());
      xdsServer.setLdsResource(serverRoute2.getListener());
      xdsServer.addResponseListener((typeUrl, responseState) => {
        if (responseState.state === 'NACKED') {
          client.stopCalls();
          assert.fail(`Client NACKED ${typeUrl} resource with message ${responseState.errorMessage}`);
        }
      });
      return routeGroup.startAllBackends(xdsServer).then(() => {
        xdsServer.setCdsResource(cluster1.getClusterConfig());
        xdsServer.setEdsResource(cluster2.getEndpointConfig());
        xdsServer.setCdsResource(cluster2.getClusterConfig());
        xdsServer.setCdsResource(aggregateCluster.getClusterConfig());
        xdsServer.setRdsResource(routeGroup.getRouteConfiguration());
        xdsServer.setLdsResource(routeGroup.getListener());
        client = XdsTestClient.createFromServer('listener1', xdsServer);
        client.startCalls(100);
        return cluster1.waitForAllBackendsToReceiveTraffic();
      }).then(() => backend1.shutdownAsync()
      ).then(() => cluster2.waitForAllBackendsToReceiveTraffic()
      ).then(() => backend1.startAsync(xdsServer)
      ).then(() => cluster1.waitForAllBackendsToReceiveTraffic());
    });
  });
});
