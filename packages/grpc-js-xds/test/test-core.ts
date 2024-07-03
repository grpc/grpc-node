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

import { Backend, createBackends } from "./backend";
import { XdsTestClient } from "./client";
import { FakeEdsCluster, FakeRouteGroup, FakeServerRoute } from "./framework";
import { ControlPlaneServer } from "./xds-server";

import { register } from "../src";
import assert = require("assert");
import { connectivityState } from "@grpc/grpc-js";

register();

describe('core xDS functionality', () => {
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
  })
  it('should route requests to the single backend', async () => {
    const [backend] = await createBackends(1);
    const serverRoute = new FakeServerRoute(backend.getPort(), 'serverRoute');
    xdsServer.setRdsResource(serverRoute.getRouteConfiguration());
    xdsServer.setLdsResource(serverRoute.getListener());
    xdsServer.addResponseListener((typeUrl, responseState) => {
      if (responseState.state === 'NACKED') {
        client?.stopCalls();
        assert.fail(`Client NACKED ${typeUrl} resource with message ${responseState.errorMessage}`);
      }
    });
    const cluster = new FakeEdsCluster('cluster1', 'endpoint1', [{backends: [backend], locality:{region: 'region1'}}]);
    const routeGroup = new FakeRouteGroup('listener1', 'route1', [{cluster: cluster}]);
    await routeGroup.startAllBackends(xdsServer);
    xdsServer.setEdsResource(cluster.getEndpointConfig());
    xdsServer.setCdsResource(cluster.getClusterConfig());
    xdsServer.setRdsResource(routeGroup.getRouteConfiguration());
    xdsServer.setLdsResource(routeGroup.getListener());
    client = XdsTestClient.createFromServer('listener1', xdsServer);
    client.startCalls(100);
    await routeGroup.waitForAllBackendsToReceiveTraffic();
    client.stopCalls();
  });
  it('should be able to enter and exit idle', function(done) {
    this.timeout(5000);
    createBackends(1).then(([backend]) => {
      const serverRoute = new FakeServerRoute(backend.getPort(), 'serverRoute');
      xdsServer.setRdsResource(serverRoute.getRouteConfiguration());
      xdsServer.setLdsResource(serverRoute.getListener());
      xdsServer.addResponseListener((typeUrl, responseState) => {
        if (responseState.state === 'NACKED') {
          client.stopCalls();
          assert.fail(`Client NACKED ${typeUrl} resource with message ${responseState.errorMessage}`);
        }
      });
      const cluster = new FakeEdsCluster('cluster1', 'endpoint1', [{backends: [backend], locality:{region: 'region1'}}]);
      const routeGroup = new FakeRouteGroup('listener1', 'route1', [{cluster: cluster}]);
      routeGroup.startAllBackends(xdsServer).then(() => {
        xdsServer.setEdsResource(cluster.getEndpointConfig());
        xdsServer.setCdsResource(cluster.getClusterConfig());
        xdsServer.setRdsResource(routeGroup.getRouteConfiguration());
        xdsServer.setLdsResource(routeGroup.getListener());
        const serverRoute = new FakeServerRoute(backend.getPort(), 'serverRoute');
        xdsServer.setRdsResource(serverRoute.getRouteConfiguration());
        xdsServer.setLdsResource(serverRoute.getListener());
        client = XdsTestClient.createFromServer('listener1', xdsServer, {
          'grpc.client_idle_timeout_ms': 1000,
        });
        client.sendOneCall(error => {
          assert.ifError(error);
          assert.strictEqual(client.getConnectivityState(), connectivityState.READY);
          setTimeout(() => {
            assert.strictEqual(client.getConnectivityState(), connectivityState.IDLE);
            client.sendOneCall(error => {
              done(error);
            })
          }, 1100);
        });
      }, reason => done(reason));
    }, reason => done(reason));
  });
  it('should handle connections aging out', function(done) {
    this.timeout(5000);
    createBackends(1, true, {'grpc.max_connection_age_ms': 1000}).then(([backend]) => {
      const serverRoute = new FakeServerRoute(backend.getPort(), 'serverRoute');
      xdsServer.setRdsResource(serverRoute.getRouteConfiguration());
      xdsServer.setLdsResource(serverRoute.getListener());
      xdsServer.addResponseListener((typeUrl, responseState) => {
        if (responseState.state === 'NACKED') {
          client.stopCalls();
          assert.fail(`Client NACKED ${typeUrl} resource with message ${responseState.errorMessage}`);
        }
      });
      const cluster = new FakeEdsCluster('cluster1', 'endpoint1', [{backends: [backend], locality:{region: 'region1'}}]);
      const routeGroup = new FakeRouteGroup('listener1', 'route1', [{cluster: cluster}]);
      routeGroup.startAllBackends(xdsServer).then(() => {
        xdsServer.setEdsResource(cluster.getEndpointConfig());
        xdsServer.setCdsResource(cluster.getClusterConfig());
        xdsServer.setRdsResource(routeGroup.getRouteConfiguration());
        xdsServer.setLdsResource(routeGroup.getListener());
        const serverRoute = new FakeServerRoute(backend.getPort(), 'serverRoute');
        xdsServer.setRdsResource(serverRoute.getRouteConfiguration());
        xdsServer.setLdsResource(serverRoute.getListener());
        client = XdsTestClient.createFromServer('listener1', xdsServer);
        client.sendOneCall(error => {
          assert.ifError(error);
          // Make another call after the max_connection_age_ms expires
          setTimeout(() => {
            client.sendOneCall(error => {
              done(error);
            })
          }, 1100);
        });
      }, reason => done(reason));
    }, reason => done(reason));
  })
});
