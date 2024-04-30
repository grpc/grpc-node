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

// @ts-expect-error no types
import * as reusify from 'reusify';
export interface GrpcFrame {
  compressed: number;
  size: number;
  message: Buffer;
}

const enum ReadState {
  NO_DATA,
  READING_SIZE,
  READING_MESSAGE,
}

const kMessageSizeBytes = 4 as const;
const kEmptyMessage = Buffer.alloc(0);

interface StreamDecoder {
  next: StreamDecoder | null;
  readState: ReadState;
  readCompressFlag: number;
  readPartialSize: Buffer;
  readSizeRemaining: number;
  readMessageSize: number;
  readPartialMessage: Buffer | null;
  readMessageRemaining: number;

  write(data: Buffer): GrpcFrame[];
}

function StreamDecoder(this: StreamDecoder) {
  // reusify reference
  this.next = null;

  // internal state
  this.readState = ReadState.NO_DATA;
  this.readCompressFlag = 0;
  this.readPartialSize = Buffer.alloc(kMessageSizeBytes);
  this.readSizeRemaining = kMessageSizeBytes;
  this.readMessageSize = 0;
  this.readPartialMessage = null;
  this.readMessageRemaining = 0;

  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const that = this;

  this.write = function decodeInputBufferStream(
    this: undefined,
    data: Buffer
  ): GrpcFrame[] {
    let readHead = 0;
    let toRead = 0;
    const result: GrpcFrame[] = [];
    const len = data.length;

    while (readHead < len) {
      const { readState } = that;
      if (readState === ReadState.NO_DATA) {
        that.readCompressFlag = data.readUint8(readHead);
        readHead += 1;
        that.readState = ReadState.READING_SIZE;

        // size prop
        that.readSizeRemaining = kMessageSizeBytes;

        // message body props
        that.readMessageSize = 0;
        that.readMessageRemaining = 0;
        that.readPartialMessage = null;
      } else if (readState === ReadState.READING_SIZE) {
        let { readSizeRemaining } = that;
        toRead = Math.min(len - readHead, readSizeRemaining);

        // we read everything in 1 go
        if (toRead === kMessageSizeBytes) {
          that.readMessageSize = data.readUInt32BE(readHead);
          readSizeRemaining = 0;
        } else {
          // we only have partial bytes available to us
          data.copy(
            that.readPartialSize,
            kMessageSizeBytes - readSizeRemaining,
            readHead,
            readHead + toRead
          );

          readSizeRemaining -= toRead;
          if (readSizeRemaining === 0) {
            that.readMessageSize = that.readPartialSize.readUInt32BE(0);
          }
        }

        that.readSizeRemaining = readSizeRemaining;
        readHead += toRead;

        // readSizeRemaining >=0 here
        if (readSizeRemaining === 0) {
          if (that.readMessageSize > 0) {
            that.readState = ReadState.READING_MESSAGE;
            that.readMessageRemaining = that.readMessageSize;
          } else {
            that.readState = ReadState.NO_DATA;
            result.push({
              compressed: that.readCompressFlag,
              size: 0,
              message: kEmptyMessage,
            });
          }
        }
      } else if (readState === ReadState.READING_MESSAGE) {
        const { readMessageSize } = that;
        let { readMessageRemaining } = that;
        toRead = Math.min(len - readHead, readMessageRemaining);

        if (toRead === readMessageSize) {
          that.readPartialMessage = data.subarray(readHead, readHead + toRead);
        } else {
          if (that.readPartialMessage === null) {
            that.readPartialMessage = Buffer.allocUnsafe(readMessageSize);
          }

          data.copy(
            that.readPartialMessage,
            readMessageSize - readMessageRemaining,
            readHead,
            readHead + toRead
          );
        }

        readMessageRemaining -= toRead;
        readHead += toRead;

        // readMessageRemaining >=0 here
        if (readMessageRemaining === 0) {
          // At that point, we have read a full message
          result.push({
            compressed: that.readCompressFlag,
            size: readMessageSize,
            message: that.readPartialMessage,
          });

          that.readState = ReadState.NO_DATA;
        } else {
          that.readMessageRemaining = readMessageRemaining;
        }
      } else {
        throw new Error('Unexpected read state');
      }
    }

    return result;
  };
}

export const decoder = reusify(StreamDecoder) as {
  get(): StreamDecoder;
  release(decoder: StreamDecoder): void;
};
