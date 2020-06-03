/**
 * @license
 * Copyright 2015 gRPC authors.
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

'use strict';

var clone = require('lodash.clone');

var grpc = require('./grpc_extension');

const common = require('./common');
const logVerbosity = require('./constants').logVerbosity;

const IDEMPOTENT_REQUEST_FLAG = 0x10;
const WAIT_FOR_READY_FLAG = 0x20;
const CACHEABLE_REQUEST_FLAG = 0x40;
const WAIT_FOR_READY_EXPLICITLY_SET_FLAG = 0x80;
const CORKED_FLAG = 0x100;

/**
 * Class for storing metadata. Keys are normalized to lowercase ASCII.
 * @memberof grpc
 * @constructor
 * @param {Object=} options Boolean options for the beginning of the call.
 *     These options only have any effect when passed at the beginning of
 *     a client request.
 * @param {boolean=} [options.idempotentRequest=false] Signal that the request
 *     is idempotent
 * @param {boolean=} [options.waitForReady=true] Signal that the call should
 *     not return UNAVAILABLE before it has started.
 * @param {boolean=} [options.cacheableRequest=false] Signal that the call is
 *     cacheable. GRPC is free to use GET verb.
 * @param {boolean=} [options.corked=false] Signal that the initial metadata
 *     should be corked.
 * @example
 * var metadata = new metadata_module.Metadata();
 * metadata.set('key1', 'value1');
 * metadata.add('key1', 'value2');
 * metadata.get('key1') // returns ['value1', 'value2']
 */
function Metadata(options) {
  this._internal_repr = {};
  this.setOptions(options);
}

function normalizeKey(key) {
  key = key.toLowerCase();
  if (grpc.metadataKeyIsLegal(key)) {
    return key;
  } else {
    throw new Error('Metadata key"' + key + '" contains illegal characters');
  }
}

function validate(key, value) {
  if (grpc.metadataKeyIsBinary(key)) {
    if (!(value instanceof Buffer)) {
      throw new Error('keys that end with \'-bin\' must have Buffer values');
    }
  } else {
    if (typeof value !== 'string') {
      throw new Error(
          'keys that don\'t end with \'-bin\' must have String values');
    }
    if (!grpc.metadataNonbinValueIsLegal(value)) {
      throw new Error('Metadata string value "' + value +
                      '" contains illegal characters');
    }
  }
}

/**
 * Sets the given value for the given key, replacing any other values associated
 * with that key. Normalizes the key.
 * @param {String} key The key to set
 * @param {String|Buffer} value The value to set. Must be a buffer if and only
 *     if the normalized key ends with '-bin'
 */
Metadata.prototype.set = function(key, value) {
  key = normalizeKey(key);
  validate(key, value);
  this._internal_repr[key] = [value];
};

/**
 * Adds the given value for the given key. Normalizes the key.
 * @param {String} key The key to add to.
 * @param {String|Buffer} value The value to add. Must be a buffer if and only
 *     if the normalized key ends with '-bin'
 */
Metadata.prototype.add = function(key, value) {
  key = normalizeKey(key);
  validate(key, value);
  if (!this._internal_repr[key]) {
    this._internal_repr[key] = [];
  }
  this._internal_repr[key].push(value);
};

/**
 * Remove the given key and any associated values. Normalizes the key.
 * @param {String} key The key to remove
 */
Metadata.prototype.remove = function(key) {
  key = normalizeKey(key);
  if (Object.prototype.hasOwnProperty.call(this._internal_repr, key)) {
    delete this._internal_repr[key];
  }
};

/**
 * Gets a list of all values associated with the key. Normalizes the key.
 * @param {String} key The key to get
 * @return {Array.<String|Buffer>} The values associated with that key
 */
Metadata.prototype.get = function(key) {
  key = normalizeKey(key);
  if (Object.prototype.hasOwnProperty.call(this._internal_repr, key)) {
    return this._internal_repr[key];
  } else {
    return [];
  }
};

/**
 * Get a map of each key to a single associated value. This reflects the most
 * common way that people will want to see metadata.
 * @return {Object.<String,String|Buffer>} A key/value mapping of the metadata
 */
Metadata.prototype.getMap = function() {
  var result = {};
  Object.keys(this._internal_repr).forEach(key => {
    const values = this._internal_repr[key];
    if(values.length > 0) {
      result[key] = values[0];
    }
  });
  return result;
};

/**
 * Clone the metadata object.
 * @return {grpc.Metadata} The new cloned object
 */
Metadata.prototype.clone = function() {
  var copy = new Metadata();
  Object.keys(this._internal_repr).forEach(key => {
    const value = this._internal_repr[key];
    copy._internal_repr[key] = clone(value);
  });
  copy.flags = this.flags;
  return copy;
};

/**
 * Set options on the metadata object
 * @param {Object} options Boolean options for the beginning of the call.
 *     These options only have any effect when passed at the beginning of
 *     a client request.
 * @param {boolean=} [options.idempotentRequest=false] Signal that the request
 *     is idempotent
 * @param {boolean=} [options.waitForReady=true] Signal that the call should
 *     not return UNAVAILABLE before it has started.
 * @param {boolean=} [options.cacheableRequest=false] Signal that the call is
 *     cacheable. GRPC is free to use GET verb.
 * @param {boolean=} [options.corked=false] Signal that the initial metadata
 *     should be corked.
 */
Metadata.prototype.setOptions = function(options) {
  let flags = 0;
  if (options) {
    if (options.idempotentRequest) {
      flags |= IDEMPOTENT_REQUEST_FLAG;
    }
    if (options.hasOwnProperty('waitForReady')) {
      flags |= WAIT_FOR_READY_EXPLICITLY_SET_FLAG;
      if (options.waitForReady) {
        flags |= WAIT_FOR_READY_FLAG;
      }
    }
    if (options.cacheableRequest) {
      flags |= CACHEABLE_REQUEST_FLAG;
    }
    if (options.corked) {
      flags |= CORKED_FLAG;
    }
  }
  this.flags = flags;
}

/**
 * Metadata representation as passed to and the native addon
 * @typedef {object} grpc~CoreMetadata
 * @param {Object.<String, Array.<String|Buffer>>} metadata The metadata
 * @param {number} flags Metadata flags
 */

/**
 * Gets the metadata in the format used by interal code. Intended for internal
 * use only. API stability is not guaranteed.
 * @private
 * @return {grpc~CoreMetadata} The metadata
 */
Metadata.prototype._getCoreRepresentation = function() {
  return {
    metadata: this._internal_repr,
    flags: this.flags
  };
};

/**
 * Creates a Metadata object from a metadata map in the internal format.
 * Intended for internal use only. API stability is not guaranteed.
 * @private
 * @param {grpc~CoreMetadata} metadata The metadata object from core
 * @return {Metadata} The new Metadata object
 */
Metadata._fromCoreRepresentation = function(metadata) {
  var newMetadata = new Metadata();
  if (metadata) {
    Object.keys(metadata.metadata).forEach(key => {
      const value = metadata.metadata[key];
      if (!grpc.metadataKeyIsLegal(key)) {
        common.log(logVerbosity.ERROR,
          "Warning: possibly corrupted metadata key received: " +
          key + ": " + value +
          ". Please report this at https://github.com/grpc/grpc-node/issues/1173.");
      }
      newMetadata._internal_repr[key] = clone(value);
    });
  }
  newMetadata.flags = metadata.flags;
  return newMetadata;
};

module.exports = Metadata;
