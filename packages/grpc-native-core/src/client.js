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
 * Client module
 *
 * This module contains the factory method for creating Client classes, and the
 * method calling code for all types of methods.
 *
 * @example <caption>Create a client and call a method on it</caption>
 *
 * var proto_obj = grpc.load(proto_file_path);
 * var Client = proto_obj.package.subpackage.ServiceName;
 * var client = new Client(server_address, client_credentials);
 * var call = client.unaryMethod(arguments, callback);
 */

'use strict';

var _ = require('lodash');

var client_interceptors = require('./client_interceptors');
var grpc = require('./grpc_extension');

var common = require('./common');

var Metadata = require('./metadata');

var constants = require('./constants');

var EventEmitter = require('events').EventEmitter;

var stream = require('stream');

var Readable = stream.Readable;
var Writable = stream.Writable;
var Duplex = stream.Duplex;
var methodTypes = constants.methodTypes;
var util = require('util');
var version = require('../package.json').version;

/**
 * Initial response metadata sent by the server when it starts processing the
 * call
 * @event grpc~ClientUnaryCall#metadata
 * @type {grpc.Metadata}
 */

/**
 * Status of the call when it has completed.
 * @event grpc~ClientUnaryCall#status
 * @type grpc~StatusObject
 */

util.inherits(ClientUnaryCall, EventEmitter);

/**
 * An EventEmitter. Used for unary calls.
 * @constructor grpc~ClientUnaryCall
 * @extends external:EventEmitter
 * @param {grpc.internal~Call} call The call object associated with the request
 */
function ClientUnaryCall(call) {
  EventEmitter.call(this);
  this.call = call;
}

util.inherits(ClientWritableStream, Writable);

/**
 * A stream that the client can write to. Used for calls that are streaming from
 * the client side.
 * @constructor grpc~ClientWritableStream
 * @extends external:Writable
 * @borrows grpc~ClientUnaryCall#cancel as grpc~ClientWritableStream#cancel
 * @borrows grpc~ClientUnaryCall#getPeer as grpc~ClientWritableStream#getPeer
 * @borrows grpc~ClientUnaryCall#event:metadata as
 *     grpc~ClientWritableStream#metadata
 * @borrows grpc~ClientUnaryCall#event:status as
 *     grpc~ClientWritableStream#status
 * @param {InterceptingCall} call Exposes gRPC request operations, processed by
 *     an interceptor stack.
 */
function ClientWritableStream(call) {
  Writable.call(this, {objectMode: true});
  this.call = call;
  var self = this;
  this.on('finish', function() {
    self.call.halfClose();
  });
}

/**
 * Write a message to the request stream. If serializing the argument fails,
 * the call will be cancelled and the stream will end with an error.
 * @name grpc~ClientWritableStream#write
 * @kind function
 * @override
 * @param {*} message The message to write. Must be a valid argument to the
 *     serialize function of the corresponding method
 * @param {grpc.writeFlags} flags Flags to modify how the message is written
 * @param {Function} callback Callback for when this chunk of data is flushed
 * @return {boolean} As defined for [Writable]{@link external:Writable}
 */

/**
 * Attempt to write the given chunk. Calls the callback when done. This is an
 * implementation of a method needed for implementing stream.Writable.
 * @private
 * @param {*} chunk The chunk to write
 * @param {grpc.writeFlags} encoding Used to pass write flags
 * @param {function(Error=)} callback Called when the write is complete
 */
function _write(chunk, encoding, callback) {
  /* jshint validthis: true */
  var self = this;
  if (this.writeFailed) {
    /* Once a write fails, just call the callback immediately to let the caller
       flush any pending writes. */
    setImmediate(callback);
    return;
  }
  var outerCallback = function(err, event) {
    if (err) {
      /* Assume that the call is complete and that writing failed because a
         status was received. In that case, set a flag to discard all future
         writes */
      self.writeFailed = true;
    }
    callback();
  };
  var context = {
    encoding: encoding,
    callback: outerCallback
  };
  this.call.sendMessageWithContext(context, chunk);
}

