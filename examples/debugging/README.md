# Debugging

Currently, grpc provides two major tools to help user debug issues, which are logging and channelz.

## Logs

gRPC has put substantial logging instruments on critical paths of gRPC to help users debug issues. The [Environment Variables](https://github.com/grpc/grpc-node/blob/master/doc/environment_variables.md) doc describes the environment variables that control debug logging.

To enable full debug logging, run the code with the following environment variables: `GRPC_TRACE=all GRPC_VERBOSITY=DEBUG`.

## Channelz

We also provide a runtime debugging tool, Channelz, to help users with live debugging.

See the channelz blog post here ([link](https://grpc.io/blog/a-short-introduction-to-channelz/)) for details about how to use channelz service to debug live program.

## Try it

The example is able to showcase how logging and channelz can help with debugging. See the channelz blog post linked above for full explanation.

```
node server.js
```

```
node client.js
```
