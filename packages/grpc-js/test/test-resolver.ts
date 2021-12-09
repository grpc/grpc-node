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
import * as resolver_dns from '../src/resolver-dns';
import * as resolver_uds from '../src/resolver-uds';
import * as resolver_ip from '../src/resolver-ip';
import { ServiceConfig } from '../src/service-config';
import { StatusObject } from '../src/call-stream';
import { SubchannelAddress, isTcpSubchannelAddress, subchannelAddressToString } from "../src/subchannel-address";
import { parseUri, GrpcUri } from '../src/uri-parser';

describe('Name Resolver', () => {
  before(() => {
    resolver_dns.setup();
    resolver_uds.setup();
    resolver_ip.setup();
  });
  describe('DNS Names', function() {
    // For some reason DNS queries sometimes take a long time on Windows
    this.timeout(4000);
    it('Should resolve localhost properly', done => {
      const target = resolverManager.mapUriDefaultScheme(parseUri('localhost:50051')!)!;
      const listener: resolverManager.ResolverListener = {
        onSuccessfulResolution: (
          addressList: SubchannelAddress[],
          serviceConfig: ServiceConfig | null,
          serviceConfigError: StatusObject | null
        ) => {
          // Only handle the first resolution result
          listener.onSuccessfulResolution = () => {};
          assert(
            addressList.some(
              addr =>
                isTcpSubchannelAddress(addr) &&
                addr.host === '127.0.0.1' &&
                addr.port === 50051
            )
          );
          assert(
            addressList.some(
              addr =>
                isTcpSubchannelAddress(addr) &&
                addr.host === '::1' &&
                addr.port === 50051
            )
          );
          done();
        },
        onError: (error: StatusObject) => {
          done(new Error(`Failed with status ${error.details}`));
        },
      };
      const resolver = resolverManager.createResolver(target, listener, {});
      resolver.updateResolution();
    });
    it('Should default to port 443', done => {
      const target = resolverManager.mapUriDefaultScheme(parseUri('localhost')!)!;
      const listener: resolverManager.ResolverListener = {
        onSuccessfulResolution: (
          addressList: SubchannelAddress[],
          serviceConfig: ServiceConfig | null,
          serviceConfigError: StatusObject | null
        ) => {
          // Only handle the first resolution result
          listener.onSuccessfulResolution = () => {};
          assert(
            addressList.some(
              addr =>
                isTcpSubchannelAddress(addr) &&
                addr.host === '127.0.0.1' &&
                addr.port === 443
            )
          );
          assert(
            addressList.some(
              addr =>
                isTcpSubchannelAddress(addr) &&
                addr.host === '::1' &&
                addr.port === 443
            )
          );
          done();
        },
        onError: (error: StatusObject) => {
          done(new Error(`Failed with status ${error.details}`));
        },
      };
      const resolver = resolverManager.createResolver(target, listener, {});
      resolver.updateResolution();
    });
    it('Should correctly represent an ipv4 address', done => {
      const target = resolverManager.mapUriDefaultScheme(parseUri('1.2.3.4')!)!;
      const listener: resolverManager.ResolverListener = {
        onSuccessfulResolution: (
          addressList: SubchannelAddress[],
          serviceConfig: ServiceConfig | null,
          serviceConfigError: StatusObject | null
        ) => {
          // Only handle the first resolution result
          listener.onSuccessfulResolution = () => {};
          assert(
            addressList.some(
              addr =>
                isTcpSubchannelAddress(addr) &&
                addr.host === '1.2.3.4' &&
                addr.port === 443
            )
          );
          done();
        },
        onError: (error: StatusObject) => {
          done(new Error(`Failed with status ${error.details}`));
        },
      };
      const resolver = resolverManager.createResolver(target, listener, {});
      resolver.updateResolution();
    });
    it('Should correctly represent an ipv6 address', done => {
      const target = resolverManager.mapUriDefaultScheme(parseUri('::1')!)!;
      const listener: resolverManager.ResolverListener = {
        onSuccessfulResolution: (
          addressList: SubchannelAddress[],
          serviceConfig: ServiceConfig | null,
          serviceConfigError: StatusObject | null
        ) => {
          // Only handle the first resolution result
          listener.onSuccessfulResolution = () => {};
          assert(
            addressList.some(
              addr =>
                isTcpSubchannelAddress(addr) &&
                addr.host === '::1' &&
                addr.port === 443
            )
          );
          done();
        },
        onError: (error: StatusObject) => {
          done(new Error(`Failed with status ${error.details}`));
        },
      };
      const resolver = resolverManager.createResolver(target, listener, {});
      resolver.updateResolution();
    });
    it('Should correctly represent a bracketed ipv6 address', done => {
      const target = resolverManager.mapUriDefaultScheme(parseUri('[::1]:50051')!)!;
      const listener: resolverManager.ResolverListener = {
        onSuccessfulResolution: (
          addressList: SubchannelAddress[],
          serviceConfig: ServiceConfig | null,
          serviceConfigError: StatusObject | null
        ) => {
          // Only handle the first resolution result
          listener.onSuccessfulResolution = () => {};
          assert(
            addressList.some(
              addr =>
                isTcpSubchannelAddress(addr) &&
                addr.host === '::1' &&
                addr.port === 50051
            )
          );
          done();
        },
        onError: (error: StatusObject) => {
          done(new Error(`Failed with status ${error.details}`));
        },
      };
      const resolver = resolverManager.createResolver(target, listener, {});
      resolver.updateResolution();
    });
    it('Should resolve a public address', done => {
      const target = resolverManager.mapUriDefaultScheme(parseUri('example.com')!)!;
      const listener: resolverManager.ResolverListener = {
        onSuccessfulResolution: (
          addressList: SubchannelAddress[],
          serviceConfig: ServiceConfig | null,
          serviceConfigError: StatusObject | null
        ) => {
          // Only handle the first resolution result
          listener.onSuccessfulResolution = () => {};
          assert(addressList.length > 0);
          done();
        },
        onError: (error: StatusObject) => {
          done(new Error(`Failed with status ${error.details}`));
        },
      };
      const resolver = resolverManager.createResolver(target, listener, {});
      resolver.updateResolution();
    });
    /* The DNS entry for loopback4.unittest.grpc.io only has a single A record
     * with the address 127.0.0.1, but the Mac DNS resolver appears to use
     * NAT64 to create an IPv6 address in that case, so it instead returns
     * 64:ff9b::7f00:1. Handling that kind of translation is outside of the
     * scope of this test, so we are skipping it. The test primarily exists
     * as a regression test for https://github.com/grpc/grpc-node/issues/1044,
     * and the test 'Should resolve gRPC interop servers' tests the same thing.
     */
    it.skip('Should resolve a name with multiple dots', done => {
      const target = resolverManager.mapUriDefaultScheme(parseUri('loopback4.unittest.grpc.io')!)!;
      const listener: resolverManager.ResolverListener = {
        onSuccessfulResolution: (
          addressList: SubchannelAddress[],
          serviceConfig: ServiceConfig | null,
          serviceConfigError: StatusObject | null
        ) => {
          // Only handle the first resolution result
          listener.onSuccessfulResolution = () => {};
          assert(
            addressList.some(
              addr =>
                isTcpSubchannelAddress(addr) &&
                addr.host === '127.0.0.1' &&
                addr.port === 443
            ), `None of [${addressList.map(addr => subchannelAddressToString(addr))}] matched '127.0.0.1:443'`
          );
          done();
        },
        onError: (error: StatusObject) => {
          done(new Error(`Failed with status ${error.details}`));
        },
      };
      const resolver = resolverManager.createResolver(target, listener, {});
      resolver.updateResolution();
    });
    /* TODO(murgatroid99): re-enable this test, once we can get the IPv6 result
     * consistently */
    it.skip('Should resolve a DNS name to an IPv6 address', done => {
      const target = resolverManager.mapUriDefaultScheme(parseUri('loopback6.unittest.grpc.io')!)!;
      const listener: resolverManager.ResolverListener = {
        onSuccessfulResolution: (
          addressList: SubchannelAddress[],
          serviceConfig: ServiceConfig | null,
          serviceConfigError: StatusObject | null
        ) => {
          // Only handle the first resolution result
          listener.onSuccessfulResolution = () => {};
          assert(
            addressList.some(
              addr =>
                isTcpSubchannelAddress(addr) &&
                addr.host === '::1' &&
                addr.port === 443
            )
          );
          done();
        },
        onError: (error: StatusObject) => {
          done(new Error(`Failed with status ${error.details}`));
        },
      };
      const resolver = resolverManager.createResolver(target, listener, {});
      resolver.updateResolution();
    });
    /* This DNS name resolves to only the IPv4 address on Windows, and only the
     * IPv6 address on Mac. There is no result that we can consistently test
     * for here. */
    it.skip('Should resolve a DNS name to IPv4 and IPv6 addresses', done => {
      const target = resolverManager.mapUriDefaultScheme(parseUri('loopback46.unittest.grpc.io')!)!;
      const listener: resolverManager.ResolverListener = {
        onSuccessfulResolution: (
          addressList: SubchannelAddress[],
          serviceConfig: ServiceConfig | null,
          serviceConfigError: StatusObject | null
        ) => {
          // Only handle the first resolution result
          listener.onSuccessfulResolution = () => {};
          assert(
            addressList.some(
              addr =>
                isTcpSubchannelAddress(addr) &&
                addr.host === '127.0.0.1' &&
                addr.port === 443
            ), `None of [${addressList.map(addr => subchannelAddressToString(addr))}] matched '127.0.0.1:443'`
          );
          /* TODO(murgatroid99): check for IPv6 result, once we can get that
           * consistently */
          done();
        },
        onError: (error: StatusObject) => {
          done(new Error(`Failed with status ${error.details}`));
        },
      };
      const resolver = resolverManager.createResolver(target, listener, {});
      resolver.updateResolution();
    });
    it('Should resolve a name with a hyphen', done => {
      /* TODO(murgatroid99): Find or create a better domain name to test this with.
       * This is just the first one I found with a hyphen. */
      const target = resolverManager.mapUriDefaultScheme(parseUri('network-tools.com')!)!;
      const listener: resolverManager.ResolverListener = {
        onSuccessfulResolution: (
          addressList: SubchannelAddress[],
          serviceConfig: ServiceConfig | null,
          serviceConfigError: StatusObject | null
        ) => {
          // Only handle the first resolution result
          listener.onSuccessfulResolution = () => {};
          assert(addressList.length > 0);
          done();
        },
        onError: (error: StatusObject) => {
          done(new Error(`Failed with status ${error.details}`));
        },
      };
      const resolver = resolverManager.createResolver(target, listener, {});
      resolver.updateResolution();
    });
    /* This test also serves as a regression test for
     * https://github.com/grpc/grpc-node/issues/1044, specifically handling
     * hyphens and multiple periods in a DNS name. It should not be skipped
     * unless there is another test for the same issue. */
    it('Should resolve gRPC interop servers', done => {
      let completeCount = 0;
      const target1 = resolverManager.mapUriDefaultScheme(parseUri('grpc-test.sandbox.googleapis.com')!)!;
      const target2 = resolverManager.mapUriDefaultScheme(parseUri('grpc-test4.sandbox.googleapis.com')!)!;
      const listener: resolverManager.ResolverListener = {
        onSuccessfulResolution: (
          addressList: SubchannelAddress[],
          serviceConfig: ServiceConfig | null,
          serviceConfigError: StatusObject | null
        ) => {
          assert(addressList.length > 0);
          completeCount += 1;
          if (completeCount === 2) {
            // Only handle the first resolution result
            listener.onSuccessfulResolution = () => {};
            done();
          }
        },
        onError: (error: StatusObject) => {
          done(new Error(`Failed with status ${error.details}`));
        },
      };
      const resolver1 = resolverManager.createResolver(target1, listener, {});
      resolver1.updateResolution();
      const resolver2 = resolverManager.createResolver(target2, listener, {});
      resolver2.updateResolution();
    });
  });
  describe('UDS Names', () => {
    it('Should handle a relative Unix Domain Socket name', done => {
      const target = resolverManager.mapUriDefaultScheme(parseUri('unix:socket')!)!;
      const listener: resolverManager.ResolverListener = {
        onSuccessfulResolution: (
          addressList: SubchannelAddress[],
          serviceConfig: ServiceConfig | null,
          serviceConfigError: StatusObject | null
        ) => {
          // Only handle the first resolution result
          listener.onSuccessfulResolution = () => {};
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
      const resolver = resolverManager.createResolver(target, listener, {});
      resolver.updateResolution();
    });
    it('Should handle an absolute Unix Domain Socket name', done => {
      const target = resolverManager.mapUriDefaultScheme(parseUri('unix:///tmp/socket')!)!;
      const listener: resolverManager.ResolverListener = {
        onSuccessfulResolution: (
          addressList: SubchannelAddress[],
          serviceConfig: ServiceConfig | null,
          serviceConfigError: StatusObject | null
        ) => {
          // Only handle the first resolution result
          listener.onSuccessfulResolution = () => {};
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
      const resolver = resolverManager.createResolver(target, listener, {});
      resolver.updateResolution();
    });
  });
  describe('IP Addresses', () => {
    it('should handle one IPv4 address with no port', done => {
      const target = resolverManager.mapUriDefaultScheme(parseUri('ipv4:127.0.0.1')!)!;
      const listener: resolverManager.ResolverListener = {
        onSuccessfulResolution: (
          addressList: SubchannelAddress[],
          serviceConfig: ServiceConfig | null,
          serviceConfigError: StatusObject | null
        ) => {
          // Only handle the first resolution result
          listener.onSuccessfulResolution = () => {};
          assert(
            addressList.some(
              addr =>
                isTcpSubchannelAddress(addr) &&
                addr.host === '127.0.0.1' &&
                addr.port === 443
            )
          );
          done();
        },
        onError: (error: StatusObject) => {
          done(new Error(`Failed with status ${error.details}`));
        },
      };
      const resolver = resolverManager.createResolver(target, listener, {});
      resolver.updateResolution();
    });
    it('should handle one IPv4 address with a port', done => {
      const target = resolverManager.mapUriDefaultScheme(parseUri('ipv4:127.0.0.1:50051')!)!;
      const listener: resolverManager.ResolverListener = {
        onSuccessfulResolution: (
          addressList: SubchannelAddress[],
          serviceConfig: ServiceConfig | null,
          serviceConfigError: StatusObject | null
        ) => {
          // Only handle the first resolution result
          listener.onSuccessfulResolution = () => {};
          assert(
            addressList.some(
              addr =>
                isTcpSubchannelAddress(addr) &&
                addr.host === '127.0.0.1' &&
                addr.port === 50051
            )
          );
          done();
        },
        onError: (error: StatusObject) => {
          done(new Error(`Failed with status ${error.details}`));
        },
      };
      const resolver = resolverManager.createResolver(target, listener, {});
      resolver.updateResolution();
    });
    it('should handle multiple IPv4 addresses with different ports', done => {
      const target = resolverManager.mapUriDefaultScheme(parseUri('ipv4:127.0.0.1:50051,127.0.0.1:50052')!)!;
      const listener: resolverManager.ResolverListener = {
        onSuccessfulResolution: (
          addressList: SubchannelAddress[],
          serviceConfig: ServiceConfig | null,
          serviceConfigError: StatusObject | null
        ) => {
          // Only handle the first resolution result
          listener.onSuccessfulResolution = () => {};
          assert(
            addressList.some(
              addr =>
                isTcpSubchannelAddress(addr) &&
                addr.host === '127.0.0.1' &&
                addr.port === 50051
            )
          );
          assert(
            addressList.some(
              addr =>
                isTcpSubchannelAddress(addr) &&
                addr.host === '127.0.0.1' &&
                addr.port === 50052
            )
          );
          done();
        },
        onError: (error: StatusObject) => {
          done(new Error(`Failed with status ${error.details}`));
        },
      };
      const resolver = resolverManager.createResolver(target, listener, {});
      resolver.updateResolution();
    });
    it('should handle one IPv6 address with no port', done => {
      const target = resolverManager.mapUriDefaultScheme(parseUri('ipv6:::1')!)!;
      const listener: resolverManager.ResolverListener = {
        onSuccessfulResolution: (
          addressList: SubchannelAddress[],
          serviceConfig: ServiceConfig | null,
          serviceConfigError: StatusObject | null
        ) => {
          // Only handle the first resolution result
          listener.onSuccessfulResolution = () => {};
          assert(
            addressList.some(
              addr =>
                isTcpSubchannelAddress(addr) &&
                addr.host === '::1' &&
                addr.port === 443
            )
          );
          done();
        },
        onError: (error: StatusObject) => {
          done(new Error(`Failed with status ${error.details}`));
        },
      };
      const resolver = resolverManager.createResolver(target, listener, {});
      resolver.updateResolution();
    });
    it('should handle one IPv6 address with a port', done => {
      const target = resolverManager.mapUriDefaultScheme(parseUri('ipv6:[::1]:50051')!)!;
      const listener: resolverManager.ResolverListener = {
        onSuccessfulResolution: (
          addressList: SubchannelAddress[],
          serviceConfig: ServiceConfig | null,
          serviceConfigError: StatusObject | null
        ) => {
          // Only handle the first resolution result
          listener.onSuccessfulResolution = () => {};
          assert(
            addressList.some(
              addr =>
                isTcpSubchannelAddress(addr) &&
                addr.host === '::1' &&
                addr.port === 50051
            )
          );
          done();
        },
        onError: (error: StatusObject) => {
          done(new Error(`Failed with status ${error.details}`));
        },
      };
      const resolver = resolverManager.createResolver(target, listener, {});
      resolver.updateResolution();
    });
    it('should handle multiple IPv6 addresses with different ports', done => {
      const target = resolverManager.mapUriDefaultScheme(parseUri('ipv6:[::1]:50051,[::1]:50052')!)!;
      const listener: resolverManager.ResolverListener = {
        onSuccessfulResolution: (
          addressList: SubchannelAddress[],
          serviceConfig: ServiceConfig | null,
          serviceConfigError: StatusObject | null
        ) => {
          // Only handle the first resolution result
          listener.onSuccessfulResolution = () => {};
          assert(
            addressList.some(
              addr =>
                isTcpSubchannelAddress(addr) &&
                addr.host === '::1' &&
                addr.port === 50051
            )
          );
          assert(
            addressList.some(
              addr =>
                isTcpSubchannelAddress(addr) &&
                addr.host === '::1' &&
                addr.port === 50052
            )
          );
          done();
        },
        onError: (error: StatusObject) => {
          done(new Error(`Failed with status ${error.details}`));
        },
      };
      const resolver = resolverManager.createResolver(target, listener, {});
      resolver.updateResolution();
    });
  });
  describe('getDefaultAuthority', () => {
    class OtherResolver implements resolverManager.Resolver {
      updateResolution() {
        return [];
      }

      destroy() {
      }

      static getDefaultAuthority(target: GrpcUri): string {
        return 'other';
      }
    }

    it('Should return the correct authority if a different resolver has been registered', () => {
      resolverManager.registerResolver('other', OtherResolver);
      const target = resolverManager.mapUriDefaultScheme(parseUri('other:name')!)!;
      console.log(target);

      const authority = resolverManager.getDefaultAuthority(target);
      assert.equal(authority, 'other');
    });
  });
});
