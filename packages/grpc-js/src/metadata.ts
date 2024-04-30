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

import * as http2 from 'http2';
import { log } from './logging';
import { LogVerbosity } from './constants';
import { getErrorMessage } from './error';

const LEGAL_KEY_REGEX = /^[0-9a-z_.-]+$/;
const LEGAL_NON_BINARY_VALUE_REGEX = /^[ -~]*$/;
const { isArray } = Array;
// const { hasOwnProperty } = Object.prototype;

export type MetadataValue = string | Buffer;
export interface MetadataObject {
  [key: string]: MetadataValue[] | undefined;
}

function isLegalKey(key: string): boolean {
  return LEGAL_KEY_REGEX.test(key);
}

function isLegalNonBinaryValue(value: string): boolean {
  return LEGAL_NON_BINARY_VALUE_REGEX.test(value);
}

// https://github.com/RafaelGSS/nodejs-bench-operations/blob/main/RESULTS-v20.md#endswith-comparison
function isBinaryKey(key: string): boolean {
  // return key.endsWith('-bin');
  return key.slice(-4) === '-bin';
}

function isCustomMetadata(key: string): boolean {
  return key.slice(0, 5) !== 'grpc-';
}

function normalizeKey(key: string): string {
  return key.toLowerCase();
}

function validate(key: string, value?: MetadataValue): void {
  if (!isLegalKey(key)) {
    throw new Error('Metadata key "' + key + '" contains illegal characters');
  }

  if (value !== null && value !== undefined) {
    if (isBinaryKey(key)) {
      if (!Buffer.isBuffer(value)) {
        throw new Error("keys that end with '-bin' must have Buffer values");
      }
    } else {
      if (Buffer.isBuffer(value)) {
        throw new Error(
          "keys that don't end with '-bin' must have String values"
        );
      }
      if (!isLegalNonBinaryValue(value)) {
        throw new Error(
          'Metadata string value "' + value + '" contains illegal characters'
        );
      }
    }
  }
}

function validateString(key: string, value: string): void {
  if (!isLegalKey(key)) {
    throw new Error('Metadata key "' + key + '" contains illegal characters');
  }

  if (!isLegalNonBinaryValue(value)) {
    throw new Error(
      'Metadata string value "' + value + '" contains illegal characters'
    );
  }
}

function validateStrings(key: string, values: string[]): void {
  if (!isLegalKey(key)) {
    throw new Error('Metadata key "' + key + '" contains illegal characters');
  }

  for (let i = 0; i < values.length; i += 1) {
    if (!isLegalNonBinaryValue(values[i])) {
      throw new Error(
        'Metadata string value "' + values[i] + '" contains illegal characters'
      );
    }
  }
}

function validateBinary(key: string): void {
  if (!isLegalKey(key)) {
    throw new Error('Metadata key "' + key + '" contains illegal characters');
  }

  if (!isBinaryKey(key)) {
    throw new Error("keys that end with '-bin' must have Buffer values");
  }
}

export interface MetadataOptions {
  /* Signal that the request is idempotent. Defaults to false */
  idempotentRequest?: boolean;
  /* Signal that the call should not return UNAVAILABLE before it has
   * started. Defaults to false. */
  waitForReady?: boolean;
  /* Signal that the call is cacheable. GRPC is free to use GET verb.
   * Defaults to false */
  cacheableRequest?: boolean;
  /* Signal that the initial metadata should be corked. Defaults to false. */
  corked?: boolean;
}

function MetadataObject() {}
MetadataObject.prototype = Object.create(null);

/**
 * A class for storing metadata. Keys are normalized to lowercase ASCII.
 */
export class Metadata {
  // @ts-expect-error - cached object
  protected internalRepr: MetadataObject = new MetadataObject();
  private options: MetadataOptions;

  constructor(
    options: MetadataOptions = {
      idempotentRequest: false,
      waitForReady: false,
      cacheableRequest: false,
      corked: false,
    }
  ) {
    this.options = options;
  }

  /**
   * Sets the given value for the given key by replacing any other values
   * associated with that key. Normalizes the key.
   * @param key The key to whose value should be set.
   * @param value The value to set. Must be a buffer if and only
   *   if the normalized key ends with '-bin'.
   */
  set(key: string, value: MetadataValue): void {
    key = normalizeKey(key);
    validate(key, value);
    this.internalRepr[key] = [value];
  }

  /**
   * Adds the given value for the given key by appending to a list of previous
   * values associated with that key. Normalizes the key.
   * @param key The key for which a new value should be appended.
   * @param value The value to add. Must be a buffer if and only
   *   if the normalized key ends with '-bin'.
   */
  add(key: string, value: MetadataValue): void {
    key = normalizeKey(key);
    validate(key, value);

    const existingValue: MetadataValue[] | undefined = this.internalRepr[key];

    if (existingValue === undefined) {
      this.internalRepr[key] = [value];
    } else {
      existingValue.push(value);
    }
  }

  addString(key: string, value: string): void {
    validateString(key, value);
    this.internalRepr[key] = [value];
  }

  addStrings(key: string, values: string[]): void {
    validateStrings(key, values);
    this.internalRepr[key] = values;
  }

  addBuffer(key: string, value: Buffer): void {
    validateBinary(key);
    this.internalRepr[key] = [value];
  }

  addBuffers(key: string, values: Buffer[]): void {
    validateBinary(key);
    this.internalRepr[key] = values;
  }

