// Original file: deps/googleapis/google/longrunning/operations.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { ICancelOperationRequest as I_google_longrunning_CancelOperationRequest, OCancelOperationRequest as O_google_longrunning_CancelOperationRequest } from '../../google/longrunning/CancelOperationRequest';
import type { IDeleteOperationRequest as I_google_longrunning_DeleteOperationRequest, ODeleteOperationRequest as O_google_longrunning_DeleteOperationRequest } from '../../google/longrunning/DeleteOperationRequest';
import type { IEmpty as I_google_protobuf_Empty, OEmpty as O_google_protobuf_Empty } from '../../google/protobuf/Empty';
import type { IGetOperationRequest as I_google_longrunning_GetOperationRequest, OGetOperationRequest as O_google_longrunning_GetOperationRequest } from '../../google/longrunning/GetOperationRequest';
import type { IListOperationsRequest as I_google_longrunning_ListOperationsRequest, OListOperationsRequest as O_google_longrunning_ListOperationsRequest } from '../../google/longrunning/ListOperationsRequest';
import type { IListOperationsResponse as I_google_longrunning_ListOperationsResponse, OListOperationsResponse as O_google_longrunning_ListOperationsResponse } from '../../google/longrunning/ListOperationsResponse';
import type { IOperation as I_google_longrunning_Operation, OOperation as O_google_longrunning_Operation } from '../../google/longrunning/Operation';
import type { IWaitOperationRequest as I_google_longrunning_WaitOperationRequest, OWaitOperationRequest as O_google_longrunning_WaitOperationRequest } from '../../google/longrunning/WaitOperationRequest';

/**
 * Manages long-running operations with an API service.
 * 
 * When an API method normally takes long time to complete, it can be designed
 * to return [Operation][google.longrunning.Operation] to the client, and the client can use this
 * interface to receive the real response asynchronously by polling the
 * operation resource, or pass the operation resource to another API (such as
 * Google Cloud Pub/Sub API) to receive the response.  Any API service that
 * returns long-running operations should implement the `Operations` interface
 * so developers can have a consistent client experience.
 */
export interface OperationsClient extends grpc.Client {
  /**
   * Starts asynchronous cancellation on a long-running operation.  The server
   * makes a best effort to cancel the operation, but success is not
   * guaranteed.  If the server doesn't support this method, it returns
   * `google.rpc.Code.UNIMPLEMENTED`.  Clients can use
   * [Operations.GetOperation][google.longrunning.Operations.GetOperation] or
   * other methods to check whether the cancellation succeeded or whether the
   * operation completed despite cancellation. On successful cancellation,
   * the operation is not deleted; instead, it becomes an operation with
   * an [Operation.error][google.longrunning.Operation.error] value with a [google.rpc.Status.code][google.rpc.Status.code] of 1,
   * corresponding to `Code.CANCELLED`.
   */
  CancelOperation(argument: I_google_longrunning_CancelOperationRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<O_google_protobuf_Empty>): grpc.ClientUnaryCall;
  CancelOperation(argument: I_google_longrunning_CancelOperationRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<O_google_protobuf_Empty>): grpc.ClientUnaryCall;
  CancelOperation(argument: I_google_longrunning_CancelOperationRequest, options: grpc.CallOptions, callback: grpc.requestCallback<O_google_protobuf_Empty>): grpc.ClientUnaryCall;
  CancelOperation(argument: I_google_longrunning_CancelOperationRequest, callback: grpc.requestCallback<O_google_protobuf_Empty>): grpc.ClientUnaryCall;
  /**
   * Starts asynchronous cancellation on a long-running operation.  The server
   * makes a best effort to cancel the operation, but success is not
   * guaranteed.  If the server doesn't support this method, it returns
   * `google.rpc.Code.UNIMPLEMENTED`.  Clients can use
   * [Operations.GetOperation][google.longrunning.Operations.GetOperation] or
   * other methods to check whether the cancellation succeeded or whether the
   * operation completed despite cancellation. On successful cancellation,
   * the operation is not deleted; instead, it becomes an operation with
   * an [Operation.error][google.longrunning.Operation.error] value with a [google.rpc.Status.code][google.rpc.Status.code] of 1,
   * corresponding to `Code.CANCELLED`.
   */
  cancelOperation(argument: I_google_longrunning_CancelOperationRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<O_google_protobuf_Empty>): grpc.ClientUnaryCall;
  cancelOperation(argument: I_google_longrunning_CancelOperationRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<O_google_protobuf_Empty>): grpc.ClientUnaryCall;
  cancelOperation(argument: I_google_longrunning_CancelOperationRequest, options: grpc.CallOptions, callback: grpc.requestCallback<O_google_protobuf_Empty>): grpc.ClientUnaryCall;
  cancelOperation(argument: I_google_longrunning_CancelOperationRequest, callback: grpc.requestCallback<O_google_protobuf_Empty>): grpc.ClientUnaryCall;
  
