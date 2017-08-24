import { Metadata } from '../src/metadata';
import { CallCredentials, CallMetadataGenerator } from '../src/call-credentials';
import * as assert from 'assert';

// Returns a Promise that resolves to an object containing either an error or
// metadata
function generateMetadata(
  callCredentials: CallCredentials,
  options: Object
): Promise<{ err?: Error, metadata?: Metadata }> {
  return new Promise((resolve) => {
    callCredentials.generateMetadata(options, (err, metadata) => {
      resolve({ err: err || undefined, metadata: metadata || undefined });
    });
  });
}

// Metadata generators

function makeGenerator(props: Array<string>): CallMetadataGenerator {
  return (options: { [propName: string]: string }, cb) => {
    const metadata: Metadata = new Metadata();
    props.forEach((prop) => {
      if (options[prop]) {
        metadata.add(prop, options[prop]);
      }
    });
    cb(null, metadata);
  }
}

function makeAfterMsElapsedGenerator(ms: number): CallMetadataGenerator {
  return (_options, cb) => {
    const metadata = new Metadata();
    metadata.add('msElapsed', `${ms}`);
    setTimeout(() => cb(null, metadata), ms);
  };
};

const generateFromName: CallMetadataGenerator = makeGenerator(['name']);
const generateWithError: CallMetadataGenerator = (_options, cb) =>
  cb(new Error());

// Tests

describe('CallCredentials', () => {
  describe('createFromMetadataGenerator', () => {
    it('should accept a metadata generator', () => {
      assert.doesNotThrow(() =>
        CallCredentials.createFromMetadataGenerator(generateFromName));
    });
  });

  describe('compose', () => {
    it('should accept a CallCredentials object and return a new object', () => {
      const callCredentials1 = CallCredentials.createFromMetadataGenerator(generateFromName);
      const callCredentials2 = CallCredentials.createFromMetadataGenerator(generateFromName);
      const combinedCredentials = callCredentials1.compose(callCredentials2);
      assert.notEqual(combinedCredentials, callCredentials1);
      assert.notEqual(combinedCredentials, callCredentials2);
    });

    it('should be chainable', () => {
      const callCredentials1 = CallCredentials.createFromMetadataGenerator(generateFromName);
      const callCredentials2 = CallCredentials.createFromMetadataGenerator(generateFromName);
      assert.doesNotThrow(() => {
        callCredentials1.compose(callCredentials2)
          .compose(callCredentials2)
          .compose(callCredentials2);
      });
    });
  });

  describe('generateMetadata', () => {
    it('should call the function passed to createFromMetadataGenerator',
      async () => {
        const callCredentials = CallCredentials.createFromMetadataGenerator(generateFromName);
        const { err, metadata } = await generateMetadata(callCredentials,
          { name: 'foo' });
        assert.ok(!err);
        assert.ok(metadata);
        if (metadata) {
          assert.deepEqual(metadata.get('name'), ['foo']);
        }
      }
    );

    it('should emit an error if the associated metadataGenerator does',
      async () => {
        const callCredentials = CallCredentials.createFromMetadataGenerator(
          generateWithError);
        const { err, metadata } = await generateMetadata(callCredentials, {});
        assert.ok(err instanceof Error);
        assert.ok(!metadata);
      }
    );

    it('should combine metadata from multiple generators', async () => {
      const [callCreds1, callCreds2, callCreds3, callCreds4] =
        [50, 100, 150, 200].map((ms) => {
          const generator: CallMetadataGenerator =
            makeAfterMsElapsedGenerator(ms);
          return CallCredentials.createFromMetadataGenerator(generator);
        });
      const testCases = [{
          credentials: callCreds1
            .compose(callCreds2)
            .compose(callCreds3)
            .compose(callCreds4),
          expected: ['50', '100', '150', '200']
        }, {
          credentials: callCreds4
            .compose(callCreds3
              .compose(callCreds2
                .compose(callCreds1))),
          expected: ['200', '150', '100', '50']
        }, {
          credentials: callCreds3
            .compose(callCreds4
              .compose(callCreds1)
              .compose(callCreds2)),
          expected: ['150', '200', '50', '100']
        }
      ];
      const options = {};
      // Try each test case and make sure the msElapsed field is as expected
      await Promise.all(testCases.map(async (testCase) => {
        const { credentials, expected } = testCase;
        const { err, metadata } = await generateMetadata(credentials, options);
        assert.ok(!err);
        assert.ok(metadata);
        if (metadata) {
          assert.deepEqual(metadata.get('msElapsed'), expected);
        }
      }));
    });
  });
});
