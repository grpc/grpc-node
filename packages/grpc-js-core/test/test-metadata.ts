import * as assert from 'assert';
import * as http2 from 'http2';
import {range} from 'lodash';
import {Metadata} from '../src/metadata';

class TestMetadata extends Metadata {
  getInternalRepresentation() {
    return this.internalRepr;
  }

  static fromHttp2Headers(headers: http2.IncomingHttpHeaders): TestMetadata {
    const result = Metadata.fromHttp2Headers(headers) as TestMetadata;
    result.getInternalRepresentation =
        TestMetadata.prototype.getInternalRepresentation;
    return result;
  }
}

const validKeyChars = '0123456789abcdefghijklmnopqrstuvwxyz_-.';
const validNonBinValueChars =
    range(0x20, 0x7f).map(code => String.fromCharCode(code)).join('');

describe('Metadata', () => {
  let metadata: TestMetadata;

  beforeEach(() => {
    metadata = new TestMetadata();
  });

  describe('set', () => {
    it('Only accepts string values for non "-bin" keys', () => {
      assert.throws(() => {
        metadata.set('key', new Buffer('value'));
      });
      assert.doesNotThrow(() => {
        metadata.set('key', 'value');
      });
    });

    it('Only accepts Buffer values for "-bin" keys', () => {
      assert.throws(() => {
        metadata.set('key-bin', 'value');
      });
      assert.doesNotThrow(() => {
        metadata.set('key-bin', new Buffer('value'));
      });
    });

    it('Rejects invalid keys', () => {
      assert.doesNotThrow(() => {
        metadata.set(validKeyChars, 'value');
      });
      assert.throws(() => {
        metadata.set('key$', 'value');
      });
      assert.throws(() => {
        metadata.set('', 'value');
      });
    });

    it('Rejects values with non-ASCII characters', () => {
      assert.doesNotThrow(() => {
        metadata.set('key', validNonBinValueChars);
      });
      assert.throws(() => {
        metadata.set('key', 'résumé');
      });
    });

    it('Saves values that can be retrieved', () => {
      metadata.set('key', 'value');
      assert.deepEqual(metadata.get('key'), ['value']);
    });

    it('Overwrites previous values', () => {
      metadata.set('key', 'value1');
      metadata.set('key', 'value2');
      assert.deepEqual(metadata.get('key'), ['value2']);
    });

    it('Normalizes keys', () => {
      metadata.set('Key', 'value1');
      assert.deepEqual(metadata.get('key'), ['value1']);
      metadata.set('KEY', 'value2');
      assert.deepEqual(metadata.get('key'), ['value2']);
    });
  });

  describe('add', () => {
    it('Only accepts string values for non "-bin" keys', () => {
      assert.throws(() => {
        metadata.add('key', new Buffer('value'));
      });
      assert.doesNotThrow(() => {
        metadata.add('key', 'value');
      });
    });

    it('Only accepts Buffer values for "-bin" keys', () => {
      assert.throws(() => {
        metadata.add('key-bin', 'value');
      });
      assert.doesNotThrow(() => {
        metadata.add('key-bin', new Buffer('value'));
      });
    });

    it('Rejects invalid keys', () => {
      assert.throws(() => {
        metadata.add('key$', 'value');
      });
      assert.throws(() => {
        metadata.add('', 'value');
      });
    });

    it('Saves values that can be retrieved', () => {
      metadata.add('key', 'value');
      assert.deepEqual(metadata.get('key'), ['value']);
    });

    it('Combines with previous values', () => {
      metadata.add('key', 'value1');
      metadata.add('key', 'value2');
      assert.deepEqual(metadata.get('key'), ['value1', 'value2']);
    });

    it('Normalizes keys', () => {
      metadata.add('Key', 'value1');
      assert.deepEqual(metadata.get('key'), ['value1']);
      metadata.add('KEY', 'value2');
      assert.deepEqual(metadata.get('key'), ['value1', 'value2']);
    });
  });

  describe('remove', () => {
    it('clears values from a key', () => {
      metadata.add('key', 'value');
      metadata.remove('key');
      assert.deepEqual(metadata.get('key'), []);
    });

    it('Normalizes keys', () => {
      metadata.add('key', 'value');
      metadata.remove('KEY');
      assert.deepEqual(metadata.get('key'), []);
    });
  });

  describe('get', () => {
    beforeEach(() => {
      metadata.add('key', 'value1');
      metadata.add('key', 'value2');
      metadata.add('key-bin', new Buffer('value'));
    });

    it('gets all values associated with a key', () => {
      assert.deepEqual(metadata.get('key'), ['value1', 'value2']);
    });

    it('Normalizes keys', () => {
      assert.deepEqual(metadata.get('KEY'), ['value1', 'value2']);
    });

    it('returns an empty list for non-existent keys', () => {
      assert.deepEqual(metadata.get('non-existent-key'), []);
    });

    it('returns Buffers for "-bin" keys', () => {
      assert.ok(metadata.get('key-bin')[0] instanceof Buffer);
    });
  });

  describe('getMap', () => {
    it('gets a map of keys to values', () => {
      metadata.add('key1', 'value1');
      metadata.add('Key2', 'value2');
      metadata.add('KEY3', 'value3a');
      metadata.add('KEY3', 'value3b');
      assert.deepEqual(
          metadata.getMap(), {key1: 'value1', key2: 'value2', key3: 'value3a'});
    });
  });

  describe('clone', () => {
    it('retains values from the original', () => {
      metadata.add('key', 'value');
      const copy = metadata.clone();
      assert.deepEqual(copy.get('key'), ['value']);
    });

    it('Does not see newly added values', () => {
      metadata.add('key', 'value1');
      const copy = metadata.clone();
      metadata.add('key', 'value2');
      assert.deepEqual(copy.get('key'), ['value1']);
    });

    it('Does not add new values to the original', () => {
      metadata.add('key', 'value1');
      const copy = metadata.clone();
      copy.add('key', 'value2');
      assert.deepEqual(metadata.get('key'), ['value1']);
    });
  });

  describe('merge', () => {
    it('appends values from a given metadata object', () => {
      metadata.add('key1', 'value1');
      metadata.add('Key2', 'value2a');
      metadata.add('KEY3', 'value3a');
      metadata.add('key4', 'value4');
      const metadata2 = new TestMetadata();
      metadata2.add('KEY1', 'value1');
      metadata2.add('key2', 'value2b');
      metadata2.add('key3', 'value3b');
      metadata2.add('key5', 'value5a');
      metadata2.add('key5', 'value5b');
      const metadata2IR = metadata2.getInternalRepresentation();
      metadata.merge(metadata2);
      // Ensure metadata2 didn't change
      assert.deepEqual(metadata2.getInternalRepresentation(), metadata2IR);
      assert.deepEqual(metadata.get('key1'), ['value1', 'value1']);
      assert.deepEqual(metadata.get('key2'), ['value2a', 'value2b']);
      assert.deepEqual(metadata.get('key3'), ['value3a', 'value3b']);
      assert.deepEqual(metadata.get('key4'), ['value4']);
      assert.deepEqual(metadata.get('key5'), ['value5a', 'value5b']);
    });
  });

  describe('toHttp2Headers', () => {
    it('creates an OutgoingHttpHeaders object with expected values', () => {
      metadata.add('key1', 'value1');
      metadata.add('Key2', 'value2');
      metadata.add('KEY3', 'value3a');
      metadata.add('key3', 'value3b');
      metadata.add('key-bin', Buffer.from(range(0, 16)));
      metadata.add('key-bin', Buffer.from(range(16, 32)));
      metadata.add('key-bin', Buffer.from(range(0, 32)));
      const headers = metadata.toHttp2Headers();
      assert.deepEqual(headers, {
        key1: ['value1'],
        key2: ['value2'],
        key3: ['value3a', 'value3b'],
        'key-bin': [
          'AAECAwQFBgcICQoLDA0ODw==', 'EBESExQVFhcYGRobHB0eHw==',
          'AAECAwQFBgcICQoLDA0ODxAREhMUFRYXGBkaGxwdHh8='
        ]
      });
    });

    it('creates an empty header object from empty Metadata', () => {
      assert.deepEqual(metadata.toHttp2Headers(), {});
    });
  });

  describe('fromHttp2Headers', () => {
    it('creates a Metadata object with expected values', () => {
      const headers = {
        key1: 'value1',
        key2: ['value2'],
        key3: ['value3a', 'value3b'],
        'key-bin': [
          'AAECAwQFBgcICQoLDA0ODw==', 'EBESExQVFhcYGRobHB0eHw==',
          'AAECAwQFBgcICQoLDA0ODxAREhMUFRYXGBkaGxwdHh8='
        ]
      };
      const metadataFromHeaders = TestMetadata.fromHttp2Headers(headers);
      const internalRepr = metadataFromHeaders.getInternalRepresentation();
      assert.deepEqual(internalRepr, {
        key1: ['value1'],
        key2: ['value2'],
        key3: ['value3a', 'value3b'],
        'key-bin': [
          Buffer.from(range(0, 16)), Buffer.from(range(16, 32)),
          Buffer.from(range(0, 32))
        ]
      });
    });

    it('creates an empty Metadata object from empty headers', () => {
      const metadataFromHeaders = TestMetadata.fromHttp2Headers({});
      const internalRepr = metadataFromHeaders.getInternalRepresentation();
      assert.deepEqual(internalRepr, {});
    });
  });
});
