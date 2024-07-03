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

import { createBackends } from "./backend";
import { XdsTestClient } from "./client";
import { FakeEdsCluster, FakeRouteGroup, FakeServerRoute } from "./framework";
import { ControlPlaneServer } from "./xds-server";

import { register } from "../src";
import assert = require("assert");
import { connectivityState, status } from "@grpc/grpc-js";

register();

describe('xDS server', () => {
  describe('Route handling', () => {
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
    it('should reject requests to invalid routes', async () => {
      const [backend] = await createBackends(1);
      const serverRoute = new FakeServerRoute(backend.getPort(), 'serverRoute', undefined, {
        virtual_hosts: [{
          domains: ['*'],
          routes: [{
            match: {
              prefix: ''
            },
            action: 'route',
            route: {
              cluster: 'any'
            }
          }]
        }]
      });
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
      const error = await client.sendOneCallAsync();
      assert(error);
      assert.strictEqual(error.code, status.UNAVAILABLE);
      assert.strictEqual(error.details, 'Routing error');
    });
  });
});