ClientWritableStream.prototype._write = _write;

util.inherits(ClientReadableStream, Readable);

/**
 * A stream that the client can read from. Used for calls that are streaming
 * from the server side.
 * @constructor grpc~ClientReadableStream
 * @extends external:Readable
 * @borrows grpc~ClientUnaryCall#cancel as grpc~ClientReadableStream#cancel
 * @borrows grpc~ClientUnaryCall#getPeer as grpc~ClientReadableStream#getPeer
 * @borrows grpc~ClientUnaryCall#event:metadata as
 *     grpc~ClientReadableStream#metadata
 * @borrows grpc~ClientUnaryCall#event:status as
 *     grpc~ClientReadableStream#status
 * @param {InterceptingCall} call Exposes gRPC request operations, processed by
 *     an interceptor stack.
 */
function ClientReadableStream(call) {
  Readable.call(this, {objectMode: true});
  this.call = call;
  this.finished = false;
  this.reading = false;
  /* Status generated from reading messages from the server. Overrides the
   * status from the server if not OK */
  this.read_status = null;
  /* Status received from the server. */
  this.received_status = null;
}

/**
 * Called when all messages from the server have been processed. The status
 * parameter indicates that the call should end with that status. status
 * defaults to OK if not provided.
 * @param {Object!} status The status that the call should end with
 * @private
 */
function _readsDone(status) {
  /* jshint validthis: true */
  if (!status) {
    status = {code: constants.status.OK, details: 'OK'};
  }
  if (status.code !== constants.status.OK) {
    this.call.cancelWithStatus(status.code, status.details);
  }
  this.finished = true;
  this.read_status = status;
  this._emitStatusIfDone();
}

ClientReadableStream.prototype._readsDone = _readsDone;

/**
 * Called to indicate that we have received a status from the server.
 * @private
 */
function _receiveStatus(status) {
  /* jshint validthis: true */
  this.received_status = status;
  this._emitStatusIfDone();
}

ClientReadableStream.prototype._receiveStatus = _receiveStatus;

/**
 * If we have both processed all incoming messages and received the status from
 * the server, emit the status. Otherwise, do nothing.
 * @private
 */
function _emitStatusIfDone() {
  /* jshint validthis: true */
  var status;
  if (this.read_status && this.received_status) {
    if (this.read_status.code !== constants.status.OK) {
      status = this.read_status;
    } else {
      status = this.received_status;
    }
    if (status.code === constants.status.OK) {
      this.push(null);
    } else {
      var error = common.createStatusError(status);
      this.emit('error', error);
    }
    this.emit('status', status);
  }
}

ClientReadableStream.prototype._emitStatusIfDone = _emitStatusIfDone;

/**
 * Read the next object from the stream.
 * @private
 * @param {*} size Ignored because we use objectMode=true
 */
function _read(size) {
  /* jshint validthis: true */
  if (this.finished) {
    this.push(null);
  } else {
    if (!this.reading) {
      this.reading = true;
      var context = {
        stream: this
      };
      this.call.recvMessageWithContext(context);
    }
  }
}

ClientReadableStream.prototype._read = _read;

util.inherits(ClientDuplexStream, Duplex);

/**
 * A stream that the client can read from or write to. Used for calls with
 * duplex streaming.
 * @constructor grpc~ClientDuplexStream
 * @extends external:Duplex
 * @borrows grpc~ClientUnaryCall#cancel as grpc~ClientDuplexStream#cancel
 * @borrows grpc~ClientUnaryCall#getPeer as grpc~ClientDuplexStream#getPeer
 * @borrows grpc~ClientWritableStream#write as grpc~ClientDuplexStream#write
 * @borrows grpc~ClientUnaryCall#event:metadata as
 *     grpc~ClientDuplexStream#metadata
 * @borrows grpc~ClientUnaryCall#event:status as
 *     grpc~ClientDuplexStream#status
 * @param {InterceptingCall} call Exposes gRPC request operations, processed by
 *     an interceptor stack.
 */
