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

import {
  ConnectionOptions,
  createSecureContext,
  PeerCertificate,
  SecureContext,
} from 'tls';

import { CallCredentials } from './call-credentials';
import { CIPHER_SUITES, getDefaultRootsData } from './tls-helpers';
import { CaCertificateUpdate, CaCertificateUpdateListener, CertificateProvider, IdentityCertificateUpdate, IdentityCertificateUpdateListener } from './certificate-provider';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function verifyIsBufferOrNull(obj: any, friendlyName: string): void {
  if (obj && !(obj instanceof Buffer)) {
    throw new TypeError(`${friendlyName}, if provided, must be a Buffer.`);
  }
}

/**
 * A callback that will receive the expected hostname and presented peer
 * certificate as parameters. The callback should return an error to
 * indicate that the presented certificate is considered invalid and
 * otherwise returned undefined.
 */
export type CheckServerIdentityCallback = (
  hostname: string,
  cert: PeerCertificate
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
  rejectUnauthorized?: boolean;
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
   * Check whether two channel credentials objects are equal. Two secure
   * credentials are equal if they were constructed with the same parameters.
   * @param other The other ChannelCredentials Object
   */
  abstract _equals(other: ChannelCredentials): boolean;

  _ref(): void {
    // Do nothing by default
  }

  _unref(): void {
    // Do nothing by default
  }

  /**
   * Return a new ChannelCredentials instance with a given set of credentials.
   * The resulting instance can be used to construct a Channel that communicates
   * over TLS.
   * @param rootCerts The root certificate data.
   * @param privateKey The client certificate private key, if available.
   * @param certChain The client certificate key chain, if available.
   * @param verifyOptions Additional options to modify certificate verification
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
      ca: rootCerts ?? getDefaultRootsData() ?? undefined,
      key: privateKey ?? undefined,
      cert: certChain ?? undefined,
      ciphers: CIPHER_SUITES,
    });
    return new SecureChannelCredentialsImpl(secureContext, verifyOptions ?? {});
  }

  /**
   * Return a new ChannelCredentials instance with credentials created using
   * the provided secureContext. The resulting instances can be used to
   * construct a Channel that communicates over TLS. gRPC will not override
   * anything in the provided secureContext, so the environment variables
   * GRPC_SSL_CIPHER_SUITES and GRPC_DEFAULT_SSL_ROOTS_FILE_PATH will
   * not be applied.
   * @param secureContext The return value of tls.createSecureContext()
   * @param verifyOptions Additional options to modify certificate verification
   */
  static createFromSecureContext(
    secureContext: SecureContext,
    verifyOptions?: VerifyOptions
  ): ChannelCredentials {
    return new SecureChannelCredentialsImpl(secureContext, verifyOptions ?? {});
  }

  /**
   * Return a new ChannelCredentials instance with no credentials.
   */
  static createInsecure(): ChannelCredentials {
    return new InsecureChannelCredentialsImpl();
  }
}

class InsecureChannelCredentialsImpl extends ChannelCredentials {
  constructor() {
    super();
  }

  compose(callCredentials: CallCredentials): never {
    throw new Error('Cannot compose insecure credentials');
  }

  _getConnectionOptions(): ConnectionOptions | null {
    return {};
  }
  _isSecure(): boolean {
    return false;
  }
  _equals(other: ChannelCredentials): boolean {
    return other instanceof InsecureChannelCredentialsImpl;
  }
}

class SecureChannelCredentialsImpl extends ChannelCredentials {
  connectionOptions: ConnectionOptions;

  constructor(
    private secureContext: SecureContext,
    private verifyOptions: VerifyOptions
  ) {
    super();
    this.connectionOptions = {
      secureContext,
    };
    // Node asserts that this option is a function, so we cannot pass undefined
    if (verifyOptions?.checkServerIdentity) {
      this.connectionOptions.checkServerIdentity =
        verifyOptions.checkServerIdentity;
    }

    if (verifyOptions?.rejectUnauthorized !== undefined) {
      this.connectionOptions.rejectUnauthorized =
        verifyOptions.rejectUnauthorized;
    }
  }

  compose(callCredentials: CallCredentials): ChannelCredentials {
    const combinedCallCredentials =
      this.callCredentials.compose(callCredentials);
    return new ComposedChannelCredentialsImpl(this, combinedCallCredentials);
  }

  _getConnectionOptions(): ConnectionOptions | null {
    // Copy to prevent callers from mutating this.connectionOptions
    return { ...this.connectionOptions };
  }
  _isSecure(): boolean {
    return true;
  }
  _equals(other: ChannelCredentials): boolean {
    if (this === other) {
      return true;
    }
    if (other instanceof SecureChannelCredentialsImpl) {
      return (
        this.secureContext === other.secureContext &&
        this.verifyOptions.checkServerIdentity ===
          other.verifyOptions.checkServerIdentity
      );
    } else {
      return false;
    }
  }
}

