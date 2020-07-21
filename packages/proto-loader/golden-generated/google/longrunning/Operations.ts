// Original file: deps/googleapis/google/longrunning/operations.proto

import * as grpc from '@grpc/grpc-js'
import { CancelOperationRequest as _google_longrunning_CancelOperationRequest, CancelOperationRequest__Output as _google_longrunning_CancelOperationRequest__Output } from '../../google/longrunning/CancelOperationRequest';
import { DeleteOperationRequest as _google_longrunning_DeleteOperationRequest, DeleteOperationRequest__Output as _google_longrunning_DeleteOperationRequest__Output } from '../../google/longrunning/DeleteOperationRequest';
import { Empty as _google_protobuf_Empty, Empty__Output as _google_protobuf_Empty__Output } from '../../google/protobuf/Empty';
import { GetOperationRequest as _google_longrunning_GetOperationRequest, GetOperationRequest__Output as _google_longrunning_GetOperationRequest__Output } from '../../google/longrunning/GetOperationRequest';
import { ListOperationsRequest as _google_longrunning_ListOperationsRequest, ListOperationsRequest__Output as _google_longrunning_ListOperationsRequest__Output } from '../../google/longrunning/ListOperationsRequest';
import { ListOperationsResponse as _google_longrunning_ListOperationsResponse, ListOperationsResponse__Output as _google_longrunning_ListOperationsResponse__Output } from '../../google/longrunning/ListOperationsResponse';
import { Operation as _google_longrunning_Operation, Operation__Output as _google_longrunning_Operation__Output } from '../../google/longrunning/Operation';
import { WaitOperationRequest as _google_longrunning_WaitOperationRequest, WaitOperationRequest__Output as _google_longrunning_WaitOperationRequest__Output } from '../../google/longrunning/WaitOperationRequest';

