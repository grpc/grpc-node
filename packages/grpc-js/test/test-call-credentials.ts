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

import * as assert from 'assert';

import {
  CallCredentials,
  CallMetadataGenerator,
  isEmptyCallCredentials,
} from '../src/call-credentials';
import { ConnectivityState } from '../src/connectivity-state';
import { Status } from '../src/constants';
import { LoadBalancingCall } from '../src/load-balancing-call';
import { Metadata } from '../src/metadata';
import { PickResultType } from '../src/picker';

// Metadata generators

function makeAfterMsElapsedGenerator(ms: number): CallMetadataGenerator {
  return (options, cb) => {
    const metadata = new Metadata();
    metadata.add('msElapsed', `${ms}`);
    setTimeout(() => cb(null, metadata), ms);
  };
}

const generateFromServiceURL: CallMetadataGenerator = (options, cb) => {
  const metadata: Metadata = new Metadata();
  metadata.add('service_url', options.service_url);
  cb(null, metadata);
};
const generateWithError: CallMetadataGenerator = (options, cb) =>
  cb(new Error());

// Tests

describe('CallCredentials', () => {
  describe('createFromMetadataGenerator', () => {
    it('should accept a metadata generator', () => {
      assert.doesNotThrow(() =>
        CallCredentials.createFromMetadataGenerator(generateFromServiceURL)
      );
    });
  });

  describe('isEmptyCallCredentials', () => {
    it('should return true for empty call credentials', () => {
      const emptyCredentials = CallCredentials.createEmpty();
      assert.strictEqual(isEmptyCallCredentials(emptyCredentials), true);
      assert.strictEqual(
        isEmptyCallCredentials(emptyCredentials.compose(emptyCredentials)),
        true
      );
    });

    it('should return false for non-empty call credentials', () => {
      const callCredentials1 = CallCredentials.createFromMetadataGenerator(
        generateFromServiceURL
      );
      const callCredentials2 = CallCredentials.createFromMetadataGenerator(
        generateFromServiceURL
      );
      assert.strictEqual(isEmptyCallCredentials(callCredentials1), false);
      assert.strictEqual(
        isEmptyCallCredentials(
          callCredentials1.compose(CallCredentials.createEmpty())
        ),
        false
      );
      assert.strictEqual(
        isEmptyCallCredentials(callCredentials1.compose(callCredentials2)),
        false
      );
    });
  });

  describe('compose', () => {
    it('should accept a CallCredentials object and return a new object', () => {
      const callCredentials1 = CallCredentials.createFromMetadataGenerator(
        generateFromServiceURL
      );
      const callCredentials2 = CallCredentials.createFromMetadataGenerator(
        generateFromServiceURL
      );
      const combinedCredentials = callCredentials1.compose(callCredentials2);
      assert.notStrictEqual(combinedCredentials, callCredentials1);
      assert.notStrictEqual(combinedCredentials, callCredentials2);
    });

    it('should return the same object when composed with empty credentials', async () => {
      const callCredentials1 = CallCredentials.createFromMetadataGenerator(
        generateFromServiceURL
      );
      const callCredentials2 = CallCredentials.createFromMetadataGenerator(
        generateFromServiceURL
      );
      const emptyCredentials = CallCredentials.createEmpty();
      assert.strictEqual(
        emptyCredentials.compose(emptyCredentials),
        emptyCredentials
      );
      assert.strictEqual(
        callCredentials1.compose(emptyCredentials),
        callCredentials1
      );
      assert.strictEqual(
        emptyCredentials.compose(callCredentials1),
        callCredentials1
      );
      const combinedCredentials = callCredentials1.compose(callCredentials2);
      assert.strictEqual(
        combinedCredentials.compose(emptyCredentials),
        combinedCredentials
      );
      assert.strictEqual(
        emptyCredentials.compose(combinedCredentials),
        combinedCredentials
      );
      const metadata = await callCredentials1
        .compose(emptyCredentials)
        .generateMetadata({
          method_name: 'bar',
          service_url: 'foo',
        });
      assert.deepStrictEqual(metadata.get('service_url'), ['foo']);
    });

    it('should be chainable', () => {
      const callCredentials1 = CallCredentials.createFromMetadataGenerator(
        generateFromServiceURL
      );
      const callCredentials2 = CallCredentials.createFromMetadataGenerator(
        generateFromServiceURL
      );
      assert.doesNotThrow(() => {
        callCredentials1
          .compose(callCredentials2)
          .compose(callCredentials2)
          .compose(callCredentials2);
      });
    });
  });

  describe('generateMetadata', () => {
    it('should call the function passed to createFromMetadataGenerator', async () => {
      const callCredentials = CallCredentials.createFromMetadataGenerator(
        generateFromServiceURL
      );
      const metadata: Metadata = await callCredentials.generateMetadata({
        method_name: 'bar',
        service_url: 'foo',
      });

      assert.deepStrictEqual(metadata.get('service_url'), ['foo']);
    });

    it('should emit an error if the associated metadataGenerator does', async () => {
      const callCredentials =
        CallCredentials.createFromMetadataGenerator(generateWithError);
      let metadata: Metadata | null = null;
      try {
        metadata = await callCredentials.generateMetadata({ method_name: '', service_url: '' });
      } catch (err) {
        assert.ok(err instanceof Error);
      }
      assert.strictEqual(metadata, null);
    });

    it('should combine metadata from multiple generators', async () => {
      const [callCreds1, callCreds2, callCreds3, callCreds4] = [
        50, 100, 150, 200,
      ].map(ms => {
        const generator: CallMetadataGenerator =
          makeAfterMsElapsedGenerator(ms);
        return CallCredentials.createFromMetadataGenerator(generator);
      });
      const testCases = [
        {
          credentials: callCreds1
            .compose(callCreds2)
            .compose(callCreds3)
            .compose(callCreds4),
          expected: ['50', '100', '150', '200'],
        },
        {
          credentials: callCreds4.compose(
            callCreds3.compose(callCreds2.compose(callCreds1))
          ),
          expected: ['200', '150', '100', '50'],
        },
        {
          credentials: callCreds3.compose(
            callCreds4.compose(callCreds1).compose(callCreds2)
          ),
          expected: ['150', '200', '50', '100'],
        },
      ];
      // Try each test case and make sure the msElapsed field is as expected
      await Promise.all(
        testCases.map(async testCase => {
          const { credentials, expected } = testCase;
          const metadata: Metadata = await credentials.generateMetadata({
            method_name: '',
            service_url: '',
          });

          assert.deepStrictEqual(metadata.get('msElapsed'), expected);
        })
      );
    });
  });

  describe('LoadBalancingCall integration', () => {
    function runLoadBalancingCallPick(
      callCredentials: CallCredentials,
      subchannelCredentials: CallCredentials,
      initialMetadata: Metadata
    ): Promise<Metadata> {
      return new Promise<Metadata>((resolve, reject) => {
        const mockSubchannel: any = {
          getCallCredentials: () => subchannelCredentials,
          getConnectivityState: () => ConnectivityState.READY,
          getRealSubchannel: () => mockSubchannel,
          getChannelzRef: () => ({ id: 1 }),
          getAddress: () => 'localhost:12345',
          createCall: (metadata: Metadata) => {
            resolve(metadata);
            return {
              getCallNumber: () => 1,
              startRead: () => {},
              sendMessageWithContext: () => {},
              halfClose: () => {},
              cancelWithStatus: () => {},
            };
          },
        };
        const mockChannel: any = {
          doPick: () => ({
            pickResultType: PickResultType.COMPLETE,
            subchannel: mockSubchannel,
            status: null,
            onCallStarted: null,
            onCallEnded: null,
          }),
        };
        const callConfig: any = {
          methodConfig: { name: [] },
          pickInformation: {},
          status: Status.OK,
          dynamicFilterFactories: [],
        };
        const call = new LoadBalancingCall(
          mockChannel,
          callConfig,
          '/service/method',
          'localhost:12345',
          callCredentials,
          Infinity,
          1
        );
        call.start(initialMetadata, {
          onReceiveMetadata: () => {},
          onReceiveMessage: () => {},
          onReceiveStatus: status => {
            reject(new Error(`Unexpected status: ${status.details}`));
          },
        });
      });
    }

    it('should bypass generateMetadata when credentials are empty', async () => {
      const emptyPrototype = Object.getPrototypeOf(
        CallCredentials.createEmpty()
      );
      const originalGenerateMetadata = emptyPrototype.generateMetadata;
      let generateMetadataCalls = 0;
      emptyPrototype.generateMetadata = function (
        ...args: Parameters<CallCredentials['generateMetadata']>
      ) {
        generateMetadataCalls += 1;
        return originalGenerateMetadata.apply(this, args);
      };
      try {
        const initialMetadata = new Metadata();
        initialMetadata.set('custom-key', 'custom-value');
        const finalMetadata = await runLoadBalancingCallPick(
          CallCredentials.createEmpty(),
          CallCredentials.createEmpty(),
          initialMetadata
        );
        assert.strictEqual(generateMetadataCalls, 0);
        assert.deepStrictEqual(finalMetadata.get('custom-key'), [
          'custom-value',
        ]);
      } finally {
        emptyPrototype.generateMetadata = originalGenerateMetadata;
      }
    });

    it('should call generateMetadata and merge metadata when credentials are non-empty', async () => {
      const initialMetadata = new Metadata();
      initialMetadata.set('custom-key', 'custom-value');
      const callCredentials = CallCredentials.createFromMetadataGenerator(
        generateFromServiceURL
      );
      const finalMetadata = await runLoadBalancingCallPick(
        callCredentials,
        CallCredentials.createEmpty(),
        initialMetadata
      );
      assert.deepStrictEqual(finalMetadata.get('custom-key'), ['custom-value']);
      assert.deepStrictEqual(finalMetadata.get('service_url'), [
        'https://localhost/service',
      ]);
    });
  });
});