  /**
   * Removes the given key and any associated values. Normalizes the key.
   * @param key The key whose values should be removed.
   */
  remove(key: string): void {
    key = normalizeKey(key);
    // validate(key);
    if (this.internalRepr[key] !== undefined) {
      this.internalRepr[key] = undefined; // expensive, but cheaper in new versions
    }
  }

  /**
   * Gets a list of all values associated with the key. Normalizes the key.
   * @param key The key whose value should be retrieved.
   * @return A list of values associated with the given key.
   */
  get(key: string): MetadataValue[] {
    return this.internalRepr[normalizeKey(key)] || [];
  }

  /**
   * Gets a plain object mapping each key to the first value associated with it.
   * This reflects the most common way that people will want to see metadata.
   * @return A key/value mapping of the metadata.
   */
  getMap(): { [key: string]: MetadataValue } {
    const result: { [key: string]: MetadataValue } = {};
    const keys = Object.keys(this.internalRepr);

    let values;
    let key;
    let v;
    for (let i = 0; i < keys.length; i += 1) {
      key = keys[i];
      values = this.internalRepr[key];
      if (values !== undefined && values.length > 0) {
        v = values[0];
        result[key] = Buffer.isBuffer(v) ? Buffer.from(v) : v;
      }
    }
    return result;
  }

  /**
   * Clones the metadata object.
   * @return The newly cloned object.
   */
  clone(): Metadata {
    const newMetadata = new Metadata(this.options);
    const newInternalRepr = newMetadata.internalRepr;
    const keys = Object.keys(this.internalRepr);

    let values;
    let key;
    for (let i = 0; i < keys.length; i += 1) {
      key = keys[i];
      values = this.internalRepr[key];
      if (values !== undefined) {
        const clonedValue: MetadataValue[] = values.map(v => {
          if (Buffer.isBuffer(v)) {
            return Buffer.from(v);
          } else {
            return v;
          }
        });

        newInternalRepr[key] = clonedValue;
      }
    }

    return newMetadata;
  }

  /**
   * Merges all key-value pairs from a given Metadata object into this one.
   * If both this object and the given object have values in the same key,
   * values from the other Metadata object will be appended to this object's
   * values.
   * @param other A Metadata object.
   */
  merge(other: Metadata): void {
    const keys = Object.keys(other.internalRepr);

    let values;
    let key;
    for (let i = 0; i < keys.length; i += 1) {
      key = keys[i];
      values = other.internalRepr[key] || [];

      const mergedValue: MetadataValue[] = (
        this.internalRepr[key] || []
      ).concat(values);

      this.internalRepr[key] = mergedValue;
    }
  }

  setOptions(options: MetadataOptions) {
    this.options = options;
  }

  getOptions(): MetadataOptions {
    return this.options;
  }

  /**
   * Creates an OutgoingHttpHeaders object that can be used with the http2 API.
   */
  toHttp2Headers(): http2.OutgoingHttpHeaders {
    const o = this.internalRepr;
    const result: http2.OutgoingHttpHeaders = Object.create(null);

    for (const k in o) {
      const cur = o[k];
      if (cur !== undefined) {
        // @ts-expect-error manual buffer conversion
        result[k] = isBinaryKey(k) ? cur.map(bufToString) : cur;
      }
    }

    return result;
  }

  /**
   * This modifies the behavior of JSON.stringify to show an object
   * representation of the metadata map.
   */
  toJSON() {
    const result: { [key: string]: MetadataValue[] } = {};
    const keys = Object.keys(this.internalRepr);

    let values;
    let key;
    for (let i = 0; i < keys.length; i += 1) {
      key = keys[i];
      values = this.internalRepr[key];
      if (values !== undefined) {
        result[key] = values;
      }
    }
    return result;
  }

  /**
   * Returns a new Metadata object based fields in a given IncomingHttpHeaders
   * object.
   * @param headers An IncomingHttpHeaders object.
   */
  static fromHttp2Headers(headers: http2.IncomingHttpHeaders): Metadata {
    const result = new Metadata();
    const keys = Object.keys(headers);

    let key: string;
    let values: string | string[] | undefined;

    for (let i = 0; i < keys.length; i += 1) {
      key = keys[i];
      // Reserved headers (beginning with `:`) are not valid keys.
      if (key.charAt(0) === ':') {
        continue;
      }

      values = headers[key];
      if (values === undefined) {
        continue;
      }

      try {
        handleMetadataValue(result, key, values);
      } catch (error) {
        const message = `Failed to add metadata entry ${key}: ${values}. ${getErrorMessage(
          error
        )}. For more information see https://github.com/grpc/grpc-node/issues/1173`;
        log(LogVerbosity.ERROR, message);
      }
    }

    return result;
  }
}

function handleMetadataValue(
  result: Metadata,
  key: string,
  values: string | string[]
): void {
  if (isBinaryKey(key)) {
    if (isArray(values)) {
      result.addBuffers(
        key,
        values.map(v => Buffer.from(v, 'base64'))
      );
    } else if (isCustomMetadata(key)) {
      result.addBuffers(
        key,
        values.split(',').map(val => Buffer.from(val.trim(), 'base64'))
      );
    } else {
      result.addBuffer(key, Buffer.from(values, 'base64'));
    }
  } else {
    if (isArray(values)) {
      result.addStrings(key, values);
    } else {
      result.addString(key, values);
    }
  }
}

const bufToString = (val: string | Buffer): string => {
  return Buffer.isBuffer(val) ? val.toString('base64') : val;
};
