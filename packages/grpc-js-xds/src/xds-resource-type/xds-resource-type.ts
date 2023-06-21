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

import { Any__Output } from "../generated/google/protobuf/Any";
import { XdsServerConfig } from "../xds-bootstrap";

export interface XdsDecodeContext {
  server: XdsServerConfig;
}

export interface XdsDecodeResult {
  name: string;
  /**
   * Mutually exclusive with error.
   */
  value?: object;
  /**
   * Mutually exclusive with value.
   */
  error?: string;
}

type ValueType = string | number | bigint | boolean | undefined | null | symbol | {[key: string]: ValueType} | ValueType[];

function deepEqual(value1: ValueType, value2: ValueType): boolean {
  if (value1 === value2) {
    return true;
  }
  // Extra null check to narrow type result of typeof value === 'object'
  if (value1 === null || value2 === null) {
    // They are not equal per previous check
    return false;
  }
  if (Array.isArray(value1) && Array.isArray(value2)) {
    if (value1.length !== value2.length) {
      return false;
    }
    for (const [index, entry] of value1.entries()) {
      if (!deepEqual(entry, value2[index])) {
        return false;
      }
    }
    return true;
  } else if (Array.isArray(value1) || Array.isArray(value2)) {
    return false;
  } else if (typeof value1 === 'object' && typeof value2 === 'object') {
    for (const [key, entry] of Object.entries(value1)) {
      if (!deepEqual(entry, value2[key])) {
        return false;
      }
    }
    return true;
  }
  return false;
}

export abstract class XdsResourceType {
  /**
   * The type URL as used in xdstp: names
   */
  abstract getTypeUrl(): string;

  /**
   * The type URL as used in the `DiscoveryResponse.type_url` field and the `Any.type_url` field
   */
  getFullTypeUrl(): string {
    return `type.googleapis.com/${this.getTypeUrl()}`;
  }

  abstract decode(context: XdsDecodeContext, resource: Any__Output): XdsDecodeResult;

  abstract allResourcesRequiredInSotW(): boolean;

  resourcesEqual(value1: object | null, value2: object | null): boolean {
    return deepEqual(value1 as ValueType, value2 as ValueType);
  }
}
