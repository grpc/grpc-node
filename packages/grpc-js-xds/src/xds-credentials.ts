/*
 * Copyright 2024 gRPC authors.
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

import { CallCredentials, ChannelCredentials, ChannelOptions, ServerCredentials, VerifyOptions, experimental, logVerbosity } from "@grpc/grpc-js";
import { CA_CERT_PROVIDER_KEY, IDENTITY_CERT_PROVIDER_KEY, SAN_MATCHER_KEY, SanMatcher } from "./load-balancer-cds";
import GrpcUri = experimental.GrpcUri;
import SecureConnector = experimental.SecureConnector;
import createCertificateProviderChannelCredentials = experimental.createCertificateProviderChannelCredentials;

const TRACER_NAME = 'xds_channel_credentials';

function trace(text: string) {
  experimental.trace(logVerbosity.DEBUG, TRACER_NAME, text);
}

export class XdsChannelCredentials extends ChannelCredentials {
  constructor(private fallbackCredentials: ChannelCredentials) {
    super();
  }
  _isSecure(): boolean {
    return true;
  }
  _equals(other: ChannelCredentials): boolean {
    return other instanceof XdsChannelCredentials && this.fallbackCredentials === other.fallbackCredentials;
  }
  _createSecureConnector(channelTarget: GrpcUri, options: ChannelOptions, callCredentials?: CallCredentials): SecureConnector {
    if (options[CA_CERT_PROVIDER_KEY]) {
      trace('Using secure credentials');
      const verifyOptions: VerifyOptions = {};
      if (options[SAN_MATCHER_KEY]) {
        const matcher = options[SAN_MATCHER_KEY] as SanMatcher;
        verifyOptions.checkServerIdentity = (hostname, cert) => {
          if (cert.subjectaltname && matcher.apply(cert.subjectaltname)) {
            return undefined;
          } else {
            trace('Subject alternative name not matched: ' + cert.subjectaltname);
            return new Error('No matching subject alternative name found in certificate');
          }
        }
      }
      const certProviderCreds = createCertificateProviderChannelCredentials(options[CA_CERT_PROVIDER_KEY], options[IDENTITY_CERT_PROVIDER_KEY] ?? null, verifyOptions);
      return certProviderCreds._createSecureConnector(channelTarget, options, callCredentials);
    } else {
      trace('Using fallback credentials');
      return this.fallbackCredentials._createSecureConnector(channelTarget, options, callCredentials);
    }
  }

}

export class XdsServerCredentials extends ServerCredentials {
  constructor(private fallbackCredentials: ServerCredentials) {
    super({});
  }

  getFallbackCredentials() {
    return this.fallbackCredentials;
  }
  _isSecure(): boolean {
    return this.fallbackCredentials._isSecure();
  }
  _equals(other: ServerCredentials): boolean {
    return (other instanceof XdsServerCredentials) && this.fallbackCredentials._equals(other.fallbackCredentials);
  }
}
