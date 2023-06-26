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

import * as assert from 'assert';
import { register } from "../src";
import { Cluster } from '../src/generated/envoy/config/cluster/v3/Cluster';
import { Backend } from "./backend";
import { XdsTestClient } from "./client";
import { FakeEdsCluster, FakeRouteGroup } from "./framework";
import { XdsServer } from "./xds-server";

register();

describe('Validation errors', () => {
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
  it('Should continue to use a valid resource after receiving an invalid EDS update', done => {
    const cluster = new FakeEdsCluster('cluster1', 'endpoint1', [{backends: [new Backend()], locality: {region: 'region1'}}]);
    const routeGroup = new FakeRouteGroup('listener1', 'route1', [{cluster: cluster}]);
    routeGroup.startAllBackends().then(() => {
      xdsServer.setEdsResource(cluster.getEndpointConfig());
      xdsServer.setCdsResource(cluster.getClusterConfig());
      xdsServer.setRdsResource(routeGroup.getRouteConfiguration());
      xdsServer.setLdsResource(routeGroup.getListener());
      client = XdsTestClient.createFromServer('listener1', xdsServer);
      client.startCalls(100);
      routeGroup.waitForAllBackendsToReceiveTraffic().then(() => {
        // After backends receive calls, set invalid EDS resource
        const invalidEdsResource = {cluster_name: cluster.getEndpointConfig().cluster_name, endpoints: [{}]};
        xdsServer.setEdsResource(invalidEdsResource);
        let seenNack = false;
        xdsServer.addResponseListener((typeUrl, responseState) => {
          if (responseState.state === 'NACKED') {
            if (seenNack) {
              return;
            }
            seenNack = true;
            routeGroup.waitForAllBackendsToReceiveTraffic().then(() => {
              client.stopCalls();
              done();
            });
          }
        });
      }, reason => done(reason));
    }, reason => done(reason));
  });
  it('Should continue to use a valid resource after receiving an invalid CDS update', done => {
    const cluster = new FakeEdsCluster('cluster1', 'endpoint1', [{backends: [new Backend()], locality: {region: 'region1'}}]);
    const routeGroup = new FakeRouteGroup('listener1', 'route1', [{cluster: cluster}]);
    routeGroup.startAllBackends().then(() => {
      xdsServer.setEdsResource(cluster.getEndpointConfig());
      xdsServer.setCdsResource(cluster.getClusterConfig());
      xdsServer.setRdsResource(routeGroup.getRouteConfiguration());
      xdsServer.setLdsResource(routeGroup.getListener());
      client = XdsTestClient.createFromServer('listener1', xdsServer);
      client.startCalls(100);
      routeGroup.waitForAllBackendsToReceiveTraffic().then(() => {
        // After backends receive calls, set invalid CDS resource
        const invalidCdsResource: Cluster = {name: cluster.getClusterConfig().name, type: 'EDS'};
        xdsServer.setCdsResource(invalidCdsResource);
        let seenNack = false;
        xdsServer.addResponseListener((typeUrl, responseState) => {
          if (responseState.state === 'NACKED') {
            if (seenNack) {
              return;
            }
            seenNack = true;
            routeGroup.waitForAllBackendsToReceiveTraffic().then(() => {
              client.stopCalls();
              done();
            });
          }
        });
      }, reason => done(reason));
    }, reason => done(reason));
  });
  it('Should continue to use a valid resource after receiving an invalid RDS update', done => {
    const cluster = new FakeEdsCluster('cluster1', 'endpoint1', [{backends: [new Backend()], locality: {region: 'region1'}}]);
    const routeGroup = new FakeRouteGroup('listener1', 'route1', [{cluster: cluster}]);
    routeGroup.startAllBackends().then(() => {
      xdsServer.setEdsResource(cluster.getEndpointConfig());
      xdsServer.setCdsResource(cluster.getClusterConfig());
      xdsServer.setRdsResource(routeGroup.getRouteConfiguration());
      xdsServer.setLdsResource(routeGroup.getListener());
      client = XdsTestClient.createFromServer('listener1', xdsServer);
      client.startCalls(100);
      routeGroup.waitForAllBackendsToReceiveTraffic().then(() => {
        // After backends receive calls, set invalid RDS resource
        const invalidRdsResource = {name: routeGroup.getRouteConfiguration().name, virtual_hosts: [{domains: ['**']}]};
        xdsServer.setRdsResource(invalidRdsResource);
        let seenNack = false;
        xdsServer.addResponseListener((typeUrl, responseState) => {
          if (responseState.state === 'NACKED') {
            if (seenNack) {
              return;
            }
            seenNack = true;
            routeGroup.waitForAllBackendsToReceiveTraffic().then(() => {
              client.stopCalls();
              done();
            });
          }
        });
      }, reason => done(reason));
    }, reason => done(reason));
  });
  it('Should continue to use a valid resource after receiving an invalid LDS update', done => {
    const cluster = new FakeEdsCluster('cluster1', 'endpoint1', [{backends: [new Backend()], locality: {region: 'region1'}}]);
    const routeGroup = new FakeRouteGroup('listener1', 'route1', [{cluster: cluster}]);
    routeGroup.startAllBackends().then(() => {
      xdsServer.setEdsResource(cluster.getEndpointConfig());
      xdsServer.setCdsResource(cluster.getClusterConfig());
      xdsServer.setRdsResource(routeGroup.getRouteConfiguration());
      xdsServer.setLdsResource(routeGroup.getListener());
      client = XdsTestClient.createFromServer('listener1', xdsServer);
      client.startCalls(100);
      routeGroup.waitForAllBackendsToReceiveTraffic().then(() => {
        // After backends receive calls, set invalid LDS resource
        const invalidLdsResource = {name: routeGroup.getListener().name};
        xdsServer.setLdsResource(invalidLdsResource);
        let seenNack = false;
        xdsServer.addResponseListener((typeUrl, responseState) => {
          if (responseState.state === 'NACKED') {
            if (seenNack) {
              return;
            }
            seenNack = true;
            routeGroup.waitForAllBackendsToReceiveTraffic().then(() => {
              client.stopCalls();
              done();
            });
          }
        });
      }, reason => done(reason));
    }, reason => done(reason));
  });
});
