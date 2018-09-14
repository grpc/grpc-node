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

/**
 * Credentials module
 *
 * This module contains factory methods for two different credential types:
 * CallCredentials and ChannelCredentials. ChannelCredentials are things like
 * SSL credentials that can be used to secure a connection, and are used to
 * construct a Client object. CallCredentials genrally modify metadata, so they
 * can be attached to an individual method call.
 *
 * CallCredentials can be composed with other CallCredentials to create
 * CallCredentials. ChannelCredentials can be composed with CallCredentials
 * to create ChannelCredentials. No combined credential can have more than
 * one ChannelCredentials.
 *
 * For example, to create a client secured with SSL that uses Google
 * default application credentials to authenticate:
 *
 * @example
 * var channel_creds = credentials.createSsl(root_certs);
 * (new GoogleAuth()).getApplicationDefault(function(err, credential) {
 *   var call_creds = credentials.createFromGoogleCredential(credential);
 *   var combined_creds = credentials.combineChannelCredentials(
 *       channel_creds, call_creds);
 *   var client = new Client(address, combined_creds);
 * });
 *
 * @namespace grpc.credentials
 */

'use strict';

var grpc = require('./grpc_extension');

/**
 * This cannot be constructed directly. Instead, instances of this class should
 * be created using the factory functions in {@link grpc.credentials}
 * @constructor grpc.credentials~CallCredentials
 */
var CallCredentials = grpc.CallCredentials;

/**
 * This cannot be constructed directly. Instead, instances of this class should
 * be created using the factory functions in {@link grpc.credentials}
 * @constructor grpc.credentials~ChannelCredentials
 */
var ChannelCredentials = grpc.ChannelCredentials;

var Metadata = require('./metadata.js');

var common = require('./common.js');

var constants = require('./constants');

var _ = require('lodash');

/**
 * @external GoogleCredential
 * @see https://github.com/google/google-auth-library-nodejs
 */

const PEM_CERT_HEADER = "-----BEGIN CERTIFICATE-----";
const PEM_CERT_FOOTER = "-----END CERTIFICATE-----";

function wrapCheckServerIdentityCallback(callback) {
  return function(hostname, cert) {
    // Parse cert from pem to a version that matches the tls.checkServerIdentity
    // format.
    // https://nodejs.org/api/tls.html#tls_tls_checkserveridentity_hostname_cert

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
    var rawBuffer = new Buffer(cert.replace("\n", "").replace(" ", ""), "base64");

    return callback(hostname, { raw: rawBuffer });
  }
}

/**
 * Create an SSL Credentials object. If using a client-side certificate, both
 * the second and third arguments must be passed. Additional peer verification
 * options can be passed in the fourth argument as described below.
 * @memberof grpc.credentials
 * @alias grpc.credentials.createSsl
 * @kind function
 * @param {Buffer=} root_certs The root certificate data
 * @param {Buffer=} private_key The client certificate private key, if
 *     applicable
 * @param {Buffer=} cert_chain The client certificate cert chain, if applicable
 * @param {Function} verify_options.checkServerIdentity Optional callback
 *     receiving the expected hostname and peer certificate for additional
 *     verification. The callback should return an Error if verification
 *     fails and otherwise return undefined.
 * @return {grpc.credentials~ChannelCredentials} The SSL Credentials object
 */
exports.createSsl = function(root_certs, private_key, cert_chain, verify_options) {
  // The checkServerIdentity callback from gRPC core will receive the cert as a PEM.
  // To better match the checkServerIdentity callback of Node, we wrap the callback
  // to decode the PEM and populate a cert object.
  if (verify_options && verify_options.checkServerIdentity) {
    if (typeof verify_options.checkServerIdentity !== 'function') {
      throw new TypeError("Value of checkServerIdentity must be a function.");
    }
    // Make a shallow clone of verify_options so our modification of the callback
    // isn't reflected to the caller
    var updated_verify_options = Object.assign({}, verify_options);
    updated_verify_options.checkServerIdentity = wrapCheckServerIdentityCallback(
        verify_options.checkServerIdentity);
    arguments[3] = updated_verify_options;
  }
  return ChannelCredentials.createSsl.apply(this, arguments);
}


/**
 * @callback grpc.credentials~metadataCallback
 * @param {Error} error The error, if getting metadata failed
 * @param {grpc.Metadata} metadata The metadata
 */

