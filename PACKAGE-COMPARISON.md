# Feature comparison of `grpc` and `@grpc/grpc-js` packages

Feature | `grpc` (deprecated) | `@grpc/grpc-js`
--------|--------|----------
Client | :heavy_check_mark: | :heavy_check_mark:
Server | :heavy_check_mark: | :heavy_check_mark:
Unary RPCs | :heavy_check_mark: | :heavy_check_mark:
Streaming RPCs | :heavy_check_mark: | :heavy_check_mark:
Deadlines | :heavy_check_mark: | :heavy_check_mark:
Cancellation | :heavy_check_mark: | :heavy_check_mark:
Automatic Reconnection | :heavy_check_mark: | :heavy_check_mark:
Per-message Compression | :heavy_check_mark: | :heavy_check_mark: (except messages sent by the server)
Channel State | :heavy_check_mark: | :heavy_check_mark:
JWT Access and Service Account Credentials | provided by the [Google Auth Library](https://www.npmjs.com/package/google-auth-library) | provided by the [Google Auth Library](https://www.npmjs.com/package/google-auth-library)
Interceptors | :heavy_check_mark: | :heavy_check_mark:
Connection Keepalives | :heavy_check_mark: | :heavy_check_mark:
HTTP Connect Support | :heavy_check_mark: | :heavy_check_mark:
Retries | :heavy_check_mark: (without hedging) | :heavy_check_mark: (including hedging)
Stats/tracing/monitoring | :heavy_check_mark: | :x:
Load Balancing | :heavy_check_mark: | :heavy_check_mark:
Initial Metadata Options | :heavy_check_mark: | only `waitForReady`

Other Properties | `grpc` | `@grpc/grpc-js`
-----------------|--------|----------------
Pure JavaScript Code | :x: | :heavy_check_mark:
Supported Node Versions | >= 4 and <=14 | ^8.13.0 or >=10.10.0
Supported Electron Versions | <=11.2 | >= 3
Supported Platforms | Linux, Windows, MacOS | All
Supported Architectures | x86, x86-64, ARM7+ | All

In addition, all channel arguments defined in [this header file](https://github.com/grpc/grpc/blob/master/include/grpc/impl/codegen/grpc_types.h) are handled by the `grpc` library.
Of those, a subset are handled by the `@grpc/grpc-js` library. See [the README](https://github.com/grpc/grpc-node/blob/master/packages/grpc-js/README.md#supported-channel-options) for `@grpc/grpc-js` for the list of supported channel options.
