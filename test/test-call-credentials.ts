import { CallCredentials, CallMetadataGenerator } from '../src/call-credentials';
import { Metadata } from '../src/metadata';
import * as assert from 'assert';

function assertNoThrowAndReturn(fn: (...args: any[]) => void): any {
  let returnValue;
  assert.doesNotThrow(() => {
    returnValue = fn();
  });
  return returnValue;
}

const generateFromName: CallMetadataGenerator = (options, cb) => {
  const { name } = options;
  cb(null, new Metadata());
}

describe('CallCredentials', () => {
  describe('createFromMetadataGenerator', () => {
    it('should accept a metadata generator', () => {
      const callCredentials = CallCredentials.createFromMetadataGenerator(
    });
  });
});