function ClientDuplexStream(call) {
  Duplex.call(this, {objectMode: true});
  this.call = call;
  /* Status generated from reading messages from the server. Overrides the
   * status from the server if not OK */
  this.read_status = null;
  /* Status received from the server. */
  this.received_status = null;
  var self = this;
  this.on('finish', function() {
    self.call.halfClose();
  });
}

ClientDuplexStream.prototype._readsDone = _readsDone;
ClientDuplexStream.prototype._receiveStatus = _receiveStatus;
ClientDuplexStream.prototype._emitStatusIfDone = _emitStatusIfDone;
ClientDuplexStream.prototype._read = _read;
ClientDuplexStream.prototype._write = _write;

/**
 * Cancel the ongoing call. Results in the call ending with a CANCELLED status,
 * unless it has already ended with some other status.
 * @alias grpc~ClientUnaryCall#cancel
 */
function cancel() {
  /* jshint validthis: true */
  this.call.cancel();
}

ClientUnaryCall.prototype.cancel = cancel;
ClientReadableStream.prototype.cancel = cancel;
ClientWritableStream.prototype.cancel = cancel;
ClientDuplexStream.prototype.cancel = cancel;

/**
 * Get the endpoint this call/stream is connected to.
 * @return {string} The URI of the endpoint
 * @alias grpc~ClientUnaryCall#getPeer
 */
function getPeer() {
  /* jshint validthis: true */
  return this.call.getPeer();
}

ClientUnaryCall.prototype.getPeer = getPeer;
ClientReadableStream.prototype.getPeer = getPeer;
ClientWritableStream.prototype.getPeer = getPeer;
ClientDuplexStream.prototype.getPeer = getPeer;

/**
 * Any client call type
 * @typedef {(grpc~ClientUnaryCall|grpc~ClientReadableStream|
 *            grpc~ClientWritableStream|grpc~ClientDuplexStream)}
 *     grpc.Client~Call
 */

/**
 * Options that can be set on a call.
 * @typedef {Object} grpc.Client~CallOptions
 * @property {grpc~Deadline} deadline The deadline for the entire call to
 *     complete.
 * @property {string} host Server hostname to set on the call. Only meaningful
 *     if different from the server address used to construct the client.
 * @property {grpc.Client~Call} parent Parent call. Used in servers when
 *     making a call as part of the process of handling a call. Used to
 *     propagate some information automatically, as specified by
 *     propagate_flags.
 * @property {number} propagate_flags Indicates which properties of a parent
 *     call should propagate to this call. Bitwise combination of flags in
 *     {@link grpc.propagate}.
 * @property {grpc.credentials~CallCredentials} credentials The credentials that
 *     should be used to make this particular call.
 */

/**
 * A generic gRPC client. Primarily useful as a base class for generated clients
 * @memberof grpc
 * @constructor
 * @param {string} address Server address to connect to
 * @param {grpc.credentials~ChannelCredentials} credentials Credentials to use
 *     to connect to the server
 * @param {Object} options Options to apply to channel creation
 */
function Client(address, credentials, options) {
  var self = this;
  if (!options) {
    options = {};
  }

  // Resolve interceptor options and assign interceptors to each method
  if (_.isArray(options.interceptor_providers) && _.isArray(options.interceptors)) {
    throw new client_interceptors.InterceptorConfigurationError(
      'Both interceptors and interceptor_providers were passed as options ' +
      'to the client constructor. Only one of these is allowed.');
  }
  self.$interceptors = options.interceptors || [];
  self.$interceptor_providers = options.interceptor_providers || [];
  _.each(self.$method_definitions, function(method_definition, method_name) {
    self[method_name].interceptors = client_interceptors
      .resolveInterceptorProviders(self.$interceptor_providers, method_definition)
      .concat(self.$interceptors);
  });
  let channelOverride = options.channelOverride;
  let channelFactoryOverride = options.channelFactoryOverride;
  // Exclude channel options which have already been consumed
  var channel_options = _.omit(options,
     ['interceptors', 'interceptor_providers',
      'channelOverride', 'channelFactoryOverride']);
  /* Private fields use $ as a prefix instead of _ because it is an invalid
   * prefix of a method name */
  if (channelOverride) {
    this.$channel = options.channelOverride;
  } else {
    if (channelFactoryOverride) {
      this.$channel = channelFactoryOverride(address, credentials, channel_options);
    } else {
      this.$channel = new grpc.Channel(address, credentials, channel_options);
    }
  }
}

