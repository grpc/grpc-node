# @grpc/grpc-js xDS plugin

This package provides support for the `xds://` URL scheme to the `@grpc/grpc-js` library. The latest version of this package is compatible with `@grpc/grpc-js` version 1.2.x.

## Installation

```
npm install @grpc/grpc-js-xds
```

## Usage

```ts
import * as grpcJsXds from '@grpc/grpc-js-xds';
grpcJsXds.register();

// ...get a @grpc/grpc-js Client class as usual

const client = new MyServiceClient('xds:///example.com:123');
```

## Supported Features

 - [xDS-Based Global Load Balancing](https://github.com/grpc/proposal/blob/master/A27-xds-global-load-balancing.md)
 - [xDS traffic splitting and routing](https://github.com/grpc/proposal/blob/master/A28-xds-traffic-splitting-and-routing.md)