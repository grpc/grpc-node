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

var path = require('path');
var fs = require('fs');
var util = require('util');

var SSL_ROOTS_PATH = path.resolve(__dirname, 'deps', 'grpc', 'etc', 'roots.pem');

var _ = require('lodash');

var ProtoBuf = require('protobufjs');

var client = require('./src/client.js');

var server = require('./src/server.js');

var common = require('./src/common.js');

var Metadata = require('./src/metadata.js');

var grpc = require('./src/grpc_extension');

var protobuf_js_5_common = require('./src/protobuf_js_5_common');
var protobuf_js_6_common = require('./src/protobuf_js_6_common');

var constants = require('./src/constants.js');

grpc.setDefaultRootsPem(fs.readFileSync(SSL_ROOTS_PATH, 'ascii'));

/**
 * @namespace grpc
 */

/**
 * Load a ProtoBuf.js object as a gRPC object.
 * @memberof grpc
 * @alias grpc.loadObject
 * @param {Object} value The ProtoBuf.js reflection object to load
 * @param {Object=} options Options to apply to the loaded file
 * @param {bool=} [options.binaryAsBase64=false] deserialize bytes values as
 *     base64 strings instead of Buffers
 * @param {bool=} [options.longsAsStrings=true] deserialize long values as
 *     strings instead of objects
 * @param {bool=} [options.enumsAsStrings=true] deserialize enum values as
 *     strings instead of numbers. Only works with Protobuf.js 6 values.
 * @param {bool=} [options.deprecatedArgumentOrder=false] use the beta method
 *     argument order for client methods, with optional arguments after the
 *     callback. This option is only a temporary stopgap measure to smooth an
 *     API breakage. It is deprecated, and new code should not use it.
 * @param {(number|string)=} [options.protobufjsVersion='detect'] 5 and 6
 *     respectively indicate that an object from the corresponding version of
 *     Protobuf.js is provided in the value argument. If the option is 'detect',
 *     gRPC will guess what the version is based on the structure of the value.
 * @return {Object<string, *>} The resulting gRPC object.
 */
exports.loadObject = function loadObject(value, options) {
  options = _.defaults(options, common.defaultGrpcOptions);
  options = _.defaults(options, {'protobufjsVersion': 'detect'});
  var protobufjsVersion;
  if (options.protobufjsVersion === 'detect') {
    if (protobuf_js_6_common.isProbablyProtobufJs6(value)) {
      protobufjsVersion = 6;
    } else if (protobuf_js_5_common.isProbablyProtobufJs5(value)) {
      protobufjsVersion = 5;
    } else {
      var error_message = 'Could not detect ProtoBuf.js version. Please ' +
          'specify the version number with the "protobufjsVersion" option';
      throw new Error(error_message);
    }
  } else {
    protobufjsVersion = options.protobufjsVersion;
  }
  switch (protobufjsVersion) {
    case 6: return protobuf_js_6_common.loadObject(value, options);
    case 5:
    return protobuf_js_5_common.loadObject(value, options);
    default:
    throw new Error('Unrecognized protobufjsVersion', protobufjsVersion);
  }
};

var loadObject = exports.loadObject;

/**
 * Load a gRPC object from a .proto file.
 * @deprecated Use the {@link https://www.npmjs.com/package/@grpc/proto-loader|proto-loader module}
       with grpc.loadPackageDefinition instead.
 * @memberof grpc
 * @alias grpc.load
 * @param {string|{root: string, file: string}} filename The file to load
 * @param {string=} format The file format to expect. Must be either 'proto' or
 *     'json'. Defaults to 'proto'
 * @param {Object=} options Options to apply to the loaded file
 * @param {bool=} [options.convertFieldsToCamelCase=false] Load this file with
 *     field names in camel case instead of their original case
 * @param {bool=} [options.binaryAsBase64=false] deserialize bytes values as
 *     base64 strings instead of Buffers
 * @param {bool=} [options.longsAsStrings=true] deserialize long values as
 *     strings instead of objects
 * @param {bool=} [options.deprecatedArgumentOrder=false] use the beta method
 *     argument order for client methods, with optional arguments after the
 *     callback. This option is only a temporary stopgap measure to smooth an
 *     API breakage. It is deprecated, and new code should not use it.
 * @return {Object<string, *>} The resulting gRPC object
 */
