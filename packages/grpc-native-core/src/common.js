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

var _ = require('lodash');
var constants = require('./constants');

/**
 * Wrap a function to pass null-like values through without calling it. If no
 * function is given, just uses the identity.
 * @private
 * @param {?function} func The function to wrap
 * @return {function} The wrapped function
 */
exports.wrapIgnoreNull = function wrapIgnoreNull(func) {
  if (!func) {
    return _.identity;
  }
  return function(arg) {
    if (arg === null || arg === undefined) {
      return null;
    }
    return func(arg);
  };
};

/**
 * The logger object for the gRPC module. Defaults to console.
 * @private
 */
exports.logger = console;

/**
 * The current logging verbosity. 0 corresponds to logging everything
 * @private
 */
exports.logVerbosity = 0;

/**
 * Log a message if the severity is at least as high as the current verbosity
 * @private
 * @param {Number} severity A value of the grpc.logVerbosity map
 * @param {String} message The message to log
 */
exports.log = function log(severity, message) {
  if (severity >= exports.logVerbosity) {
    exports.logger.error(message);
  }
};

/**
 * Default options for loading proto files into gRPC
 * @alias grpc~defaultLoadOptions
 */
exports.defaultGrpcOptions = {
  convertFieldsToCamelCase: false,
  binaryAsBase64: false,
  longsAsStrings: true,
  enumsAsStrings: true,
  deprecatedArgumentOrder: false
};

/**
 * Create an Error object from a status object
 * @param {grpc~StatusObject} status The status object
 * @return {Error} The resulting Error
 */
exports.createStatusError = function(status) {
  let statusName = _.invert(constants.status)[status.code];
  let message = `${status.code} ${statusName}: ${status.details}`;
  let error = new Error(message);
  error.code = status.code;
  error.metadata = status.metadata;
  error.details = status.details;
  return error;
};

/**
 * Get a method's type from its definition
 * @param {grpc~MethodDefinition} method_definition
 * @return {number}
 */
exports.getMethodType = function(method_definition) {
  if (method_definition.requestStream) {
    if (method_definition.responseStream) {
      return constants.methodTypes.BIDI_STREAMING;
    } else {
      return constants.methodTypes.CLIENT_STREAMING;
    }
  } else {
    if (method_definition.responseStream) {
      return constants.methodTypes.SERVER_STREAMING;
    } else {
      return constants.methodTypes.UNARY;
    }
  }
};

const PEM_CERT_HEADER = "-----BEGIN CERTIFICATE-----";
const PEM_CERT_FOOTER = "-----END CERTIFICATE-----";

/**
 * Converts a certificate in ASCII PEM format to a byte buffer.
 * @param {string} cert The certificate in PEM format
 * @return {Buffer|Error} The certificate as a byte buffer.
 */

exports.pemCertificateToRaw = function(cert) {
  // Parse cert from pem to a version that matches the tls.checkServerIdentity
  // format and the tls.TLSSocket.getPeerCertificate format.
  // https://nodejs.org/api/tls.html#tls_tls_checkserveridentity_hostname_cert
  // https://nodejs.org/api/tls.html#tls_tlssocket_getpeercertificate_detailed

  var pemHeaderIndex = cert.indexOf(PEM_CERT_HEADER);
  if (pemHeaderIndex === -1) {
    return new Error("Unable to parse certificate PEM.");
  }
  cert = cert.substring(pemHeaderIndex);
  var pemFooterIndex = cert.indexOf(PEM_CERT_FOOTER);
  if (pemFooterIndex === -1) {
    return new Error("Unable to parse certificate PEM.");
  }
  cert = cert.substring(PEM_CERT_HEADER.length, pemFooterIndex);
  return new Buffer(cert.replace("\n", "").replace(" ", ""), "base64");
}


// JSDoc definitions that are used in multiple other modules

/**
 * Represents the status of a completed request. If `code` is
 * {@link grpc.status}.OK, then the request has completed successfully.
 * Otherwise, the request has failed, `details` will contain a description of
 * the error. Either way, `metadata` contains the trailing response metadata
 * sent by the server when it finishes processing the call.
 * @typedef {object} grpc~StatusObject
 * @property {number} code The error code, a key of {@link grpc.status}
 * @property {string} details Human-readable description of the status
 * @property {grpc.Metadata} metadata Trailing metadata sent with the status,
 *     if applicable
 */

/**
 * Describes how a request has failed. The member `message` will be the same as
 * `details` in {@link grpc~StatusObject}, and `code` and `metadata` are the
 * same as in that object.
 * @typedef {Error} grpc~ServiceError
 * @property {number} code The error code, a key of {@link grpc.status} that is
 *     not `grpc.status.OK`
 * @property {grpc.Metadata} metadata Trailing metadata sent with the status,
 *     if applicable
 */