  /**
   * Deletes a long-running operation. This method indicates that the client is
   * no longer interested in the operation result. It does not cancel the
   * operation. If the server doesn't support this method, it returns
   * `google.rpc.Code.UNIMPLEMENTED`.
   */
  DeleteOperation(argument: I_google_longrunning_DeleteOperationRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<O_google_protobuf_Empty>): grpc.ClientUnaryCall;
  DeleteOperation(argument: I_google_longrunning_DeleteOperationRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<O_google_protobuf_Empty>): grpc.ClientUnaryCall;
  DeleteOperation(argument: I_google_longrunning_DeleteOperationRequest, options: grpc.CallOptions, callback: grpc.requestCallback<O_google_protobuf_Empty>): grpc.ClientUnaryCall;
  DeleteOperation(argument: I_google_longrunning_DeleteOperationRequest, callback: grpc.requestCallback<O_google_protobuf_Empty>): grpc.ClientUnaryCall;
  /**
   * Deletes a long-running operation. This method indicates that the client is
   * no longer interested in the operation result. It does not cancel the
   * operation. If the server doesn't support this method, it returns
   * `google.rpc.Code.UNIMPLEMENTED`.
   */
  deleteOperation(argument: I_google_longrunning_DeleteOperationRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<O_google_protobuf_Empty>): grpc.ClientUnaryCall;
  deleteOperation(argument: I_google_longrunning_DeleteOperationRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<O_google_protobuf_Empty>): grpc.ClientUnaryCall;
  deleteOperation(argument: I_google_longrunning_DeleteOperationRequest, options: grpc.CallOptions, callback: grpc.requestCallback<O_google_protobuf_Empty>): grpc.ClientUnaryCall;
  deleteOperation(argument: I_google_longrunning_DeleteOperationRequest, callback: grpc.requestCallback<O_google_protobuf_Empty>): grpc.ClientUnaryCall;
  
  /**
   * Gets the latest state of a long-running operation.  Clients can use this
   * method to poll the operation result at intervals as recommended by the API
   * service.
   */
  GetOperation(argument: I_google_longrunning_GetOperationRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<O_google_longrunning_Operation>): grpc.ClientUnaryCall;
  GetOperation(argument: I_google_longrunning_GetOperationRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<O_google_longrunning_Operation>): grpc.ClientUnaryCall;
  GetOperation(argument: I_google_longrunning_GetOperationRequest, options: grpc.CallOptions, callback: grpc.requestCallback<O_google_longrunning_Operation>): grpc.ClientUnaryCall;
  GetOperation(argument: I_google_longrunning_GetOperationRequest, callback: grpc.requestCallback<O_google_longrunning_Operation>): grpc.ClientUnaryCall;
  /**
   * Gets the latest state of a long-running operation.  Clients can use this
   * method to poll the operation result at intervals as recommended by the API
   * service.
   */
  getOperation(argument: I_google_longrunning_GetOperationRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<O_google_longrunning_Operation>): grpc.ClientUnaryCall;
  getOperation(argument: I_google_longrunning_GetOperationRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<O_google_longrunning_Operation>): grpc.ClientUnaryCall;
  getOperation(argument: I_google_longrunning_GetOperationRequest, options: grpc.CallOptions, callback: grpc.requestCallback<O_google_longrunning_Operation>): grpc.ClientUnaryCall;
  getOperation(argument: I_google_longrunning_GetOperationRequest, callback: grpc.requestCallback<O_google_longrunning_Operation>): grpc.ClientUnaryCall;
  
