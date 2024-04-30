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

const enum ReadState {
  NO_DATA,
  READING_SIZE,
  READING_MESSAGE,
}

export interface GrpcFrame {
  compressed: number;
  size: number;
  message: Buffer;
}

export class StreamDecoder {
  private readState: ReadState = ReadState.NO_DATA;
  private readCompressFlag: Buffer = Buffer.alloc(1);
  private readPartialSize: Buffer = Buffer.alloc(4);
  private readSizeRemaining = 4;
  private readMessageSize = 0;
  private readPartialMessage: Buffer[] = [];
  private readMessageRemaining = 0;

  write(data: Buffer): Buffer[] {
    let readHead = 0;
    let toRead: number;
    const result: Buffer[] = [];

    while (readHead < data.length) {
      switch (this.readState) {
        case ReadState.NO_DATA:
          this.readCompressFlag = data.slice(readHead, readHead + 1);
          readHead += 1;
          this.readState = ReadState.READING_SIZE;
          this.readPartialSize.fill(0);
          this.readSizeRemaining = 4;
          this.readMessageSize = 0;
          this.readMessageRemaining = 0;
          this.readPartialMessage = [];
          break;
        case ReadState.READING_SIZE:
          toRead = Math.min(data.length - readHead, this.readSizeRemaining);
          data.copy(
            this.readPartialSize,
            4 - this.readSizeRemaining,
            readHead,
            readHead + toRead
          );
          this.readSizeRemaining -= toRead;
          readHead += toRead;
          // readSizeRemaining >=0 here
          if (this.readSizeRemaining === 0) {
            this.readMessageSize = this.readPartialSize.readUInt32BE(0);
            this.readMessageRemaining = this.readMessageSize;
            if (this.readMessageRemaining > 0) {
              this.readState = ReadState.READING_MESSAGE;
            } else {
              const message = Buffer.concat(
                [this.readCompressFlag, this.readPartialSize],
                5
              );

              this.readState = ReadState.NO_DATA;
              result.push(message);
            }
          }
          break;
        case ReadState.READING_MESSAGE:
          toRead = Math.min(data.length - readHead, this.readMessageRemaining);
          this.readPartialMessage.push(data.slice(readHead, readHead + toRead));
          this.readMessageRemaining -= toRead;
          readHead += toRead;
          // readMessageRemaining >=0 here
          if (this.readMessageRemaining === 0) {
            // At this point, we have read a full message
            const framedMessageBuffers = [
              this.readCompressFlag,
              this.readPartialSize,
            ].concat(this.readPartialMessage);
            const framedMessage = Buffer.concat(
              framedMessageBuffers,
              this.readMessageSize + 5
            );

            this.readState = ReadState.NO_DATA;
            result.push(framedMessage);
          }
          break;
        default:
          throw new Error('Unexpected read state');
      }
    }

    return result;
  }
}

const kMessageSizeBytes = 4 as const;
const kEmptyMessage = Buffer.alloc(0);

interface StreamDecoder2 {
  next: StreamDecoder2 | null;
  readState: ReadState;
  readCompressFlag: number;
  readPartialSize: Buffer;
  readSizeRemaining: number;
  readMessageSize: number;
  readPartialMessage: Buffer | null;
  readMessageRemaining: number;

  write(data: Buffer): GrpcFrame[];
}

function StreamDecoder2(this: StreamDecoder2) {
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
          if (that.readMessageRemaining > 0) {
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

        if (toRead === readMessageRemaining) {
          that.readPartialMessage = data.subarray(readHead, readHead + toRead);
        } else {
          if (that.readPartialMessage === null) {
            that.readPartialMessage = Buffer.allocUnsafe(readMessageSize);
          }

          data.copy(
            that.readPartialMessage!,
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
        }
      } else {
        throw new Error('Unexpected read state');
      }
    }

    return result;
  };
}

export const decoder = reusify(StreamDecoder2);
