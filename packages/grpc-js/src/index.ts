/**
 * @license
 * Copyright 2017 gRPC authors.
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

'use strict';

import {
  CallCredentials,
  ChannelCredentials,
  Metadata,
  Status,
  PropagateFlags,
  Client
} from '@grpc/js-core';

const compose = <S extends { compose: (other: T) => S }, T>(a: S, b: T) => a.compose(b);

const notImplementedFn = () => { throw new Error('Not implemented'); }

module.exports = require('@grpc/surface')({
  Client,
  Metadata,
  propagate: PropagateFlags,
  status: Status,
  credentials: {
    createSsl: ChannelCredentials.createSsl,
    createFromMetadataGenerator: CallCredentials.createFromMetadataGenerator,
    createFromGoogleCredential: notImplementedFn,
    combineChannelCredentials: (channelCredentials: ChannelCredentials,
        ...callCredentialsList: CallCredentials[]): ChannelCredentials => {
      return callCredentialsList.reduce(compose, channelCredentials);
    },
    combineCallCredentials: (...callCredentialsList: CallCredentials[]): CallCredentials => {
      return callCredentialsList.slice(1).reduce(compose, callCredentialsList[0]);
    },
    createInsecure: ChannelCredentials.createInsecure
  },
  get setLogger() { return notImplementedFn; },
  get setLogVerbosity() { return notImplementedFn; },
  get ServerCredentials() { return notImplementedFn; },
  get callError() { return notImplementedFn; },
  get writeFlags() { return notImplementedFn; },
  get logVerbosity() { return notImplementedFn; },
  getClientChannel(client: Client) {
    return client.getChannel();
  },
  waitForClientReady(client: Client, deadline: number|Date, callback: (err: Error|null) => {}) {
    client.waitForReady(deadline, callback);
  },
  closeClient(client: Client) { return client.close(); }
});
