import { CallCredentials } from '../src/call-credentials';
import { ChannelCredentials } from '../src/channel-credentials';
import * as assert from 'assert';
import * as fs from 'fs';
import * as pify from 'pify';

class MockCallCredentials extends CallCredentials {
  child: MockCallCredentials;
  constructor(child?: MockCallCredentials) {
    super();
    if (child) {
      this.child = child;
    }
  }

  compose(callCredentials: CallCredentials): MockCallCredentials {
    return new MockCallCredentials(callCredentials as MockCallCredentials);
  }

  isEqual(other: MockCallCredentials): boolean {
    if (!this.child) {
      return this === other;
    } else if (!other.child) {
      return false;
    } else {
      return this.child.isEqual(other.child);
    }
  }
}

function assertNoThrowAndReturn(fn: (...args: any[]) => void): any {
  let returnValue;
  assert.doesNotThrow(() => {
    returnValue = fn();
  });
  return returnValue;
}

const readFile: (...args: any[]) => Promise<Buffer> = pify(fs.readFile);
const pFixtures = Promise.all([
    'ca.pem',
    'server1.key',
    'server1.pem'
  ].map((file) => readFile(`test/fixtures/${file}`)))
  .then((result) => {
    return {
      ca: result[0],
      key: result[1],
      cert: result[2]
    };
  });

describe('ChannelCredentials', () => {
  describe('createInsecure', () => {
    it('should return a ChannelCredentials object with no associated secure context', () => {
      const creds = assertNoThrowAndReturn(
        () => ChannelCredentials.createInsecure());
      assert.ok(creds instanceof ChannelCredentials);
      assert.ok(!creds.getSecureContext());
    });
  });

  describe('createSsl', () => {
    it('should work when given no arguments', () => {
      const creds = assertNoThrowAndReturn(
        () => ChannelCredentials.createSsl());
      assert.ok(creds instanceof ChannelCredentials);
      assert.ok(!!creds.getSecureContext());
      assert.ok(!!creds.getSecureContext().context);
    });

    it('should work with just a CA override', async () => {
      const { ca } = await pFixtures;
      const creds = assertNoThrowAndReturn(
        () => ChannelCredentials.createSsl(ca));
      assert.ok(creds instanceof ChannelCredentials);
      assert.ok(!!creds.getSecureContext());
      assert.ok(!!creds.getSecureContext().context);
    });

    it('should work with just a private key and cert chain', async () => {
      const { key, cert } = await pFixtures;
      const creds = assertNoThrowAndReturn(
        () => ChannelCredentials.createSsl(null, key, cert));
      assert.ok(creds instanceof ChannelCredentials);
      assert.ok(!!creds.getSecureContext());
      assert.ok(!!creds.getSecureContext().context);
    });

    it('should work with all three parameters specified', async () => {
      const { ca, key, cert } = await pFixtures;
      const creds = assertNoThrowAndReturn(
        () => ChannelCredentials.createSsl(ca, key, cert));
      assert.ok(creds instanceof ChannelCredentials);
      assert.ok(!!creds.getSecureContext());
      assert.ok(!!creds.getSecureContext().context);
    });

    it('should throw if just one of private key and cert chain are missing',
      async () => {
        const { ca, key, cert } = await pFixtures;
        assert.throws(() => ChannelCredentials.createSsl(ca, key));
        assert.throws(() => ChannelCredentials.createSsl(ca, key, null));
        assert.throws(() => ChannelCredentials.createSsl(ca, null, cert));
        assert.throws(() => ChannelCredentials.createSsl(null, key));
        assert.throws(() => ChannelCredentials.createSsl(null, key, null));
        assert.throws(() => ChannelCredentials.createSsl(null, null, cert));
      });
  });

  describe('compose', () => {
    it('should return a ChannelCredentials object', () => {
      const channelCreds = ChannelCredentials.createInsecure();
      const callCreds = new MockCallCredentials();
      const composedChannelCreds = channelCreds.compose(callCreds);
      assert.ok(!channelCreds.getCallCredentials());
      assert.strictEqual(composedChannelCreds.getCallCredentials(),
        callCreds);
    });

    it('should be chainable', () => {
      const callCreds1 = new MockCallCredentials();
      const callCreds2 = new MockCallCredentials();
      // Associate both call credentials with channelCreds
      const composedChannelCreds = ChannelCredentials.createInsecure()
        .compose(callCreds1)
        .compose(callCreds2);
      // Build a mock object that should be an identical copy
      const composedCallCreds = callCreds1.compose(callCreds2);
      assert.ok(composedCallCreds.isEqual(
        composedChannelCreds.getCallCredentials() as MockCallCredentials));
    });
  })
});