  /**
   * Lists operations that match the specified filter in the request. If the
   * server doesn't support this method, it returns `UNIMPLEMENTED`.
   * 
   * NOTE: the `name` binding allows API services to override the binding
   * to use different resource name schemes, such as `users/* /operations`. To
   * override the binding, API services can add a binding such as
   * `"/v1/{name=users/*}/operations"` to their service configuration.
   * For backwards compatibility, the default name includes the operations
   * collection id, however overriding users must ensure the name binding
   * is the parent resource, without the operations collection id.
   */
  ListOperations(argument: I_google_longrunning_ListOperationsRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<O_google_longrunning_ListOperationsResponse>): grpc.ClientUnaryCall;
  ListOperations(argument: I_google_longrunning_ListOperationsRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<O_google_longrunning_ListOperationsResponse>): grpc.ClientUnaryCall;
  ListOperations(argument: I_google_longrunning_ListOperationsRequest, options: grpc.CallOptions, callback: grpc.requestCallback<O_google_longrunning_ListOperationsResponse>): grpc.ClientUnaryCall;
  ListOperations(argument: I_google_longrunning_ListOperationsRequest, callback: grpc.requestCallback<O_google_longrunning_ListOperationsResponse>): grpc.ClientUnaryCall;
  /**
   * Lists operations that match the specified filter in the request. If the
   * server doesn't support this method, it returns `UNIMPLEMENTED`.
   * 
   * NOTE: the `name` binding allows API services to override the binding
   * to use different resource name schemes, such as `users/* /operations`. To
   * override the binding, API services can add a binding such as
   * `"/v1/{name=users/*}/operations"` to their service configuration.
   * For backwards compatibility, the default name includes the operations
   * collection id, however overriding users must ensure the name binding
   * is the parent resource, without the operations collection id.
   */
  listOperations(argument: I_google_longrunning_ListOperationsRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<O_google_longrunning_ListOperationsResponse>): grpc.ClientUnaryCall;
  listOperations(argument: I_google_longrunning_ListOperationsRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<O_google_longrunning_ListOperationsResponse>): grpc.ClientUnaryCall;
  listOperations(argument: I_google_longrunning_ListOperationsRequest, options: grpc.CallOptions, callback: grpc.requestCallback<O_google_longrunning_ListOperationsResponse>): grpc.ClientUnaryCall;
  listOperations(argument: I_google_longrunning_ListOperationsRequest, callback: grpc.requestCallback<O_google_longrunning_ListOperationsResponse>): grpc.ClientUnaryCall;
  
  /**
   * Waits for the specified long-running operation until it is done or reaches
   * at most a specified timeout, returning the latest state.  If the operation
   * is already done, the latest state is immediately returned.  If the timeout
   * specified is greater than the default HTTP/RPC timeout, the HTTP/RPC
   * timeout is used.  If the server does not support this method, it returns
   * `google.rpc.Code.UNIMPLEMENTED`.
   * Note that this method is on a best-effort basis.  It may return the latest
   * state before the specified timeout (including immediately), meaning even an
   * immediate response is no guarantee that the operation is done.
   */
  WaitOperation(argument: I_google_longrunning_WaitOperationRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<O_google_longrunning_Operation>): grpc.ClientUnaryCall;
  WaitOperation(argument: I_google_longrunning_WaitOperationRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<O_google_longrunning_Operation>): grpc.ClientUnaryCall;
  WaitOperation(argument: I_google_longrunning_WaitOperationRequest, options: grpc.CallOptions, callback: grpc.requestCallback<O_google_longrunning_Operation>): grpc.ClientUnaryCall;
  WaitOperation(argument: I_google_longrunning_WaitOperationRequest, callback: grpc.requestCallback<O_google_longrunning_Operation>): grpc.ClientUnaryCall;
  /**
   * Waits for the specified long-running operation until it is done or reaches
   * at most a specified timeout, returning the latest state.  If the operation
   * is already done, the latest state is immediately returned.  If the timeout
   * specified is greater than the default HTTP/RPC timeout, the HTTP/RPC
   * timeout is used.  If the server does not support this method, it returns
   * `google.rpc.Code.UNIMPLEMENTED`.
   * Note that this method is on a best-effort basis.  It may return the latest
   * state before the specified timeout (including immediately), meaning even an
   * immediate response is no guarantee that the operation is done.
   */
  waitOperation(argument: I_google_longrunning_WaitOperationRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<O_google_longrunning_Operation>): grpc.ClientUnaryCall;
  waitOperation(argument: I_google_longrunning_WaitOperationRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<O_google_longrunning_Operation>): grpc.ClientUnaryCall;
  waitOperation(argument: I_google_longrunning_WaitOperationRequest, options: grpc.CallOptions, callback: grpc.requestCallback<O_google_longrunning_Operation>): grpc.ClientUnaryCall;
  waitOperation(argument: I_google_longrunning_WaitOperationRequest, callback: grpc.requestCallback<O_google_longrunning_Operation>): grpc.ClientUnaryCall;
  
}

