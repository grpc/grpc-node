// Original file: deps/googleapis/google/longrunning/operations.proto

import type { IAny as I_google_protobuf_Any, OAny as O_google_protobuf_Any } from '../../google/protobuf/Any';
import type { IStatus as I_google_rpc_Status, OStatus as O_google_rpc_Status } from '../../google/rpc/Status';

/**
 * This resource represents a long-running operation that is the result of a
 * network API call.
 */
export interface IOperation {
  /**
   * The server-assigned name, which is only unique within the same service that
   * originally returns it. If you use the default HTTP mapping, the
   * `name` should be a resource name ending with `operations/{unique_id}`.
   */
  'name'?: (string);
  /**
   * Service-specific metadata associated with the operation.  It typically
   * contains progress information and common metadata such as create time.
   * Some services might not provide such metadata.  Any method that returns a
   * long-running operation should document the metadata type, if any.
   */
  'metadata'?: (I_google_protobuf_Any | null);
  /**
   * If the value is `false`, it means the operation is still in progress.
   * If `true`, the operation is completed, and either `error` or `response` is
   * available.
   */
  'done'?: (boolean);
  /**
   * The error result of the operation in case of failure or cancellation.
   */
  'error'?: (I_google_rpc_Status | null);
  /**
   * The normal response of the operation in case of success.  If the original
   * method returns no data on success, such as `Delete`, the response is
   * `google.protobuf.Empty`.  If the original method is standard
   * `Get`/`Create`/`Update`, the response should be the resource.  For other
   * methods, the response should have the type `XxxResponse`, where `Xxx`
   * is the original method name.  For example, if the original method name
   * is `TakeSnapshot()`, the inferred response type is
   * `TakeSnapshotResponse`.
   */
  'response'?: (I_google_protobuf_Any | null);
  /**
   * The operation result, which can be either an `error` or a valid `response`.
   * If `done` == `false`, neither `error` nor `response` is set.
   * If `done` == `true`, exactly one of `error` or `response` is set.
   */
  'result'?: "error"|"response";
}

/**
 * This resource represents a long-running operation that is the result of a
 * network API call.
 */
export interface OOperation {
  /**
   * The server-assigned name, which is only unique within the same service that
   * originally returns it. If you use the default HTTP mapping, the
   * `name` should be a resource name ending with `operations/{unique_id}`.
   */
  'name': (string);
  /**
   * Service-specific metadata associated with the operation.  It typically
   * contains progress information and common metadata such as create time.
   * Some services might not provide such metadata.  Any method that returns a
   * long-running operation should document the metadata type, if any.
   */
  'metadata': (O_google_protobuf_Any | null);
  /**
   * If the value is `false`, it means the operation is still in progress.
   * If `true`, the operation is completed, and either `error` or `response` is
   * available.
   */
  'done': (boolean);
  /**
   * The error result of the operation in case of failure or cancellation.
   */
  'error'?: (O_google_rpc_Status | null);
  /**
   * The normal response of the operation in case of success.  If the original
   * method returns no data on success, such as `Delete`, the response is
   * `google.protobuf.Empty`.  If the original method is standard
   * `Get`/`Create`/`Update`, the response should be the resource.  For other
   * methods, the response should have the type `XxxResponse`, where `Xxx`
   * is the original method name.  For example, if the original method name
   * is `TakeSnapshot()`, the inferred response type is
   * `TakeSnapshotResponse`.
   */
  'response'?: (O_google_protobuf_Any | null);
  /**
   * The operation result, which can be either an `error` or a valid `response`.
   * If `done` == `false`, neither `error` nor `response` is set.
   * If `done` == `true`, exactly one of `error` or `response` is set.
   */
  'result': "error"|"response";
}
