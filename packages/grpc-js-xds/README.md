# @grpc/grpc-js xDS plugin

This package provides support for the `xds://` URL scheme to the `@grpc/grpc-js` library. The latest version of this package is compatible with `@grpc/grpc-js` version 1.9.x.

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
 - [xDS v3 API](https://github.com/grpc/proposal/blob/master/A30-xds-v3.md)
 - [xDS Timeouts](https://github.com/grpc/proposal/blob/master/A31-xds-timeout-support-and-config-selector.md)
 - [xDS Circuit Breaking](https://github.com/grpc/proposal/blob/master/A32-xds-circuit-breaking.md)
 - [xDS Client-Side Fault Injection](https://github.com/grpc/proposal/blob/master/A33-Fault-Injection.md)
 - [Client Status Discovery Service](https://github.com/grpc/proposal/blob/master/A40-csds-support.md)
 - [Outlier Detection](https://github.com/grpc/proposal/blob/master/A50-xds-outlier-detection.md)
 - [xDS Retry Support](https://github.com/grpc/proposal/blob/master/A44-xds-retry.md)
 - [xDS Aggregate and Logical DNS Clusters](https://github.com/grpc/proposal/blob/master/A37-xds-aggregate-and-logical-dns-clusters.md)'
 - [xDS Federation](https://github.com/grpc/proposal/blob/master/A47-xds-federation.md) (Currently experimental, enabled by environment variable `GRPC_EXPERIMENTAL_XDS_FEDERATION`)
