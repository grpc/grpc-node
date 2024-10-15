/*
 * Copyright 2024 gRPC authors.
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
import { createBackends } from './backend';
import { FakeEdsCluster, FakeRouteGroup, FakeServerRoute } from './framework';
import { ControlPlaneServer } from './xds-server';
import { XdsTestClient } from './client';
import { XdsServerCredentials } from '../src';
import { credentials, ServerCredentials } from '@grpc/grpc-js';
import { readFileSync } from 'fs';
import * as path from 'path';
import { Listener } from '../src/generated/envoy/config/listener/v3/Listener';
import { DownstreamTlsContext } from '../src/generated/envoy/extensions/transport_sockets/tls/v3/DownstreamTlsContext';
import { AnyExtension } from '@grpc/proto-loader';
import { DOWNSTREAM_TLS_CONTEXT_TYPE_URL } from '../src/resources';

const ca = readFileSync(path.join(__dirname, 'fixtures', 'ca.pem'));
const key = readFileSync(path.join(__dirname, 'fixtures', 'server1.key'));
const cert = readFileSync(path.join(__dirname, 'fixtures', 'server1.pem'));

describe('Server xDS Credentials', () => {
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
  it('Should use fallback credentials when certificate providers are not configured', async () => {
    const [backend] = await createBackends(1, true, new XdsServerCredentials(ServerCredentials.createInsecure()));
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
    client = XdsTestClient.createFromServer('listener1', xdsServer, credentials.createInsecure());
    const error = await client.sendOneCallAsync();
    assert.strictEqual(error, null);
  });
  it('Should use the identity certificate when configured', async () => {
    const [backend] = await createBackends(1, true, new XdsServerCredentials(ServerCredentials.createInsecure()));
    const downstreamTlsContext: DownstreamTlsContext & AnyExtension = {
      '@type': DOWNSTREAM_TLS_CONTEXT_TYPE_URL,
      common_tls_context: {
        tls_certificate_provider_instance: {
          instance_name: 'test_certificates'
        },
        validation_context: {}
      },
      ocsp_staple_policy: 'LENIENT_STAPLING'
    }
    const baseServerListener: Listener = {
      default_filter_chain: {
        filter_chain_match: {
          source_type: 'SAME_IP_OR_LOOPBACK'
        },
        transport_socket: {
          name: 'envoy.transport_sockets.tls',
          typed_config: downstreamTlsContext
        }
      }
    }
    const serverRoute = new FakeServerRoute(backend.getPort(), 'serverRoute', baseServerListener);
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
    client = XdsTestClient.createFromServer('listener1', xdsServer, credentials.createSsl(ca), {
      'grpc.ssl_target_name_override': 'foo.test.google.fr',
      'grpc.default_authority': 'foo.test.google.fr',
    });
    const error = await client.sendOneCallAsync();
    assert.strictEqual(error, null);
  });
  it('Should use identity and CA certificates when configured', async () => {
    const [backend] = await createBackends(1, true, new XdsServerCredentials(ServerCredentials.createInsecure()));
    const downstreamTlsContext: DownstreamTlsContext & AnyExtension = {
      '@type': DOWNSTREAM_TLS_CONTEXT_TYPE_URL,
      common_tls_context: {
        tls_certificate_provider_instance: {
          instance_name: 'test_certificates'
        },
        validation_context: {
          ca_certificate_provider_instance: {
            instance_name: 'test_certificates'
          }
        }
      },
      ocsp_staple_policy: 'LENIENT_STAPLING',
      require_client_certificate: {
        value: true
      }
    }
    const baseServerListener: Listener = {
      default_filter_chain: {
        filter_chain_match: {
          source_type: 'SAME_IP_OR_LOOPBACK'
        },
        transport_socket: {
          name: 'envoy.transport_sockets.tls',
          typed_config: downstreamTlsContext
        }
      }
    }
    const serverRoute = new FakeServerRoute(backend.getPort(), 'serverRoute', baseServerListener);
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
    client = XdsTestClient.createFromServer('listener1', xdsServer, credentials.createSsl(ca, key, cert), {
      'grpc.ssl_target_name_override': 'foo.test.google.fr',
      'grpc.default_authority': 'foo.test.google.fr',
    });
    const error = await client.sendOneCallAsync();
    assert.strictEqual(error, null);
  });
});
