# Error Handling

This example demonstrates basic RPC error handling in gRPC for unary and
streaming response cardinalities.

## Start the server

Run the server, whcih returns an error if the RPC request's `name` field is
empty.

```
node server.js
```

## Run the client

Then run the client in another terminal, which makes two requests for each of
unary and streaming responses: one with an empty Name field and one with it
populated with the current username provided by os/user.

```
node client.js
```
