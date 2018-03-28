# gRPC Protobuf Loader

## Installation

```sh
npm install @grpc/proto-loader
```

## Usage

```js
const protoLoader = require('@grpc/proto-loader');
const grpcLibrary = require('grpc');
// OR
const grpcLibrary = require('@grpc/grpc-js');
protoLoader.load(protoFile, options).then(packageDefinition => {
  const package = grpcLibrary.loadPackageDefinition(packageDefinition);
});
```
