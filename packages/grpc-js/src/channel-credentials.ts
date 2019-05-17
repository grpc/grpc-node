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

import { ConnectionOptions, createSecureContext, PeerCertificate } from 'tls';

import { CallCredentials } from './call-credentials';

// tslint:disable-next-line:no-any
function verifyIsBufferOrNull(obj: any, friendlyName: string): void {
  if (obj && !(obj instanceof Buffer)) {
    throw new TypeError(`${friendlyName}, if provided, must be a Buffer.`);
  }
}

/**
 * A certificate as received by the checkServerIdentity callback.
 */
export interface Certificate {
  /**
   * The raw certificate in DER form.
   */
  raw: Buffer;
}

/**
 * A callback that will receive the expected hostname and presented peer
 * certificate as parameters. The callback should return an error to
 * indicate that the presented certificate is considered invalid and
 * otherwise returned undefined.
 */
export type CheckServerIdentityCallback = (
  hostname: string,
  cert: Certificate
) => Error | undefined;

/**
 * Additional peer verification options that can be set when creating
 * SSL credentials.
 */
export interface VerifyOptions {
  /**
   * If set, this callback will be invoked after the usual hostname verification
   * has been performed on the peer certificate.
   */
  checkServerIdentity?: CheckServerIdentityCallback;
}

/**
 * A class that contains credentials for communicating over a channel, as well
 * as a set of per-call credentials, which are applied to every method call made
 * over a channel initialized with an instance of this class.
 */
export abstract class ChannelCredentials {
  protected callCredentials: CallCredentials;

  protected constructor(callCredentials?: CallCredentials) {
    this.callCredentials = callCredentials || CallCredentials.createEmpty();
  }
  /**
   * Returns a copy of this object with the included set of per-call credentials
   * expanded to include callCredentials.
   * @param callCredentials A CallCredentials object to associate with this
   * instance.
   */
  abstract compose(callCredentials: CallCredentials): ChannelCredentials;

  /**
   * Gets the set of per-call credentials associated with this instance.
   */
  _getCallCredentials(): CallCredentials {
    return this.callCredentials;
  }

  /**
   * Gets a SecureContext object generated from input parameters if this
   * instance was created with createSsl, or null if this instance was created
   * with createInsecure.
   */
  abstract _getConnectionOptions(): ConnectionOptions | null;

  /**
   * Indicates whether this credentials object creates a secure channel.
   */
  abstract _isSecure(): boolean;

  /**
   * Return a new ChannelCredentials instance with a given set of credentials.
   * The resulting instance can be used to construct a Channel that communicates
   * over TLS.
   * @param rootCerts The root certificate data.
   * @param privateKey The client certificate private key, if available.
   * @param certChain The client certificate key chain, if available.
   */
  static createSsl(
    rootCerts?: Buffer | null,
    privateKey?: Buffer | null,
    certChain?: Buffer | null,
    verifyOptions?: VerifyOptions
  ): ChannelCredentials {
    verifyIsBufferOrNull(rootCerts, 'Root certificate');
    verifyIsBufferOrNull(privateKey, 'Private key');
    verifyIsBufferOrNull(certChain, 'Certificate chain');
    if (privateKey && !certChain) {
      throw new Error(
        'Private key must be given with accompanying certificate chain'
      );
    }
    if (!privateKey && certChain) {
      throw new Error(
        'Certificate chain must be given with accompanying private key'
      );
    }
    const secureContext = createSecureContext({
      ca: rootCerts || undefined,
      key: privateKey || undefined,
      cert: certChain || undefined,
    });
    const connectionOptions: ConnectionOptions = { secureContext };
    if (verifyOptions && verifyOptions.checkServerIdentity) {
      connectionOptions.checkServerIdentity = (
        host: string,
        cert: PeerCertificate
      ) => {
        return verifyOptions.checkServerIdentity!(host, { raw: cert.raw });
      };
    }
    return new SecureChannelCredentialsImpl(connectionOptions);
  }

  /**
   * Return a new ChannelCredentials instance with no credentials.
   */
  static createInsecure(): ChannelCredentials {
    return new InsecureChannelCredentialsImpl();
  }
}

class InsecureChannelCredentialsImpl extends ChannelCredentials {
  constructor(callCredentials?: CallCredentials) {
    super(callCredentials);
  }

  compose(callCredentials: CallCredentials): ChannelCredentials {
    throw new Error('Cannot compose insecure credentials');
  }

  _getConnectionOptions(): ConnectionOptions | null {
    return null;
  }
  _isSecure(): boolean {
    return false;
  }
}

class SecureChannelCredentialsImpl extends ChannelCredentials {
  connectionOptions: ConnectionOptions;

  constructor(
    connectionOptions: ConnectionOptions,
    callCredentials?: CallCredentials
  ) {
    super(callCredentials);
    this.connectionOptions = connectionOptions;
  }

  compose(callCredentials: CallCredentials): ChannelCredentials {
    const combinedCallCredentials = this.callCredentials.compose(
      callCredentials
    );
    return new SecureChannelCredentialsImpl(
      this.connectionOptions,
      combinedCallCredentials
    );
  }

  _getConnectionOptions(): ConnectionOptions | null {
    return this.connectionOptions;
  }
  _isSecure(): boolean {
    return true;
  }
}
