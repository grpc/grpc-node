# gRPC Protobuf Loader

## Installation

```sh
npm install @grpc/proto-loader
```

## Usage

```js
const protoLoader = require('@grpc/proto-loader')
protoLoader.load(protoFile, options).then(packageDefinition => {
  package = grpcLibrary.loadPackageDefinition(packageDefinition);
});
```