exports.Client = Client;

Client.prototype.resolveCallInterceptors = function(method_definition, interceptors, interceptor_providers) {
  if (_.isArray(interceptors) && _.isArray(interceptor_providers)) {
    throw new client_interceptors.InterceptorConfigurationError(
      'Both interceptors and interceptor_providers were passed as call ' +
      'options. Only one of these is allowed.');
  }
  if (_.isArray(interceptors) || _.isArray(interceptor_providers)) {
    interceptors = interceptors || [];
    interceptor_providers = interceptor_providers || [];
    return client_interceptors.resolveInterceptorProviders(interceptor_providers, method_definition).concat(interceptors);
  } else {
    return client_interceptors.resolveInterceptorProviders(this.$interceptor_providers, method_definition).concat(this.$interceptors);
  }
}

/**
 * @callback grpc.Client~requestCallback
 * @param {?grpc~ServiceError} error The error, if the call
 *     failed
 * @param {*} value The response value, if the call succeeded
 */

/**
 * Make a unary request to the given method, using the given serialize
 * and deserialize functions, with the given argument.
 * @param {string} path The path of the method to request
 * @param {grpc~serialize} serialize The serialization function for
 *     inputs
 * @param {grpc~deserialize} deserialize The deserialization
 *     function for outputs
 * @param {*} argument The argument to the call. Should be serializable with
 *     serialize
 * @param {grpc.Metadata=} metadata Metadata to add to the call
 * @param {grpc.Client~CallOptions=} options Options map
 * @param {grpc.Client~requestCallback} callback The callback
 *     for when the response is received
 * @return {grpc~ClientUnaryCall} An event emitter for stream related events
 */
Client.prototype.makeUnaryRequest = function(path, serialize, deserialize,
                                             argument, metadata, options,
                                             callback) {
  if (_.isFunction(options)) {
    callback = options;
    if (metadata instanceof Metadata) {
      options = {};
    } else {
      options = metadata;
      metadata = new Metadata();
    }
  } else if (_.isFunction(metadata)) {
    callback = metadata;
    metadata = new Metadata();
    options = {};
  }
  if (!metadata) {
    metadata = new Metadata();
  }
  if (!options) {
    options = {};
  }
  if (!((metadata instanceof Metadata) &&
        (options instanceof Object) &&
        (_.isFunction(callback)))) {
    throw new Error('Argument mismatch in makeUnaryRequest');
  }

  var method_definition = options.method_definition = {
    path: path,
    requestStream: false,
    responseStream: false,
    requestSerialize: serialize,
    responseDeserialize: deserialize
  };

  metadata = metadata.clone();

  var intercepting_call = client_interceptors.getInterceptingCall(
    method_definition,
    options,
    Client.prototype.resolveCallInterceptors.call(this, method_definition, options.interceptors, options.interceptor_providers),
    this.$channel,
    callback
  );
  var emitter = new ClientUnaryCall(intercepting_call);
  var last_listener = client_interceptors.getLastListener(
    method_definition,
    emitter,
    callback
  );

  intercepting_call.start(metadata, last_listener);
  intercepting_call.sendMessage(argument);
  intercepting_call.halfClose();

  return emitter;
};

