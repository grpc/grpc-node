# Load balancing

This examples shows how `Client` can pick different load balancing policies.

## Try it

```
node server.js
```

```
node client.js
```

## Explanation

Two echo servers are serving on "0.0.0.0:50051" and "0.0.0.0:50052". They will include their serving address in the response. So the server on "0.0.0.0:50051" will reply to the RPC with this is examples/load_balancing (from 0.0.0.0:50051).

Two clients are created, to connect to both of these servers. Each client picks a different load balancer (using the `grpc.service_config` option): `pick_first` or `round_robin`.

Note that balancers can also be switched using service config, which allows service owners (instead of client owners) to pick the balancer to use. Service config doc is available at https://github.com/grpc/grpc/blob/master/doc/service_config.md.

### pick_first

The first client is configured to use `pick_first`. `pick_first` tries to connect to the first address, uses it for all RPCs if it connects, or try the next address if it fails (and keep doing that until one connection is successful). Because of this, all the RPCs will be sent to the same backend. The responses received all show the same backend address.

```
this is examples/load_balancing (from 0.0.0.0:50051)
this is examples/load_balancing (from 0.0.0.0:50051)
this is examples/load_balancing (from 0.0.0.0:50051)
this is examples/load_balancing (from 0.0.0.0:50051)
this is examples/load_balancing (from 0.0.0.0:50051)
this is examples/load_balancing (from 0.0.0.0:50051)
this is examples/load_balancing (from 0.0.0.0:50051)
this is examples/load_balancing (from 0.0.0.0:50051)
this is examples/load_balancing (from 0.0.0.0:50051)
this is examples/load_balancing (from 0.0.0.0:50051)
```

### round_robin

The second client is configured to use `round_robin`. `round_robin` connects to all the addresses it sees, and sends an RPC to each backend one at a time in order. E.g. the first RPC will be sent to backend-1, the second RPC will be sent to backend-2, and the third RPC will be sent to backend-1 again.

```
this is examples/load_balancing (from 0.0.0.0:50051)
this is examples/load_balancing (from 0.0.0.0:50051)
this is examples/load_balancing (from 0.0.0.0:50052)
this is examples/load_balancing (from 0.0.0.0:50051)
this is examples/load_balancing (from 0.0.0.0:50052)
this is examples/load_balancing (from 0.0.0.0:50051)
this is examples/load_balancing (from 0.0.0.0:50052)
this is examples/load_balancing (from 0.0.0.0:50051)
this is examples/load_balancing (from 0.0.0.0:50052)
this is examples/load_balancing (from 0.0.0.0:50051)
```

Note that it's possible to see two consecutive RPC sent to the same backend. That's because `round_robin` only picks the connections ready for RPCs. So if one of the two connections is not ready for some reason, all RPCs will be sent to the ready connection.
