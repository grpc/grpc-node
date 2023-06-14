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
import { XdsServer } from "./xds-server";
import { XdsTestClient } from "./client";
import { FakeAggregateCluster, FakeDnsCluster, FakeEdsCluster, FakeRouteGroup } from "./framework";
import { Backend } from "./backend";

register();

describe('Cluster types', () => {
  let xdsServer: XdsServer;
  let client: XdsTestClient;
  beforeEach(done => {
    xdsServer = new XdsServer();
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
      const cluster = new FakeDnsCluster('dnsCluster', new Backend());
      const routeGroup = new FakeRouteGroup('listener1', 'route1', [{cluster: cluster}]);
      routeGroup.startAllBackends().then(() => {
        xdsServer.addResponseListener((typeUrl, responseState) => {
          if (responseState.state === 'NACKED') {
            assert.fail(`Client NACKED ${typeUrl} resource with message ${responseState.errorMessage}`);
          }
        });
        xdsServer.setCdsResource(cluster.getClusterConfig());
        xdsServer.setRdsResource(routeGroup.getRouteConfiguration());
        xdsServer.setLdsResource(routeGroup.getListener());
        client = XdsTestClient.createFromServer('listener1', xdsServer);
        client.sendOneCall(error => {
          done(error);
        });
      }, reason => done(reason));
    });
  });
  /* These tests pass on Node 18 fail on Node 16, probably because of
   * https://github.com/nodejs/node/issues/42713 */
  describe.skip('Aggregate DNS Clusters', () => {
    it('Should result in prioritized clusters', () => {
      const backend1 = new Backend();
      const backend2 = new Backend();
      const cluster1 = new FakeEdsCluster('cluster1', 'endpoint1', [{backends: [backend1], locality:{region: 'region1'}}]);
      const cluster2 = new FakeEdsCluster('cluster2', 'endpoint2', [{backends: [backend2], locality:{region: 'region2'}}]);
      const aggregateCluster = new FakeAggregateCluster('aggregateCluster', [cluster1, cluster2]);
      const routeGroup = new FakeRouteGroup('listener1', 'route1', [{cluster: aggregateCluster}]);
      return routeGroup.startAllBackends().then(() => {
        xdsServer.setEdsResource(cluster1.getEndpointConfig());
        xdsServer.setCdsResource(cluster1.getClusterConfig());
        xdsServer.setEdsResource(cluster2.getEndpointConfig());
        xdsServer.setCdsResource(cluster2.getClusterConfig());
        xdsServer.setCdsResource(aggregateCluster.getClusterConfig());
        xdsServer.setRdsResource(routeGroup.getRouteConfiguration());
        xdsServer.setLdsResource(routeGroup.getListener());
        xdsServer.addResponseListener((typeUrl, responseState) => {
          if (responseState.state === 'NACKED') {
            client.stopCalls();
            assert.fail(`Client NACKED ${typeUrl} resource with message ${responseState.errorMessage}`);
          }
        });
        client = XdsTestClient.createFromServer('listener1', xdsServer);
        client.startCalls(100);
        return cluster1.waitForAllBackendsToReceiveTraffic();
      }).then(() => backend1.shutdownAsync()
      ).then(() => cluster2.waitForAllBackendsToReceiveTraffic()
      ).then(() => backend1.startAsync()
      ).then(() => cluster1.waitForAllBackendsToReceiveTraffic());
    });
    it('Should handle a diamond dependency', () => {
      const backend1 = new Backend();
      const backend2 = new Backend();
      const cluster1 = new FakeEdsCluster('cluster1', 'endpoint1', [{backends: [backend1], locality:{region: 'region1'}}]);
      const cluster2 = new FakeEdsCluster('cluster2', 'endpoint2', [{backends: [backend2], locality:{region: 'region2'}}]);
      const aggregateCluster1 = new FakeAggregateCluster('aggregateCluster1', [cluster1, cluster2]);
      const aggregateCluster2 = new FakeAggregateCluster('aggregateCluster2', [cluster1, aggregateCluster1]);
      const routeGroup = new FakeRouteGroup('listener1', 'route1', [{cluster: aggregateCluster2}]);
      return Promise.all([backend1.startAsync(), backend2.startAsync()]).then(() => {
        xdsServer.setEdsResource(cluster1.getEndpointConfig());
        xdsServer.setCdsResource(cluster1.getClusterConfig());
        xdsServer.setEdsResource(cluster2.getEndpointConfig());
        xdsServer.setCdsResource(cluster2.getClusterConfig());
        xdsServer.setCdsResource(aggregateCluster1.getClusterConfig());
        xdsServer.setCdsResource(aggregateCluster2.getClusterConfig());
        xdsServer.setRdsResource(routeGroup.getRouteConfiguration());
        xdsServer.setLdsResource(routeGroup.getListener());
        xdsServer.addResponseListener((typeUrl, responseState) => {
          if (responseState.state === 'NACKED') {
            client.stopCalls();
            assert.fail(`Client NACKED ${typeUrl} resource with message ${responseState.errorMessage}`);
          }
        });
        client = XdsTestClient.createFromServer('listener1', xdsServer);
        client.startCalls(100);
        return cluster1.waitForAllBackendsToReceiveTraffic();
      }).then(() => backend1.shutdownAsync()
      ).then(() => cluster2.waitForAllBackendsToReceiveTraffic()
      ).then(() => backend1.startAsync()
      ).then(() => cluster1.waitForAllBackendsToReceiveTraffic());
    });
    it('Should handle EDS then DNS cluster order', () => {
      const backend1 = new Backend();
      const backend2 = new Backend();
      const cluster1 = new FakeEdsCluster('cluster1', 'endpoint1', [{backends: [backend1], locality:{region: 'region1'}}]);
      const cluster2 = new FakeDnsCluster('cluster2', backend2);
      const aggregateCluster = new FakeAggregateCluster('aggregateCluster', [cluster1, cluster2]);
      const routeGroup = new FakeRouteGroup('listener1', 'route1', [{cluster: aggregateCluster}]);
      return routeGroup.startAllBackends().then(() => {
        xdsServer.setEdsResource(cluster1.getEndpointConfig());
        xdsServer.setCdsResource(cluster1.getClusterConfig());
        xdsServer.setCdsResource(cluster2.getClusterConfig());
        xdsServer.setCdsResource(aggregateCluster.getClusterConfig());
        xdsServer.setRdsResource(routeGroup.getRouteConfiguration());
        xdsServer.setLdsResource(routeGroup.getListener());
        xdsServer.addResponseListener((typeUrl, responseState) => {
          if (responseState.state === 'NACKED') {
            client.stopCalls();
            assert.fail(`Client NACKED ${typeUrl} resource with message ${responseState.errorMessage}`);
          }
        });
        client = XdsTestClient.createFromServer('listener1', xdsServer);
        client.startCalls(100);
        return cluster1.waitForAllBackendsToReceiveTraffic();
      }).then(() => backend1.shutdownAsync()
      ).then(() => cluster2.waitForAllBackendsToReceiveTraffic()
      ).then(() => backend1.startAsync()
      ).then(() => cluster1.waitForAllBackendsToReceiveTraffic());
    });
    it('Should handle DNS then EDS cluster order', () => {
      const backend1 = new Backend();
      const backend2 = new Backend();
      const cluster1 = new FakeDnsCluster('cluster1', backend1);
      const cluster2 = new FakeEdsCluster('cluster2', 'endpoint2', [{backends: [backend2], locality:{region: 'region2'}}]);
      const aggregateCluster = new FakeAggregateCluster('aggregateCluster', [cluster1, cluster2]);
      const routeGroup = new FakeRouteGroup('listener1', 'route1', [{cluster: aggregateCluster}]);
      return routeGroup.startAllBackends().then(() => {
        xdsServer.setCdsResource(cluster1.getClusterConfig());
        xdsServer.setEdsResource(cluster2.getEndpointConfig());
        xdsServer.setCdsResource(cluster2.getClusterConfig());
        xdsServer.setCdsResource(aggregateCluster.getClusterConfig());
        xdsServer.setRdsResource(routeGroup.getRouteConfiguration());
        xdsServer.setLdsResource(routeGroup.getListener());
        xdsServer.addResponseListener((typeUrl, responseState) => {
          if (responseState.state === 'NACKED') {
            client.stopCalls();
            assert.fail(`Client NACKED ${typeUrl} resource with message ${responseState.errorMessage}`);
          }
        });
        client = XdsTestClient.createFromServer('listener1', xdsServer);
        client.startCalls(100);
        return cluster1.waitForAllBackendsToReceiveTraffic();
      }).then(() => backend1.shutdownAsync()
      ).then(() => cluster2.waitForAllBackendsToReceiveTraffic()
      ).then(() => backend1.startAsync()
      ).then(() => cluster1.waitForAllBackendsToReceiveTraffic());
    });
  });
});
