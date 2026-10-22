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
 * used to modify incoming and outgoing data. The sendMetadata, sendMessage,
 * and receiveMessage methods may return their result directly when no
 * asynchronous work is needed, or a thenable otherwise. All async filters can
 * be rejected. The rejection error must be a StatusObject, and a rejection
 * will cause the call to end with that status.
 */
export interface Filter {
  sendMetadata(metadata: Metadata): Metadata | PromiseLike<Metadata>;

  receiveMetadata(metadata: Metadata): Metadata;

  sendMessage(message: WriteObject): WriteObject | PromiseLike<WriteObject>;

  receiveMessage(message: Buffer): Buffer | PromiseLike<Buffer>;

  receiveTrailers(status: StatusObject): StatusObject;
}

export abstract class BaseFilter implements Filter {
  sendMetadata(metadata: Metadata): Metadata | PromiseLike<Metadata> {
    return metadata;
  }

  receiveMetadata(metadata: Metadata): Metadata {
    return metadata;
  }

  sendMessage(message: WriteObject): WriteObject | PromiseLike<WriteObject> {
    return message;
  }

  receiveMessage(message: Buffer): Buffer | PromiseLike<Buffer> {
    return message;
  }

  receiveTrailers(status: StatusObject): StatusObject {
    return status;
  }
}

export interface FilterFactory<T extends Filter> {
  createFilter(): T;
}

/**
 * Checks whether a filter result is a thenable that must be awaited, rather
 * than a value that is already available. This is used instead of
 * `instanceof Promise` so that promises from other realms and custom
 * thenables are also recognized.
 */
export function isThenable<T>(
  value: T | PromiseLike<T>
): value is PromiseLike<T> {
  return typeof (value as PromiseLike<T>)?.then === 'function';
}
