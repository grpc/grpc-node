/*
 * Copyright 2026 gRPC authors.
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

// Regression test for https://github.com/grpc/grpc-node/issues/3037:
// InterceptingCallInterface must be importable by name from the package entry
// point, as it was in @grpc/grpc-js 1.14.1.
import * as assert from 'assert';

import { InterceptingCall, InterceptingCallInterface } from '../src';

function makeInterceptingCall(nextCall: InterceptingCallInterface) {
  return new InterceptingCall(nextCall);
}

describe('Public API exports', () => {
  it('should export InterceptingCallInterface', () => {
    const nextCall: InterceptingCallInterface = {
      cancelWithStatus() {},
      getPeer() {
        return 'test-peer';
      },
      start() {},
      sendMessageWithContext() {},
      sendMessage() {},
      startRead() {},
      halfClose() {},
      getAuthContext() {
        return null;
      },
    };
    const call = makeInterceptingCall(nextCall);
    assert.strictEqual(call.getPeer(), 'test-peer');
  });
});
