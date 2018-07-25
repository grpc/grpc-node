/**
 * @license
 * Copyright 2018 gRPC authors.
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
 * Client Interceptors
 *
 * This module describes the interceptor framework for clients.
 * An interceptor is a function which takes an options object and a nextCall
 * function and returns an InterceptingCall:
 *
 * ```
 * var interceptor = function(options, nextCall) {
 *   return new InterceptingCall(nextCall(options));
 * }
 * ```
 *
 * The interceptor function must return an InterceptingCall object. Returning
 * `new InterceptingCall(nextCall(options))` will satisfy the contract (but
 * provide no interceptor functionality). `nextCall` is a function which will
 * generate the next interceptor in the chain.
 *
 * To implement interceptor functionality, create a requester and pass it to
 * the InterceptingCall constructor:
 *
 * `return new InterceptingCall(nextCall(options), requester);`
 *
 * A requester is a POJO with zero or more of the following methods:
 *
 * `start(metadata, listener, next)`
 * * To continue, call next(metadata, listener). Listeners are described
 * * below.
 *
 * `sendMessage(message, next)`
 * * To continue, call next(message).
 *
 * `halfClose(next)`
 * * To continue, call next().
 *
 * `cancel(message, next)`
 * * To continue, call next().
 *
 * A listener is a POJO with one or more of the following methods:
 *
 * `onReceiveMetadata(metadata, next)`
 * * To continue, call next(metadata)
 *
 * `onReceiveMessage(message, next)`
 * * To continue, call next(message)
 *
 * `onReceiveStatus(status, next)`
 * * To continue, call next(status)
 *
 * A listener is provided by the requester's `start` method. The provided
 * listener implements all the inbound interceptor methods, which can be called
 * to short-circuit the gRPC call.
 *
 * Three usage patterns are supported for listeners:
 * 1) Pass the listener along without modification: `next(metadata, listener)`.
 *   In this case the interceptor declines to intercept any inbound operations.
 * 2) Create a new listener with one or more inbound interceptor methods and
 *   pass it to `next`. In this case the interceptor will fire on the inbound
 *   operations implemented in the new listener.
 * 3) Make direct inbound calls to the provided listener's methods. This
 *   short-circuits the interceptor stack.
 *
 * Do not modify the listener passed in. Either pass it along unmodified,
 * ignore it, or call methods on it to short-circuit the call.
 *
 * To intercept errors, implement the `onReceiveStatus` method and test for
 * `status.code !== grpc.status.OK`.
 *
 * To intercept trailers, examine `status.metadata` in the `onReceiveStatus`
 * method.
 *
 * This is a trivial implementation of all interceptor methods:
 * var interceptor = function(options, nextCall) {
 *   return new InterceptingCall(nextCall(options), {
 *     start: function(metadata, listener, next) {
 *       next(metadata, {
 *         onReceiveMetadata: function (metadata, next) {
 *           next(metadata);
 *         },
 *         onReceiveMessage: function (message, next) {
 *           next(message);
 *         },
 *         onReceiveStatus: function (status, next) {
 *           next(status);
 *         },
 *       });
 *     },
 *     sendMessage: function(message, next) {
 *       next(message);
 *     },
 *     halfClose: function(next) {
 *       next();
 *     },
 *     cancel: function(message, next) {
 *       next();
 *     }
 *   });
 * };
 *
 * This is an interceptor with a single method:
 * var interceptor = function(options, nextCall) {
 *   return new InterceptingCall(nextCall(options), {
 *     sendMessage: function(message, next) {
 *       next(message);
 *     }
 *   });
 * };
 *
 * Builders are provided for convenience: StatusBuilder, ListenerBuilder,
 * and RequesterBuilder
 *
 * gRPC client operations use this mapping to interceptor methods:
 *
 * grpc.opType.SEND_INITIAL_METADATA -> start
 * grpc.opType.SEND_MESSAGE -> sendMessage
 * grpc.opType.SEND_CLOSE_FROM_CLIENT -> halfClose
 * grpc.opType.RECV_INITIAL_METADATA -> onReceiveMetadata
 * grpc.opType.RECV_MESSAGE -> onReceiveMessage
 * grpc.opType.RECV_STATUS_ON_CLIENT -> onReceiveStatus
 *
 * @module
 */

'use strict';

var _ = require('lodash');
var grpc = require('./grpc_extension');
var Metadata = require('./metadata');
var constants = require('./constants');
var common = require('./common');
var methodTypes = constants.methodTypes;
var EventEmitter = require('events').EventEmitter;

/**
 * A custom error thrown when interceptor configuration fails.
 * @param {string} message The error message
 * @param {object=} extra
 * @constructor
 */
var InterceptorConfigurationError =
  function InterceptorConfigurationError(message, extra) {
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.message = message;
    this.extra = extra;
  };

require('util').inherits(InterceptorConfigurationError, Error);

/**
 * A builder for gRPC status objects.
 * @constructor
 */
function StatusBuilder() {
  this.code = null;
  this.details = null;
  this.metadata = null;
}

/**
 * Adds a status code to the builder.
 * @param {number} code The status code.
 * @return {StatusBuilder}
 */
StatusBuilder.prototype.withCode = function(code) {
  this.code = code;
  return this;
};

/**
 * Adds details to the builder.
 * @param {string} details A status message.
 * @return {StatusBuilder}
 */
