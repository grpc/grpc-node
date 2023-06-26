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

import { BootstrapInfo, Node, validateBootstrapConfig } from "../src/xds-bootstrap";
import { experimental } from "@grpc/grpc-js";
import * as assert from 'assert';
import GrpcUri = experimental.GrpcUri;
import { getListenerResourceName } from "../src/resolver-xds";

const testNode: Node = {
  id: 'test',
  locality: {}
};

/* Test cases in this file are derived from examples in the xDS federation proposal
 * https://github.com/grpc/proposal/blob/master/A47-xds-federation.md */
describe('Listener resource name evaluation', () => {
  describe('No new bootstrap fields', () => {
    const bootstrap = validateBootstrapConfig({
      node: testNode,
      xds_servers: []
    });
    it('xds:server.example.com', () => {
      const target: GrpcUri = {
        scheme: 'xds',
        path: 'server.example.com'
      };
      assert.strictEqual(getListenerResourceName(bootstrap, target), 'server.example.com');
    });
    it('xds://xds.authority.com/server.example.com', () => {
      const target: GrpcUri = {
        scheme: 'xds',
        authority: 'xds.authority.com',
        path: 'server.example.com'
      };
      assert.throws(() => getListenerResourceName(bootstrap, target), /xds.authority.com/);
    });
  });
  describe('New-style names', () => {
    const bootstrap = validateBootstrapConfig({
      node: testNode,
      xds_servers: [],
      client_default_listener_resource_name_template: 'xdstp://xds.authority.com/envoy.config.listener.v3.Listener/%s',
      authorities: {
        'xds.authority.com': {}
      }
    });
    it('xds:server.example.com', () => {
      const target: GrpcUri = {
        scheme: 'xds',
        path: 'server.example.com'
      };
      assert.strictEqual(getListenerResourceName(bootstrap, target), 'xdstp://xds.authority.com/envoy.config.listener.v3.Listener/server.example.com');
    });
    it('xds://xds.authority.com/server.example.com', () => {
      const target: GrpcUri = {
        scheme: 'xds',
        authority: 'xds.authority.com',
        path: 'server.example.com'
      };
      assert.strictEqual(getListenerResourceName(bootstrap, target), 'xdstp://xds.authority.com/envoy.config.listener.v3.Listener/server.example.com');
    });
  });
  describe('Multiple authorities', () => {
    const bootstrap = validateBootstrapConfig({
      node: testNode,
      xds_servers: [{
        "server_uri": "xds-server.authority.com",
        "channel_creds": [ { "type": "google_default" } ]
      }],
      client_default_listener_resource_name_template: 'xdstp://xds.authority.com/envoy.config.listener.v3.Listener/grpc/client/%s?project_id=1234',
      authorities: {
        "xds.authority.com": {
          "client_listener_resource_name_template": "xdstp://xds.authority.com/envoy.config.listener.v3.Listener/grpc/client/%s?project_id=1234"
        },
      
        "xds.other.com": {
          "xds_servers": [
            {
              "server_uri": "xds-server.other.com",
              "channel_creds": [ { "type": "google_default" } ]
            }
          ]
        }
      }
    });
    it('xds:server.example.com', () => {
      const target: GrpcUri = {
        scheme: 'xds',
        path: 'server.example.com'
      };
      assert.strictEqual(getListenerResourceName(bootstrap, target), 'xdstp://xds.authority.com/envoy.config.listener.v3.Listener/grpc/client/server.example.com?project_id=1234');
    });
    it('xds://xds.authority.com/server.example.com', () => {
      const target: GrpcUri = {
        scheme: 'xds',
        authority: 'xds.authority.com',
        path: 'server.example.com'
      };
      assert.strictEqual(getListenerResourceName(bootstrap, target), 'xdstp://xds.authority.com/envoy.config.listener.v3.Listener/grpc/client/server.example.com?project_id=1234');
    });
    it('xds://xds.other.com/server.other.com', () => {
      const target: GrpcUri = {
        scheme: 'xds',
        authority: 'xds.other.com',
        path: 'server.other.com'
      };
      assert.strictEqual(getListenerResourceName(bootstrap, target), 'xdstp://xds.other.com/envoy.config.listener.v3.Listener/server.other.com');
    });
  });
});
