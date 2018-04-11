# Pure JavaScript gRPC Client

**Note: This is an alpha-level release. Some APIs may not yet be present and there may be bugs. Please report any that you encounter**

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