StatusBuilder.prototype.withDetails = function(details) {
  this.details = details;
  return this;
};

/**
 * Adds metadata to the builder.
 * @param {Metadata} metadata The gRPC status metadata.
 * @return {StatusBuilder}
 */
StatusBuilder.prototype.withMetadata = function(metadata) {
  this.metadata = metadata;
  return this;
};

/**
 * Builds the status object.
 * @return {grpc~StatusObject} A gRPC status.
 */
StatusBuilder.prototype.build = function() {
  var status = {};
  if (this.code !== undefined) {
    status.code = this.code;
  }
  if (this.details) {
    status.details = this.details;
  }
  if (this.metadata) {
    status.metadata = this.metadata;
  }
  return status;
};

/**
 * A builder for listener interceptors.
 * @constructor
 */
function ListenerBuilder() {
  this.metadata = null;
  this.message = null;
  this.status = null;
}

/**
 * Adds an onReceiveMetadata method to the builder.
 * @param {MetadataListener} on_receive_metadata A listener method for
 * receiving metadata.
 * @return {ListenerBuilder}
 */
ListenerBuilder.prototype.withOnReceiveMetadata =
  function(on_receive_metadata) {
    this.metadata = on_receive_metadata;
    return this;
  };

/**
 * Adds an onReceiveMessage method to the builder.
 * @param {MessageListener} on_receive_message A listener method for receiving
 * messages.
 * @return {ListenerBuilder}
 */
ListenerBuilder.prototype.withOnReceiveMessage = function(on_receive_message) {
  this.message = on_receive_message;
  return this;
};

/**
 * Adds an onReceiveStatus method to the builder.
 * @param {StatusListener} on_receive_status A listener method for receiving
 * status.
 * @return {ListenerBuilder}
 */
ListenerBuilder.prototype.withOnReceiveStatus = function(on_receive_status) {
  this.status = on_receive_status;
  return this;
};

/**
 * Builds the call listener.
 * @return {grpc~Listener}
 */
ListenerBuilder.prototype.build = function() {
  var self = this;
  var listener = {};
  listener.onReceiveMetadata = self.metadata;
  listener.onReceiveMessage = self.message;
  listener.onReceiveStatus = self.status;
  return listener;
};

/**
 * A builder for the outbound methods of an interceptor.
 * @constructor
 */
function RequesterBuilder() {
  this.start = null;
  this.message = null;
  this.half_close = null;
  this.cancel = null;
}

/**
 * Add a metadata requester to the builder.
 * @param {MetadataRequester} start A requester method for handling metadata.
 * @return {RequesterBuilder}
 */
RequesterBuilder.prototype.withStart = function(start) {
  this.start = start;
  return this;
};

/**
 * Add a message requester to the builder.
 * @param {MessageRequester} send_message A requester method for handling
 * messages.
 * @return {RequesterBuilder}
 */
RequesterBuilder.prototype.withSendMessage = function(send_message) {
  this.message = send_message;
  return this;
};

/**
 * Add a close requester to the builder.
 * @param {CloseRequester} half_close A requester method for handling client
 * close.
 * @return {RequesterBuilder}
 */
RequesterBuilder.prototype.withHalfClose = function(half_close) {
  this.half_close = half_close;
  return this;
};

/**
 * Add a cancel requester to the builder.
 * @param {CancelRequester} cancel A requester method for handling `cancel`
 * @return {RequesterBuilder}
 */
RequesterBuilder.prototype.withCancel = function(cancel) {
  this.cancel = cancel;
  return this;
};

/**
 * Builds the requester's interceptor methods.
 * @return {grpc~Requester}
 */
RequesterBuilder.prototype.build = function() {
  var requester = {};
  requester.start = this.start;
  requester.sendMessage = this.message;
  requester.halfClose = this.half_close;
  requester.cancel = this.cancel;
  return requester;
};

/**
 * Transforms a list of interceptor providers into interceptors.
 * @param {InterceptorProvider[]} providers
 * @param {grpc~MethodDefinition} method_definition
 * @return {null|Interceptor[]}
 */
var resolveInterceptorProviders = function(providers, method_definition) {
  if (!_.isArray(providers)) {
    return null;
  }
  var interceptors = [];
  for (var i = 0; i < providers.length; i++) {
    var provider = providers[i];
    var interceptor = provider(method_definition);
    if (interceptor) {
      interceptors.push(interceptor);
    }
  }
  return interceptors;
};

/**
 * A chainable gRPC call proxy which will delegate to an optional requester
 * object. By default, interceptor methods will chain to next_call. If a
 * requester is provided which implements an interceptor method, that
 * requester method will be executed as part of the chain.
 * @param {InterceptingCall|null} next_call The next call in the chain
 * @param {grpc~Requester=} requester Interceptor methods to handle request
 * operations.
 * @constructor
 */
function InterceptingCall(next_call, requester) {
  this.next_call = next_call;
  this.requester = requester;
}

/**
 * Get the next method in the chain or a no-op function if we are at the end
 * of the chain
 * @param {string} method_name
 * @return {function} The next method in the chain
 * @private
 */
InterceptingCall.prototype._getNextCall = function(method_name) {
  return this.next_call ?
    this.next_call[method_name].bind(this.next_call) :
    function(){};
};