/**
 * The EventEmitter class in the event standard module
 * @external EventEmitter
 * @see https://nodejs.org/api/events.html#events_class_eventemitter
 */

/**
 * The Readable class in the stream standard module
 * @external Readable
 * @see https://nodejs.org/api/stream.html#stream_readable_streams
 */

/**
 * The Writable class in the stream standard module
 * @external Writable
 * @see https://nodejs.org/api/stream.html#stream_writable_streams
 */

/**
 * The Duplex class in the stream standard module
 * @external Duplex
 * @see https://nodejs.org/api/stream.html#stream_class_stream_duplex
 */

/**
 * A serialization function
 * @callback grpc~serialize
 * @param {*} value The value to serialize
 * @return {Buffer} The value serialized as a byte sequence
 */

/**
 * A deserialization function
 * @callback grpc~deserialize
 * @param {Buffer} data The byte sequence to deserialize
 * @return {*} The data deserialized as a value
 */

/**
 * The deadline of an operation. If it is a date, the deadline is reached at
 * the date and time specified. If it is a finite number, it is treated as
 * a number of milliseconds since the Unix Epoch. If it is Infinity, the
 * deadline will never be reached. If it is -Infinity, the deadline has already
 * passed.
 * @typedef {(number|Date)} grpc~Deadline
 */

/**
 * An object that completely defines a service method signature.
 * @typedef {Object} grpc~MethodDefinition
 * @property {string} path The method's URL path
 * @property {boolean} requestStream Indicates whether the method accepts
 *     a stream of requests
 * @property {boolean} responseStream Indicates whether the method returns
 *     a stream of responses
 * @property {grpc~serialize} requestSerialize Serialization
 *     function for request values
 * @property {grpc~serialize} responseSerialize Serialization
 *     function for response values
 * @property {grpc~deserialize} requestDeserialize Deserialization
 *     function for request data
 * @property {grpc~deserialize} responseDeserialize Deserialization
 *     function for repsonse data
 */

/**
 * @function MetadataListener
 * @param {grpc.Metadata} metadata The response metadata.
 * @param {function} next Passes metadata to the next interceptor.
 */

/**
 * @function MessageListener
 * @param {jspb.Message} message The response message.
 * @param {function} next Passes a message to the next interceptor.
 */

/**
 * @function StatusListener
 * @param {grpc~StatusObject} status The response status.
 * @param {function} next Passes a status to the next interceptor.
 */

/**
 * A set of interceptor functions triggered by responses
 * @typedef {object} grpc~Listener
 * @property {MetadataListener=} onReceiveMetadata A function triggered by
 *     response metadata.
 * @property {MessageListener=} onReceiveMessage A function triggered by a
 *     response message.
 * @property {StatusListener=} onReceiveStatus A function triggered by a
 *     response status.
 */

/**
 * @function MetadataRequester
 * @param {grpc.Metadata} metadata The request metadata.
 * @param {grpc~Listener} listener A listener wired to the previous layers
 *     in the interceptor stack.
 * @param {function} next Passes metadata and a listener to the next
 *      interceptor.
 */

/**
 * @function MessageRequester
 * @param {jspb.Message} message The request message.
 * @param {function} next Passes a message to the next interceptor.
 */

/**
 * @function CloseRequester
 * @param {function} next Calls the next interceptor.
 */

/**
 * @function CancelRequester
 * @param {function} next Calls the next interceptor.
 */

/**
 * @function GetPeerRequester
 * @param {function} next Calls the next interceptor.
 * @return {string}
 */

/**
 * @typedef {object} grpc~Requester
 * @param {MetadataRequester=} start A function triggered when the call begins.
 * @param {MessageRequester=} sendMessage A function triggered by the request
 *     message.
 * @param {CloseRequester=} halfClose A function triggered when the client
 *     closes the call.
 * @param {CancelRequester=} cancel A function triggered when the call is
 *     cancelled.
 * @param {GetPeerRequester=} getPeer A function triggered when the endpoint is
 *     requested.
 */

/**
 * An object that completely defines a service.
 * @typedef {Object.<string, grpc~MethodDefinition>} grpc~ServiceDefinition
 */

/**
 * An object that defines a package hierarchy with multiple services
 * @typedef {Object.<string, grpc~ServiceDefinition>} grpc~PackageDefinition
 */

/**
 * A function for dynamically assigning an interceptor to a call.
 * @function InterceptorProvider
 * @param {grpc~MethodDefinition} method_definition The method to provide
 *     an interceptor for.
 * @return {Interceptor|null} The interceptor to provide or nothing
 */

/**
 * A function which can modify call options and produce methods to intercept
 * RPC operations.
 * @function Interceptor
 * @param {object} options The grpc call options
 * @param {NextCall} nextCall
 * @return {InterceptingCall}
 */

/**
 * A function which produces the next InterceptingCall.
 * @function NextCall
 * @param {object} options The grpc call options
 * @return {InterceptingCall|null}
 */
