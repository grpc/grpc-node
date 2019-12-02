# Compression

## Client side
The preferred method for configuring message compression on a client is to pass `options` when the client object is instantiated.

These two options control compression behavior:

**grpc.default_compression_algorithm** (int)

Default compression algorithm for the channel, applies to sending messages.

Possible values for this option are:
- `0` - No compression
- `1` - Compress with DEFLATE algorithm
- `2` - Compress with GZIP algorithm
- `3` - Stream compression with GZIP algorithm

**grpc.default_compression_level** (int)

Default compression level for the channel, applies to receiving messages.

Possible values for this option are:
- `0` - None
- `1` - Low level
- `2` - Medium level
- `3` - High level

### Code example
```javascript
client = new ExampleClient("example.com", credentials.createInsecure(), {'grpc.default_compression_algorithm': 2, 'grpc.default_compression_level': 2});
```