export interface OperationsClient extends grpc.Client {
  CancelOperation(argument: _google_longrunning_CancelOperationRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _google_protobuf_Empty__Output) => void): grpc.ClientUnaryCall;
  CancelOperation(argument: _google_longrunning_CancelOperationRequest, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _google_protobuf_Empty__Output) => void): grpc.ClientUnaryCall;
  CancelOperation(argument: _google_longrunning_CancelOperationRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _google_protobuf_Empty__Output) => void): grpc.ClientUnaryCall;
  CancelOperation(argument: _google_longrunning_CancelOperationRequest, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _google_protobuf_Empty__Output) => void): grpc.ClientUnaryCall;
  cancelOperation(argument: _google_longrunning_CancelOperationRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _google_protobuf_Empty__Output) => void): grpc.ClientUnaryCall;
  cancelOperation(argument: _google_longrunning_CancelOperationRequest, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _google_protobuf_Empty__Output) => void): grpc.ClientUnaryCall;
  cancelOperation(argument: _google_longrunning_CancelOperationRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _google_protobuf_Empty__Output) => void): grpc.ClientUnaryCall;
  cancelOperation(argument: _google_longrunning_CancelOperationRequest, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _google_protobuf_Empty__Output) => void): grpc.ClientUnaryCall;
  
  DeleteOperation(argument: _google_longrunning_DeleteOperationRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _google_protobuf_Empty__Output) => void): grpc.ClientUnaryCall;
  DeleteOperation(argument: _google_longrunning_DeleteOperationRequest, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _google_protobuf_Empty__Output) => void): grpc.ClientUnaryCall;
  DeleteOperation(argument: _google_longrunning_DeleteOperationRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _google_protobuf_Empty__Output) => void): grpc.ClientUnaryCall;
  DeleteOperation(argument: _google_longrunning_DeleteOperationRequest, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _google_protobuf_Empty__Output) => void): grpc.ClientUnaryCall;
  deleteOperation(argument: _google_longrunning_DeleteOperationRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _google_protobuf_Empty__Output) => void): grpc.ClientUnaryCall;
  deleteOperation(argument: _google_longrunning_DeleteOperationRequest, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _google_protobuf_Empty__Output) => void): grpc.ClientUnaryCall;
  deleteOperation(argument: _google_longrunning_DeleteOperationRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _google_protobuf_Empty__Output) => void): grpc.ClientUnaryCall;
  deleteOperation(argument: _google_longrunning_DeleteOperationRequest, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _google_protobuf_Empty__Output) => void): grpc.ClientUnaryCall;
  
  GetOperation(argument: _google_longrunning_GetOperationRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _google_longrunning_Operation__Output) => void): grpc.ClientUnaryCall;
  GetOperation(argument: _google_longrunning_GetOperationRequest, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _google_longrunning_Operation__Output) => void): grpc.ClientUnaryCall;
  GetOperation(argument: _google_longrunning_GetOperationRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _google_longrunning_Operation__Output) => void): grpc.ClientUnaryCall;
  GetOperation(argument: _google_longrunning_GetOperationRequest, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _google_longrunning_Operation__Output) => void): grpc.ClientUnaryCall;
  getOperation(argument: _google_longrunning_GetOperationRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _google_longrunning_Operation__Output) => void): grpc.ClientUnaryCall;
  getOperation(argument: _google_longrunning_GetOperationRequest, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _google_longrunning_Operation__Output) => void): grpc.ClientUnaryCall;
  getOperation(argument: _google_longrunning_GetOperationRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _google_longrunning_Operation__Output) => void): grpc.ClientUnaryCall;
  getOperation(argument: _google_longrunning_GetOperationRequest, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _google_longrunning_Operation__Output) => void): grpc.ClientUnaryCall;
  
  ListOperations(argument: _google_longrunning_ListOperationsRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _google_longrunning_ListOperationsResponse__Output) => void): grpc.ClientUnaryCall;
  ListOperations(argument: _google_longrunning_ListOperationsRequest, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _google_longrunning_ListOperationsResponse__Output) => void): grpc.ClientUnaryCall;
  ListOperations(argument: _google_longrunning_ListOperationsRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _google_longrunning_ListOperationsResponse__Output) => void): grpc.ClientUnaryCall;
  ListOperations(argument: _google_longrunning_ListOperationsRequest, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _google_longrunning_ListOperationsResponse__Output) => void): grpc.ClientUnaryCall;
  listOperations(argument: _google_longrunning_ListOperationsRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _google_longrunning_ListOperationsResponse__Output) => void): grpc.ClientUnaryCall;
  listOperations(argument: _google_longrunning_ListOperationsRequest, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _google_longrunning_ListOperationsResponse__Output) => void): grpc.ClientUnaryCall;
  listOperations(argument: _google_longrunning_ListOperationsRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _google_longrunning_ListOperationsResponse__Output) => void): grpc.ClientUnaryCall;
  listOperations(argument: _google_longrunning_ListOperationsRequest, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _google_longrunning_ListOperationsResponse__Output) => void): grpc.ClientUnaryCall;
  
  WaitOperation(argument: _google_longrunning_WaitOperationRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _google_longrunning_Operation__Output) => void): grpc.ClientUnaryCall;
  WaitOperation(argument: _google_longrunning_WaitOperationRequest, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _google_longrunning_Operation__Output) => void): grpc.ClientUnaryCall;
  WaitOperation(argument: _google_longrunning_WaitOperationRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _google_longrunning_Operation__Output) => void): grpc.ClientUnaryCall;
  WaitOperation(argument: _google_longrunning_WaitOperationRequest, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _google_longrunning_Operation__Output) => void): grpc.ClientUnaryCall;
  waitOperation(argument: _google_longrunning_WaitOperationRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _google_longrunning_Operation__Output) => void): grpc.ClientUnaryCall;
  waitOperation(argument: _google_longrunning_WaitOperationRequest, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _google_longrunning_Operation__Output) => void): grpc.ClientUnaryCall;
  waitOperation(argument: _google_longrunning_WaitOperationRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _google_longrunning_Operation__Output) => void): grpc.ClientUnaryCall;
  waitOperation(argument: _google_longrunning_WaitOperationRequest, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _google_longrunning_Operation__Output) => void): grpc.ClientUnaryCall;
  
}

export interface OperationsHandlers {
  CancelOperation(call: grpc.ServerUnaryCall<_google_longrunning_CancelOperationRequest, _google_protobuf_Empty__Output>, callback: grpc.sendUnaryData<_google_protobuf_Empty__Output>): void;
  
  DeleteOperation(call: grpc.ServerUnaryCall<_google_longrunning_DeleteOperationRequest, _google_protobuf_Empty__Output>, callback: grpc.sendUnaryData<_google_protobuf_Empty__Output>): void;
  
  GetOperation(call: grpc.ServerUnaryCall<_google_longrunning_GetOperationRequest, _google_longrunning_Operation__Output>, callback: grpc.sendUnaryData<_google_longrunning_Operation__Output>): void;
  
  ListOperations(call: grpc.ServerUnaryCall<_google_longrunning_ListOperationsRequest, _google_longrunning_ListOperationsResponse__Output>, callback: grpc.sendUnaryData<_google_longrunning_ListOperationsResponse__Output>): void;
  
  WaitOperation(call: grpc.ServerUnaryCall<_google_longrunning_WaitOperationRequest, _google_longrunning_Operation__Output>, callback: grpc.sendUnaryData<_google_longrunning_Operation__Output>): void;
  
}
