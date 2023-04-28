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

import { XdsResourceKey, xdsResourceKeyEqual, XdsResourceName } from "./resources";

interface ResourceCacheEntry<ResourceType> {
  key: XdsResourceKey;
  value: ResourceType;
  refCount: number;
}

export class ResourceCache<ResourceType> {
  /**
   * Map authority to a list of key/value pairs
   */
  private cache: Map<string, ResourceCacheEntry<ResourceType>[]> = new Map();
  getAndRef(name: XdsResourceName): ResourceType | undefined {
    const mapEntry = this.cache.get(name.authority);
    if (!mapEntry) {
      return undefined;
    }
    for (const entry of mapEntry) {
      if (xdsResourceKeyEqual(name.key, entry.key)) {
        entry.refCount += 1;
        return entry.value;
      }
    }
    return undefined;
  }

  set(name: XdsResourceName, value: ResourceType): void {
    const mapEntry = this.cache.get(name.authority);
    if (!mapEntry) {
      this.cache.set(name.authority, [{key: name.key, value: value, refCount: 1}]);
      return;
    }
    for (const entry of mapEntry) {
      if (xdsResourceKeyEqual(name.key, entry.key)) {
        entry.value = value;
        return;
      }
    }
    mapEntry.push({key: name.key, value: value, refCount: 1});
  }

  unref(name: XdsResourceName): void {
    const mapEntry = this.cache.get(name.authority);
    if (!mapEntry) {
      return;
    }
    for (let i = 0; i < mapEntry.length; i++) {
      if (xdsResourceKeyEqual(name.key, mapEntry[i].key)) {
        mapEntry[i].refCount -= 1;
        if (mapEntry[i].refCount === 0) {
          mapEntry.splice(i, 1);
        }
        return;
      }
    }
  }
}