/**
 * Call the next method in the chain. This will either be on the next
 * InterceptingCall (next_call), or the requester if the requester
 * implements the method.
 * @param {string} method_name The name of the interceptor method
 * @param {array=} args Payload arguments for the operation
 * @param {function=} next The next InterceptingCall's method
 * @return {null}
 * @private
 */
InterceptingCall.prototype._callNext = function(method_name, args, next) {
  var args_array = args || [];
  var next_call = next ? next : this._getNextCall(method_name);
  if (this.requester && this.requester[method_name]) {
    // Avoid using expensive `apply` calls
    var num_args = args_array.length;
    switch (num_args) {
      case 0:
        return this.requester[method_name](next_call);
      case 1:
        return this.requester[method_name](args_array[0], next_call);
      case 2:
        return this.requester[method_name](args_array[0], args_array[1],
                                           next_call);
    }
  } else {
    return next_call(args_array[0], args_array[1]);
  }
};

/**
 * Starts a call through the outbound interceptor chain and adds an element to
 * the reciprocal inbound listener chain.
 * @param {grpc.Metadata} metadata The outgoing metadata.
 * @param {grpc~Listener} listener An intercepting listener for inbound
 * operations.
 */
InterceptingCall.prototype.start = function(metadata, listener) {
  var self = this;

  // If the listener provided is an InterceptingListener, use it. Otherwise, we
  // must be at the end of the listener chain, and any listener operations
  // should be terminated in an EndListener.
  var next_listener = _getInterceptingListener(listener, new EndListener());

  // Build the next method in the interceptor chain
  var next = function(metadata, current_listener) {
    // If there is a next call in the chain, run it. Otherwise do nothing.
    if (self.next_call) {
      // Wire together any listener provided with the next listener
      var listener = _getInterceptingListener(current_listener, next_listener);
      self.next_call.start(metadata, listener);
    }
  };
  this._callNext('start', [metadata, next_listener], next);
};

/**
 * Pass a message through the interceptor chain.
 * @param {jspb.Message} message
 */
InterceptingCall.prototype.sendMessage = function(message) {
  this._callNext('sendMessage', [message]);
};

/**
 * Run a close operation through the interceptor chain
 */
InterceptingCall.prototype.halfClose = function() {
  this._callNext('halfClose');
};

/**
 * Run a cancel operation through the interceptor chain
 */
InterceptingCall.prototype.cancel = function() {
  this._callNext('cancel');
};

/**
 * Run a cancelWithStatus operation through the interceptor chain.
 * @param {grpc~StatusObject} status
 * @param {string} message
 */
InterceptingCall.prototype.cancelWithStatus = function(status, message) {
  this._callNext('cancelWithStatus', [status, message]);
};

/**
 * Pass a getPeer call down to the base gRPC call (should not be intercepted)
 * @return {object}
 */
InterceptingCall.prototype.getPeer = function() {
  return this._callNext('getPeer');
};

/**
 * For streaming calls, we need to transparently pass the stream's context
 * through the interceptor chain. Passes the context between InterceptingCalls
 * but hides it from any requester implementations.
 * @param {object} context Carries objects needed for streaming operations.
 * @param {jspb.Message} message The message to send.
 */
InterceptingCall.prototype.sendMessageWithContext = function(context, message) {
  var next = this.next_call ?
    this.next_call.sendMessageWithContext.bind(this.next_call, context) :
    context;
  this._callNext('sendMessage', [message], next);
};

/**
 * For receiving streaming messages, we need to seed the base interceptor with
 * the streaming context to create a RECV_MESSAGE batch.
 * @param {object} context Carries objects needed for streaming operations
 */
InterceptingCall.prototype.recvMessageWithContext = function(context) {
  this._callNext('recvMessageWithContext', [context]);
};

/**
 * A chain-able listener object which will delegate to a custom listener when
 * appropriate.
 * @param {InterceptingListener|null} next_listener The next
 * InterceptingListener in the chain
 * @param {grpc~Listener=} delegate A custom listener object which may implement
 * specific operations
 * @constructor
 */
function InterceptingListener(next_listener, delegate) {
  this.delegate = delegate || {};
  this.next_listener = next_listener;
}

/**
 * Get the next method in the chain or a no-op function if we are at the end
 * of the chain.
 * @param {string} method_name The name of the listener method.
 * @return {function} The next method in the chain
 * @private
 */
InterceptingListener.prototype._getNextListener = function(method_name) {
  return this.next_listener ?
    this.next_listener[method_name].bind(this.next_listener) :
    function(){};
};

/**
 * Call the next method in the chain. This will either be on the next
 * InterceptingListener (next_listener), or the requester if the requester
 * implements the method.
 * @param {string} method_name The name of the interceptor method
 * @param {array=} args Payload arguments for the operation
 * @param {function=} next The next InterceptingListener's method
 * @return {null}
 * @private
 */
InterceptingListener.prototype._callNext = function(method_name, args, next) {
  var args_array = args || [];
  var next_listener = next ? next : this._getNextListener(method_name);
  if (this.delegate && this.delegate[method_name]) {
    // Avoid using expensive `apply` calls
    var num_args = args_array.length;
    switch (num_args) {
      case 0:
        return this.delegate[method_name](next_listener);
      case 1:
        return this.delegate[method_name](args_array[0], next_listener);
      case 2:
        return this.delegate[method_name](args_array[0], args_array[1],
                                          next_listener);
    }
  } else {
    return next_listener(args_array[0], args_array[1]);
  }
};
/**
 * Inbound metadata receiver.
 * @param {Metadata} metadata
 */
