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
import { Backend, createBackends } from "./backend";
import { XdsTestClient } from "./client";
import { FakeEdsCluster, FakeRouteGroup, FakeServerRoute } from "./framework";
import { ControlPlaneServer } from "./xds-server";
import * as assert from 'assert';
import { WrrLocality } from "../src/generated/envoy/extensions/load_balancing_policies/wrr_locality/v3/WrrLocality";
import { TypedStruct } from "../src/generated/xds/type/v3/TypedStruct";
import { ChannelOptions, connectivityState, experimental, logVerbosity } from "@grpc/grpc-js";

import TypedLoadBalancingConfig = experimental.TypedLoadBalancingConfig;
import LoadBalancer = experimental.LoadBalancer;
import ChannelControlHelper = experimental.ChannelControlHelper;
import ChildLoadBalancerHandler = experimental.ChildLoadBalancerHandler;
import Endpoint = experimental.Endpoint;
import Picker = experimental.Picker;
import PickArgs = experimental.PickArgs;
import PickResult = experimental.PickResult;
import PickResultType = experimental.PickResultType;
import createChildChannelControlHelper = experimental.createChildChannelControlHelper;
import parseLoadBalancingConfig = experimental.parseLoadBalancingConfig;
import registerLoadBalancerType = experimental.registerLoadBalancerType;
import StatusOr = experimental.StatusOr;
import { PickFirst } from "../src/generated/envoy/extensions/load_balancing_policies/pick_first/v3/PickFirst";
import { ClientSideWeightedRoundRobin } from "../src/generated/envoy/extensions/load_balancing_policies/client_side_weighted_round_robin/v3/ClientSideWeightedRoundRobin";

const LB_POLICY_NAME = 'test.RpcBehaviorLoadBalancer';

class RpcBehaviorLoadBalancingConfig implements TypedLoadBalancingConfig {
  constructor(private rpcBehavior: string) {}
  getLoadBalancerName(): string {
    return LB_POLICY_NAME;
  }
  toJsonObject(): object {
    return {
      [LB_POLICY_NAME]: {
        'rpcBehavior': this.rpcBehavior
      }
    };
  }
  getRpcBehavior() {
    return this.rpcBehavior;
  }
  static createFromJson(obj: any): RpcBehaviorLoadBalancingConfig {
    if (!('rpcBehavior' in obj && typeof obj.rpcBehavior === 'string')) {
      throw new Error(`${LB_POLICY_NAME} parsing error: expected string field rpcBehavior`);
    }
    return new RpcBehaviorLoadBalancingConfig(obj.rpcBehavior);
  }
}

class RpcBehaviorPicker implements Picker {
  constructor(private wrappedPicker: Picker, private rpcBehavior: string) {}
  pick(pickArgs: PickArgs): PickResult {
    const wrappedPick = this.wrappedPicker.pick(pickArgs);
    if (wrappedPick.pickResultType === PickResultType.COMPLETE) {
      pickArgs.metadata.add('rpc-behavior', this.rpcBehavior);
    }
    return wrappedPick;
  }
}

const RPC_BEHAVIOR_CHILD_CONFIG = parseLoadBalancingConfig({round_robin: {}});

/**
 * Load balancer implementation for Custom LB policy test
 */
class RpcBehaviorLoadBalancer implements LoadBalancer {
  private child: ChildLoadBalancerHandler;
  private latestConfig: RpcBehaviorLoadBalancingConfig | null = null;
  constructor(channelControlHelper: ChannelControlHelper) {
    const childChannelControlHelper = createChildChannelControlHelper(channelControlHelper, {
      updateState: (state, picker, errorMessage) => {
        if (state === connectivityState.READY && this.latestConfig) {
          picker = new RpcBehaviorPicker(picker, this.latestConfig.getRpcBehavior());
        }
        channelControlHelper.updateState(state, picker, errorMessage);
      }
    });
    this.child = new ChildLoadBalancerHandler(childChannelControlHelper);
  }
  updateAddressList(endpointList: StatusOr<Endpoint[]>, lbConfig: TypedLoadBalancingConfig, options: ChannelOptions, resolutionNote: string): boolean {
    if (!(lbConfig instanceof RpcBehaviorLoadBalancingConfig)) {
      return false;
    }
    this.latestConfig = lbConfig;
    return this.child.updateAddressList(endpointList, RPC_BEHAVIOR_CHILD_CONFIG, options, resolutionNote);
  }
  exitIdle(): void {
    this.child.exitIdle();
  }
  resetBackoff(): void {
    this.child.resetBackoff();
  }
  destroy(): void {
    this.child.destroy();
  }
  getTypeName(): string {
    return LB_POLICY_NAME;
  }
}

registerLoadBalancerType(LB_POLICY_NAME, RpcBehaviorLoadBalancer, RpcBehaviorLoadBalancingConfig);

