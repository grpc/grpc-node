// Original file: deps/googleapis/google/rpc/status.proto

import type { IAny as I_google_protobuf_Any, OAny as O_google_protobuf_Any } from '../../google/protobuf/Any.ts';

/**
 * The `Status` type defines a logical error model that is suitable for
 * different programming environments, including REST APIs and RPC APIs. It is
 * used by [gRPC](https://github.com/grpc). Each `Status` message contains
 * three pieces of data: error code, error message, and error details.
 * 
 * You can find out more about this error model and how to work with it in the
 * [API Design Guide](https://cloud.google.com/apis/design/errors).
 */
export interface IStatus {
  /**
   * The status code, which should be an enum value of [google.rpc.Code][google.rpc.Code].
   */
  'code'?: (number);
  /**
   * A developer-facing error message, which should be in English. Any
   * user-facing error message should be localized and sent in the
   * [google.rpc.Status.details][google.rpc.Status.details] field, or localized by the client.
   */
  'message'?: (string);
  /**
   * A list of messages that carry the error details.  There is a common set of
   * message types for APIs to use.
   */
  'details'?: (I_google_protobuf_Any)[];
}

/**
 * The `Status` type defines a logical error model that is suitable for
 * different programming environments, including REST APIs and RPC APIs. It is
 * used by [gRPC](https://github.com/grpc). Each `Status` message contains
 * three pieces of data: error code, error message, and error details.
 * 
 * You can find out more about this error model and how to work with it in the
 * [API Design Guide](https://cloud.google.com/apis/design/errors).
 */
export interface OStatus {
  /**
   * The status code, which should be an enum value of [google.rpc.Code][google.rpc.Code].
   */
  'code': (number);
  /**
   * A developer-facing error message, which should be in English. Any
   * user-facing error message should be localized and sent in the
   * [google.rpc.Status.details][google.rpc.Status.details] field, or localized by the client.
   */
  'message': (string);
  /**
   * A list of messages that carry the error details.  There is a common set of
   * message types for APIs to use.
   */
  'details': (O_google_protobuf_Any)[];
}
