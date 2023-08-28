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
import { connectivityState, experimental, logVerbosity } from "@grpc/grpc-js";

import TypedLoadBalancingConfig = experimental.TypedLoadBalancingConfig;
import LoadBalancer = experimental.LoadBalancer;
import ChannelControlHelper = experimental.ChannelControlHelper;
import ChildLoadBalancerHandler = experimental.ChildLoadBalancerHandler;
import SubchannelAddress = experimental.SubchannelAddress;
import Picker = experimental.Picker;
import PickArgs = experimental.PickArgs;
import PickResult = experimental.PickResult;
import PickResultType = experimental.PickResultType;
import createChildChannelControlHelper = experimental.createChildChannelControlHelper;
import parseLoadBalancingConfig = experimental.parseLoadBalancingConfig;
import registerLoadBalancerType = experimental.registerLoadBalancerType;

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
      updateState: (state, picker) => {
        if (state === connectivityState.READY && this.latestConfig) {
          picker = new RpcBehaviorPicker(picker, this.latestConfig.getRpcBehavior());
        }
        channelControlHelper.updateState(state, picker);
      }
    });
    this.child = new ChildLoadBalancerHandler(childChannelControlHelper);
  }
  updateAddressList(addressList: SubchannelAddress[], lbConfig: TypedLoadBalancingConfig, attributes: { [key: string]: unknown; }): void {
    if (!(lbConfig instanceof RpcBehaviorLoadBalancingConfig)) {
      return;
    }
    this.latestConfig = lbConfig;
    this.child.updateAddressList(addressList, RPC_BEHAVIOR_CHILD_CONFIG, attributes);
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
  it('Should handle a custom LB policy', done => {
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
      client.sendOneCall(error => {
        assert.strictEqual(error?.code, 15);
        done();
      });
    }, reason => done(reason));
  })
});