exports.load = util.deprecate(function load(filename, format, options) {
  options = _.defaults(options, common.defaultGrpcOptions);
  options.protobufjsVersion = 5;
  if (!format) {
    format = 'proto';
  }
  var convertFieldsToCamelCaseOriginal = ProtoBuf.convertFieldsToCamelCase;
  if(options && options.hasOwnProperty('convertFieldsToCamelCase')) {
    ProtoBuf.convertFieldsToCamelCase = options.convertFieldsToCamelCase;
  }
  var builder;
  try {
    switch(format) {
      case 'proto':
      builder = ProtoBuf.loadProtoFile(filename);
      break;
      case 'json':
      builder = ProtoBuf.loadJsonFile(filename);
      break;
      default:
      throw new Error('Unrecognized format "' + format + '"');
    }
  } finally {
    ProtoBuf.convertFieldsToCamelCase = convertFieldsToCamelCaseOriginal;
  }

  if (!builder) {
    throw new Error('Could not load file "' + filename + '"');
  }

  return loadObject(builder.ns, options);
}, 'grpc.load: Use the @grpc/proto-loader module with grpc.loadPackageDefinition instead');

/**
 * Load a gRPC package definition as a gRPC object hierarchy
 * @param packageDef grpc~PackageDefinition The package definition object
 * @return {Object<string, *>} The resulting gRPC object
 */
exports.loadPackageDefinition = function loadPackageDefintion(packageDef) {
  const result = {};
  for (const serviceFqn in packageDef) {
    const service = packageDef[serviceFqn];
    const nameComponents = serviceFqn.split('.');
    const serviceName = nameComponents[nameComponents.length-1];
    let current = result;
    for (const packageName of nameComponents.slice(0, -1)) {
      if (!current[packageName]) {
        current[packageName] = {};
      }
      current = current[packageName];
    }
    current[serviceName] = client.makeClientConstructor(service, serviceName, {});
  }
  return result;
};

var log_template = function(args) {
  var file = args.file;
  var line = args.line;
  var severity = args.severity;
  var message = args.message;
  var timestamp = args.timestamp;
  return `${severity} ${timestamp}\t${file}:${line}]\t${message}`;
};

/**
 * Sets the logger function for the gRPC module. For debugging purposes, the C
 * core will log synchronously directly to stdout unless this function is
 * called. Note: the output format here is intended to be informational, and
 * is not guaranteed to stay the same in the future.
 * Logs will be directed to logger.error.
 * @memberof grpc
 * @alias grpc.setLogger
 * @param {Console} logger A Console-like object.
 */
exports.setLogger = function setLogger(logger) {
  common.logger = logger;
  grpc.setDefaultLoggerCallback(function(file, line, severity,
                                         message, timestamp) {
    logger.error(log_template({
      file: path.basename(file),
      line: line,
      severity: severity,
      message: message,
      timestamp: timestamp.toISOString()
    }));
  });
};

/**
 * Sets the logger verbosity for gRPC module logging. The options are members
 * of the grpc.logVerbosity map.
 * @memberof grpc
 * @alias grpc.setLogVerbosity
 * @param {Number} verbosity The minimum severity to log
 */
exports.setLogVerbosity = function setLogVerbosity(verbosity) {
  common.logVerbosity = verbosity;
  grpc.setLogVerbosity(verbosity);
};

exports.Server = server.Server;

exports.Metadata = Metadata;

exports.status = constants.status;

exports.propagate = constants.propagate;

exports.callError = constants.callError;

exports.writeFlags = constants.writeFlags;

exports.logVerbosity = constants.logVerbosity;

exports.methodTypes = constants.methodTypes;

exports.connectivityState = constants.connectivityState;

exports.credentials = require('./src/credentials.js');

/**
 * ServerCredentials factories
 * @constructor ServerCredentials
 * @memberof grpc
 */
exports.ServerCredentials = grpc.ServerCredentials;

