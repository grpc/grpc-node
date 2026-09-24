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
import { getDefaultConfigSelector } from '../src/resolving-load-balancer';
import { ServiceConfig } from '../src/service-config';
import { Metadata } from '../src/metadata';
import { Status } from '../src/constants';

describe('getDefaultConfigSelector', () => {
  const dummyMetadata = new Metadata();
  const dummyChannelId = 0;

  const sampleServiceConfigWithoutWildcard: ServiceConfig = {
    loadBalancingConfig: [],
    methodConfig: [
      {
        name: [{ service: 'TestService', method: 'SpecificMethod' }],
        timeout: { seconds: 10, nanos: 0 },
      },
      {
        name: [{ service: 'TestService' }],
        timeout: { seconds: 20, nanos: 0 },
      },
    ],
  };

  const sampleServiceConfigWithWildcard: ServiceConfig = {
    loadBalancingConfig: [],
    methodConfig: [
      {
        name: [{ service: 'TestService', method: 'SpecificMethod' }],
        timeout: { seconds: 10, nanos: 0 },
      },
      {
        name: [{ service: 'TestService' }],
        timeout: { seconds: 20, nanos: 0 },
      },
      {
        name: [{}],
        timeout: { seconds: 30, nanos: 0 },
      },
    ],
  };

  it('matches exact service and method', () => {
    const selector = getDefaultConfigSelector(
      sampleServiceConfigWithoutWildcard
    );
    const callConfig = selector.invoke(
      '/TestService/SpecificMethod',
      dummyMetadata,
      dummyChannelId
    );
    assert.strictEqual(callConfig.status, Status.OK);
    assert.strictEqual(callConfig.methodConfig.timeout?.seconds, 10);
  });

  it('matches service-level config when method does not match', () => {
    const selector = getDefaultConfigSelector(
      sampleServiceConfigWithoutWildcard
    );
    const callConfig = selector.invoke(
      '/TestService/OtherMethod',
      dummyMetadata,
      dummyChannelId
    );
    assert.strictEqual(callConfig.status, Status.OK);
    assert.strictEqual(callConfig.methodConfig.timeout?.seconds, 20);
  });

  it('returns empty name default config when serviceConfig is present but neither method nor service matches', () => {
    const selector = getDefaultConfigSelector(
      sampleServiceConfigWithoutWildcard
    );
    const callConfig = selector.invoke(
      '/OtherService/AnyMethod',
      dummyMetadata,
      dummyChannelId
    );
    assert.strictEqual(callConfig.status, Status.OK);
    assert.deepStrictEqual(callConfig.methodConfig.name, []);
    assert.strictEqual(callConfig.methodConfig.timeout, undefined);
  });

  it('matches empty name default config when service does not match and wildcard is present', () => {
    const selector = getDefaultConfigSelector(sampleServiceConfigWithWildcard);
    const callConfig = selector.invoke(
      '/OtherService/AnyMethod',
      dummyMetadata,
      dummyChannelId
    );
    assert.strictEqual(callConfig.status, Status.OK);
    assert.strictEqual(callConfig.methodConfig.timeout?.seconds, 30);
  });

  it('returns default config when serviceConfig is null', () => {
    const selector = getDefaultConfigSelector(null);
    const callConfig = selector.invoke(
      '/TestService/TestMethod',
      dummyMetadata,
      dummyChannelId
    );
    assert.strictEqual(callConfig.status, Status.OK);
    assert.deepStrictEqual(callConfig.methodConfig.name, []);
    assert.strictEqual(callConfig.methodConfig.timeout, undefined);
  });

  it('memoizes MethodConfig and returns isolated CallConfig containers', () => {
    const selector = getDefaultConfigSelector(
      sampleServiceConfigWithoutWildcard
    );
    const firstCallConfig = selector.invoke(
      '/TestService/SpecificMethod',
      dummyMetadata,
      dummyChannelId
    );
    const secondCallConfig = selector.invoke(
      '/TestService/SpecificMethod',
      dummyMetadata,
      dummyChannelId
    );

    // CallConfig containers must be isolated
    assert.notStrictEqual(firstCallConfig, secondCallConfig);
    assert.notStrictEqual(
      firstCallConfig.pickInformation,
      secondCallConfig.pickInformation
    );
    assert.notStrictEqual(
      firstCallConfig.dynamicFilterFactories,
      secondCallConfig.dynamicFilterFactories
    );

    // Underlying resolved MethodConfig must be memoized by reference
    assert.strictEqual(
      firstCallConfig.methodConfig,
      secondCallConfig.methodConfig
    );

    // Mutations on one call's pickInformation must not leak to the other
    (firstCallConfig.pickInformation as Record<string, string>)['testKey'] =
      'testValue';
    assert.strictEqual(
      (secondCallConfig.pickInformation as Record<string, string>)['testKey'],
      undefined
    );
  });

  it('bounds the cache size to 100 entries', () => {
    const selector = getDefaultConfigSelector(
      sampleServiceConfigWithoutWildcard
    );
    for (let methodIndex = 0; methodIndex < 150; methodIndex++) {
      const callConfig = selector.invoke(
        `/UnmatchedService/Method${methodIndex}`,
        dummyMetadata,
        dummyChannelId
      );
      assert.strictEqual(callConfig.status, Status.OK);
    }

    // Method0 was in the first 100 calls, so its resolved MethodConfig is cached by reference
    const firstCachedCallConfig = selector.invoke(
      '/UnmatchedService/Method0',
      dummyMetadata,
      dummyChannelId
    );
    const secondCachedCallConfig = selector.invoke(
      '/UnmatchedService/Method0',
      dummyMetadata,
      dummyChannelId
    );
    assert.strictEqual(
      firstCachedCallConfig.methodConfig,
      secondCachedCallConfig.methodConfig
    );

    // Method149 was beyond 100, so it was not cached; each invoke generates a fresh { name: [] }
    const firstUncachedCallConfig = selector.invoke(
      '/UnmatchedService/Method149',
      dummyMetadata,
      dummyChannelId
    );
    const secondUncachedCallConfig = selector.invoke(
      '/UnmatchedService/Method149',
      dummyMetadata,
      dummyChannelId
    );
    assert.strictEqual(firstUncachedCallConfig.status, Status.OK);
    assert.deepStrictEqual(
      firstUncachedCallConfig.methodConfig,
      secondUncachedCallConfig.methodConfig
    );
    assert.notStrictEqual(
      firstUncachedCallConfig.methodConfig,
      secondUncachedCallConfig.methodConfig
    );
  });

  it('clears the cache on unref()', () => {
    const selector = getDefaultConfigSelector(
      sampleServiceConfigWithoutWildcard
    );
    const firstCallConfig = selector.invoke(
      '/UnmatchedService/MethodX',
      dummyMetadata,
      dummyChannelId
    );
    selector.unref();

    // After unref, a subsequent invoke will recompute a fresh MethodConfig object
    const secondCallConfig = selector.invoke(
      '/UnmatchedService/MethodX',
      dummyMetadata,
      dummyChannelId
    );
    assert.deepStrictEqual(
      firstCallConfig.methodConfig,
      secondCallConfig.methodConfig
    );
    assert.notStrictEqual(
      firstCallConfig.methodConfig,
      secondCallConfig.methodConfig
    );
  });
});
