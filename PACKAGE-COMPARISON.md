# Feature comparison of `grpc` and `@grpc/grpc-js` packages

Feature | `grpc` | `@grpc/grpc-js`
--------|--------|----------
Client | :heavy_check_mark: | :heavy_check_mark:
Server | :heavy_check_mark: | :x:
Unary RPCs | :heavy_check_mark: | :heavy_check_mark:
Streaming RPCs | :heavy_check_mark: | :heavy_check_mark:
Deadlines | :heavy_check_mark: | :heavy_check_mark:
Cancellation | :heavy_check_mark: | :heavy_check_mark:
Automatic Reconnection | :heavy_check_mark: | :heavy_check_mark:
Per-message Compression | :heavy_check_mark: | only for response messages
Channel State | :heavy_check_mark: | :heavy_check_mark:
JWT Access and Service Account Credentials | provided by the [Google Auth Library](https://www.npmjs.com/package/google-auth-library) | provided by the [Google Auth Library](https://www.npmjs.com/package/google-auth-library)
Interceptors | :heavy_check_mark: | :x:
Connection Keepalives | :heavy_check_mark: | :heavy_check_mark:
HTTP Connect Support | :heavy_check_mark: | :x:
Retries | :heavy_check_mark: | :x:
Stats/tracing/monitoring | :heavy_check_mark: | :x:
Load Balancing | :heavy_check_mark: | :x:

Other Properties | `grpc` | `@grpc/grpc-js`
-----------------|--------|----------------
Pure JavaScript Code | :x: | :heavy_check_mark:
Supported Node Versions | >= 4 | ^8.13.0 or >=10.10.0
Supported Electron Versions | All | >= 3
Supported Platforms | Linux, Windows, MacOS | All
Supported Architectures | x86, x86-64, ARM7+ | All

In addition, all channel arguments defined in [this header file](https://github.com/grpc/grpc/blob/master/include/grpc/impl/codegen/grpc_types.h) are handled by the `grpc` library. Of those, the following are handled by the `@grpc/grpc-js` library:

 - `grpc.ssl_target_name_override`
 - `grpc.primary_user_agent`
 - `grpc.secondary_user_agent`
 - `grpc.default_authority`
 - `grpc.keepalive_time_ms`
 - `grpc.keepalive_timeout_ms`
 - `channelOverride`
 - `channelFactoryOverride`
