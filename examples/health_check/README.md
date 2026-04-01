# Health Check

This example demonstrates how to set up standard gRPC Health Checks utilizing the unified [grpc-health-check](https://www.npmjs.com/package/grpc-health-check) library.

## Overview

The example uses the `grpc-health-check` package to:
- **Server**: Initialize a `HealthImplementation` and toggle the health status every 3 seconds.
- **Client**: Connect to the server and `watch` the health service for streamed status updates.

## Start the server

Run the server, which serves only the health checking API:

```
node server.js
```

## Run the client

In another terminal, run the client which watches the server for health check variations:

```
node client.js
```

## Expected Output

The client will begin to continuously receive state changes from the server:

**Server Output:**
```
Server running at http://0.0.0.0:50051
```

**Client Output:**
```
Health check status: SERVING
Health check status: NOT_SERVING
Health check status: SERVING
```
