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

import { Backend } from "./backend";
import { XdsTestClient } from "./client";
import { FakeEdsCluster, FakeRouteGroup } from "./framework";
import { XdsServer } from "./xds-server";

import { register } from "../src";
import assert = require("assert");

register();

describe('core xDS functionality', () => {
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
  })
  it('should route requests to the single backend', done => {
    const cluster = new FakeEdsCluster('cluster1', 'endpoint1', [{backends: [new Backend()], locality:{region: 'region1'}}]);
    const routeGroup = new FakeRouteGroup('listener1', 'route1', [{cluster: cluster}]);
    routeGroup.startAllBackends().then(() => {
      xdsServer.setEdsResource(cluster.getEndpointConfig());
      xdsServer.setCdsResource(cluster.getClusterConfig());
      xdsServer.setRdsResource(routeGroup.getRouteConfiguration());
      xdsServer.setLdsResource(routeGroup.getListener());
      xdsServer.addResponseListener((typeUrl, responseState) => {
        if (responseState.state === 'NACKED') {
          client.stopCalls();
          assert.fail(`Client NACKED ${typeUrl} resource with message ${responseState.errorMessage}`);
        }
      })
      client = XdsTestClient.createFromServer('listener1', xdsServer);
      client.startCalls(100);
      routeGroup.waitForAllBackendsToReceiveTraffic().then(() => {
        client.stopCalls();
        done();
      }, reason => done(reason));
    }, reason => done(reason));
  });
});