/**
 * @callback grpc.credentials~generateMetadata
 * @param {Object} params Parameters that can modify metadata generation
 * @param {string} params.service_url The URL of the service that the call is
 *     going to
 * @param {grpc.credentials~metadataCallback} callback
 */

/**
 * Create a gRPC credentials object from a metadata generation function. This
 * function gets the service URL and a callback as parameters. The error
 * passed to the callback can optionally have a 'code' value attached to it,
 * which corresponds to a status code that this library uses.
 * @memberof grpc.credentials
 * @alias grpc.credentials.createFromMetadataGenerator
 * @param {grpc.credentials~generateMetadata} metadata_generator The function
 *     that generates metadata
 * @return {grpc.credentials~CallCredentials} The credentials object
 */
exports.createFromMetadataGenerator = function(metadata_generator) {
  return CallCredentials.createFromPlugin(function(service_url, cb_data,
                                                   callback) {
    metadata_generator({service_url: service_url}, function(error, metadata) {
      var code = constants.status.OK;
      var message = '';
      if (error) {
        message = error.message;
        if (error.hasOwnProperty('code') && _.isFinite(error.code)) {
          code = error.code;
        } else {
          code = constants.status.UNAUTHENTICATED;
        }
        if (!metadata) {
          metadata = new Metadata();
        }
      }
      callback(code, message, metadata._getCoreRepresentation(), cb_data);
    });
  });
};

function getAuthorizationHeaderFromGoogleCredential(google_credential, url, callback) {
  // google-auth-library pre-v2.0.0 does not have getRequestHeaders
  // but has getRequestMetadata, which is deprecated in v2.0.0
  if (typeof google_credential.getRequestHeaders === 'function') {
    google_credential.getRequestHeaders(url)
      .then(function(header) {
        callback(null, header.Authorization);
      })
      .catch(function(err) {
        callback(err);
        return;
      });
  } else {
    google_credential.getRequestMetadata(url, function(err, header) {
      if (err) {
        callback(err);
        return;
      }
      callback(null, header.Authorization);
    });
  }
}

/**
 * Create a gRPC credential from a Google credential object.
 * @memberof grpc.credentials
 * @alias grpc.credentials.createFromGoogleCredential
 * @param {external:GoogleCredential} google_credential The Google credential
 *     object to use
 * @return {grpc.credentials~CallCredentials} The resulting credentials object
 */
exports.createFromGoogleCredential = function(google_credential) {
  return exports.createFromMetadataGenerator(function(auth_context, callback) {
    var service_url = auth_context.service_url;
    getAuthorizationHeaderFromGoogleCredential(google_credential, service_url,
      function(err, authHeader) {
        if (err) {
          common.log(constants.logVerbosity.INFO, 'Auth error:' + err);
          callback(err);
          return;
        }
        var metadata = new Metadata();
        metadata.add('authorization', authHeader);
        callback(null, metadata);
      });
  });
};

/**
 * Combine a ChannelCredentials with any number of CallCredentials into a single
 * ChannelCredentials object.
 * @memberof grpc.credentials
 * @alias grpc.credentials.combineChannelCredentials
 * @param {grpc.credentials~ChannelCredentials} channel_credential The ChannelCredentials to
 *     start with
 * @param {...grpc.credentials~CallCredentials} credentials The CallCredentials to compose
 * @return {grpc.credentials~ChannelCredentials} A credentials object that combines all of the
 *     input credentials
 */
exports.combineChannelCredentials = function(channel_credential) {
  var current = channel_credential;
  for (var i = 1; i < arguments.length; i++) {
    current = current.compose(arguments[i]);
  }
  return current;
};

/**
 * Combine any number of CallCredentials into a single CallCredentials object
 * @memberof grpc.credentials
 * @alias grpc.credentials.combineCallCredentials
 * @param {...grpc.credentials~CallCredentials} credentials The CallCredentials to compose
 * @return {grpc.credentials~CallCredentials} A credentials object that combines all of the input
 *     credentials
 */
exports.combineCallCredentials = function() {
  var current = arguments[0];
  for (var i = 1; i < arguments.length; i++) {
    current = current.compose(arguments[i]);
  }
  return current;
};

/**
 * Create an insecure credentials object. This is used to create a channel that
 * does not use SSL. This cannot be composed with anything.
 * @memberof grpc.credentials
 * @alias grpc.credentials.createInsecure
 * @kind function
 * @return {grpc.credentials~ChannelCredentials} The insecure credentials object
 */
exports.createInsecure = ChannelCredentials.createInsecure;
