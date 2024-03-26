# Interceptor

Node gRPC provides simple APIs to implement and install interceptors on clients
and servers. An interceptor intercepts the execution of each incoming/outgoing
RPC call on the client or server where it is installed. Users can use
interceptors to do logging, authentication/authorization, metrics collection,
and many other functions that can be shared across RPCs.

## Run the server

```
node server.js
```

## Run the client

```
node client.js
```

# Explanation

In Node gRPC, clients and servers each have their own types of interceptors.

## Client

Node gRPC client interceptors are formally specified in [gRFC L5](https://github.com/grpc/proposal/blob/master/L5-node-client-interceptors.md).
An interceptor is a function that can wrap a call object with an
`InterceptingCall`, with intercepting functions for individual call operations.
To illustrate, the following is a trivial interceptor with all interception
methods:

```js
const interceptor = function(options, nextCall) {
  const requester = {
    start: function(metadata, listener, next) {
      const listener = {
          onReceiveMetadata: function(metadata, next) {
            next(metadata);
          },
          onReceiveMessage: function(message, next) {
            next(message);
          },
          onReceiveStatus: function(status, next) {
            next(status);
          }
      };
      next(metadata, listener);
    },
    sendMessage: function(message, next) {
      next(messasge);
    },
    halfClose: function(next) {
      next();
    },
    cancel: function(message, next) {
      next();
    }
  };
  return new InterceptingCall(nextCall(options), requester);
};
```

The requester intercepts outgoing operations, and the listener intercepts
incoming operations. Each intercepting method can read or modify the data for
that operation before passing it along to the `next` callback.

The `RequesterBuilder` and `ListenerBuilder` utility classes provide an
alternative way to construct requester and listener objects

## Server

Node gRPC server interceptors are formally specified in [gRFC L112](https://github.com/grpc/proposal/blob/master/L112-node-server-interceptors.md).
Similar to client interceptors, a server interceptor is a function that can
wrap a call object with a `ServerInterceptingCall`, with intercepting functions
for individual call operations. Server intercepting functions broadly mirror
the client intercepting functions, with sending and receiving switched. To
illustrate, the following is a trivial server interceptor with all interception
methods:

```js
const interceptor = function(methodDescriptor, call) {
  const responder = {
    start: function(next) {
      const listener = {
        onReceiveMetadata: function(metadata, next) {
          next(metadata);
        },
        onReceiveMessage: function(message, next) {
          next(message);
        },
        onReceiveHalfClose: function(next) {
          next();
        },
        onCancel: function() {
        }
      };
      next(listener);
    },
    sendMetadata: function(metadata, next) {
      next(metadata);
    },
    sendMessage: function(message, next) {
      next(message);
    },
    sendStatus: function(status, next) {
      next(status);
    }
  };
  return new ServerInterceptingCall(call, responder);
}
```

As with client interceptors, the responder intercepts outgoing operations and
the listener intercepts incoming operations. Each intercepting method can read
or modify the data for that operation before passing it along to the `next`
callback.

The `ResponderBuilder` and `ServerListenerBuilder` utility classes provide an
alternative way to build responder and server listener objects.