InterceptingListener.prototype.onReceiveMetadata = function(metadata) {
  this._callNext('onReceiveMetadata', [metadata]);
};

/**
 * Inbound message receiver.
 * @param {jspb.Message} message
 */
InterceptingListener.prototype.onReceiveMessage = function(message) {
  this._callNext('onReceiveMessage', [message]);
};

/**
 * When intercepting streaming message, we need to pass the streaming context
 * transparently along the chain. Hides the context from the delegate listener
 * methods.
 * @param {object} context Carries objects needed for streaming operations.
 * @param {jspb.Message} message The message received.
 */
InterceptingListener.prototype.recvMessageWithContext = function(context,
                                                                 message) {
  var fallback = this.next_listener.recvMessageWithContext;
  var next_method = this.next_listener ?
    fallback.bind(this.next_listener, context) :
    context;
  if (this.delegate.onReceiveMessage) {
    this.delegate.onReceiveMessage(message, next_method, context);
  } else {
    next_method(message);
  }
};

/**
 * Inbound status receiver.
 * @param {grpc~StatusObject} status
 */
InterceptingListener.prototype.onReceiveStatus = function(status) {
  this._callNext('onReceiveStatus', [status]);
};

/**
 * A dead-end listener used to terminate a call chain. Used when an interceptor
 * creates a branch chain, when the branch returns the listener chain will
 * terminate here.
 * @constructor
 */
function EndListener() {}
EndListener.prototype.onReceiveMetadata = function(){};
EndListener.prototype.onReceiveMessage = function(){};
EndListener.prototype.onReceiveStatus = function(){};
EndListener.prototype.recvMessageWithContext = function(){};

/**
 * Get a call object built with the provided options.
 * @param {grpc.Channel} channel
 * @param {string} path
 * @param {grpc.Client~CallOptions=} options Options object.
 */
function getCall(channel, path, options) {
  var deadline;
  var host;
  var parent;
  var propagate_flags;
  var credentials;
  if (options) {
    deadline = options.deadline;
    host = options.host;
    parent = _.get(options, 'parent.call');
    propagate_flags = options.propagate_flags;
    credentials = options.credentials;
  }
  if (deadline === undefined) {
    deadline = Infinity;
  }
  var call = channel.createCall(path, deadline, host,
                                parent, propagate_flags);
  if (credentials) {
    call.setCredentials(credentials);
  }
  return call;
}

var OP_DEPENDENCIES = {
  [grpc.opType.SEND_MESSAGE]: [grpc.opType.SEND_INITIAL_METADATA],
  [grpc.opType.SEND_CLOSE_FROM_CLIENT]: [grpc.opType.SEND_MESSAGE],
  [grpc.opType.RECV_MESSAGE]: [grpc.opType.SEND_INITIAL_METADATA]
};

/**
 * Produces a callback triggered by streaming response messages.
 * @private
 * @param {EventEmitter} emitter
 * @param {grpc.internal~Call} call
 * @param {function} get_listener Returns a grpc~Listener.
 * @param {grpc~deserialize} deserialize
 * @return {Function}
 */
function _getStreamReadCallback(emitter, call, get_listener, deserialize) {
  return function (err, response) {
    if (err) {
      // Something has gone wrong. Stop reading and wait for status
      emitter.finished = true;
      emitter._readsDone();
      return;
    }
    var data = response.read;
    var deserialized;
    try {
      deserialized = deserialize(data);
    } catch (e) {
      emitter._readsDone({
        code: constants.status.INTERNAL,
        details: 'Failed to parse server response'
      });
      return;
    }
    if (data === null) {
      emitter._readsDone();
      return;
    }
    var listener = get_listener();
    var context = {
      call: call,
      listener: listener
    };
    listener.recvMessageWithContext(context, deserialized);
  };
}

/**
 * Tests whether a batch can be started.
 * @private
 * @param {number[]} batch_ops The operations in the batch we are checking.
 * @param {number[]} completed_ops Previously completed operations.
 * @return {boolean}
 */
function _areBatchRequirementsMet(batch_ops, completed_ops) {
  var dependencies = _.flatMap(batch_ops, function(op) {
    return OP_DEPENDENCIES[op] || [];
  });
  for (var i = 0; i < dependencies.length; i++) {
    var required_dep = dependencies[i];
    if (batch_ops.indexOf(required_dep) === -1 &&
        completed_ops.indexOf(required_dep) === -1) {
      return false;
    }
  }
  return true;
}

/**
 * Enforces the order of operations for synchronous requests. If a batch's
 * operations cannot be started because required operations have not started
 * yet, the batch is deferred until requirements are met.
 * @private
 * @param {grpc.Client~Call} call
 * @param {object} batch
 * @param {object} batch_state
 * @param {number[]} [batch_state.completed_ops] The ops already sent.
 * @param {object} [batch_state.deferred_batches] Batches to be sent after
 *     their dependencies are fulfilled.
 * @param {function} callback
 * @return {object}
 */
