import * as http2 from 'http2';
import {forOwn} from 'lodash';

export type MetadataValue = string | Buffer;

export interface MetadataObject { [key: string]: Array<MetadataValue>; }

function cloneMetadataObject(repr: MetadataObject): MetadataObject {
  const result: MetadataObject = {};
  forOwn(repr, (value, key) => {
    // v.slice copies individual buffer values in value.
    // TODO(kjin): Is this necessary
    result[key] = value.map(v => {
      if (v instanceof Buffer) {
        return v.slice();
      } else {
        return v;
      }
    });
  });
  return result;
}

function isLegalKey(key: string): boolean {
  return !!key.match(/^[0-9a-z_.-]+$/);
}

function isLegalNonBinaryValue(value: string): boolean {
  return !!value.match(/^[ -~]*$/);
}

function isBinaryKey(key: string): boolean {
  return key.endsWith('-bin');
}

function normalizeKey(key: string): string {
  return key.toLowerCase();
}

function validate(key: string, value?: MetadataValue): void {
  if (!isLegalKey(key)) {
    throw new Error('Metadata key"' + key + '" contains illegal characters');
  }
  if (value != null) {
    if (isBinaryKey(key)) {
      if (!(value instanceof Buffer)) {
        throw new Error('keys that end with \'-bin\' must have Buffer values');
      }
    } else {
      if (value instanceof Buffer) {
        throw new Error(
            'keys that don\'t end with \'-bin\' must have String values');
      }
      if (!isLegalNonBinaryValue(value)) {
        throw new Error(
            'Metadata string value "' + value +
            '" contains illegal characters');
      }
    }
  }
}

/**
 * A class for storing metadata. Keys are normalized to lowercase ASCII.
 */
export class Metadata {
  protected internalRepr: MetadataObject = {};

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
    if (!this.internalRepr[key]) {
      this.internalRepr[key] = [value];
    } else {
      this.internalRepr[key].push(value);
    }
  }

  /**
   * Removes the given key and any associated values. Normalizes the key.
   * @param key The key whose values should be removed.
   */
  remove(key: string): void {
    key = normalizeKey(key);
    validate(key);
    if (Object.prototype.hasOwnProperty.call(this.internalRepr, key)) {
      delete this.internalRepr[key];
    }
  }

  /**
   * Gets a list of all values associated with the key. Normalizes the key.
   * @param key The key whose value should be retrieved.
   * @return A list of values associated with the given key.
   */
  get(key: string): Array<MetadataValue> {
    key = normalizeKey(key);
    validate(key);
    if (Object.prototype.hasOwnProperty.call(this.internalRepr, key)) {
      return this.internalRepr[key];
    } else {
      return [];
    }
  }

  /**
   * Gets a plain object mapping each key to the first value associated with it.
   * This reflects the most common way that people will want to see metadata.
   * @return A key/value mapping of the metadata.
   */
  getMap(): {[key: string]: MetadataValue} {
    const result: {[key: string]: MetadataValue} = {};
    forOwn(this.internalRepr, (values, key) => {
      if (values.length > 0) {
        const v = values[0];
        result[key] = v instanceof Buffer ? v.slice() : v;
      }
    });
    return result;
  }

  /**
   * Clones the metadata object.
   * @return The newly cloned object.
   */
  clone(): Metadata {
    let newMetadata = new Metadata();
    newMetadata.internalRepr = cloneMetadataObject(this.internalRepr);
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
    forOwn(other.internalRepr, (values, key) => {
      this.internalRepr[key] = (this.internalRepr[key] || []).concat(values);
    });
  }

  /**
   * Creates an OutgoingHttpHeaders object that can be used with the http2 API.
   */
  toHttp2Headers(): http2.OutgoingHttpHeaders {
    // NOTE: Node <8.9 formats http2 headers incorrectly.
    const result: http2.OutgoingHttpHeaders = {};
    forOwn(this.internalRepr, (values, key) => {
      // We assume that the user's interaction with this object is limited to
      // through its public API (i.e. keys and values are already validated).
      result[key] = values.map((value) => {
        if (value instanceof Buffer) {
          return value.toString('base64');
        } else {
          return value;
        }
      });
    });
    return result;
  }
  
  // For compatibility with the other Metadata implementation
  private _getCoreRepresentation() {
    return this.internalRepr;
  }

  /**
   * Returns a new Metadata object based fields in a given IncomingHttpHeaders
   * object.
   * @param headers An IncomingHttpHeaders object.
   */
  static fromHttp2Headers(headers: http2.IncomingHttpHeaders): Metadata {
    const result = new Metadata();
    forOwn(headers, (values, key) => {
      if (isBinaryKey(key)) {
        if (Array.isArray(values)) {
          values.forEach((value) => {
            result.add(key, Buffer.from(value, 'base64'));
          });
        } else if (values !== undefined) {
          values.split(',').map(v => v.trim()).forEach(v =>
            result.add(key, Buffer.from(v, 'base64')));
        }
      } else {
        if (Array.isArray(values)) {
          values.forEach((value) => {
            result.add(key, value);
          });
        } else if (values !== undefined) {
          values.split(',').map(v => v.trim()).forEach(v =>
            result.add(key, v));
        }
      }
    });
    return result;
  }
}
