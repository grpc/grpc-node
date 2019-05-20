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

import * as assert from 'assert';
import { OutgoingHttpHeaders } from 'http';
import * as http2 from 'http2';
import { range } from 'lodash';
import * as stream from 'stream';

import { CallCredentials } from '../src/call-credentials';
import { Http2CallStream } from '../src/call-stream';
import { Channel, Http2Channel } from '../src/channel';
import { CompressionFilterFactory } from '../src/compression-filter';
import { Status } from '../src/constants';
import { FilterStackFactory } from '../src/filter-stack';
import { Metadata } from '../src/metadata';

import { assert2, mockFunction } from './common';

interface DataFrames {
  payload: Buffer;
  frameLengths: number[];
}

const { HTTP2_HEADER_STATUS } = http2.constants;

function serialize(data: string): Buffer {
  const header: Buffer = Buffer.alloc(5);
  header.writeUInt8(0, 0); // TODO: Uncompressed only
  header.writeInt32BE(data.length, 1);
  return Buffer.concat([header, Buffer.from(data, 'utf8')]);
}

class ClientHttp2StreamMock extends stream.Duplex
  implements http2.ClientHttp2Stream {
  constructor(private readonly dataFrames: DataFrames) {
    super();
  }
  emitResponse(responseCode: number, metadata?: Metadata) {
    this.emit('response', {
      [HTTP2_HEADER_STATUS]: responseCode,
      ...(metadata ? metadata.toHttp2Headers() : {}),
    });
  }
  bytesRead = 0;
  dataFrame = 0;
  aborted = false;
  closed = false;
  destroyed = false;
  endAfterHeaders = false;
  pending = false;
  rstCode = 0;
  readonly bufferSize: number = 0;
  readonly sentHeaders: OutgoingHttpHeaders = {};
  readonly sentInfoHeaders?: OutgoingHttpHeaders[] = [];
  readonly sentTrailers?: OutgoingHttpHeaders = undefined;
  // tslint:disable:no-any
  session: http2.Http2Session = {} as any;
  state: http2.StreamState = {} as any;
  // tslint:enable:no-any
  close = mockFunction;
  priority = mockFunction;
  rstStream = mockFunction;
  rstWithNoError = mockFunction;
  rstWithProtocolError = mockFunction;
  rstWithCancel = mockFunction;
  rstWithRefuse = mockFunction;
  rstWithInternalError = mockFunction;
  setTimeout = mockFunction;
  _read() {
    if (this.dataFrame === this.dataFrames.frameLengths.length) {
      if (this.bytesRead < this.dataFrames.payload.length) {
        this.push(
          this.dataFrames.payload.slice(
            this.bytesRead,
            this.dataFrames.payload.length
          )
        );
      }
      this.push(null);
      return;
    }
    const from = this.bytesRead;
    this.bytesRead += this.dataFrames.frameLengths[this.dataFrame++];
    this.push(this.dataFrames.payload.slice(from, this.bytesRead));
  }
  _write(chunk: Buffer, encoding: string, cb: Function) {
    this.emit('write', chunk);
    cb();
  }
  sendTrailers(headers: OutgoingHttpHeaders) {
    return this;
  }
}

