# grpc-js environment variables

`@grpc/grpc-js` exposes some configuration as environment variables that
can be set.

*For the legacy `grpc` library, the environment variables are documented
[in the main gRPC repository](https://github.com/grpc/grpc/blob/master/doc/environment_variables.md)*

* grpc_proxy, https_proxy, http_proxy
  The URI of the proxy to use for HTTP CONNECT support. These variables are
  checked in order, and the first one that has a value is used.

* no_grpc_proxy, no_proxy
  A comma separated list of hostnames to connect to without using a proxy even
  if a proxy is set. These variables are checked in order, and the first one
  that has a value is used.

* GRPC_SSL_CIPHER_SUITES
  A colon separated list of cipher suites to use with OpenSSL
  Defaults to the defaults for Node.js

* GRPC_DEFAULT_SSL_ROOTS_FILE_PATH
  PEM file to load SSL roots from

* GRPC_NODE_TRACE, GRPC_TRACE
  A comma separated list of tracers that provide additional insight into how
  grpc-js is processing requests via debug logs. Available tracers include:
  - `call_stream` - Traces client request internals
  - `channel` - Traces channel events
  - `connectivity_state` - Traces channel connectivity state changes
  - `dns_resolver` - Traces DNS resolution
  - `ip_resolver` - Traces IPv4/v6 resolution
  - `pick_first` - Traces the pick first load balancing policy
  - `proxy` - Traces proxy operations
  - `resolving_load_balancer` - Traces the resolving load balancer
  - `round_robin` - Traces the round robin load balancing policy
  - `server` - Traces high-level server events
  - `server_call` - Traces server handling of individual requests
  - `subchannel` - Traces subchannel connectivity state and errors
  - `subchannel_refcount` - Traces subchannel refcount changes. Includes per-call logs.
  - `subchannel_flowctrl` - Traces HTTP/2 flow control. Includes per-call logs.
  - `subchannel_internals` - Traces HTTP/2 session state. Includes per-call logs.
  - `channel_stacktrace` - Traces channel construction events with stack traces.
  - `keepalive` - Traces gRPC keepalive pings
  - `index` - Traces module loading
  - `outlier_detection` - Traces outlier detection events

  The following tracers are added by the `@grpc/grpc-js-xds` library:
  - `cds_balancer` - Traces the CDS load balancing policy
  - `eds_balancer` - Traces the EDS load balancing policy
  - `priority` - Traces the priority load balancing policy
  - `weighted_target` - Traces the weighted target load balancing policy
  - `xds_client` - Traces the xDS Client
  - `xds_cluster_manager` - Traces the xDS cluster manager load balancing policy
  - `xds_resolver` - Traces the xDS name resolver

  'all' can additionally be used to turn all traces on.
  Individual traces can be disabled by prefixing them with '-'.

* GRPC_NODE_VERBOSITY, GRPC_VERBOSITY
  Default gRPC logging verbosity - one of:
  - DEBUG - log all gRPC messages
  - INFO - log INFO and ERROR message
  - ERROR - log only errors (default)
  - NONE - won't log any