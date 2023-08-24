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

import { AnyExtension } from "@grpc/proto-loader";
import { Any } from "../src/generated/google/protobuf/Any";
import { Backend } from "./backend";
import { XdsTestClient } from "./client";
import { FakeEdsCluster, FakeRouteGroup } from "./framework";
import { XdsServer } from "./xds-server";
import * as assert from 'assert';
import { WrrLocality } from "../src/generated/envoy/extensions/load_balancing_policies/wrr_locality/v3/WrrLocality";
import { TypedStruct } from "../src/generated/xds/type/v3/TypedStruct";

describe('Custom LB policies', () => {
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
  it('Should handle round_robin', done => {
    const lbPolicy: Any = {
      '@type': 'type.googleapis.com/envoy.extensions.load_balancing_policies.round_robin.v3.RoundRobin'
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
  it('Should handle xds_wrr_locality with round_robin child', done => {
    const lbPolicy: WrrLocality & AnyExtension = {
      '@type': 'type.googleapis.com/envoy.extensions.load_balancing_policies.wrr_locality.v3.WrrLocality',
      endpoint_picking_policy: {
        policies: [
          {
            typed_extension_config: {
              name: 'child',
              typed_config: {
                '@type': 'type.googleapis.com/envoy.extensions.load_balancing_policies.round_robin.v3.RoundRobin'
              }
            }
          }
        ]
      }
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
  it('Should handle a typed_struct policy', done => {
    const lbPolicy: TypedStruct & AnyExtension = {
      '@type': 'type.googleapis.com/xds.type.v3.TypedStruct',
      type_url: 'round_robin',
      value: {
        fields: {}
      }
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
  it('Should handle xds_wrr_locality with an unrecognized first child', done => {
    const invalidChildPolicy: TypedStruct & AnyExtension = {
      '@type': 'type.googleapis.com/xds.type.v3.TypedStruct',
      type_url: 'test.ThisLoadBalancerDoesNotExist',
      value: {
        fields: {}
      }
    }
    const lbPolicy: WrrLocality & AnyExtension = {
      '@type': 'type.googleapis.com/envoy.extensions.load_balancing_policies.wrr_locality.v3.WrrLocality',
      endpoint_picking_policy: {
        policies: [
          {
            typed_extension_config: {
              name: 'child',
              typed_config: invalidChildPolicy
            }
          },
          {
            typed_extension_config: {
              name: 'child',
              typed_config: {
                '@type': 'type.googleapis.com/envoy.extensions.load_balancing_policies.round_robin.v3.RoundRobin'
              }
            }
          }
        ]
      }
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
});