function _startBatchIfReady(call, batch, batch_state, callback) {
  var completed_ops = batch_state.completed_ops;
  var deferred_batches = batch_state.deferred_batches;
  var batch_ops = _.map(_.keys(batch), Number);
  if (_areBatchRequirementsMet(batch_ops, completed_ops)) {
    // Dependencies are met, start the batch and any deferred batches whose
    // dependencies are met as a result.
    call.startBatch(batch, callback);
    completed_ops = _.union(completed_ops, batch_ops);
    deferred_batches = _.flatMap(deferred_batches, function(deferred_batch) {
      var deferred_batch_ops = _.map(_.keys(deferred_batch), Number);
      if (_areBatchRequirementsMet(deferred_batch_ops, completed_ops)) {
        call.startBatch(deferred_batch.batch, deferred_batch.callback);
        return [];
      }
      return [deferred_batch];
    });
  } else {
    // Dependencies are not met, defer the batch
    deferred_batches = deferred_batches.concat({
      batch: batch,
      callback: callback
    });
  }
  return {
    completed_ops: completed_ops,
    deferred_batches: deferred_batches
  };
}

/**
 * Produces an interceptor which will start gRPC batches for unary calls.
 * @private
 * @param {grpc~MethodDefinition} method_definition
 * @param {grpc.Channel} channel
 * @param {EventEmitter} emitter
 * @param {function} callback
 * @return {Interceptor}
 */
function _getUnaryInterceptor(method_definition, channel, emitter, callback) {
  var serialize = method_definition.requestSerialize;
  var deserialize = method_definition.responseDeserialize;
  return function (options) {
    var call = getCall(channel, method_definition.path, options);
    var first_listener;
    var final_requester = {};
    var batch_state = {
      completed_ops: [],
      deferred_batches: []
    };
    final_requester.start = function (metadata, listener) {
      var batch = {
        [grpc.opType.SEND_INITIAL_METADATA]:
          metadata._getCoreRepresentation(),
      };
      first_listener = listener;
      batch_state = _startBatchIfReady(call, batch, batch_state,
                                       function() {});
    };
    final_requester.sendMessage = function (message) {
      var batch = {
        [grpc.opType.SEND_MESSAGE]: serialize(message),
      };
      batch_state = _startBatchIfReady(call, batch, batch_state,
                                         function() {});
    };
    final_requester.halfClose = function () {
      var batch = {
        [grpc.opType.SEND_CLOSE_FROM_CLIENT]: true,
        [grpc.opType.RECV_INITIAL_METADATA]: true,
        [grpc.opType.RECV_MESSAGE]: true,
        [grpc.opType.RECV_STATUS_ON_CLIENT]: true
      };
      var callback = function (err, response) {
        response.status.metadata = Metadata._fromCoreRepresentation(
          response.status.metadata);
        var status = response.status;
        var deserialized;
        if (status.code === constants.status.OK) {
          if (err) {
            // Got a batch error, but OK status. Something went wrong
            callback(err);
            return;
          } else {
            try {
              deserialized = deserialize(response.read);
            } catch (e) {
              /* Change status to indicate bad server response. This
               * will result in passing an error to the callback */
              status = {
                code: constants.status.INTERNAL,
                details: 'Failed to parse server response'
              };
            }
          }
        }
        response.metadata =
          Metadata._fromCoreRepresentation(response.metadata);
        first_listener.onReceiveMetadata(response.metadata);
        first_listener.onReceiveMessage(deserialized);
        first_listener.onReceiveStatus(status);
      };
      batch_state = _startBatchIfReady(call, batch, batch_state, callback);
    };
    final_requester.cancel = function () {
      call.cancel();
    };
    final_requester.getPeer = function () {
      return call.getPeer();
    };
    return new InterceptingCall(null, final_requester);
  };
}

/**
 * Produces an interceptor which will start gRPC batches for client streaming
 * calls.
 * @private
 * @param {grpc~MethodDefinition} method_definition
 * @param {grpc.Channel} channel
 * @param {EventEmitter} emitter
 * @param {function} callback
 * @return {Interceptor}
 */
