# Troubleshooting grpc-js

This guide is for troubleshooting the `grpc-js` library for Node.js

## Enabling extra logging and tracing

Extra logging can be very useful for diagnosing problems. `grpc-js` supports
the `GRPC_VERBOSITY` and `GRPC_TRACE` environment variables that can be used to increase the amount of information
that gets printed to stderr.

## GRPC_VERBOSITY

`GRPC_VERBOSITY` is used to set the minimum level of log messages printed by gRPC (supported values are `DEBUG`, `INFO` and `ERROR`). If this environment variable is unset, only `ERROR` logs will be printed.

## GRPC_TRACE

`GRPC_TRACE` can be used to enable extra logging for some internal gRPC components. Enabling the right traces can be invaluable
for diagnosing for what is going wrong when things aren't working as intended. Possible values for `GRPC_TRACE` are listed in [Environment Variables Overview](doc/environment_variables.md).
Multiple traces can be enabled at once (use comma as separator).

```
# Enable debug logs for an application
GRPC_VERBOSITY=debug ./helloworld_application_using_grpc
```

```
# Print information about channel state changes
GRPC_VERBOSITY=debug GRPC_TRACE=connectivity_state ./helloworld_application_using_grpc
```

```
# Print info from 3 different tracers, including tracing logs with log level DEBUG
GRPC_VERBOSITY=debug GRPC_TRACE=channel,subchannel,call_stream ./helloworld_application_using_grpc
```

Please note that the `GRPC_TRACE` environment variable has nothing to do with gRPC's "tracing" feature (= tracing RPCs in
microservice environment to gain insight about how requests are processed by deployment), it is merely used to enable printing
of extra logs.
