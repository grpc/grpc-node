# Keepalive

This example illustrates how to set up client-side keepalive pings and
server-side keepalive pings and connection age and idleness settings.

## Start the server

```
node server.js
```

## Start the client

```
GRPC_TRACE=transport,keepalive GRPC_VERBOSITY=DEBUG node client.js
```
