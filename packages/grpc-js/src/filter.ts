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

import { StatusObject, WriteObject } from './call-interface';
import { Metadata } from './metadata';

/**
 * Filter classes represent related per-call logic and state that is primarily
 * used to modify incoming and outgoing data. All async filters can be
 * rejected. The rejection error must be a StatusObject, and a rejection will
 * cause the call to end with that status.
 */
export interface Filter {
  sendMetadata(metadata: Promise<Metadata>): Promise<Metadata>;

  receiveMetadata(metadata: Metadata): Metadata;

  sendMessage(message: Promise<WriteObject>): Promise<WriteObject>;

  receiveMessage(message: Promise<Buffer>): Promise<Buffer>;

  receiveTrailers(status: StatusObject): StatusObject;

  /**
   * Optional synchronous fast path for sendMetadata. When present, FilterStack
   * calls this method instead of sendMetadata, so both must behave identically.
   * Return the Metadata directly when no asynchronous work is needed, or a
   * Promise (checked via `instanceof Promise`) otherwise. Report failures by
   * returning a rejected Promise whose reason is a StatusObject rather than
   * throwing synchronously.
   */
  sendMetadataMaybeSync?(metadata: Metadata): Metadata | Promise<Metadata>;

  /**
   * Optional synchronous fast path for sendMessage. When present, FilterStack
   * calls this method instead of sendMessage, so both must behave identically.
   * Return the WriteObject directly when no asynchronous work is needed, or a
   * Promise (checked via `instanceof Promise`) otherwise. Report failures by
   * returning a rejected Promise whose reason is a StatusObject rather than
   * throwing synchronously.
   */
  sendMessageMaybeSync?(
    message: WriteObject
  ): WriteObject | Promise<WriteObject>;

  /**
   * Optional synchronous fast path for receiveMessage. When present,
   * FilterStack calls this method instead of receiveMessage, so both must
   * behave identically. Return the Buffer directly when no asynchronous work is
   * needed, or a Promise (checked via `instanceof Promise`) otherwise. Report
   * failures by returning a rejected Promise whose reason is a StatusObject
   * rather than throwing synchronously.
   */
  receiveMessageMaybeSync?(message: Buffer): Buffer | Promise<Buffer>;
}

/**
 * Base class for filters with no-op default implementations. FilterStack's
 * synchronous fast-path methods detect and skip methods inherited unchanged
 * from BaseFilter without allocating a Promise.
 */
export abstract class BaseFilter implements Filter {
  sendMetadataMaybeSync?(metadata: Metadata): Metadata | Promise<Metadata>;

  sendMessageMaybeSync?(
    message: WriteObject
  ): WriteObject | Promise<WriteObject>;

  receiveMessageMaybeSync?(message: Buffer): Buffer | Promise<Buffer>;

  async sendMetadata(metadata: Promise<Metadata>): Promise<Metadata> {
    return this.sendMetadataMaybeSync
      ? this.sendMetadataMaybeSync(await metadata)
      : metadata;
  }

  receiveMetadata(metadata: Metadata): Metadata {
    return metadata;
  }

  async sendMessage(message: Promise<WriteObject>): Promise<WriteObject> {
    return this.sendMessageMaybeSync
      ? this.sendMessageMaybeSync(await message)
      : message;
  }

  async receiveMessage(message: Promise<Buffer>): Promise<Buffer> {
    return this.receiveMessageMaybeSync
      ? this.receiveMessageMaybeSync(await message)
      : message;
  }

  receiveTrailers(status: StatusObject): StatusObject {
    return status;
  }
}

export interface FilterFactory<T extends Filter> {
  createFilter(): T;
}
