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

import * as assert from 'assert';
import { mapProxyName } from '../src/http_proxy';
import { parseUri } from '../src/uri-parser';

const PROXY_OPTIONS = { 'grpc.http_proxy': 'http://proxy.example:3128' };

function usesProxy(target: string): boolean {
  const parsedTarget = parseUri(target);
  assert(parsedTarget, `Failed to parse target ${target}`);
  const result = mapProxyName(parsedTarget, PROXY_OPTIONS);
  return 'grpc.http_connect_target' in result.extraOptions;
}

describe('HTTP proxy no_proxy matching', () => {
  let savedNoGrpcProxy: string | undefined;
  let savedNoProxy: string | undefined;

  beforeEach(() => {
    savedNoGrpcProxy = process.env.no_grpc_proxy;
    savedNoProxy = process.env.no_proxy;
    delete process.env.no_grpc_proxy;
    delete process.env.no_proxy;
  });

  afterEach(() => {
    if (savedNoGrpcProxy === undefined) {
      delete process.env.no_grpc_proxy;
    } else {
      process.env.no_grpc_proxy = savedNoGrpcProxy;
    }
    if (savedNoProxy === undefined) {
      delete process.env.no_proxy;
    } else {
      process.env.no_proxy = savedNoProxy;
    }
  });

  it('Uses the proxy when no_proxy is not set', () => {
    assert.strictEqual(usesProxy('dns:local.com:443'), true);
  });

  it('Bypasses the proxy for an exact domain match', () => {
    process.env.no_grpc_proxy = 'local.com,apple.com';
    assert.strictEqual(usesProxy('dns:local.com:443'), false);
    assert.strictEqual(usesProxy('dns:apple.com:443'), false);
  });

  it('Bypasses the proxy for subdomains of an entry', () => {
    process.env.no_grpc_proxy = 'local.com,apple.com';
    assert.strictEqual(usesProxy('dns:www.local.com:443'), false);
    assert.strictEqual(usesProxy('dns:a.b.apple.com:443'), false);
  });

  it('Does not bypass the proxy for hosts that only share a suffix', () => {
    process.env.no_grpc_proxy = 'local.com,apple.com';
    assert.strictEqual(usesProxy('dns:notlocal.com:443'), true);
    assert.strictEqual(usesProxy('dns:www.notlocal.com:443'), true);
    assert.strictEqual(usesProxy('dns:www.snapple.com:443'), true);
  });

  it('Treats a leading dot the same as a bare domain', () => {
    process.env.no_grpc_proxy = '.local.com';
    assert.strictEqual(usesProxy('dns:local.com:443'), false);
    assert.strictEqual(usesProxy('dns:www.local.com:443'), false);
    assert.strictEqual(usesProxy('dns:notlocal.com:443'), true);
  });

  it('Ignores whitespace and empty entries', () => {
    process.env.no_grpc_proxy = ' local.com , ,apple.com,';
    assert.strictEqual(usesProxy('dns:www.local.com:443'), false);
    assert.strictEqual(usesProxy('dns:apple.com:443'), false);
    assert.strictEqual(usesProxy('dns:example.com:443'), true);
  });

  it('Matches IP addresses exactly, not by suffix', () => {
    process.env.no_grpc_proxy = '0.0.1';
    assert.strictEqual(usesProxy('dns:10.0.0.1:443'), true);
    process.env.no_grpc_proxy = '10.0.0.1';
    assert.strictEqual(usesProxy('dns:10.0.0.1:443'), false);
  });

  it('Still supports CIDR ranges', () => {
    process.env.no_grpc_proxy = '192.168.0.0/16';
    assert.strictEqual(usesProxy('dns:192.168.10.20:443'), false);
    assert.strictEqual(usesProxy('dns:192.169.10.20:443'), true);
  });

  it('Falls back to no_proxy when no_grpc_proxy is unset', () => {
    process.env.no_proxy = 'local.com';
    assert.strictEqual(usesProxy('dns:www.local.com:443'), false);
    assert.strictEqual(usesProxy('dns:notlocal.com:443'), true);
  });
});