function _getClientStreamingInterceptor(method_definition, channel, emitter,
  callback) {
  var serialize = common.wrapIgnoreNull(method_definition.requestSerialize);
  var deserialize = method_definition.responseDeserialize;
  return function (options) {
    var first_listener;
    var call = getCall(channel, method_definition.path, options);
    var final_requester = {};
    final_requester.start = function (metadata, listener) {
      var metadata_batch = {
        [grpc.opType.SEND_INITIAL_METADATA]: metadata._getCoreRepresentation(),
        [grpc.opType.RECV_INITIAL_METADATA]: true
      };
      first_listener = listener;
      call.startBatch(metadata_batch, function (err, response) {
        if (err) {
          // The call has stopped for some reason. A non-OK status will arrive
          // in the other batch.
          return;
        }
        response.metadata = Metadata._fromCoreRepresentation(response.metadata);
        listener.onReceiveMetadata(response.metadata);
      });
      var recv_batch = {};
      recv_batch[grpc.opType.RECV_MESSAGE] = true;
      recv_batch[grpc.opType.RECV_STATUS_ON_CLIENT] = true;
      call.startBatch(recv_batch, function (err, response) {
        response.status.metadata = Metadata._fromCoreRepresentation(
          response.status.metadata);
        var status = response.status;
        var deserialized;
        if (status.code === constants.status.OK) {
          if (err) {
            // Got a batch error, but OK status. Something went wrong
            callback(err);
            return;
          } else {
            try {
              deserialized = deserialize(response.read);
            } catch (e) {
              /* Change status to indicate bad server response. This will result
               * in passing an error to the callback */
              status = {
                code: constants.status.INTERNAL,
                details: 'Failed to parse server response'
              };
            }
          }
        }
        listener.onReceiveMessage(deserialized);
        listener.onReceiveStatus(status);
      });
    };
    final_requester.sendMessage = function (chunk, context) {
      var message;
      var callback = (context && context.callback) ?
        context.callback :
        function () { };
      var encoding = (context && context.encoding) ?
        context.encoding :
        '';
      try {
        message = serialize(chunk);
      } catch (e) {
        /* Sending this error to the server and emitting it immediately on the
           client may put the call in a slightly weird state on the client side,
           but passing an object that causes a serialization failure is a misuse
           of the API anyway, so that's OK. The primary purpose here is to give
           the programmer a useful error and to stop the stream properly */
        call.cancelWithStatus(constants.status.INTERNAL,
          'Serialization failure');
        callback(e);
        return;
      }
      if (_.isFinite(encoding)) {
        /* Attach the encoding if it is a finite number. This is the closest we
         * can get to checking that it is valid flags */
        message.grpcWriteFlags = encoding;
      }
      var batch = {
        [grpc.opType.SEND_MESSAGE]: message
      };
      call.startBatch(batch, function (err, event) {
        callback(err, event);
      });
    };
    final_requester.halfClose = function () {
      var batch = {
        [grpc.opType.SEND_CLOSE_FROM_CLIENT]: true
      };
      call.startBatch(batch, function () { });
    };
    final_requester.cancel = function () {
      call.cancel();
    };
    final_requester.getPeer = function() {
      return call.getPeer();
    };
    return new InterceptingCall(null, final_requester);
  };
}

/**
 * Produces an interceptor which will start gRPC batches for server streaming
 * calls.
 * @private
 * @param {grpc~MethodDefinition} method_definition
 * @param {grpc.Channel} channel
 * @param {EventEmitter} emitter
 * @return {Interceptor}
 */
function _getServerStreamingInterceptor(method_definition, channel, emitter) {
  var deserialize = common.wrapIgnoreNull(
    method_definition.responseDeserialize);
  var serialize = method_definition.requestSerialize;
  return function (options) {
    var batch_state = {
      completed_ops: [],
      deferred_batches: []
    };
    var call = getCall(channel, method_definition.path, options);
    var final_requester = {};
    var first_listener;
    var get_listener = function() {
      return first_listener;
    };
    final_requester.start = function(metadata, listener) {
      first_listener = listener;
      metadata = metadata.clone();
      var metadata_batch = {
        [grpc.opType.SEND_INITIAL_METADATA]: metadata._getCoreRepresentation(),
        [grpc.opType.RECV_INITIAL_METADATA]: true
      };
      var callback = function(err, response) {
        if (err) {
          // The call has stopped for some reason. A non-OK status will arrive
          // in the other batch.
          return;
        }
        first_listener.onReceiveMetadata(
          Metadata._fromCoreRepresentation(response.metadata));
      };
      batch_state = _startBatchIfReady(call, metadata_batch, batch_state,
                                       callback);
      var status_batch = {
        [grpc.opType.RECV_STATUS_ON_CLIENT]: true
      };
      call.startBatch(status_batch, function(err, response) {
        if (err) {
          emitter.emit('error', err);
          return;
        }
        response.status.metadata = Metadata._fromCoreRepresentation(
          response.status.metadata);
        first_listener.onReceiveStatus(response.status);
      });
    };
    final_requester.sendMessage = function(argument) {
      var message = serialize(argument);
      if (options) {
        message.grpcWriteFlags = options.flags;
      }
      var send_batch = {
        [grpc.opType.SEND_MESSAGE]: message
      };
      var callback = function(err, response) {
        if (err) {
          // The call has stopped for some reason. A non-OK status will arrive
          // in the other batch.
          return;
        }
      };
      batch_state = _startBatchIfReady(call, send_batch, batch_state, callback);
    };
    final_requester.halfClose = function() {
      var batch = {
        [grpc.opType.SEND_CLOSE_FROM_CLIENT]: true
      };
      batch_state = _startBatchIfReady(call, batch, batch_state, function() {});
    };
    final_requester.recvMessageWithContext = function(context) {
      var recv_batch = {
        [grpc.opType.RECV_MESSAGE]: true
      };
      var callback = _getStreamReadCallback(emitter, call,
        get_listener, deserialize);
      batch_state = _startBatchIfReady(call, recv_batch, batch_state, callback);
    };
    final_requester.cancel = function() {
      call.cancel();
    };
    final_requester.getPeer = function() {
      return call.getPeer();
    };
    return new InterceptingCall(null, final_requester);
  };
}

/**
 * Produces an interceptor which will start gRPC batches for bi-directional
 * calls.
 * @private
 * @param {grpc~MethodDefinition} method_definition
 * @param {grpc.Channel} channel
 * @param {EventEmitter} emitter
 * @return {Interceptor}
 */