describe('CallStream', () => {
  const callStreamArgs = {
    deadline: Infinity,
    flags: 0,
    host: '',
    parentCall: null,
  };
  /* A CompressionFilter is now necessary to frame and deframe messages.
   * Currently the channel is unused, so we can replace it with an empty object,
   * but this might break if we start checking channel arguments, in which case
   * we will need a more sophisticated fake */
  const filterStackFactory = new FilterStackFactory([
    new CompressionFilterFactory({} as Channel),
  ]);
  const message = 'eat this message'; // 16 bytes

  beforeEach(() => {
    assert2.clearMustCalls();
  });

  it('should emit a metadata event when it receives a response event', done => {
    const responseMetadata = new Metadata();
    responseMetadata.add('key', 'value');
    const callStream = new Http2CallStream(
      'foo',
      {} as Http2Channel,
      callStreamArgs,
      filterStackFactory
    );

    const http2Stream = new ClientHttp2StreamMock({
      payload: Buffer.alloc(0),
      frameLengths: [],
    });
    callStream.once(
      'metadata',
      assert2.mustCall(metadata => {
        assert.deepStrictEqual(metadata.get('key'), ['value']);
      })
    );
    callStream.attachHttp2Stream(http2Stream);
    http2Stream.emitResponse(200, responseMetadata);
    assert2.afterMustCallsSatisfied(done);
  });

  describe('should end a call with an error if a stream was closed', () => {
    const c = http2.constants;
    const s = Status;
    const errorCodeMapping = {
      [c.NGHTTP2_NO_ERROR]: s.INTERNAL,
      [c.NGHTTP2_PROTOCOL_ERROR]: s.INTERNAL,
      [c.NGHTTP2_INTERNAL_ERROR]: s.INTERNAL,
      [c.NGHTTP2_FLOW_CONTROL_ERROR]: s.INTERNAL,
      [c.NGHTTP2_SETTINGS_TIMEOUT]: s.INTERNAL,
      [c.NGHTTP2_STREAM_CLOSED]: null,
      [c.NGHTTP2_FRAME_SIZE_ERROR]: s.INTERNAL,
      [c.NGHTTP2_REFUSED_STREAM]: s.UNAVAILABLE,
      [c.NGHTTP2_CANCEL]: s.CANCELLED,
      [c.NGHTTP2_COMPRESSION_ERROR]: s.INTERNAL,
      [c.NGHTTP2_CONNECT_ERROR]: s.INTERNAL,
      [c.NGHTTP2_ENHANCE_YOUR_CALM]: s.RESOURCE_EXHAUSTED,
      [c.NGHTTP2_INADEQUATE_SECURITY]: s.PERMISSION_DENIED,
    };
    const keys = Object.keys(errorCodeMapping).map(key => Number(key));
    keys.forEach(key => {
      const value = errorCodeMapping[key];
      // A null value indicates: behavior isn't specified, so skip this test.
      const maybeSkip = (fn: typeof it) => (value ? fn : fn.skip);
      maybeSkip(it)(`for error code ${key}`, () => {
        return new Promise((resolve, reject) => {
          const callStream = new Http2CallStream(
            'foo',
            {} as Http2Channel,
            callStreamArgs,
            filterStackFactory
          );
          const http2Stream = new ClientHttp2StreamMock({
            payload: Buffer.alloc(0),
            frameLengths: [],
          });
          callStream.attachHttp2Stream(http2Stream);
          callStream.once('status', status => {
            try {
              assert.strictEqual(status.code, value);
              resolve();
            } catch (e) {
              reject(e);
            }
          });
          http2Stream.emit('close', Number(key));
        });
      });
    });
  });

  it('should have functioning getters', done => {
    const callStream = new Http2CallStream(
      'foo',
      {} as Http2Channel,
      callStreamArgs,
      filterStackFactory
    );
    assert.strictEqual(callStream.getDeadline(), callStreamArgs.deadline);
    assert.strictEqual(callStream.getStatus(), null);
    const credentials = CallCredentials.createEmpty();
    callStream.setCredentials(credentials);
    assert.strictEqual(callStream.getCredentials(), credentials);
    callStream.on(
      'status',
      assert2.mustCall(status => {
        assert.strictEqual(status.code, Status.CANCELLED);
        assert.strictEqual(status.details, ';)');
        assert.strictEqual(callStream.getStatus(), status);
      })
    );
    callStream.cancelWithStatus(Status.CANCELLED, ';)');
    // TODO: getPeer
    assert2.afterMustCallsSatisfied(done);
  });

  describe('attachHttp2Stream', () => {
    it('should handle an empty message', done => {
      const callStream = new Http2CallStream(
        'foo',
        {} as Http2Channel,
        callStreamArgs,
        filterStackFactory
      );
      const http2Stream = new ClientHttp2StreamMock({
        payload: serialize(''),
        frameLengths: [],
      });
      callStream.once(
        'data',
        assert2.mustCall(buffer => {
          assert.strictEqual(buffer.toString('utf8'), '');
        })
      );
      callStream.attachHttp2Stream(http2Stream);
      assert2.afterMustCallsSatisfied(done);
    });

    [
      {
        description: 'all data is supplied in a single frame',
        frameLengths: [],
      },
      {
        description: 'frames are split along header field delimiters',
        frameLengths: [1, 4],
      },
      {
        description:
          'portions of header fields are split between different frames',
        frameLengths: [2, 1, 1, 4],
      },
      {
        description: 'frames are split into bytes',
        frameLengths: range(0, 20).map(() => 1),
      },
    ].forEach((testCase: { description: string; frameLengths: number[] }) => {
      it(`should handle a short message where ${
        testCase.description
      }`, done => {
        const callStream = new Http2CallStream(
          'foo',
          {} as Http2Channel,
          callStreamArgs,
          filterStackFactory
        );
        const http2Stream = new ClientHttp2StreamMock({
          payload: serialize(message), // 21 bytes
          frameLengths: testCase.frameLengths,
        });
        callStream.once(
          'data',
          assert2.mustCall(buffer => {
            assert.strictEqual(buffer.toString('utf8'), message);
          })
        );
        callStream.once('end', assert2.mustCall(() => {}));
        callStream.attachHttp2Stream(http2Stream);
        assert2.afterMustCallsSatisfied(done);
      });
    });

    [
      {
        description: 'all data is supplied in a single frame',
        frameLengths: [],
      },
      {
        description: 'frames are split between delimited messages',
        frameLengths: [21],
      },
      {
        description: 'frames are split within messages',
        frameLengths: [10, 22],
      },
      {
        description: "part of 2nd message's header is in first frame",
        frameLengths: [24],
      },
      {
        description: 'frames are split into bytes',
        frameLengths: range(0, 41).map(() => 1),
      },
    ].forEach((testCase: { description: string; frameLengths: number[] }) => {
      it(`should handle two messages where ${testCase.description}`, done => {
        const callStream = new Http2CallStream(
          'foo',
          {} as Http2Channel,
          callStreamArgs,
          filterStackFactory
        );
        const http2Stream = new ClientHttp2StreamMock({
          payload: Buffer.concat([serialize(message), serialize(message)]), // 42 bytes
          frameLengths: testCase.frameLengths,
        });
        callStream.once(
          'data',
          assert2.mustCall(buffer => {
            assert.strictEqual(buffer.toString('utf8'), message);
          })
        );
        callStream.once(
          'data',
          assert2.mustCall(buffer => {
            assert.strictEqual(buffer.toString('utf8'), message);
          })
        );
        callStream.once('end', assert2.mustCall(() => {}));
        callStream.attachHttp2Stream(http2Stream);
        assert2.afterMustCallsSatisfied(done);
      });
    });

    it('should send buffered writes', done => {
      const callStream = new Http2CallStream(
        'foo',
        {} as Http2Channel,
        callStreamArgs,
        filterStackFactory
      );
      const http2Stream = new ClientHttp2StreamMock({
        payload: Buffer.alloc(0),
        frameLengths: [],
      });
      let streamFlushed = false;
      http2Stream.once(
        'write',
        assert2.mustCall((chunk: Buffer) => {
          const dataLength = chunk.readInt32BE(1);
          const encodedMessage = chunk.slice(5).toString('utf8');
          assert.strictEqual(dataLength, message.length);
          assert.strictEqual(encodedMessage, message);
          streamFlushed = true;
        })
      );
      callStream.write(
        { message: Buffer.from(message) },
        assert2.mustCall(() => {
          // Ensure this is called only after contents are written to http2Stream
          assert.ok(streamFlushed);
        })
      );
      callStream.end(assert2.mustCall(() => {}));
      callStream.attachHttp2Stream(http2Stream);
      assert2.afterMustCallsSatisfied(done);
    });

    it('should cause data chunks in write calls afterward to be written to the given stream', done => {
      const callStream = new Http2CallStream(
        'foo',
        {} as Http2Channel,
        callStreamArgs,
        filterStackFactory
      );
      const http2Stream = new ClientHttp2StreamMock({
        payload: Buffer.alloc(0),
        frameLengths: [],
      });
      http2Stream.once(
        'write',
        assert2.mustCall((chunk: Buffer) => {
          const dataLength = chunk.readInt32BE(1);
          const encodedMessage = chunk.slice(5).toString('utf8');
          assert.strictEqual(dataLength, message.length);
          assert.strictEqual(encodedMessage, message);
        })
      );
      callStream.attachHttp2Stream(http2Stream);
      callStream.write(
        { message: Buffer.from(message) },
        assert2.mustCall(() => {})
      );
      callStream.end(assert2.mustCall(() => {}));
      assert2.afterMustCallsSatisfied(done);
    });

    it('should handle underlying stream errors', () => {
      const callStream = new Http2CallStream(
        'foo',
        {} as Http2Channel,
        callStreamArgs,
        filterStackFactory
      );
      const http2Stream = new ClientHttp2StreamMock({
        payload: Buffer.alloc(0),
        frameLengths: [],
      });
      callStream.once(
        'status',
        assert2.mustCall(status => {
          assert.strictEqual(status.code, Status.INTERNAL);
        })
      );
      callStream.attachHttp2Stream(http2Stream);
      http2Stream.emit('error');
    });
  });
});