class CertificateProviderChannelCredentialsImpl extends ChannelCredentials {
  private refcount: number = 0;
  private latestCaUpdate: CaCertificateUpdate | null = null;
  private latestIdentityUpdate: IdentityCertificateUpdate | null = null;
  private caCertificateUpdateListener: CaCertificateUpdateListener = this.handleCaCertificateUpdate.bind(this);
  private identityCertificateUpdateListener: IdentityCertificateUpdateListener = this.handleIdentityCertitificateUpdate.bind(this);
  constructor(
    private caCertificateProvider: CertificateProvider,
    private identityCertificateProvider: CertificateProvider | null,
    private verifyOptions: VerifyOptions | null
  ) {
    super();
  }
  compose(callCredentials: CallCredentials): ChannelCredentials {
    const combinedCallCredentials =
      this.callCredentials.compose(callCredentials);
    return new ComposedChannelCredentialsImpl(
      this,
      combinedCallCredentials
    );
  }
  _getConnectionOptions(): ConnectionOptions | null {
    if (this.latestCaUpdate === null) {
      return null;
    }
    if (this.identityCertificateProvider !== null && this.latestIdentityUpdate === null) {
      return null;
    }
    const secureContext: SecureContext = createSecureContext({
      ca: this.latestCaUpdate.caCertificate,
      key: this.latestIdentityUpdate?.privateKey,
      cert: this.latestIdentityUpdate?.certificate,
      ciphers: CIPHER_SUITES
    });
    const options: ConnectionOptions = {
      secureContext: secureContext
    };
    if (this.verifyOptions?.checkServerIdentity) {
      options.checkServerIdentity = this.verifyOptions.checkServerIdentity;
    }
    return options;
  }
  _isSecure(): boolean {
    return true;
  }
  _equals(other: ChannelCredentials): boolean {
    if (this === other) {
      return true;
    }
    if (other instanceof CertificateProviderChannelCredentialsImpl) {
      return this.caCertificateProvider === other.caCertificateProvider &&
        this.identityCertificateProvider === other.identityCertificateProvider &&
        this.verifyOptions?.checkServerIdentity === other.verifyOptions?.checkServerIdentity;
    } else {
      return false;
    }
  }
  _ref(): void {
    if (this.refcount === 0) {
      this.caCertificateProvider.addCaCertificateListener(this.caCertificateUpdateListener);
      this.identityCertificateProvider?.addIdentityCertificateListener(this.identityCertificateUpdateListener);
    }
    this.refcount += 1;
  }
  _unref(): void {
    this.refcount -= 1;
    if (this.refcount === 0) {
      this.caCertificateProvider.removeCaCertificateListener(this.caCertificateUpdateListener);
      this.identityCertificateProvider?.removeIdentityCertificateListener(this.identityCertificateUpdateListener);
    }
  }

  private handleCaCertificateUpdate(update: CaCertificateUpdate | null) {
    this.latestCaUpdate = update;
  }

  private handleIdentityCertitificateUpdate(update: IdentityCertificateUpdate | null) {
    this.latestIdentityUpdate = update;
  }
}

export function createCertificateProviderChannelCredentials(caCertificateProvider: CertificateProvider, identityCertificateProvider: CertificateProvider | null, verifyOptions?: VerifyOptions) {
  return new CertificateProviderChannelCredentialsImpl(caCertificateProvider, identityCertificateProvider, verifyOptions ?? null);
}

class ComposedChannelCredentialsImpl extends ChannelCredentials {
  constructor(
    private channelCredentials: ChannelCredentials,
    callCreds: CallCredentials
  ) {
    super(callCreds);
    if (!channelCredentials._isSecure()) {
      throw new Error('Cannot compose insecure credentials');
    }
  }
  compose(callCredentials: CallCredentials) {
    const combinedCallCredentials =
      this.callCredentials.compose(callCredentials);
    return new ComposedChannelCredentialsImpl(
      this.channelCredentials,
      combinedCallCredentials
    );
  }

  _getConnectionOptions(): ConnectionOptions | null {
    return this.channelCredentials._getConnectionOptions();
  }
  _isSecure(): boolean {
    return true;
  }
  _equals(other: ChannelCredentials): boolean {
    if (this === other) {
      return true;
    }
    if (other instanceof ComposedChannelCredentialsImpl) {
      return (
        this.channelCredentials._equals(other.channelCredentials) &&
        this.callCredentials._equals(other.callCredentials)
      );
    } else {
      return false;
    }
  }
}