/**
 * Make a client stream request to the given method, using the given serialize
 * and deserialize functions, with the given argument.
 * @param {string} path The path of the method to request
 * @param {grpc~serialize} serialize The serialization function for
 *     inputs
 * @param {grpc~deserialize} deserialize The deserialization
 *     function for outputs
 * @param {grpc.Metadata=} metadata Array of metadata key/value pairs to add to
 *     the call
 * @param {grpc.Client~CallOptions=} options Options map
 * @param {grpc.Client~requestCallback} callback The callback for when the
 *     response is received
 * @return {grpc~ClientWritableStream} An event emitter for stream related
 *     events
 */
Client.prototype.makeClientStreamRequest = function(path, serialize,
                                                    deserialize, metadata,
                                                    options, callback) {
  if (_.isFunction(options)) {
    callback = options;
    if (metadata instanceof Metadata) {
      options = {};
    } else {
      options = metadata;
      metadata = new Metadata();
    }
  } else if (_.isFunction(metadata)) {
    callback = metadata;
    metadata = new Metadata();
    options = {};
  }
  if (!metadata) {
    metadata = new Metadata();
  }
  if (!options) {
    options = {};
  }
  if (!((metadata instanceof Metadata) &&
       (options instanceof Object) &&
       (_.isFunction(callback)))) {
    throw new Error('Argument mismatch in makeClientStreamRequest');
  }

  var method_definition = options.method_definition = {
    path: path,
    requestStream: true,
    responseStream: false,
    requestSerialize: serialize,
    responseDeserialize: deserialize
  };

  metadata = metadata.clone();

  var intercepting_call = client_interceptors.getInterceptingCall(
    method_definition,
    options,
    Client.prototype.resolveCallInterceptors.call(this, method_definition, options.interceptors, options.interceptor_providers),
    this.$channel,
    callback
  );
  var emitter = new ClientWritableStream(intercepting_call);
  var last_listener = client_interceptors.getLastListener(
    method_definition,
    emitter,
    callback
  );

  intercepting_call.start(metadata, last_listener);

  return emitter;
};

/**
 * Make a server stream request to the given method, with the given serialize
 * and deserialize function, using the given argument
 * @param {string} path The path of the method to request
 * @param {grpc~serialize} serialize The serialization function for inputs
 * @param {grpc~deserialize} deserialize The deserialization
 *     function for outputs
 * @param {*} argument The argument to the call. Should be serializable with
 *     serialize
 * @param {grpc.Metadata=} metadata Array of metadata key/value pairs to add to
 *     the call
 * @param {grpc.Client~CallOptions=} options Options map
 * @return {grpc~ClientReadableStream} An event emitter for stream related
 *     events
 */
Client.prototype.makeServerStreamRequest = function(path, serialize,
                                                    deserialize, argument,
                                                    metadata, options) {
  if (!(metadata instanceof Metadata)) {
    options = metadata;
    metadata = new Metadata();
  }
  if (!(options instanceof Object)) {
    options = {};
  }
  if (!((metadata instanceof Metadata) && (options instanceof Object))) {
    throw new Error('Argument mismatch in makeServerStreamRequest');
  }

  var method_definition = options.method_definition = {
    path: path,
    requestStream: false,
    responseStream: true,
    requestSerialize: serialize,
    responseDeserialize: deserialize
  };

  metadata = metadata.clone();

  var emitter = new ClientReadableStream();
  var intercepting_call = client_interceptors.getInterceptingCall(
    method_definition,
    options,
    Client.prototype.resolveCallInterceptors.call(this, method_definition, options.interceptors, options.interceptor_providers),
    this.$channel,
    emitter
  );
  emitter.call = intercepting_call;
  var last_listener = client_interceptors.getLastListener(
    method_definition,
    emitter
  );

  intercepting_call.start(metadata, last_listener);
  intercepting_call.sendMessage(argument);
  intercepting_call.halfClose();

  return emitter;
};

