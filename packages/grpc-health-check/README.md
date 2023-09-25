# grpc-health-check

Health check client and service for use with gRPC-node.

## Background

This package provides an implementation of the [gRPC Health Checking Protocol](https://github.com/grpc/grpc/blob/master/doc/health-checking.md) service, as described in [gRFC L106](https://github.com/grpc/proposal/blob/master/L106-node-heath-check-library.md).

## Installation

Use the package manager [npm](https://www.npmjs.com/get-npm) to install `grpc-health-check`.

```bash
npm install grpc-health-check
```

## Usage

### Server

Any gRPC-node server can use `grpc-health-check` to adhere to the gRPC Health Checking Protocol.
The following shows how this package can be added to a pre-existing gRPC server.

```typescript
// Import package
import { HealthImplementation, ServingStatusMap } from 'grpc-health-check';

// Define service status map. Key is the service name, value is the corresponding status.
// By convention, the empty string '' key represents that status of the entire server.
const statusMap = {
  'ServiceFoo': 'SERVING',
  'ServiceBar': 'NOT_SERVING',
  '': 'NOT_SERVING',
};

// Construct the service implementation
const healthImpl = new HealthImplementation(statusMap);

healthImpl.addToServer(server);

// When ServiceBar comes up
healthImpl.setStatus('serviceBar', 'SERVING');
```

Congrats! Your server now allows any client to run a health check against it.

### Client

Any gRPC-node client can use the `service` object exported by `grpc-health-check` to generate clients that can make health check requests.

### Command Line Usage

The absolute path to `health.proto` can be obtained on the command line with `node -p 'require("grpc-health-check").protoPath'`.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[Apache License 2.0](https://choosealicense.com/licenses/apache-2.0/)