/**
 * Create insecure server credentials
 * @name grpc.ServerCredentials.createInsecure
 * @kind function
 * @return {grpc.ServerCredentials}
 */

/**
 * A private key and certificate pair
 * @typedef {Object} grpc.ServerCredentials~keyCertPair
 * @property {Buffer} private_key The server's private key
 * @property {Buffer} cert_chain The server's certificate chain
 */

/**
 * Create SSL server credentials
 * @name grpc.ServerCredentials.createSsl
 * @kind function
 * @param {?Buffer} rootCerts Root CA certificates for validating client
 *     certificates
 * @param {Array<grpc.ServerCredentials~keyCertPair>} keyCertPairs A list of
 *     private key and certificate chain pairs to be used for authenticating
 *     the server
 * @param {boolean} [checkClientCertificate=false] Indicates that the server
 *     should request and verify the client's certificates
 * @return {grpc.ServerCredentials}
 */

exports.makeGenericClientConstructor = client.makeClientConstructor;

exports.getClientChannel = client.getClientChannel;

exports.waitForClientReady = client.waitForClientReady;

exports.StatusBuilder = client.StatusBuilder;
exports.ListenerBuilder = client.ListenerBuilder;
exports.RequesterBuilder = client.RequesterBuilder;
exports.InterceptingCall = client.InterceptingCall;

/**
 * @memberof grpc
 * @alias grpc.closeClient
 * @param {grpc.Client} client_obj The client to close
 */
exports.closeClient = function closeClient(client_obj) {
  client.Client.prototype.close.apply(client_obj);
};

exports.Client = client.Client;

/**
 * @typedef {Object.<string, string | number>} grpc~ChannelOptions
 */

/**
 * This constructor API is almost identical to the Client constructor,
 * except that some of the options for the Client constructor are not valid
 * here.
 * @constructor Channel
 * @memberof grpc
 * @param {string} target The address of the server to connect to
 * @param {grpc.ChannelCredentials} credentials Channel credentials to use when connecting
 * @param {grpc~ChannelOptions} options A map of channel options that will be passed to the core
 */
exports.Channel = grpc.Channel;

/**
 * Close the channel. This has the same functionality as the existing grpc.Client#close
 * @name grpc.Channel#close
 * @kind function
 */

/**
 * Return the target that this channel connects to
 * @name grpc.Channel#getTarget
 * @kind function
 * @return {string} The target
 */

/**
 * Get the channel's current connectivity state.
 * @name grpc.Channel#getConnectivityState
 * @kind function
 * @param {boolean} tryToConnect If true, the channel will start connecting if it is
 *     idle. Otherwise, idle channels will only start connecting when a
 *     call starts.
 * @return {grpc.connectivityState} The current connectivity state
 */

/**
 * @callback grpc.Channel~watchConnectivityStateCallback
 * @param {Error?} error
 */

/**
 * Watch for connectivity state changes.
 * @name grpc.Channel#watchConnectivityState
 * @kind function
 * @param {grpc.ConnectivityState} currentState The state to watch for
 *     transitions from. This should always be populated by calling
 *     getConnectivityState immediately before.
 * @param {grpc~Deadline} deadline A deadline for waiting for a state change
 * @param {grpc.Channel~watchConnectivityStateCallback} callback Called with no
 *     error when the state changes, or with an error if the deadline passes
 *     without a state change
 */

/**
 * @name grpc~Call
 * @kind class
 */

/**
 * Create a call object. Call is an opaque type used by the {@link grpc.Client}
 * and {@link grpc.Server} classes. This function is called by the gRPC library
 * when starting a request. Implementers should return an instance of Call that
 * is returned from calling createCall on an instance of the provided Channel
 * class.
 * @name grpc.Channel#createCall
 * @kind function
 * @param {string} method The full method string to request
 * @param {grpc~Deadline} deadline The call deadline
 * @param {string|null} host A host string override for making the request
 * @param {grpc~Call|null} parentCall A server call to propagate some
 *     information from
 * @param {number|null} propagateFlags A bitwise combination of elements of
 *     {@link grpc.propagate} that indicates what information to propagate
 *     from parentCall
 * @return {grpc~Call}
 */