/**
 * Make a bidirectional stream request with this method on the given channel.
 * @param {string} path The path of the method to request
 * @param {grpc~serialize} serialize The serialization function for inputs
 * @param {grpc~deserialize} deserialize The deserialization
 *     function for outputs
 * @param {grpc.Metadata=} metadata Array of metadata key/value
 *     pairs to add to the call
 * @param {grpc.Client~CallOptions=} options Options map
 * @return {grpc~ClientDuplexStream} An event emitter for stream related events
 */
Client.prototype.makeBidiStreamRequest = function(path, serialize,
                                                  deserialize, metadata,
                                                  options) {
  if (!(metadata instanceof Metadata)) {
    options = metadata;
    metadata = new Metadata();
  }
  if (!(options instanceof Object)) {
    options = {};
  }
  if (!((metadata instanceof Metadata) && (options instanceof Object))) {
    throw new Error('Argument mismatch in makeBidiStreamRequest');
  }

  var method_definition = options.method_definition = {
    path: path,
    requestStream: true,
    responseStream: true,
    requestSerialize: serialize,
    responseDeserialize: deserialize
  };

  metadata = metadata.clone();

  var emitter = new ClientDuplexStream();
  var intercepting_call = client_interceptors.getInterceptingCall(
    method_definition,
    options,
    Client.prototype.resolveCallInterceptors.call(this, method_definition, options.interceptors, options.interceptor_providers),
    this.$channel,
    emitter
  );
  emitter.call = intercepting_call;
  var last_listener = client_interceptors.getLastListener(
    method_definition,
    emitter
  );

  intercepting_call.start(metadata, last_listener);

  return emitter;
};

/**
 * Close this client.
 */
Client.prototype.close = function() {
  this.$channel.close();
};

/**
 * Return the underlying channel object for the specified client
 * @return {Channel} The channel
 */
Client.prototype.getChannel = function() {
  return this.$channel;
};

/**
 * Wait for the client to be ready. The callback will be called when the
 * client has successfully connected to the server, and it will be called
 * with an error if the attempt to connect to the server has unrecoverablly
 * failed or if the deadline expires. This function will make the channel
 * start connecting if it has not already done so.
 * @param {grpc~Deadline} deadline When to stop waiting for a connection.
 * @param {function(Error)} callback The callback to call when done attempting
 *     to connect.
 */
Client.prototype.waitForReady = function(deadline, callback) {
  var self = this;
  var checkState = function(err) {
    if (err) {
      callback(new Error('Failed to connect before the deadline'));
      return;
    }
    var new_state;
    try {
      new_state = self.$channel.getConnectivityState(true);
    } catch (e) {
      callback(new Error('The channel has been closed'));
      return;
    }
    if (new_state === grpc.connectivityState.READY) {
      callback();
    } else if (new_state === grpc.connectivityState.FATAL_FAILURE) {
      callback(new Error('Failed to connect to server'));
    } else {
      try {
        self.$channel.watchConnectivityState(new_state, deadline, checkState);
      } catch (e) {
        callback(new Error('The channel has been closed'));
      }
    }
  };
  /* Force a single round of polling to ensure that the channel state is up
   * to date */
  grpc.forcePoll();
  setImmediate(checkState);
};

/**
 * Map with short names for each of the requester maker functions. Used in
 * makeClientConstructor
 * @private
 */
var requester_funcs = {
  [methodTypes.UNARY]: Client.prototype.makeUnaryRequest,
  [methodTypes.CLIENT_STREAMING]: Client.prototype.makeClientStreamRequest,
  [methodTypes.SERVER_STREAMING]: Client.prototype.makeServerStreamRequest,
  [methodTypes.BIDI_STREAMING]: Client.prototype.makeBidiStreamRequest
};

function getDefaultValues(metadata, options) {
  var res = {};
  res.metadata = metadata || new Metadata();
  res.options = options || {};
  return res;
}

/**
 * Map with wrappers for each type of requester function to make it use the old
 * argument order with optional arguments after the callback.
 * @access private
 */
