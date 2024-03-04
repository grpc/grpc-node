/*
 * Copyright 2023 gRPC authors.
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

import assert = require('assert');
import { CidrRange, formatIPv4, formatIPv6, normalizeCidrRange, parseIPv4, parseIPv6 } from '../src/cidr';

describe('parseIPv4 and formatIPv4', () => {
  describe('Should transform as expected', () => {
    const TEST_CASES = [
      {
        address: '0.0.0.0',
        parsed: 0n
      },
      {
        address: '255.255.255.255',
        parsed: 0xffffffffn
      },
      {
        address: '10.0.0.1',
        parsed: 0x0a000001n
      },
      {
        address: '10.0.0.0',
        parsed: 0x0a000000n
      },
      {
        address: '192.168.0.1',
        parsed: 0xc0a80001n
      },
      {
        address: '192.168.0.0',
        parsed: 0xc0a80000n
      }
    ];
    for (const {address, parsed} of TEST_CASES) {
      it(address, () => {
        assert.strictEqual(parseIPv4(address), parsed);
        assert.strictEqual(formatIPv4(parsed), address);
      });
    }
  });
});
describe('parseIPv6 and formatIPv6', () => {
  describe('Should transform as expected', () => {
    const TEST_CASES = [
      {
        address: '::',
        parsed: 0n
      },
      {
        address: 'ffff:ffff:ffff:ffff:ffff:ffff:ffff:ffff',
        parsed: 0xffffffffffffffffffffffffffffffffn
      },
      {
        address: '::1',
        parsed: 1n
      },
      // The example address in the IPv6 Wikipedia article
      {
        address: '2001:db8::ff00:42:8329',
        parsed: 0x20010db8000000000000ff0000428329n
      }
    ];
    for (const {address, parsed} of TEST_CASES) {
      it(address, () => {
        assert.strictEqual(parseIPv6(address), parsed);
        assert.strictEqual(formatIPv6(parsed), address);
      });
    }
  });
});
describe('CIDR range normalization', () => {
  const TEST_CASES: {input: CidrRange, output: CidrRange}[] = [
    {
      input: {
        addressPrefix: '192.168.0.0',
        prefixLen: 24
      },
      output: {
        addressPrefix: '192.168.0.0',
        prefixLen: 24
      },
    },
    {
      input: {
        addressPrefix: '192.168.0.128',
        prefixLen: 24
      },
      output: {
        addressPrefix: '192.168.0.0',
        prefixLen: 24
      },
    },
    {
      input: {
        addressPrefix: '192.168.0.1',
        prefixLen: 24
      },
      output: {
        addressPrefix: '192.168.0.0',
        prefixLen: 24
      },
    },
    {
      input: {
        addressPrefix: '192.168.0.1',
        prefixLen: -1
      },
      output: {
        addressPrefix: '0.0.0.0',
        prefixLen: 0
      },
    },
    {
      input: {
        addressPrefix: '192.168.0.1',
        prefixLen: 33
      },
      output: {
        addressPrefix: '192.168.0.1',
        prefixLen: 32
      },
    },
    {
      input: {
        addressPrefix: 'fe80::',
        prefixLen: 10
      },
      output: {
        addressPrefix: 'fe80::',
        prefixLen: 10
      },
    },
    {
      input: {
        addressPrefix: 'fe80::1',
        prefixLen: 10
      },
      output: {
        addressPrefix: 'fe80::',
        prefixLen: 10
      },
    },
  ];
  for (const {input, output} of TEST_CASES) {
    it(`${input.addressPrefix}/${input.prefixLen} -> ${output.addressPrefix}/${output.prefixLen}`, () => {
      assert.deepStrictEqual(normalizeCidrRange(input), output);
    })
  }
});
