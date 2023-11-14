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

import { SecureServerOptions } from 'http2';
import { CIPHER_SUITES, getDefaultRootsData } from './tls-helpers';

export interface KeyCertPair {
  private_key: Buffer;
  cert_chain: Buffer;
}

export abstract class ServerCredentials {
  abstract _isSecure(): boolean;
  abstract _getSettings(): SecureServerOptions | null;
  abstract _equals(other: ServerCredentials): boolean;

  static createInsecure(): ServerCredentials {
    return new InsecureServerCredentials();
  }

  static createSsl(
    rootCerts: Buffer | null,
    keyCertPairs: KeyCertPair[],
    checkClientCertificate = false
  ): ServerCredentials {
    if (rootCerts !== null && !Buffer.isBuffer(rootCerts)) {
      throw new TypeError('rootCerts must be null or a Buffer');
    }

    if (!Array.isArray(keyCertPairs)) {
      throw new TypeError('keyCertPairs must be an array');
    }

    if (typeof checkClientCertificate !== 'boolean') {
      throw new TypeError('checkClientCertificate must be a boolean');
    }

    const cert: Buffer[] = [];
    const key: Buffer[] = [];

    for (let i = 0; i < keyCertPairs.length; i++) {
      const pair = keyCertPairs[i];

      if (pair === null || typeof pair !== 'object') {
        throw new TypeError(`keyCertPair[${i}] must be an object`);
      }

      if (!Buffer.isBuffer(pair.private_key)) {
        throw new TypeError(`keyCertPair[${i}].private_key must be a Buffer`);
      }

      if (!Buffer.isBuffer(pair.cert_chain)) {
        throw new TypeError(`keyCertPair[${i}].cert_chain must be a Buffer`);
      }

      cert.push(pair.cert_chain);
      key.push(pair.private_key);
    }

    return new SecureServerCredentials({
      ca: rootCerts ?? getDefaultRootsData() ?? undefined,
      cert,
      key,
      requestCert: checkClientCertificate,
      ciphers: CIPHER_SUITES,
    });
  }
}

class InsecureServerCredentials extends ServerCredentials {
  _isSecure(): boolean {
    return false;
  }

  _getSettings(): null {
    return null;
  }

  _equals(other: ServerCredentials): boolean {
    return other instanceof InsecureServerCredentials;
  }
}

class SecureServerCredentials extends ServerCredentials {
  private options: SecureServerOptions;

  constructor(options: SecureServerOptions) {
    super();
    this.options = options;
  }

  _isSecure(): boolean {
    return true;
  }

  _getSettings(): SecureServerOptions {
    return this.options;
  }

  /**
   * Checks equality by checking the options that are actually set by
   * createSsl.
   * @param other
   * @returns
   */
  _equals(other: ServerCredentials): boolean {
    if (this === other) {
      return true;
    }
    if (!(other instanceof SecureServerCredentials)) {
      return false;
    }
    // options.ca equality check
    if (Buffer.isBuffer(this.options.ca) && Buffer.isBuffer(other.options.ca)) {
      if (!this.options.ca.equals(other.options.ca)) {
        return false;
      }
    } else {
      if (this.options.ca !== other.options.ca) {
        return false;
      }
    }
    // options.cert equality check
    if (Array.isArray(this.options.cert) && Array.isArray(other.options.cert)) {
      if (this.options.cert.length !== other.options.cert.length) {
        return false;
      }
      for (let i = 0; i < this.options.cert.length; i++) {
        const thisCert = this.options.cert[i];
        const otherCert = other.options.cert[i];
        if (Buffer.isBuffer(thisCert) && Buffer.isBuffer(otherCert)) {
          if (!thisCert.equals(otherCert)) {
            return false;
          }
        } else {
          if (thisCert !== otherCert) {
            return false;
          }
        }
      }
    } else {
      if (this.options.cert !== other.options.cert) {
        return false;
      }
    }
    // options.key equality check
    if (Array.isArray(this.options.key) && Array.isArray(other.options.key)) {
      if (this.options.key.length !== other.options.key.length) {
        return false;
      }
      for (let i = 0; i < this.options.key.length; i++) {
        const thisKey = this.options.key[i];
        const otherKey = other.options.key[i];
        if (Buffer.isBuffer(thisKey) && Buffer.isBuffer(otherKey)) {
          if (!thisKey.equals(otherKey)) {
            return false;
          }
        } else {
          if (thisKey !== otherKey) {
            return false;
          }
        }
      }
    } else {
      if (this.options.key !== other.options.key) {
        return false;
      }
    }
    // options.requestCert equality check
    if (this.options.requestCert !== other.options.requestCert) {
      return false;
    }
    /* ciphers is derived from a value that is constant for the process, so no
     * equality check is needed. */
    return true;
  }
}
