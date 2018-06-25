import * as assert from 'assert';
import * as fs from 'fs';
import {promisify} from 'util';

import {CallCredentials} from '../src/call-credentials';
import {ChannelCredentials} from '../src/channel-credentials';

import {assert2, mockFunction} from './common';

class CallCredentialsMock implements CallCredentials {
  child: CallCredentialsMock|null = null;
  constructor(child?: CallCredentialsMock) {
    if (child) {
      this.child = child;
    }
  }

  generateMetadata = mockFunction;

  compose(callCredentials: CallCredentialsMock): CallCredentialsMock {
    return new CallCredentialsMock(callCredentials);
  }

  isEqual(other: CallCredentialsMock): boolean {
    if (!this.child) {
      return this === other;
    } else if (!other || !other.child) {
      return false;
    } else {
      return this.child.isEqual(other.child);
    }
  }
}

// tslint:disable-next-line:no-any
const readFile: (...args: any[]) => Promise<Buffer> = promisify(fs.readFile);
// A promise which resolves to loaded files in the form { ca, key, cert }
const certFiles = [
  'somename_ca.pem',
  'somename_client.key',
  'somename_client.pem',
  'somename_usingpassphrase_client.key',
  'somename_usingpassphrase_client.pem',
  ]
const pCerts = Promise
                      .all(certFiles.map(
                          (file) => readFile(`${__dirname}/certs/${file}`)))
                      .then((result) => {
                        return {
                            ca: result[0],
                            key: result[1],
                            cert: result[2],
                            usingPassphraseKey: result[3],
                            usingPassphraseCert: result[4],
                        };
                      });
const passphrase = 'somepassphrase';
const badPassphrase = 'this-is-not-the-correct-passphrase';

describe('ChannelCredentials Implementation', () => {
  describe('createInsecure', () => {
    it('should return a ChannelCredentials object with no associated secure context',
       () => {
         const creds = assert2.noThrowAndReturn(
             () => ChannelCredentials.createInsecure());
         assert.ok(!creds.getSecureContext());
       });
  });

  describe('createSsl', () => {
    it('should work when given no arguments', () => {
      const creds: ChannelCredentials =
          assert2.noThrowAndReturn(() => ChannelCredentials.createSsl());
      assert.ok(!!creds.getSecureContext());
    });

    it('should work with just a CA override', async () => {
      const {ca} = await pCerts;
      const creds =
          assert2.noThrowAndReturn(() => ChannelCredentials.createSsl(ca));
      assert.ok(!!creds.getSecureContext());
    });

    it('should work with just a private key and cert chain', async () => {
      const {key, cert} = await pCerts;
      const creds = assert2.noThrowAndReturn(
          () => ChannelCredentials.createSsl(null, key, cert));
      assert.ok(!!creds.getSecureContext());
    });

    it('should work with a CA, private key and cert chain', async () => {
      const {ca, key, cert} = await pCerts;
      const creds = assert2.noThrowAndReturn(
          () => ChannelCredentials.createSsl(ca, key, cert));
      assert.ok(!!creds.getSecureContext());
    });

    it('should work with a private key, cert chain, and private key passphrase', async () => {
      const {usingPassphraseKey, usingPassphraseCert} = await pCerts;
      const creds = assert2.noThrowAndReturn(
          () => ChannelCredentials.createSsl(null, usingPassphraseKey, usingPassphraseCert, passphrase));
      assert.ok(!!creds.getSecureContext());
    });

    it('should work with a CA, private key, cert chain, and private key passphrase', async () => {
      const {ca, usingPassphraseKey, usingPassphraseCert} = await pCerts;
      const creds = assert2.noThrowAndReturn(
          () => ChannelCredentials.createSsl(ca, usingPassphraseKey, usingPassphraseCert, passphrase));
      assert.ok(!!creds.getSecureContext());
    });

    it('should throw an error with a bad passphrase', async () => {
      const {ca, usingPassphraseKey, usingPassphraseCert} = await pCerts;
      assert.throws(() => ChannelCredentials.createSsl(ca, usingPassphraseKey, usingPassphraseCert, badPassphrase));
    });

    it('should work with a CA, private key, cert chain, and private key passphrase when key is not passphrase-protected', async () => {
      const {ca, key, cert} = await pCerts;
      const creds = assert2.noThrowAndReturn(
          () => ChannelCredentials.createSsl(ca, key, cert, passphrase));
      assert.ok(!!creds.getSecureContext());
    });

    it('should throw if just one of private key and cert chain are missing',
       async () => {
         const {ca, key, cert} = await pCerts;
         assert.throws(() => ChannelCredentials.createSsl(ca, key));
         assert.throws(() => ChannelCredentials.createSsl(ca, key, null));
         assert.throws(() => ChannelCredentials.createSsl(ca, null, cert));
         assert.throws(() => ChannelCredentials.createSsl(null, key));
         assert.throws(() => ChannelCredentials.createSsl(null, key, null));
         assert.throws(() => ChannelCredentials.createSsl(null, null, cert));
      });

    it('should throw if passphrase is specified but key is missing', async () => {
      const {ca, usingPassphraseKey, usingPassphraseCert} = await pCerts;
      assert.throws(() => ChannelCredentials.createSsl(ca, null, null, passphrase));
      assert.throws(() => ChannelCredentials.createSsl(null, null, null, passphrase));
    });

  });

  describe('compose', () => {
    it('should return a ChannelCredentials object', () => {
      const channelCreds = ChannelCredentials.createSsl();
      const callCreds = new CallCredentialsMock();
      const composedChannelCreds = channelCreds.compose(callCreds);
      assert.strictEqual(composedChannelCreds.getCallCredentials(), callCreds);
    });

    it('should be chainable', () => {
      const callCreds1 = new CallCredentialsMock();
      const callCreds2 = new CallCredentialsMock();
      // Associate both call credentials with channelCreds
      const composedChannelCreds = ChannelCredentials.createSsl()
                                       .compose(callCreds1)
                                       .compose(callCreds2);
      // Build a mock object that should be an identical copy
      const composedCallCreds = callCreds1.compose(callCreds2);
      assert.ok(composedCallCreds.isEqual(
          composedChannelCreds.getCallCredentials() as CallCredentialsMock));
    });
  });
});
