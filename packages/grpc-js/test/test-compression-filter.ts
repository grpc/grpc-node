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
import { WriteFlags, WriteObject } from '../src/call-interface';
import { CompressionAlgorithms } from '../src/compression-algorithms';
import { CompressionFilter } from '../src/compression-filter';

describe('CompressionFilter', () => {
  describe('sendMessage', () => {
    /* Request serializers are caller-supplied and only nominally typed as
     * returning a Buffer. Libraries such as protobufjs can fall back to
     * returning a plain Uint8Array at runtime (e.g. when its optional
     * Buffer utility is unavailable), so the filter needs to handle that
     * without crashing. */
    it('frames a Uint8Array message under identity compression', async () => {
      const filter = new CompressionFilter({}, {});
      const payload = new Uint8Array([1, 2, 3, 4, 5]);
      assert.strictEqual(payload instanceof Buffer, false);
      const writeObject: WriteObject = {
        message: payload as unknown as Buffer,
      };
      const result = await filter.sendMessage(Promise.resolve(writeObject));
      assert.strictEqual(result.message.readUInt8(0), 0);
      assert.strictEqual(result.message.readUInt32BE(1), payload.length);
      assert.deepStrictEqual(
        Array.from(result.message.subarray(5)),
        Array.from(payload)
      );
    });

    it('frames a Uint8Array message when compression is skipped via NoCompress', async () => {
      const filter = new CompressionFilter(
        { 'grpc.default_compression_algorithm': CompressionAlgorithms.gzip },
        {}
      );
      const payload = new Uint8Array([9, 8, 7, 6]);
      assert.strictEqual(payload instanceof Buffer, false);
      const writeObject: WriteObject = {
        message: payload as unknown as Buffer,
        flags: WriteFlags.NoCompress,
      };
      const result = await filter.sendMessage(Promise.resolve(writeObject));
      assert.strictEqual(result.message.readUInt8(0), 0);
      assert.strictEqual(result.message.readUInt32BE(1), payload.length);
      assert.deepStrictEqual(
        Array.from(result.message.subarray(5)),
        Array.from(payload)
      );
    });
  });
});