describe('Custom LB policies', () => {
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
  it('Should handle round_robin', async () => {
    const lbPolicy: Any = {
      '@type': 'type.googleapis.com/envoy.extensions.load_balancing_policies.round_robin.v3.RoundRobin'
    };
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
    const cluster = new FakeEdsCluster('cluster1', 'endpoint1', [{backends: [backend], locality:{region: 'region1'}}], lbPolicy);
    const routeGroup = new FakeRouteGroup('listener1', 'route1', [{cluster: cluster}]);
    xdsServer.setEdsResource(cluster.getEndpointConfig());
    xdsServer.setCdsResource(cluster.getClusterConfig());
    xdsServer.setRdsResource(routeGroup.getRouteConfiguration());
    xdsServer.setLdsResource(routeGroup.getListener());
    await routeGroup.startAllBackends(xdsServer);
    client = XdsTestClient.createFromServer('listener1', xdsServer);
    const error = await client.sendOneCallAsync();
    assert.strictEqual(error, null);
  });
  it('Should handle xds_wrr_locality with round_robin child', async () => {
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
    const cluster = new FakeEdsCluster('cluster1', 'endpoint1', [{backends: [backend], locality:{region: 'region1'}}], lbPolicy);
    const routeGroup = new FakeRouteGroup('listener1', 'route1', [{cluster: cluster}]);
    xdsServer.setEdsResource(cluster.getEndpointConfig());
    xdsServer.setCdsResource(cluster.getClusterConfig());
    xdsServer.setRdsResource(routeGroup.getRouteConfiguration());
    xdsServer.setLdsResource(routeGroup.getListener());
    await routeGroup.startAllBackends(xdsServer);
    client = XdsTestClient.createFromServer('listener1', xdsServer);
    const error = await client.sendOneCallAsync();
    assert.strictEqual(error, null);
  });
  it('Should handle a typed_struct policy', async () => {
    const lbPolicy: TypedStruct & AnyExtension = {
      '@type': 'type.googleapis.com/xds.type.v3.TypedStruct',
      type_url: 'round_robin',
      value: {
        fields: {}
      }
    };
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
    const cluster = new FakeEdsCluster('cluster1', 'endpoint1', [{backends: [backend], locality:{region: 'region1'}}], lbPolicy);
    const routeGroup = new FakeRouteGroup('listener1', 'route1', [{cluster: cluster}]);
    xdsServer.setEdsResource(cluster.getEndpointConfig());
    xdsServer.setCdsResource(cluster.getClusterConfig());
    xdsServer.setRdsResource(routeGroup.getRouteConfiguration());
    xdsServer.setLdsResource(routeGroup.getListener());
    await routeGroup.startAllBackends(xdsServer);
    client = XdsTestClient.createFromServer('listener1', xdsServer);
    const error = await client.sendOneCallAsync();
    assert.strictEqual(error, null);
  });
  it('Should handle xds_wrr_locality with an unrecognized first child', async () => {
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
    const cluster = new FakeEdsCluster('cluster1', 'endpoint1', [{backends: [backend], locality:{region: 'region1'}}], lbPolicy);
    const routeGroup = new FakeRouteGroup('listener1', 'route1', [{cluster: cluster}]);
    xdsServer.setEdsResource(cluster.getEndpointConfig());
    xdsServer.setCdsResource(cluster.getClusterConfig());
    xdsServer.setRdsResource(routeGroup.getRouteConfiguration());
    xdsServer.setLdsResource(routeGroup.getListener());
    await routeGroup.startAllBackends(xdsServer);
    client = XdsTestClient.createFromServer('listener1', xdsServer);
    const error = await client.sendOneCallAsync();
    assert.strictEqual(error, null);
  });
  it('Should handle a custom LB policy', async () => {
    const childPolicy: TypedStruct & AnyExtension = {
      '@type': 'type.googleapis.com/xds.type.v3.TypedStruct',
      type_url: 'test.RpcBehaviorLoadBalancer',
      value: {
        fields: {
          rpcBehavior: {stringValue: 'error-code-15'}
        }
      }
    };
    const lbPolicy: WrrLocality & AnyExtension = {
      '@type': 'type.googleapis.com/envoy.extensions.load_balancing_policies.wrr_locality.v3.WrrLocality',
      endpoint_picking_policy: {
        policies: [
          {
            typed_extension_config: {
              name: 'child',
              typed_config: childPolicy
            }
          }
        ]
      }
    };
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
    const cluster = new FakeEdsCluster('cluster1', 'endpoint1', [{backends: [backend], locality:{region: 'region1'}}], lbPolicy);
    const routeGroup = new FakeRouteGroup('listener1', 'route1', [{cluster: cluster}]);
    xdsServer.setEdsResource(cluster.getEndpointConfig());
    xdsServer.setCdsResource(cluster.getClusterConfig());
    xdsServer.setRdsResource(routeGroup.getRouteConfiguration());
    xdsServer.setLdsResource(routeGroup.getListener());
    await routeGroup.startAllBackends(xdsServer);
    client = XdsTestClient.createFromServer('listener1', xdsServer);
    const error = await client.sendOneCallAsync();
    assert(error);
    assert.strictEqual(error.code, 15);
  });
  it('Should handle pick_first', async () => {
    const lbPolicy: PickFirst & AnyExtension = {
      '@type': 'type.googleapis.com/envoy.extensions.load_balancing_policies.pick_first.v3.PickFirst',
      shuffle_address_list: true
    };
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
    const cluster = new FakeEdsCluster('cluster1', 'endpoint1', [{backends: [backend], locality:{region: 'region1'}}], lbPolicy);
    const routeGroup = new FakeRouteGroup('listener1', 'route1', [{cluster: cluster}]);
    xdsServer.setEdsResource(cluster.getEndpointConfig());
    xdsServer.setCdsResource(cluster.getClusterConfig());
    xdsServer.setRdsResource(routeGroup.getRouteConfiguration());
    xdsServer.setLdsResource(routeGroup.getListener());
    await routeGroup.startAllBackends(xdsServer);
    client = XdsTestClient.createFromServer('listener1', xdsServer);
    const error = await client.sendOneCallAsync();
    assert.strictEqual(error, null);
  });
  it('Should handle weighted_round_robin', async () => {
    const lbPolicy: ClientSideWeightedRoundRobin & AnyExtension = {
      '@type': 'type.googleapis.com/envoy.extensions.load_balancing_policies.client_side_weighted_round_robin.v3.ClientSideWeightedRoundRobin',
      enable_oob_load_report: { value: true },
      oob_reporting_period: { seconds: 1 },
      blackout_period: { seconds: 1 },
      weight_expiration_period: { seconds: 1 },
      weight_update_period: { seconds: 1 },
      error_utilization_penalty: { value: 0.5 }
    };
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
    const cluster = new FakeEdsCluster('cluster1', 'endpoint1', [{backends: [backend], locality:{region: 'region1'}}], lbPolicy);
    const routeGroup = new FakeRouteGroup('listener1', 'route1', [{cluster: cluster}]);
    xdsServer.setEdsResource(cluster.getEndpointConfig());
    xdsServer.setCdsResource(cluster.getClusterConfig());
    xdsServer.setRdsResource(routeGroup.getRouteConfiguration());
    xdsServer.setLdsResource(routeGroup.getListener());
    await routeGroup.startAllBackends(xdsServer);
    client = XdsTestClient.createFromServer('listener1', xdsServer);
    const error = await client.sendOneCallAsync();
    assert.strictEqual(error, null);
  });
  it('Should distribute traffic among backends with weighted_round_robin', async () => {
    const lbPolicy: ClientSideWeightedRoundRobin & AnyExtension = {
      '@type': 'type.googleapis.com/envoy.extensions.load_balancing_policies.client_side_weighted_round_robin.v3.ClientSideWeightedRoundRobin',
      enable_oob_load_report: { value: true },
      oob_reporting_period: { seconds: 1 },
      blackout_period: { seconds: 1 },
      weight_expiration_period: { seconds: 1 },
      weight_update_period: { seconds: 1 },
      error_utilization_penalty: { value: 0.5 }
    };
    xdsServer.addResponseListener((typeUrl, responseState) => {
      if (responseState.state === 'NACKED') {
        client?.stopCalls();
        assert.fail(`Client NACKED ${typeUrl} resource with message ${responseState.errorMessage}`);
      }
    });
    const [backend1, backend2] = await createBackends(2);
    const serverRoute1 = new FakeServerRoute(backend1.getPort(), 'serverRoute');
    const serverRoute2 = new FakeServerRoute(backend2.getPort(), 'serverRoute2');
    xdsServer.setRdsResource(serverRoute1.getRouteConfiguration());
    xdsServer.setLdsResource(serverRoute1.getListener());
    xdsServer.setRdsResource(serverRoute2.getRouteConfiguration());
    xdsServer.setLdsResource(serverRoute2.getListener());
    const cluster = new FakeEdsCluster('cluster1', 'endpoint1', [{backends: [backend1, backend2], locality:{region: 'region1'}}], lbPolicy);
    const routeGroup = new FakeRouteGroup('listener1', 'route1', [{cluster: cluster}]);
    xdsServer.setEdsResource(cluster.getEndpointConfig());
    xdsServer.setCdsResource(cluster.getClusterConfig());
    xdsServer.setRdsResource(routeGroup.getRouteConfiguration());
    xdsServer.setLdsResource(routeGroup.getListener());
    await routeGroup.startAllBackends(xdsServer);
    client = XdsTestClient.createFromServer('listener1', xdsServer);
    client.startCalls(100);
    await routeGroup.waitForAllBackendsToReceiveTraffic();
    client.stopCalls();
  });
});
