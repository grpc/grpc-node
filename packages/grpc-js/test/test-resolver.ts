/*
 * Copyright 2019 gRPC authors.
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

// Allow `any` data type for testing runtime type checking.
// tslint:disable no-any
import * as assert from 'assert';
import * as resolverManager from '../src/resolver';
import { ServiceConfig } from '../src/service-config';
import { StatusObject } from '../src/call-stream';
import { SubchannelAddress, isTcpSubchannelAddress } from '../src/subchannel';

describe('Name Resolver', () => {
  describe('DNS Names', function() {
    // For some reason DNS queries sometimes take a long time on Windows
    this.timeout(4000);
    before(() => {
      resolverManager.registerAll();
    });
    it('Should resolve localhost properly', done => {
      const target = 'localhost:50051';
      const listener: resolverManager.ResolverListener = {
        onSuccessfulResolution: (
          addressList: SubchannelAddress[],
          serviceConfig: ServiceConfig | null,
          serviceConfigError: StatusObject | null
        ) => {
          assert(
            addressList.some(
              addr =>
                isTcpSubchannelAddress(addr) &&
                addr.host === '127.0.0.1' &&
                addr.port === 50051
            )
          );
          // We would check for the IPv6 address but it needs to be omitted on some Node versions
          done();
        },
        onError: (error: StatusObject) => {
          done(new Error(`Failed with status ${error.details}`));
        },
      };
      const resolver = resolverManager.createResolver(target, listener);
      resolver.updateResolution();
    });
    it('Should default to port 443', done => {
      const target = 'localhost';
      const listener: resolverManager.ResolverListener = {
        onSuccessfulResolution: (
          addressList: SubchannelAddress[],
          serviceConfig: ServiceConfig | null,
          serviceConfigError: StatusObject | null
        ) => {
          assert(
            addressList.some(
              addr =>
                isTcpSubchannelAddress(addr) &&
                addr.host === '127.0.0.1' &&
                addr.port === 443
            )
          );
          // We would check for the IPv6 address but it needs to be omitted on some Node versions
          done();
        },
        onError: (error: StatusObject) => {
          done(new Error(`Failed with status ${error.details}`));
        },
      };
      const resolver = resolverManager.createResolver(target, listener);
      resolver.updateResolution();
    });
    it('Should correctly represent an ipv4 address', done => {
      const target = '1.2.3.4';
      const listener: resolverManager.ResolverListener = {
        onSuccessfulResolution: (
          addressList: SubchannelAddress[],
          serviceConfig: ServiceConfig | null,
          serviceConfigError: StatusObject | null
        ) => {
          assert(
            addressList.some(
              addr =>
                isTcpSubchannelAddress(addr) &&
                addr.host === '1.2.3.4' &&
                addr.port === 443
            )
          );
          // We would check for the IPv6 address but it needs to be omitted on some Node versions
          done();
        },
        onError: (error: StatusObject) => {
          done(new Error(`Failed with status ${error.details}`));
        },
      };
      const resolver = resolverManager.createResolver(target, listener);
      resolver.updateResolution();
    });
    it('Should correctly represent an ipv6 address', done => {
      const target = '::1';
      const listener: resolverManager.ResolverListener = {
        onSuccessfulResolution: (
          addressList: SubchannelAddress[],
          serviceConfig: ServiceConfig | null,
          serviceConfigError: StatusObject | null
        ) => {
          assert(
            addressList.some(
              addr =>
                isTcpSubchannelAddress(addr) &&
                addr.host === '::1' &&
                addr.port === 443
            )
          );
          // We would check for the IPv6 address but it needs to be omitted on some Node versions
          done();
        },
        onError: (error: StatusObject) => {
          done(new Error(`Failed with status ${error.details}`));
        },
      };
      const resolver = resolverManager.createResolver(target, listener);
      resolver.updateResolution();
    });
    it('Should correctly represent a bracketed ipv6 address', done => {
      const target = '[::1]:50051';
      const listener: resolverManager.ResolverListener = {
        onSuccessfulResolution: (
          addressList: SubchannelAddress[],
          serviceConfig: ServiceConfig | null,
          serviceConfigError: StatusObject | null
        ) => {
          assert(
            addressList.some(
              addr =>
                isTcpSubchannelAddress(addr) &&
                addr.host === '::1' &&
                addr.port === 50051
            )
          );
          // We would check for the IPv6 address but it needs to be omitted on some Node versions
          done();
        },
        onError: (error: StatusObject) => {
          done(new Error(`Failed with status ${error.details}`));
        },
      };
      const resolver = resolverManager.createResolver(target, listener);
      resolver.updateResolution();
    });
    it('Should resolve a public address', done => {
      const target = 'example.com';
      const listener: resolverManager.ResolverListener = {
        onSuccessfulResolution: (
          addressList: SubchannelAddress[],
          serviceConfig: ServiceConfig | null,
          serviceConfigError: StatusObject | null
        ) => {
          assert(addressList.length > 0);
          done();
        },
        onError: (error: StatusObject) => {
          done(new Error(`Failed with status ${error.details}`));
        },
      };
      const resolver = resolverManager.createResolver(target, listener);
      resolver.updateResolution();
    });
    it('Should resolve a name with multiple dots', done => {
      const target = 'loopback4.unittest.grpc.io';
      const listener: resolverManager.ResolverListener = {
        onSuccessfulResolution: (
          addressList: SubchannelAddress[],
          serviceConfig: ServiceConfig | null,
          serviceConfigError: StatusObject | null
        ) => {
          assert(addressList.length > 0);
          done();
        },
        onError: (error: StatusObject) => {
          done(new Error(`Failed with status ${error.details}`));
        },
      };
      const resolver = resolverManager.createResolver(target, listener);
      resolver.updateResolution();
    });
    it('Should resolve a name with a hyphen', done => {
      /* TODO(murgatroid99): Find or create a better domain name to test this with.
       * This is just the first one I found with a hyphen. */
      const target = 'network-tools.com';
      const listener: resolverManager.ResolverListener = {
        onSuccessfulResolution: (
          addressList: SubchannelAddress[],
          serviceConfig: ServiceConfig | null,
          serviceConfigError: StatusObject | null
        ) => {
          assert(addressList.length > 0);
          done();
        },
        onError: (error: StatusObject) => {
          done(new Error(`Failed with status ${error.details}`));
        },
      };
      const resolver = resolverManager.createResolver(target, listener);
      resolver.updateResolution();
    });
    it('Should resolve gRPC interop servers', done => {
      let completeCount = 0;
      function done2(error?: Error) {
        if (error) {
          done(error);
        } else {
          completeCount += 1;
          if (completeCount === 2) {
            done();
          }
        }
      }
      const target1 = 'grpc-test.sandbox.googleapis.com';
      const target2 = 'grpc-test4.sandbox.googleapis.com';
      const listener: resolverManager.ResolverListener = {
        onSuccessfulResolution: (
          addressList: SubchannelAddress[],
          serviceConfig: ServiceConfig | null,
          serviceConfigError: StatusObject | null
        ) => {
          assert(addressList.length > 0);
          done2();
        },
        onError: (error: StatusObject) => {
          done2(new Error(`Failed with status ${error.details}`));
        },
      };
      const resolver1 = resolverManager.createResolver(target1, listener);
      resolver1.updateResolution();
      const resolver2 = resolverManager.createResolver(target1, listener);
      resolver2.updateResolution();
    });
  });
  describe('UDS Names', () => {
    it('Should handle a relative Unix Domain Socket name', done => {
      const target = 'unix:socket';
      const listener: resolverManager.ResolverListener = {
        onSuccessfulResolution: (
          addressList: SubchannelAddress[],
          serviceConfig: ServiceConfig | null,
          serviceConfigError: StatusObject | null
        ) => {
          assert(
            addressList.some(
              addr => !isTcpSubchannelAddress(addr) && addr.path === 'socket'
            )
          );
          done();
        },
        onError: (error: StatusObject) => {
          done(new Error(`Failed with status ${error.details}`));
        },
      };
      const resolver = resolverManager.createResolver(target, listener);
      resolver.updateResolution();
    });
    it('Should handle an absolute Unix Domain Socket name', done => {
      const target = 'unix:///tmp/socket';
      const listener: resolverManager.ResolverListener = {
        onSuccessfulResolution: (
          addressList: SubchannelAddress[],
          serviceConfig: ServiceConfig | null,
          serviceConfigError: StatusObject | null
        ) => {
          assert(
            addressList.some(
              addr =>
                !isTcpSubchannelAddress(addr) && addr.path === '/tmp/socket'
            )
          );
          done();
        },
        onError: (error: StatusObject) => {
          done(new Error(`Failed with status ${error.details}`));
        },
      };
      const resolver = resolverManager.createResolver(target, listener);
      resolver.updateResolution();
    });
  });
  describe('getDefaultAuthority', () => {
    class OtherResolver implements resolverManager.Resolver {
      updateResolution() {
        return [];
      }

      static getDefaultAuthority(target: string): string {
        return 'other';
      }
    }

    it('Should return the correct authority if a different resolver has been registered', () => {
      const target = 'other://name';
      resolverManager.registerResolver('other:', OtherResolver);

      const authority = resolverManager.getDefaultAuthority(target);
      assert.equal(authority, 'other');
    });
  });
});