var deprecated_request_wrap = {
  [methodTypes.UNARY]: function(makeUnaryRequest) {
    return function makeWrappedUnaryRequest(argument, callback,
                                            metadata, options) {
      /* jshint validthis: true */
      var opt_args = getDefaultValues(metadata, options);
      return makeUnaryRequest.call(this, argument, opt_args.metadata,
                                   opt_args.options, callback);
    };
  },
  [methodTypes.CLIENT_STREAMING]: function(makeServerStreamRequest) {
    return function makeWrappedClientStreamRequest(callback, metadata,
                                                   options) {
      /* jshint validthis: true */
      var opt_args = getDefaultValues(metadata, options);
      return makeServerStreamRequest.call(this, opt_args.metadata,
                                          opt_args.options, callback);
    };
  },
  [methodTypes.SERVER_STREAMING]: _.identity,
  [methodTypes.BIDI_STREAMING]: _.identity
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
 * @param {boolean=} [class_options.deprecatedArgumentOrder=false] Indicates
 *     that the old argument order should be used for methods, with optional
 *     arguments at the end instead of the callback at the end. This option
 *     is only a temporary stopgap measure to smooth an API breakage.
 *     It is deprecated, and new code should not use it.
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
  ServiceClient.prototype.$method_definitions = methods;
  ServiceClient.prototype.$method_names = {};

  _.each(methods, function(attrs, name) {
    if (_.startsWith(name, '$')) {
      throw new Error('Method names cannot start with $');
    }
    var method_type = common.getMethodType(attrs);
    var method_func = _.partial(requester_funcs[method_type], attrs.path,
                                attrs.requestSerialize,
                                attrs.responseDeserialize);
    if (class_options.deprecatedArgumentOrder) {
      ServiceClient.prototype[name] =
        deprecated_request_wrap[method_type](method_func);
    } else {
      ServiceClient.prototype[name] = method_func;
    }
    ServiceClient.prototype.$method_names[attrs.path] = name;
    // Associate all provided attributes with the method
    _.assign(ServiceClient.prototype[name], attrs);
    if (attrs.originalName) {
      ServiceClient.prototype[attrs.originalName] =
        ServiceClient.prototype[name];
    }
  });

  ServiceClient.service = methods;

  return ServiceClient;
};

/**
 * Return the underlying channel object for the specified client
 * @memberof grpc
 * @alias grpc~getClientChannel
 * @param {grpc.Client} client The client
 * @return {Channel} The channel
 * @see grpc.Client#getChannel
 */
exports.getClientChannel = function(client) {
  return Client.prototype.getChannel.call(client);
};

/**
 * Gets a map of client method names to interceptor stacks.
 * @param {grpc.Client} client
 * @returns {Object.<string, Interceptor[]>}
 */
exports.getClientInterceptors = function(client) {
  return _.mapValues(client.$method_definitions, function(def, name) {
    return client[name].interceptors;
  });
};

/**
 * Wait for the client to be ready. The callback will be called when the
 * client has successfully connected to the server, and it will be called
 * with an error if the attempt to connect to the server has unrecoverablly
 * failed or if the deadline expires. This function will make the channel
 * start connecting if it has not already done so.
 * @memberof grpc
 * @alias grpc~waitForClientReady
 * @param {grpc.Client} client The client to wait on
 * @param {grpc~Deadline} deadline When to stop waiting for a connection. Pass
 *     Infinity to wait forever.
 * @param {function(Error)} callback The callback to call when done attempting
 *     to connect.
 * @see grpc.Client#waitForReady
 */
exports.waitForClientReady = function(client, deadline, callback) {
  Client.prototype.waitForReady.call(client, deadline, callback);
};

exports.StatusBuilder = client_interceptors.StatusBuilder;
exports.ListenerBuilder = client_interceptors.ListenerBuilder;
exports.RequesterBuilder = client_interceptors.RequesterBuilder;
exports.InterceptingCall = client_interceptors.InterceptingCall;
