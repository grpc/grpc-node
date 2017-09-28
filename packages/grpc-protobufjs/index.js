/**
 * @license
 * Copyright 2017 gRPC authors.
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

var path = require('path');

var _ = require('lodash');
var ProtoBuf = require('protobufjs');

module.exports = function(grpc) {

  let exports = {};

  const protobuf_js_5_common = require('protobuf_js_5_common')(grpc);
  const protobuf_js_6_common = require('protobuf_js_6_common')(grpc);

  /**
   * Default options for loading proto files into gRPC
   * @alias grpc~defaultLoadOptions
   */
  const defaultGrpcOptions = {
    convertFieldsToCamelCase: false,
    binaryAsBase64: false,
    longsAsStrings: true,
    enumsAsStrings: true
  };

  /**
   * Load a ProtoBuf.js object as a gRPC object. The options object can provide
   * the following options:
   * - binaryAsBase64: deserialize bytes values as base64 strings instead of
   *   Buffers. Defaults to false
   * - longsAsStrings: deserialize long values as strings instead of objects.
   *   Defaults to true
   * - enumsAsStrings: deserialize enum values as strings instead of numbers.
   *   Defaults to true
   * - protobufjsVersion: Available values are 5, 6, and 'detect'. 5 and 6
   *   respectively indicate that an object from the corresponding version of
   *   ProtoBuf.js is provided in the value argument. If the option is 'detect',
   *   gRPC will guess what the version is based on the structure of the value.
   *   Defaults to 'detect'.
   * @param {Object} value The ProtoBuf.js reflection object to load
   * @param {Object=} options Options to apply to the loaded file
   * @return {Object<string, *>} The resulting gRPC object
   */
  exports.loadObject = function loadObject(value, options) {
    options = _.defaults(options, defaultGrpcOptions);
    options = _.defaults(options, {'protobufjsVersion': 'detect'});
    var protobufjsVersion;
    if (options.protobufjsVersion === 'detect') {
      if (protobuf_js_6_common.isProbablyProtobufJs6(value)) {
        protobufjsVersion = 6;
      } else if (protobuf_js_5_common.isProbablyProtobufJs5(value)) {
        protobufjsVersion = 5;
      } else {
        var error_message = 'Could not detect ProtoBuf.js version. Please ' +
            'specify the version number with the "protobufjs_version" option';
        throw new Error(error_message);
      }
    } else {
      protobufjsVersion = options.protobufjsVersion;
    }
    switch (protobufjsVersion) {
      case 6: return protobuf_js_6_common.loadObject(value, options);
      case 5: return protobuf_js_5_common.loadObject(value, options);
      default:
      throw new Error('Unrecognized protobufjsVersion', protobufjsVersion);
    }
  };

  var loadObject = exports.loadObject;

  function applyProtoRoot(filename, root) {
    if (_.isString(filename)) {
      return filename;
    }
    filename.root = path.resolve(filename.root) + '/';
    root.resolvePath = function(originPath, importPath, alreadyNormalized) {
      return ProtoBuf.util.path.resolve(filename.root,
                                        importPath,
                                        alreadyNormalized);
    };
    return filename.file;
  }

  /**
   * Load a gRPC object from a .proto file. The options object can provide the
   * following options:
   * - convertFieldsToCamelCase: Load this file with field names in camel case
   *   instead of their original case
   * - binaryAsBase64: deserialize bytes values as base64 strings instead of
   *   Buffers. Defaults to false
   * - longsAsStrings: deserialize long values as strings instead of objects.
   *   Defaults to true
   * - enumsAsStrings: deserialize enum values as strings instead of numbers.
   *   Defaults to true
   * - deprecatedArgumentOrder: Use the beta method argument order for client
   *   methods, with optional arguments after the callback. Defaults to false.
   *   This option is only a temporary stopgap measure to smooth an API breakage.
   *   It is deprecated, and new code should not use it.
   * @param {string|{root: string, file: string}} filename The file to load
   * @param {string=} format The file format to expect. Must be either 'proto' or
   *     'json'. Defaults to 'proto'
   * @param {Object=} options Options to apply to the loaded file
   * @return {Object<string, *>} The resulting gRPC object
   */
  exports.load = function load(filename, format, options) {
    /* Note: format is currently unused, because the API for loading a proto
       file or a JSON file is identical in Protobuf.js 6. In the future, there is
       still the possibility of adding other formats that would be loaded
       differently */
    options = _.defaults(options, defaultGrpcOptions);
    options.protobufjs_version = 6;
    var root = new ProtoBuf.Root();
    var parse_options = {keepCase: !options.convertFieldsToCamelCase};
    return loadObject(root.loadSync(applyProtoRoot(filename, root),
                                    parse_options),
                      options);
  };

  return exports;

};
