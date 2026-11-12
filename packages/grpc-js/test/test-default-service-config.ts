/*
 * Copyright 2026 gRPC authors.
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
import { ResolvingLoadBalancer } from '../src/resolving-load-balancer';
import {
  registerResolver,
  ResolverListener,
  Resolver,
  ResolverConstructor,
} from '../src/resolver';
import { ChannelControlHelper } from '../src/load-balancer';
import { statusOrFromValue, statusOrFromError } from '../src/call-interface';
import { ServiceConfig } from '../src/service-config';
import { Endpoint, subchannelAddressToString } from '../src/subchannel-address';
import { GrpcUri } from '../src/uri-parser';
import { Status } from '../src/constants';
import { MockSubchannel } from './common';
import { ChannelOptions } from '../src/channel-options';

// Ensure all resolvers and load balancers are registered
import '../src/index';

/**
 * A resolver that returns a valid endpoint list but an invalid/error
 * service config. This simulates a resolver that encounters an error
 * while parsing or fetching the service config.
 */
class InvalidServiceConfigResolver implements Resolver {
  constructor(
    _target: GrpcUri,
    private listener: ResolverListener,
    _channelOptions: ChannelOptions
  ) {}

  updateResolution() {
    setImmediate(() => {
      this.listener(
        statusOrFromValue<Endpoint[]>([
          { addresses: [{ host: 'localhost', port: 50051 }] },
        ]),
        {},
        statusOrFromError<ServiceConfig>({
          code: Status.UNAVAILABLE,
          details: 'Invalid service config from resolver',
        }),
        ''
      );
    });
  }

  destroy() {}

  static getDefaultAuthority(target: GrpcUri): string {
    return target.path;
  }
}

describe('Default Service Config', () => {
  before(() => {
    registerResolver(
      'test-invalid-sc',
      InvalidServiceConfigResolver as unknown as ResolverConstructor
    );
  });

  it('uses the explicit default when the first resolver config is invalid', function (done) {
    this.timeout(5000);

    const defaultServiceConfig: ServiceConfig = {
      loadBalancingConfig: [],
      methodConfig: [
        {
          name: [{ service: 'TestService', method: 'TestMethod' }],
          waitForReady: true,
        },
      ],
    };

    const channelControlHelper: ChannelControlHelper = {
      createSubchannel: subchannelAddress => {
        return new MockSubchannel(subchannelAddressToString(subchannelAddress));
      },
      addChannelzChild: () => {},
      removeChannelzChild: () => {},
      requestReresolution: () => {},
      updateState: () => {},
    };

    const rlb = new ResolvingLoadBalancer(
      { scheme: 'test-invalid-sc', authority: undefined, path: 'test-target' },
      channelControlHelper,
      {
        'grpc.service_config': JSON.stringify(defaultServiceConfig),
      },
      (serviceConfig: ServiceConfig) => {
        // onSuccessfulResolution: The default service config should be used.
        try {
          assert.strictEqual(
            serviceConfig.methodConfig.length,
            1,
            'Default service config should have one method config entry'
          );
          assert.strictEqual(
            serviceConfig.methodConfig[0].waitForReady,
            true,
            'waitForReady should be true from default service config'
          );
        } finally {
          rlb.destroy();
        }
        done();
      },
      status => {
        // onFailedResolution: This should NOT be called when a default
        // service config is available.
        rlb.destroy();
        done(
          new Error(
            'Resolution failed, but should have fallen back to default service config. ' +
              `Status: ${status.code} - ${status.details}`
          )
        );
      }
    );

    rlb.exitIdle();
  });

  it('reports the error when no default service config was provided', function (done) {
    this.timeout(5000);
    const channelControlHelper: ChannelControlHelper = {
      createSubchannel: subchannelAddress =>
        new MockSubchannel(subchannelAddressToString(subchannelAddress)),
      addChannelzChild: () => {},
      removeChannelzChild: () => {},
      requestReresolution: () => {},
      updateState: () => {},
    };
    const rlb = new ResolvingLoadBalancer(
      { scheme: 'test-invalid-sc', authority: undefined, path: 'test-target' },
      channelControlHelper,
      {},
      () => {
        rlb.destroy();
        done(
          new Error('Resolution should have failed without a default config')
        );
      },
      status => {
        rlb.destroy();
        assert.strictEqual(status.code, Status.UNAVAILABLE);
        done();
      }
    );
    rlb.exitIdle();
  });
});
