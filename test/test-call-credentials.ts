import { Metadata } from '../src/metadata';
import { CallCredentials, CallMetadataGenerator } from '../src/call-credentials';
import { mockFunction } from './common';
import * as assert from 'assert';

class MetadataMock extends Metadata {
  constructor(private obj: { [propName: string]: Array<string> } = {}) {
    super();
  }

  add(key: string, value: string) {
    if (!this.obj[key]) {
      this.obj[key] = [value];
    } else {
      this.obj[key].push(value);
    }
  }
  clone() { return new MetadataMock(Object.create(this.obj)); };
  get(key: string) { return this.obj[key]; }
  getMap() { return this.obj; }
  set() { mockFunction() }
  remove() { mockFunction() }
}
Metadata.createMetadata = () => new MetadataMock();

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
    const metadata: Metadata = new MetadataMock();
    props.forEach((prop) => {
      if (options[prop]) {
        metadata.add(prop, options[prop]);
        metadata.add('allProps', options[prop]);
      }
    });
    cb(null, metadata);
  }
}

const generateFromName: CallMetadataGenerator = makeGenerator(['name']);
const generateWithError: CallMetadataGenerator = (_options, cb) =>
  cb(new Error());

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
          assert.deepEqual(metadata.getMap(), {
            name: ['foo'],
            allProps: ['foo']
          });
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
        ['a', 'b', 'c', 'd'].map((key) => {
          const generator: CallMetadataGenerator = makeGenerator([key]);
          return CallCredentials.createFromMetadataGenerator(generator);
        });
      const options = {
        a: 'foo',
        b: 'bar',
        c: 'baz',
        d: 'foobar'
      };

      { // two credentials
        const callCreds12 = callCreds1.compose(callCreds2);
        const { err, metadata } = await generateMetadata(callCreds12, options);
        assert.ok(!err);
        assert.ok(metadata);
        if (metadata) {
          assert.deepEqual(metadata.getMap(), {
            a: ['foo'],
            b: ['bar'],
            allProps: ['foo', 'bar']
          });
        }
      }

      { // three credentials, chained
        const callCreds123 = callCreds1.compose(callCreds2).compose(callCreds3);
        const { err, metadata } = await generateMetadata(callCreds123, options);
        assert.ok(!err);
        assert.ok(metadata);
        if (metadata) {
          assert.deepEqual(metadata.getMap(), {
            a: ['foo'],
            b: ['bar'],
            c: ['baz'],
            allProps: ['foo', 'bar', 'baz']
          });
        }
      }

      { // four credentials
        const callCreds1234 = callCreds1.compose(callCreds2)
          .compose(callCreds3.compose(callCreds4));
        const { err, metadata } = await generateMetadata(callCreds1234, options);
        assert.ok(!err);
        assert.ok(metadata);
        if (metadata) {
          assert.deepEqual(metadata.getMap(), {
            a: ['foo'],
            b: ['bar'],
            c: ['baz'],
            d: ['foobar'],
            allProps: ['foo', 'bar', 'baz', 'foobar']
          });
        }
      }

      { // four credentials in a different order, completely nested
        const callCreds4213 = callCreds4.compose(
          callCreds2.compose(callCreds1.compose(callCreds3)));
        const { err, metadata } = await generateMetadata(callCreds4213, options);
        assert.ok(!err);
        assert.ok(metadata);
        if (metadata) {
          assert.deepEqual(metadata.getMap(), {
            a: ['foo'],
            b: ['bar'],
            c: ['baz'],
            d: ['foobar'],
            allProps: ['foobar', 'bar', 'foo', 'baz']
          });
        }
      }

      { // four credentials in a different order, completely nested
        const errorCallCreds = CallCredentials.createFromMetadataGenerator(
          generateWithError);
        const callCreds123e = callCreds1.compose(callCreds2)
          .compose(callCreds3).compose(errorCallCreds);
        const { err, metadata } = await generateMetadata(callCreds123e, options);
        assert.ok(err instanceof Error);
        assert.ok(!metadata);
      }
    });
  });
});
