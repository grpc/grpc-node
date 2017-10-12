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

const util = require('util');

const _ = require('lodash');

module.exports = function(grpc) {

  let exports = {};

  const Client = grpc.Client;

  function getDefaultValues(metadata, options) {
    var res = {};
    res.metadata = metadata || new grpc.Metadata();
    res.options = options || {};
    return res;
  }

  /**
   * Map with wrappers for each type of requester function to make it use the old
   * argument order with optional arguments after the callback.
   * @access private
   */
  var deprecated_request_wrap = {
    unary: function(makeUnaryRequest) {
      return function makeWrappedUnaryRequest(argument, callback,
                                              metadata, options) {
        /* jshint validthis: true */
        var opt_args = getDefaultValues(metadata, metadata);
        return makeUnaryRequest.call(this, argument, opt_args.metadata,
                                     opt_args.options, callback);
      };
    },
    client_stream: function(makeServerStreamRequest) {
      return function makeWrappedClientStreamRequest(callback, metadata,
                                                     options) {
        /* jshint validthis: true */
        var opt_args = getDefaultValues(metadata, options);
        return makeServerStreamRequest.call(this, opt_args.metadata,
                                            opt_args.options, callback);
      };
    },
    server_stream: _.identity,
    bidi: _.identity
  };

  /**
   * Map with short names for each of the requester maker functions. Used in
   * makeClientConstructor
   * @private
   */
  const requester_funcs = {
    unary: Client.prototype.makeUnaryRequest,
    server_stream: Client.prototype.makeServerStreamRequest,
    client_stream: Client.prototype.makeClientStreamRequest,
    bidi: Client.prototype.makeBidiStreamRequest
  };

  /**
   * Creates a constructor for a client with the given methods, as specified in
   * the methods argument. The resulting class will have an instance method for
   * each method in the service, which is a partial application of one of the
   * [Client]{@link grpc.Client} request methods, depending on `requestSerialize`
   * and `responseSerialize`, with the `method`, `serialize`, and `deserialize`
   * arguments predefined.
   * @memberof grpc
   * @alias grpc~makeGenericClientConstructor
   * @param {grpc~ServiceDefinition} methods An object mapping method names to
   *     method attributes
   * @param {string} serviceName The fully qualified name of the service
   * @param {Object} class_options An options object.
   * @return {function} New client constructor, which is a subclass of
   *     {@link grpc.Client}, and has the same arguments as that constructor.
   */
  exports.makeClientConstructor = function(methods, serviceName,
                                           class_options) {
    if (!class_options) {
      class_options = {};
    }

    function ServiceClient(address, credentials, options) {
      Client.call(this, address, credentials, options);
    }

    util.inherits(ServiceClient, Client);

    _.each(methods, function(attrs, name) {
      var method_type;
      // TODO(murgatroid99): Verify that we don't need this anymore
      if (_.startsWith(name, '$')) {
        throw new Error('Method names cannot start with $');
      }
      if (attrs.requestStream) {
        if (attrs.responseStream) {
          method_type = 'bidi';
        } else {
          method_type = 'client_stream';
        }
      } else {
        if (attrs.responseStream) {
          method_type = 'server_stream';
        } else {
          method_type = 'unary';
        }
      }
      var serialize = attrs.requestSerialize;
      var deserialize = attrs.responseDeserialize;
      var method_func = _.partial(requester_funcs[method_type], attrs.path,
                                  serialize, deserialize);
      if (class_options.deprecatedArgumentOrder) {
        ServiceClient.prototype[name] = deprecated_request_wrap(method_func);
      } else {
        ServiceClient.prototype[name] = method_func;
      }
      // Associate all provided attributes with the method
      _.assign(ServiceClient.prototype[name], attrs);
      if (attrs.originalName) {
        ServiceClient.prototype[attrs.originalName] = ServiceClient.prototype[name];
      }
    });

    ServiceClient.service = methods;

    return ServiceClient;
  };

  return Object.assign(exports, grpc);
};
