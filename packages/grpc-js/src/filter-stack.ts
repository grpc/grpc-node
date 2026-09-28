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
import { BaseFilter, Filter, FilterFactory } from './filter';
import { Metadata } from './metadata';

export class FilterStack implements Filter {
  constructor(private readonly filters: Filter[]) {}

  sendMetadata(metadata: Promise<Metadata>): Promise<Metadata> {
    let result: Promise<Metadata> = metadata;

    for (let i = 0; i < this.filters.length; i++) {
      result = this.filters[i].sendMetadata(result);
    }

    return result;
  }

  /* Note: sendMetadataMaybeSync, sendMessageMaybeSync, and
   * receiveMessageMaybeSync are intentionally kept as separate methods rather
   * than sharing a dynamic helper so that property accesses on each filter
   * remain monomorphic in V8 inline caches. */
  sendMetadataMaybeSync(metadata: Metadata): Metadata | Promise<Metadata> {
    let result: Metadata | Promise<Metadata> = metadata;

    for (let i = 0; i < this.filters.length; i++) {
      const filter = this.filters[i];
      if (filter.sendMetadataMaybeSync) {
        result =
          result instanceof Promise
            ? result.then(resolvedMetadata =>
                filter.sendMetadataMaybeSync!(resolvedMetadata)
              )
            : filter.sendMetadataMaybeSync(result);
      } else if (filter.sendMetadata === BaseFilter.prototype.sendMetadata) {
        // Default pass-through: no-op for both sync and Promise values
      } else {
        /* Normalize custom thenables or cross-realm promises into a native
         * Promise so downstream `instanceof Promise` checks remain valid. */
        result = Promise.resolve(filter.sendMetadata(Promise.resolve(result)));
      }
    }

    return result;
  }

  receiveMetadata(metadata: Metadata) {
    let result: Metadata = metadata;

    for (let i = this.filters.length - 1; i >= 0; i--) {
      result = this.filters[i].receiveMetadata(result);
    }

    return result;
  }

  sendMessage(message: Promise<WriteObject>): Promise<WriteObject> {
    let result: Promise<WriteObject> = message;

    for (let i = 0; i < this.filters.length; i++) {
      result = this.filters[i].sendMessage(result);
    }

    return result;
  }

  sendMessageMaybeSync(
    message: WriteObject
  ): WriteObject | Promise<WriteObject> {
    let result: WriteObject | Promise<WriteObject> = message;

    for (let i = 0; i < this.filters.length; i++) {
      const filter = this.filters[i];
      if (filter.sendMessageMaybeSync) {
        result =
          result instanceof Promise
            ? result.then(resolvedMessage =>
                filter.sendMessageMaybeSync!(resolvedMessage)
              )
            : filter.sendMessageMaybeSync(result);
      } else if (filter.sendMessage === BaseFilter.prototype.sendMessage) {
        // Default pass-through: no-op for both sync and Promise values
      } else {
        result = Promise.resolve(filter.sendMessage(Promise.resolve(result)));
      }
    }

    return result;
  }

  receiveMessage(message: Promise<Buffer>): Promise<Buffer> {
    let result: Promise<Buffer> = message;

    for (let i = this.filters.length - 1; i >= 0; i--) {
      result = this.filters[i].receiveMessage(result);
    }

    return result;
  }

  receiveMessageMaybeSync(message: Buffer): Buffer | Promise<Buffer> {
    let result: Buffer | Promise<Buffer> = message;

    for (let i = this.filters.length - 1; i >= 0; i--) {
      const filter = this.filters[i];
      if (filter.receiveMessageMaybeSync) {
        result =
          result instanceof Promise
            ? result.then(resolvedMessage =>
                filter.receiveMessageMaybeSync!(resolvedMessage)
              )
            : filter.receiveMessageMaybeSync(result);
      } else if (
        filter.receiveMessage === BaseFilter.prototype.receiveMessage
      ) {
        // Default pass-through: no-op for both sync and Promise values
      } else {
        result = Promise.resolve(
          filter.receiveMessage(Promise.resolve(result))
        );
      }
    }

    return result;
  }

  receiveTrailers(status: StatusObject): StatusObject {
    let result: StatusObject = status;

    for (let i = this.filters.length - 1; i >= 0; i--) {
      result = this.filters[i].receiveTrailers(result);
    }

    return result;
  }

  push(filters: Filter[]) {
    this.filters.unshift(...filters);
  }

  getFilters(): Filter[] {
    return this.filters;
  }
}

export class FilterStackFactory implements FilterFactory<FilterStack> {
  constructor(private readonly factories: Array<FilterFactory<Filter>>) {}

  push(filterFactories: FilterFactory<Filter>[]) {
    this.factories.unshift(...filterFactories);
  }

  clone(): FilterStackFactory {
    return new FilterStackFactory([...this.factories]);
  }

  createFilter(): FilterStack {
    return new FilterStack(
      this.factories.map(factory => factory.createFilter())
    );
  }
}
