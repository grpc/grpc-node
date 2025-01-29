# Retry

This example shows how to enable and configure retry on gRPC clients.

## Documentation

[gRFC for client-side retry support](https://github.com/grpc/proposal/blob/master/A6-client-retries.md)

## Try it

This example includes a service implementation that fails requests three times with status code Unavailable, then passes the fourth. The client is configured to make four retry attempts when receiving an Unavailable status code.

First start the server:

```
node server.js
```

Then run the client:

```
node client.js
```

## Usage

### Define your retry policy

Retry is configured via the service config, which can be provided by the name resolver, or as a channel option (described below). In the below example, we set the retry policy for the "grpc.example.echo.Echo" method.

```js
const serviceConfig = {
  loadBalancingConfig: [],
  methodConfig: [
    {
      name: [
        {
          service: 'grpc.examples.echo.Echo',
        },
      ],
      retryPolicy: {
        maxAttempts: 4,
        initialBackoff: '0.01s',
        maxBackoff: '0.01s',
        backoffMultiplier: 1.0,
        retryableStatusCodes: ['UNAVAILABLE'],
      },
    },
  ],
};
```

### Providing the retry policy as a channel option

```js
const client = new Echo('localhost:50052', grpc.credentials.createInsecure(), { 'grpc.service_config': JSON.stringify(serviceConfig) });
```