/**
 * Manages long-running operations with an API service.
 * 
 * When an API method normally takes long time to complete, it can be designed
 * to return [Operation][google.longrunning.Operation] to the client, and the client can use this
 * interface to receive the real response asynchronously by polling the
 * operation resource, or pass the operation resource to another API (such as
 * Google Cloud Pub/Sub API) to receive the response.  Any API service that
 * returns long-running operations should implement the `Operations` interface
 * so developers can have a consistent client experience.
 */
export interface OperationsHandlers extends grpc.UntypedServiceImplementation {
  /**
   * Starts asynchronous cancellation on a long-running operation.  The server
   * makes a best effort to cancel the operation, but success is not
   * guaranteed.  If the server doesn't support this method, it returns
   * `google.rpc.Code.UNIMPLEMENTED`.  Clients can use
   * [Operations.GetOperation][google.longrunning.Operations.GetOperation] or
   * other methods to check whether the cancellation succeeded or whether the
   * operation completed despite cancellation. On successful cancellation,
   * the operation is not deleted; instead, it becomes an operation with
   * an [Operation.error][google.longrunning.Operation.error] value with a [google.rpc.Status.code][google.rpc.Status.code] of 1,
   * corresponding to `Code.CANCELLED`.
   */
  CancelOperation: grpc.handleUnaryCall<O_google_longrunning_CancelOperationRequest, I_google_protobuf_Empty>;
  
  /**
   * Deletes a long-running operation. This method indicates that the client is
   * no longer interested in the operation result. It does not cancel the
   * operation. If the server doesn't support this method, it returns
   * `google.rpc.Code.UNIMPLEMENTED`.
   */
  DeleteOperation: grpc.handleUnaryCall<O_google_longrunning_DeleteOperationRequest, I_google_protobuf_Empty>;
  
  /**
   * Gets the latest state of a long-running operation.  Clients can use this
   * method to poll the operation result at intervals as recommended by the API
   * service.
   */
  GetOperation: grpc.handleUnaryCall<O_google_longrunning_GetOperationRequest, I_google_longrunning_Operation>;
  
  /**
   * Lists operations that match the specified filter in the request. If the
   * server doesn't support this method, it returns `UNIMPLEMENTED`.
   * 
   * NOTE: the `name` binding allows API services to override the binding
   * to use different resource name schemes, such as `users/* /operations`. To
   * override the binding, API services can add a binding such as
   * `"/v1/{name=users/*}/operations"` to their service configuration.
   * For backwards compatibility, the default name includes the operations
   * collection id, however overriding users must ensure the name binding
   * is the parent resource, without the operations collection id.
   */
  ListOperations: grpc.handleUnaryCall<O_google_longrunning_ListOperationsRequest, I_google_longrunning_ListOperationsResponse>;
  
  /**
   * Waits for the specified long-running operation until it is done or reaches
   * at most a specified timeout, returning the latest state.  If the operation
   * is already done, the latest state is immediately returned.  If the timeout
   * specified is greater than the default HTTP/RPC timeout, the HTTP/RPC
   * timeout is used.  If the server does not support this method, it returns
   * `google.rpc.Code.UNIMPLEMENTED`.
   * Note that this method is on a best-effort basis.  It may return the latest
   * state before the specified timeout (including immediately), meaning even an
   * immediate response is no guarantee that the operation is done.
   */
  WaitOperation: grpc.handleUnaryCall<O_google_longrunning_WaitOperationRequest, I_google_longrunning_Operation>;
  
}

export interface OperationsDefinition extends grpc.ServiceDefinition {
  CancelOperation: MethodDefinition<I_google_longrunning_CancelOperationRequest, I_google_protobuf_Empty, O_google_longrunning_CancelOperationRequest, O_google_protobuf_Empty>
  DeleteOperation: MethodDefinition<I_google_longrunning_DeleteOperationRequest, I_google_protobuf_Empty, O_google_longrunning_DeleteOperationRequest, O_google_protobuf_Empty>
  GetOperation: MethodDefinition<I_google_longrunning_GetOperationRequest, I_google_longrunning_Operation, O_google_longrunning_GetOperationRequest, O_google_longrunning_Operation>
  ListOperations: MethodDefinition<I_google_longrunning_ListOperationsRequest, I_google_longrunning_ListOperationsResponse, O_google_longrunning_ListOperationsRequest, O_google_longrunning_ListOperationsResponse>
  WaitOperation: MethodDefinition<I_google_longrunning_WaitOperationRequest, I_google_longrunning_Operation, O_google_longrunning_WaitOperationRequest, O_google_longrunning_Operation>
}