function _getBidiStreamingInterceptor(method_definition, channel, emitter) {
  var serialize = common.wrapIgnoreNull(method_definition.requestSerialize);
  var deserialize = common.wrapIgnoreNull(
    method_definition.responseDeserialize);
  return function (options) {
    var first_listener;
    var get_listener = function() {
      return first_listener;
    };
    var call = getCall(channel, method_definition.path, options);
    var final_requester = {};
    final_requester.start = function (metadata, listener) {
      var metadata_batch = {
        [grpc.opType.SEND_INITIAL_METADATA]: metadata._getCoreRepresentation(),
        [grpc.opType.RECV_INITIAL_METADATA]: true
      };
      first_listener = listener;
      call.startBatch(metadata_batch, function (err, response) {
        if (err) {
          // The call has stopped for some reason. A non-OK status will arrive
          // in the other batch.
          return;
        }
        response.metadata = Metadata._fromCoreRepresentation(response.metadata);
        listener.onReceiveMetadata(response.metadata);
      });
      var recv_batch = {};
      recv_batch[grpc.opType.RECV_STATUS_ON_CLIENT] = true;
      call.startBatch(recv_batch, function (err, response) {
        var status = response.status;
        if (status.code === constants.status.OK) {
          if (err) {
            emitter.emit('error', err);
            return;
          }
        }
        response.status.metadata = Metadata._fromCoreRepresentation(
          response.status.metadata);
        listener.onReceiveStatus(status);
      });
    };
    final_requester.sendMessage = function (chunk, context) {
      var message;
      var callback = (context && context.callback) ?
        context.callback :
        function() {};
      var encoding = (context && context.encoding) ?
        context.encoding :
        '';
      try {
        message = serialize(chunk);
      } catch (e) {
        /* Sending this error to the server and emitting it immediately on the
           client may put the call in a slightly weird state on the client side,
           but passing an object that causes a serialization failure is a misuse
           of the API anyway, so that's OK. The primary purpose here is to give
           the programmer a useful error and to stop the stream properly */
        call.cancelWithStatus(constants.status.INTERNAL,
          'Serialization failure');
        callback(e);
        return;
      }
      if (_.isFinite(encoding)) {
        /* Attach the encoding if it is a finite number. This is the closest we
         * can get to checking that it is valid flags */
        message.grpcWriteFlags = encoding;
      }
      var batch = {
        [grpc.opType.SEND_MESSAGE]: message
      };
      call.startBatch(batch, function (err, event) {
        callback(err, event);
      });
    };
    final_requester.halfClose = function () {
      var batch = {
        [grpc.opType.SEND_CLOSE_FROM_CLIENT]: true
      };
      call.startBatch(batch, function () { });
    };
    final_requester.recvMessageWithContext = function(context) {
      var recv_batch = {
        [grpc.opType.RECV_MESSAGE]: true
      };
      call.startBatch(recv_batch, _getStreamReadCallback(emitter, call,
        get_listener, deserialize));
    };
    final_requester.cancel = function() {
      call.cancel();
    };
    final_requester.getPeer = function() {
      return call.getPeer();
    };
    return new InterceptingCall(null, final_requester);
  };
}

/**
 * Produces a listener for responding to callers of unary RPCs.
 * @private
 * @param {grpc~MethodDefinition} method_definition
 * @param {EventEmitter} emitter
 * @param {function} callback
 * @return {grpc~Listener}
 */
function _getUnaryListener(method_definition, emitter, callback) {
  var resultMessage;
  return {
    onReceiveMetadata: function (metadata) {
      emitter.emit('metadata', metadata);
    },
    onReceiveMessage: function (message) {
      resultMessage = message;
    },
    onReceiveStatus: function (status) {
      if (status.code !== constants.status.OK) {
        var error = common.createStatusError(status);
        callback(error);
      } else {
        callback(null, resultMessage);
      }
      emitter.emit('status', status);
    }
  };
}

/**
 * Produces a listener for responding to callers of client streaming RPCs.
 * @private
 * @param {grpc~MethodDefinition} method_definition
 * @param {EventEmitter} emitter
 * @param {function} callback
 * @return {grpc~Listener}
 */
function _getClientStreamingListener(method_definition, emitter, callback) {
  var resultMessage;
  return {
    onReceiveMetadata: function (metadata) {
      emitter.emit('metadata', metadata);
    },
    onReceiveMessage: function (message) {
      resultMessage = message;
    },
    onReceiveStatus: function (status) {
      if (status.code !== constants.status.OK) {
        var error = common.createStatusError(status);
        callback(error);
      } else {
        callback(null, resultMessage);
      }
      emitter.emit('status', status);
    }
  };
}

/**
 * Produces a listener for responding to callers of server streaming RPCs.
 * @private
 * @param {grpc~MethodDefinition} method_definition
 * @param {EventEmitter} emitter
 * @return {grpc~Listener}
 */
function _getServerStreamingListener(method_definition, emitter) {
  var deserialize = common.wrapIgnoreNull(
    method_definition.responseDeserialize);
  return {
    onReceiveMetadata: function (metadata) {
      emitter.emit('metadata', metadata);
    },
    onReceiveMessage: function(message, next, context) {
      if (emitter.push(message) && message !== null) {
        var call = context.call;
        var get_listener = function() {
          return context.listener;
        };
        var read_batch = {};
        read_batch[grpc.opType.RECV_MESSAGE] = true;
        call.startBatch(read_batch, _getStreamReadCallback(emitter, call,
          get_listener, deserialize));
      } else {
        emitter.reading = false;
      }
    },
    onReceiveStatus: function (status) {
      emitter._receiveStatus(status);
    }
  };
}

