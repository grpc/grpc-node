import * as assert from 'assert';
import { Metadata } from '../src/metadata';

describe('Metadata', () => {
  let metadata: Metadata;

  beforeEach(() => {
    metadata = new Metadata();
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
      assert.throws(() => {
        metadata.set('key$', 'value');
      });
      assert.throws(() => {
        metadata.set('', 'value');
      });
    });

    it('Rejects values with non-ASCII characters', () => {
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
      metadata.add('KEY3', 'value3');
      assert.deepEqual(metadata.getMap(),
                       {key1: 'value1',
                        key2: 'value2',
                        key3: 'value3'});
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
});