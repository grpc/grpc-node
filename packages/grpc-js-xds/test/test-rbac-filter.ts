/*
 * Copyright 2025 gRPC authors.
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
import { createBackends } from "./backend";
import { XdsTestClient } from "./client";
import { FakeEdsCluster, FakeRouteGroup, FakeServerRoute } from "./framework";
import { ControlPlaneServer } from "./xds-server";
import { AnyExtension } from '@grpc/proto-loader';
import { RBAC } from '../src/generated/envoy/extensions/filters/http/rbac/v3/RBAC';
import { status } from '@grpc/grpc-js';

describe('RBAC HTTP filter', () => {
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
  it('Should accept matching requests with ALLOW action', async () => {
    const [backend] = await createBackends(1);
    const rbacFilter: AnyExtension & RBAC = {
      '@type': 'type.googleapis.com/envoy.extensions.filters.http.rbac.v3.RBAC',
      rules: {
        action: 'ALLOW',
        policies: {
          local: {
            principals: [{any: true}],
            permissions: [{any: true}]
          }
        }
      }
    };
    const routerFilter: AnyExtension = {
      '@type': 'type.googleapis.com/envoy.extensions.filters.http.router.v3.Router'
    };
    const serverRoute = new FakeServerRoute(backend.getPort(), 'serverRoute', undefined, undefined, [{typed_config: rbacFilter, name: 'rbac'}, {typed_config: routerFilter, name: 'router'}]);
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
    assert.strictEqual(error, null);
  });
  it('Should reject matching requests with DENY action', async () => {
    const [backend] = await createBackends(1);
    const rbacFilter: AnyExtension & RBAC = {
      '@type': 'type.googleapis.com/envoy.extensions.filters.http.rbac.v3.RBAC',
      rules: {
        action: 'DENY',
        policies: {
          local: {
            principals: [{any: true}],
            permissions: [{any: true}]
          }
        }
      }
    };
    const routerFilter: AnyExtension = {
      '@type': 'type.googleapis.com/envoy.extensions.filters.http.router.v3.Router'
    };
    const serverRoute = new FakeServerRoute(backend.getPort(), 'serverRoute', undefined, undefined, [{typed_config: rbacFilter, name: 'rbac'}, {typed_config: routerFilter, name: 'router'}]);
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
    assert.strictEqual(error?.code, status.PERMISSION_DENIED);
  });
  it('Should reject non-matching requests with ALLOW action', async () => {
    const [backend] = await createBackends(1);
    const rbacFilter: AnyExtension & RBAC = {
      '@type': 'type.googleapis.com/envoy.extensions.filters.http.rbac.v3.RBAC',
      rules: {
        action: 'ALLOW',
        policies: {
          local: {
            principals: [{any: true}],
            permissions: [{not_rule: {any: true}}]
          }
        }
      }
    };
    const routerFilter: AnyExtension = {
      '@type': 'type.googleapis.com/envoy.extensions.filters.http.router.v3.Router'
    };
    const serverRoute = new FakeServerRoute(backend.getPort(), 'serverRoute', undefined, undefined, [{typed_config: rbacFilter, name: 'rbac'}, {typed_config: routerFilter, name: 'router'}]);
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
    assert.strictEqual(error?.code, status.PERMISSION_DENIED);
  });
  it('Should accept non-matching requests with DENY action', async () => {
    const [backend] = await createBackends(1);
    const rbacFilter: AnyExtension & RBAC = {
      '@type': 'type.googleapis.com/envoy.extensions.filters.http.rbac.v3.RBAC',
      rules: {
        action: 'DENY',
        policies: {
          local: {
            principals: [{any: true}],
            permissions: [{not_rule: {any: true}}]
          }
        }
      }
    };
    const routerFilter: AnyExtension = {
      '@type': 'type.googleapis.com/envoy.extensions.filters.http.router.v3.Router'
    };
    const serverRoute = new FakeServerRoute(backend.getPort(), 'serverRoute', undefined, undefined, [{typed_config: rbacFilter, name: 'rbac'}, {typed_config: routerFilter, name: 'router'}]);
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
    assert.strictEqual(error, null);
  });
});
