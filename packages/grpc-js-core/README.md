# Pure JavaScript gRPC Client

## Installation

Node 9.x or greater is required.

```sh
npm install @grpc/grpc-js
```

## Features

 - Unary and streaming calls
 - Cancellation
 - Deadlines
 - TLS channel credentials
 - Call credentials (for auth)
 - Simple reconnection

This library does not directly handle `.proto` files. To use `.proto` files with this library we recommend using the `@grpc/proto-loader` package.
