# gRPC Protobuf Loader

A utility package for loading `.proto` files for use with gRPC, using the latest Protobuf.js package.

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

protoLoader.load(protoFileName, options).then(packageDefinition => {
  const packageObject = grpcLibrary.loadPackageDefinition(packageDefinition);
});
// OR
const packageDefinition = protoLoader.loadSync(protoFileName, options);
const packageObject = grpcLibrary.loadPackageDefinition(packageDefinition);
```

The options parameter is an object that can have the following optional properties:

| Field name | Valid values | Description
|------------|--------------|------------
| `keepCase` | `true` or `false` | Preserve field names. The default is to change them to camel case.
| `longs` | `String` or `Number` | The type to use to represent `long` values. Defaults to a `Long` object type.
| `enums` | `String` | The type to use to represent `enum` values. Defaults to the numeric value.
| `bytes` | `Array` or `String` | The type to use to represent `bytes` values. Defaults to `Buffer`.
| `defaults` | `true` or `false` | Set default values on output objects. Defaults to `false`.
| `arrays` | `true` or `false` | Set empty arrays for missing array values even if `defaults` is `false` Defaults to `false`.
| `objects` | `true` or `false` | Set empty objects for missing object values even if `defaults` is `false` Defaults to `false`.
| `oneofs` | `true` or `false` | Set virtual oneof properties to the present field's name. Defaults to `false`.
| `includeDirs` | An array of strings | A list of search paths for imported `.proto` files.

The following options object closely approximates the existing behavior of `grpc.load`:

```js
const options = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
}
```
