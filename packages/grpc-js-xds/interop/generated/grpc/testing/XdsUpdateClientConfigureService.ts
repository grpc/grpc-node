// Original file: proto/grpc/testing/test.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { ClientConfigureRequest as _grpc_testing_ClientConfigureRequest, ClientConfigureRequest__Output as _grpc_testing_ClientConfigureRequest__Output } from '../../grpc/testing/ClientConfigureRequest';
import type { ClientConfigureResponse as _grpc_testing_ClientConfigureResponse, ClientConfigureResponse__Output as _grpc_testing_ClientConfigureResponse__Output } from '../../grpc/testing/ClientConfigureResponse';

/**
 * A service to dynamically update the configuration of an xDS test client.
 */
export interface XdsUpdateClientConfigureServiceClient extends grpc.Client {
  /**
   * Update the tes client's configuration.
   */
  Configure(argument: _grpc_testing_ClientConfigureRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_grpc_testing_ClientConfigureResponse__Output>): grpc.ClientUnaryCall;
  Configure(argument: _grpc_testing_ClientConfigureRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_grpc_testing_ClientConfigureResponse__Output>): grpc.ClientUnaryCall;
  Configure(argument: _grpc_testing_ClientConfigureRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_grpc_testing_ClientConfigureResponse__Output>): grpc.ClientUnaryCall;
  Configure(argument: _grpc_testing_ClientConfigureRequest, callback: grpc.requestCallback<_grpc_testing_ClientConfigureResponse__Output>): grpc.ClientUnaryCall;
  /**
   * Update the tes client's configuration.
   */
  configure(argument: _grpc_testing_ClientConfigureRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_grpc_testing_ClientConfigureResponse__Output>): grpc.ClientUnaryCall;
  configure(argument: _grpc_testing_ClientConfigureRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_grpc_testing_ClientConfigureResponse__Output>): grpc.ClientUnaryCall;
  configure(argument: _grpc_testing_ClientConfigureRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_grpc_testing_ClientConfigureResponse__Output>): grpc.ClientUnaryCall;
  configure(argument: _grpc_testing_ClientConfigureRequest, callback: grpc.requestCallback<_grpc_testing_ClientConfigureResponse__Output>): grpc.ClientUnaryCall;
  
}

/**
 * A service to dynamically update the configuration of an xDS test client.
 */
export interface XdsUpdateClientConfigureServiceHandlers extends grpc.UntypedServiceImplementation {
  /**
   * Update the tes client's configuration.
   */
  Configure: grpc.handleUnaryCall<_grpc_testing_ClientConfigureRequest__Output, _grpc_testing_ClientConfigureResponse>;
  
}

export interface XdsUpdateClientConfigureServiceDefinition extends grpc.ServiceDefinition {
  Configure: MethodDefinition<_grpc_testing_ClientConfigureRequest, _grpc_testing_ClientConfigureResponse, _grpc_testing_ClientConfigureRequest__Output, _grpc_testing_ClientConfigureResponse__Output>
}
