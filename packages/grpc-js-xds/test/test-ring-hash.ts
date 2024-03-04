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
import { Any } from "../src/generated/google/protobuf/Any";
import { AnyExtension } from "@grpc/proto-loader";
import { RingHash } from "../src/generated/envoy/extensions/load_balancing_policies/ring_hash/v3/RingHash";
import { EXPERIMENTAL_RING_HASH } from "../src/environment";

register();

describe('Ring hash LB policy', () => {
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
  it('Should route requests to the single backend with the old lbPolicy field', async function() {
    if (!EXPERIMENTAL_RING_HASH) {
      this.skip();
    }
    xdsServer.addResponseListener((typeUrl, responseState) => {
      if (responseState.state === 'NACKED') {
        client?.stopCalls();
        assert.fail(`Client NACKED ${typeUrl} resource with message ${responseState.errorMessage}`);
      }
    });
    const [backend] = await createBackends(1);
    const serverRoute = new FakeServerRoute(backend.getPort(), 'serverRoute');
    xdsServer.setRdsResource(serverRoute.getRouteConfiguration());
    xdsServer.setLdsResource(serverRoute.getListener());
    const cluster = new FakeEdsCluster('cluster1', 'endpoint1', [{backends: [backend], locality:{region: 'region1'}}], 'RING_HASH');
    const routeGroup = new FakeRouteGroup('listener1', 'route1', [{cluster: cluster}]);
    xdsServer.setEdsResource(cluster.getEndpointConfig());
    xdsServer.setCdsResource(cluster.getClusterConfig());
    xdsServer.setRdsResource(routeGroup.getRouteConfiguration());
    xdsServer.setLdsResource(routeGroup.getListener());
    await routeGroup.startAllBackends(xdsServer);
    client = XdsTestClient.createFromServer('listener1', xdsServer);
    return client.sendOneCallAsync();
  });
  it('Should route requests to the single backend with the new load_balancing_policy field', async function() {
    if (!EXPERIMENTAL_RING_HASH) {
      this.skip();
    }
    xdsServer.addResponseListener((typeUrl, responseState) => {
      if (responseState.state === 'NACKED') {
        client?.stopCalls();
        assert.fail(`Client NACKED ${typeUrl} resource with message ${responseState.errorMessage}`);
      }
    });
    const lbPolicy: AnyExtension & RingHash = {
      '@type': 'type.googleapis.com/envoy.extensions.load_balancing_policies.ring_hash.v3.RingHash',
      hash_function: 'XX_HASH'
    };
    const [backend] = await createBackends(1);
    const serverRoute = new FakeServerRoute(backend.getPort(), 'serverRoute');
    xdsServer.setRdsResource(serverRoute.getRouteConfiguration());
    xdsServer.setLdsResource(serverRoute.getListener());
    const cluster = new FakeEdsCluster('cluster1', 'endpoint1', [{backends: [backend], locality:{region: 'region1'}}], lbPolicy);
    const routeGroup = new FakeRouteGroup('listener1', 'route1', [{cluster: cluster}]);
    xdsServer.setEdsResource(cluster.getEndpointConfig());
    xdsServer.setCdsResource(cluster.getClusterConfig());
    xdsServer.setRdsResource(routeGroup.getRouteConfiguration());
    xdsServer.setLdsResource(routeGroup.getListener());
    await routeGroup.startAllBackends(xdsServer);
    client = XdsTestClient.createFromServer('listener1', xdsServer);
    return client.sendOneCallAsync();
  });
  it('Should route all identical requests to the same backend', async function() {
    if (!EXPERIMENTAL_RING_HASH) {
      this.skip();
    }
    xdsServer.addResponseListener((typeUrl, responseState) => {
      if (responseState.state === 'NACKED') {
        client?.stopCalls();
        assert.fail(`Client NACKED ${typeUrl} resource with message ${responseState.errorMessage}`);
      }
    });
    const [backend1, backend2] = await createBackends(2);
    const serverRoute1 = new FakeServerRoute(backend1.getPort(), 'serverRoute1');
    xdsServer.setRdsResource(serverRoute1.getRouteConfiguration());
    xdsServer.setLdsResource(serverRoute1.getListener());
    const serverRoute2 = new FakeServerRoute(backend1.getPort(), 'serverRoute2');
    xdsServer.setRdsResource(serverRoute2.getRouteConfiguration());
    xdsServer.setLdsResource(serverRoute2.getListener());
    const cluster = new FakeEdsCluster('cluster1', 'endpoint1', [{backends: [backend1, backend2], locality:{region: 'region1'}}], 'RING_HASH');
    const routeGroup = new FakeRouteGroup('listener1', 'route1', [{cluster: cluster}]);
    xdsServer.setEdsResource(cluster.getEndpointConfig());
    xdsServer.setCdsResource(cluster.getClusterConfig());
    xdsServer.setRdsResource(routeGroup.getRouteConfiguration());
    xdsServer.setLdsResource(routeGroup.getListener());
    routeGroup.startAllBackends(xdsServer);
    client = XdsTestClient.createFromServer('listener1', xdsServer);
    await client.sendNCallsAsync(10);
    assert((backend1.getCallCount() === 0) !== (backend2.getCallCount() === 0));
  });
  it('Should fallback to a second backend if the first one goes down', async function() {
    if (!EXPERIMENTAL_RING_HASH) {
      this.skip();
    }
    const backends = await createBackends(3);
    for (const backend of backends) {
      const serverRoute = new FakeServerRoute(backend.getPort(), 'serverRoute');
      xdsServer.setRdsResource(serverRoute.getRouteConfiguration());
      xdsServer.setLdsResource(serverRoute.getListener());
    }
    const cluster = new FakeEdsCluster('cluster1', 'endpoint1', [{backends: backends, locality:{region: 'region1'}}], 'RING_HASH');
    const routeGroup = new FakeRouteGroup('listener1', 'route1', [{cluster: cluster}]);
    xdsServer.setEdsResource(cluster.getEndpointConfig());
    xdsServer.setCdsResource(cluster.getClusterConfig());
    xdsServer.setRdsResource(routeGroup.getRouteConfiguration());
    xdsServer.setLdsResource(routeGroup.getListener());
    routeGroup.startAllBackends(xdsServer);
    xdsServer.addResponseListener((typeUrl, responseState) => {
      if (responseState.state === 'NACKED') {
        client.stopCalls();
        assert.fail(`Client NACKED ${typeUrl} resource with message ${responseState.errorMessage}`);
      }
    })
    client = XdsTestClient.createFromServer('listener1', xdsServer);
    await client.sendNCallsAsync(100);
    let backendWithTraffic: number | null = null;
    for (let i = 0; i < backends.length; i++) {
      if (backendWithTraffic === null) {
        if (backends[i].getCallCount() > 0) {
          backendWithTraffic = i;
        }
      } else {
        assert.strictEqual(backends[i].getCallCount(), 0, `Backends ${backendWithTraffic} and ${i} both got traffic`);
      }
    }
    assert.notStrictEqual(backendWithTraffic, null, 'No backend got traffic');
    await backends[backendWithTraffic!].shutdownAsync();
    backends[backendWithTraffic!].resetCallCount();
    await client.sendNCallsAsync(100);
    let backendWithTraffic2: number | null = null;
    for (let i = 0; i < backends.length; i++) {
      if (backendWithTraffic2 === null) {
        if (backends[i].getCallCount() > 0) {
          backendWithTraffic2 = i;
        }
      } else {
        assert.strictEqual(backends[i].getCallCount(), 0, `Backends ${backendWithTraffic2} and ${i} both got traffic`);
      }
    }
    assert.notStrictEqual(backendWithTraffic2, null, 'No backend got traffic');
    assert.notStrictEqual(backendWithTraffic2, backendWithTraffic, `Traffic went to the same backend ${backendWithTraffic} after shutdown`);
  })
});
