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
import { Any } from "../src/generated/google/protobuf/Any";
import { AnyExtension } from "@grpc/proto-loader";
import { RingHash } from "../src/generated/envoy/extensions/load_balancing_policies/ring_hash/v3/RingHash";
import { EXPERIMENTAL_RING_HASH } from "../src/environment";

register();

describe('Ring hash LB policy', () => {
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
  it('Should route requests to the single backend with the old lbPolicy field', function(done) {
    if (!EXPERIMENTAL_RING_HASH) {
      this.skip();
    }
    const cluster = new FakeEdsCluster('cluster1', 'endpoint1', [{backends: [new Backend()], locality:{region: 'region1'}}], 'RING_HASH');
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
      client.sendOneCall(done);
    }, reason => done(reason));
  });
  it('Should route requests to the single backend with the new load_balancing_policy field', function(done) {
    if (!EXPERIMENTAL_RING_HASH) {
      this.skip();
    }
    const lbPolicy: AnyExtension & RingHash = {
      '@type': 'type.googleapis.com/envoy.extensions.load_balancing_policies.ring_hash.v3.RingHash',
      hash_function: 'XX_HASH'
    };
    const cluster = new FakeEdsCluster('cluster1', 'endpoint1', [{backends: [new Backend()], locality:{region: 'region1'}}], lbPolicy);
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
      client.sendOneCall(done);
    }, reason => done(reason));
  });
  it('Should route all identical requests to the same backend', function(done) {
    if (!EXPERIMENTAL_RING_HASH) {
      this.skip();
    }
    const backend1 = new Backend();
    const backend2 = new Backend()
    const cluster = new FakeEdsCluster('cluster1', 'endpoint1', [{backends: [backend1, backend2], locality:{region: 'region1'}}], 'RING_HASH');
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
      client.sendNCalls(10, error => {
        assert.ifError(error);
        assert((backend1.getCallCount() === 0) !== (backend2.getCallCount() === 0));
        done();
      })
    }, reason => done(reason));
  });
});
