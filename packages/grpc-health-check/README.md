# grpc-health-check

Health check client and service for use with gRPC-node.

## Background

This package exports both a client and server that adhere to the [gRPC Health Checking Protocol](https://github.com/grpc/grpc/blob/master/doc/health-checking.md).

By using this package, clients and servers can rely on common proto and service definitions. This means:
- Clients can use the generated stubs to health check _any_ server that adheres to the protocol.
- Servers do not reimplement common logic for publishing health statuses.

## Installation

Use the package manager [npm](https://www.npmjs.com/get-npm) to install `grpc-health-check`.

```bash
npm install grpc-health-check
```

## Usage

### Server

Any gRPC-node server can use `grpc-health-check` to adhere to the gRPC Health Checking Protocol. 
The following shows how this package can be added to a pre-existing gRPC server.

```javascript 1.8
// Import package
let health = require('grpc-health-check');

// Define service status map. Key is the service name, value is the corresponding status.
// By convention, the empty string "" key represents that status of the entire server.
const statusMap = {
  "ServiceFoo": proto.grpc.health.v1.HealthCheckResponse.ServingStatus.SERVING,
  "ServiceBar": proto.grpc.health.v1.HealthCheckResponse.ServingStatus.NOT_SERVING,
  "": proto.grpc.health.v1.HealthCheckResponse.ServingStatus.NOT_SERVING,
};

// Construct the service implementation
let healthImpl = new health.Implementation(statusMap);

// Add the service and implementation to your pre-existing gRPC-node server
server.addService(health.service, healthImpl);
```

Congrats! Your server now allows any client to run a health check against it.

### Client

Any gRPC-node client can use `grpc-health-check` to run health checks against other servers that follow the protocol.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[Apache License 2.0](https://choosealicense.com/licenses/apache-2.0/)