/**
 * Produces a listener for responding to callers of bi-directional RPCs.
 * @private
 * @param {grpc~MethodDefinition} method_definition
 * @param {EventEmitter} emitter
 * @return {grpc~Listener}
 */
function _getBidiStreamingListener(method_definition, emitter) {
  var deserialize = common.wrapIgnoreNull(
    method_definition.responseDeserialize);
  return {
    onReceiveMetadata: function (metadata) {
      emitter.emit('metadata', metadata);
    },
    onReceiveMessage: function(message, next, context) {
      if (emitter.push(message) && message !== null) {
        var call = context.call;
        var get_listener = function() {
          return context.listener;
        };
        var read_batch = {};
        read_batch[grpc.opType.RECV_MESSAGE] = true;
        call.startBatch(read_batch, _getStreamReadCallback(emitter, call,
          get_listener, deserialize));
      } else {
        emitter.reading = false;
      }
    },
    onReceiveStatus: function (status) {
      emitter._receiveStatus(status);
    }
  };
}

var interceptorGenerators = {
  [methodTypes.UNARY]: _getUnaryInterceptor,
  [methodTypes.CLIENT_STREAMING]: _getClientStreamingInterceptor,
  [methodTypes.SERVER_STREAMING]: _getServerStreamingInterceptor,
  [methodTypes.BIDI_STREAMING]: _getBidiStreamingInterceptor
};

var listenerGenerators = {
  [methodTypes.UNARY]: _getUnaryListener,
  [methodTypes.CLIENT_STREAMING]: _getClientStreamingListener,
  [methodTypes.SERVER_STREAMING]: _getServerStreamingListener,
  [methodTypes.BIDI_STREAMING]: _getBidiStreamingListener
};

/**
 * Creates the last listener in an interceptor stack.
 * @param {grpc~MethodDefinition} method_definition
 * @param {EventEmitter} emitter
 * @param {function=} callback
 * @return {grpc~Listener}
 */
function getLastListener(method_definition, emitter, callback) {
  if (emitter instanceof Function) {
    callback = emitter;
    callback = function() {};
  }
  if (!(callback instanceof Function)) {
    callback = function() {};
  }
  if (!((emitter instanceof EventEmitter) &&
       (callback instanceof Function))) {
    throw new Error('Argument mismatch in getLastListener');
  }
  var method_type = common.getMethodType(method_definition);
  var generator = listenerGenerators[method_type];
  return generator(method_definition, emitter, callback);
}

/**
 *
 * @param {grpc~MethodDefinition} method_definition
 * @param {grpc.Client~CallOptions} options
 * @param {Interceptor[]} interceptors
 * @param {grpc.Channel} channel
 * @param {function|EventEmitter} responder
 */
function getInterceptingCall(method_definition, options,
                             interceptors, channel, responder) {
  var last_interceptor = _getLastInterceptor(method_definition, channel,
                                            responder);
  var all_interceptors = interceptors.concat(last_interceptor);
  return _buildChain(all_interceptors, options);
}

/**
 * Creates the last interceptor in an interceptor stack.
 * @private
 * @param {grpc~MethodDefinition} method_definition
 * @param {grpc.Channel} channel
 * @param {function|EventEmitter} responder
 * @return {Interceptor}
 */
function _getLastInterceptor(method_definition, channel, responder) {
  var callback = (responder instanceof Function) ? responder : function() {};
  var emitter = (responder instanceof EventEmitter) ? responder :
                                                      new EventEmitter();
  var method_type = common.getMethodType(method_definition);
  var generator = interceptorGenerators[method_type];
  return generator(method_definition, channel, emitter, callback);
}

/**
 * Chain a list of interceptors together and return the first InterceptingCall.
 * @private
 * @param {Interceptor[]} interceptors An interceptor stack.
 * @param {grpc.Client~CallOptions} options Call options.
 * @return {InterceptingCall}
 */
function _buildChain(interceptors, options) {
  var next = function(interceptors) {
    if (interceptors.length === 0) {
      return function (options) {};
    }
    var head_interceptor = interceptors[0];
    var rest_interceptors = interceptors.slice(1);
    return function (options) {
      return head_interceptor(options, next(rest_interceptors));
    };
  };
  var chain = next(interceptors)(options);
  return new InterceptingCall(chain);
}

/**
 * Wraps a plain listener object in an InterceptingListener if it isn't an
 * InterceptingListener already.
 * @param {InterceptingListener|object|null} current_listener
 * @param {InterceptingListener|EndListener} next_listener
 * @return {InterceptingListener|null}
 * @private
 */
function _getInterceptingListener(current_listener, next_listener) {
  if (!_isInterceptingListener(current_listener)) {
    return new InterceptingListener(next_listener, current_listener);
  }
  return current_listener;
}

/**
 * Test if the listener exists and is an InterceptingListener.
 * @param listener
 * @return {boolean}
 * @private
 */
function _isInterceptingListener(listener) {
  return listener && listener.constructor.name === 'InterceptingListener';
}

exports.resolveInterceptorProviders = resolveInterceptorProviders;

exports.InterceptingCall = InterceptingCall;
exports.ListenerBuilder = ListenerBuilder;
exports.RequesterBuilder = RequesterBuilder;
exports.StatusBuilder = StatusBuilder;

exports.InterceptorConfigurationError = InterceptorConfigurationError;

exports.getInterceptingCall = getInterceptingCall;
exports.getLastListener = getLastListener;
