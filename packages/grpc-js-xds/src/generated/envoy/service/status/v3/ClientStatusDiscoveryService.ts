// Original file: deps/envoy-api/envoy/service/status/v3/csds.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { ClientStatusRequest as _envoy_service_status_v3_ClientStatusRequest, ClientStatusRequest__Output as _envoy_service_status_v3_ClientStatusRequest__Output } from '../../../../envoy/service/status/v3/ClientStatusRequest';
import type { ClientStatusResponse as _envoy_service_status_v3_ClientStatusResponse, ClientStatusResponse__Output as _envoy_service_status_v3_ClientStatusResponse__Output } from '../../../../envoy/service/status/v3/ClientStatusResponse';

/**
 * CSDS is Client Status Discovery Service. It can be used to get the status of
 * an xDS-compliant client from the management server's point of view. It can
 * also be used to get the current xDS states directly from the client.
 */
export interface ClientStatusDiscoveryServiceClient extends grpc.Client {
  FetchClientStatus(argument: _envoy_service_status_v3_ClientStatusRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_envoy_service_status_v3_ClientStatusResponse__Output>): grpc.ClientUnaryCall;
  FetchClientStatus(argument: _envoy_service_status_v3_ClientStatusRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_envoy_service_status_v3_ClientStatusResponse__Output>): grpc.ClientUnaryCall;
  FetchClientStatus(argument: _envoy_service_status_v3_ClientStatusRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_envoy_service_status_v3_ClientStatusResponse__Output>): grpc.ClientUnaryCall;
  FetchClientStatus(argument: _envoy_service_status_v3_ClientStatusRequest, callback: grpc.requestCallback<_envoy_service_status_v3_ClientStatusResponse__Output>): grpc.ClientUnaryCall;
  fetchClientStatus(argument: _envoy_service_status_v3_ClientStatusRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_envoy_service_status_v3_ClientStatusResponse__Output>): grpc.ClientUnaryCall;
  fetchClientStatus(argument: _envoy_service_status_v3_ClientStatusRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_envoy_service_status_v3_ClientStatusResponse__Output>): grpc.ClientUnaryCall;
  fetchClientStatus(argument: _envoy_service_status_v3_ClientStatusRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_envoy_service_status_v3_ClientStatusResponse__Output>): grpc.ClientUnaryCall;
  fetchClientStatus(argument: _envoy_service_status_v3_ClientStatusRequest, callback: grpc.requestCallback<_envoy_service_status_v3_ClientStatusResponse__Output>): grpc.ClientUnaryCall;
  
  StreamClientStatus(metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientDuplexStream<_envoy_service_status_v3_ClientStatusRequest, _envoy_service_status_v3_ClientStatusResponse__Output>;
  StreamClientStatus(options?: grpc.CallOptions): grpc.ClientDuplexStream<_envoy_service_status_v3_ClientStatusRequest, _envoy_service_status_v3_ClientStatusResponse__Output>;
  streamClientStatus(metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientDuplexStream<_envoy_service_status_v3_ClientStatusRequest, _envoy_service_status_v3_ClientStatusResponse__Output>;
  streamClientStatus(options?: grpc.CallOptions): grpc.ClientDuplexStream<_envoy_service_status_v3_ClientStatusRequest, _envoy_service_status_v3_ClientStatusResponse__Output>;
  
}

/**
 * CSDS is Client Status Discovery Service. It can be used to get the status of
 * an xDS-compliant client from the management server's point of view. It can
 * also be used to get the current xDS states directly from the client.
 */
export interface ClientStatusDiscoveryServiceHandlers extends grpc.UntypedServiceImplementation {
  FetchClientStatus: grpc.handleUnaryCall<_envoy_service_status_v3_ClientStatusRequest__Output, _envoy_service_status_v3_ClientStatusResponse>;
  
  StreamClientStatus: grpc.handleBidiStreamingCall<_envoy_service_status_v3_ClientStatusRequest__Output, _envoy_service_status_v3_ClientStatusResponse>;
  
}

export interface ClientStatusDiscoveryServiceDefinition extends grpc.ServiceDefinition {
  FetchClientStatus: MethodDefinition<_envoy_service_status_v3_ClientStatusRequest, _envoy_service_status_v3_ClientStatusResponse, _envoy_service_status_v3_ClientStatusRequest__Output, _envoy_service_status_v3_ClientStatusResponse__Output>
  StreamClientStatus: MethodDefinition<_envoy_service_status_v3_ClientStatusRequest, _envoy_service_status_v3_ClientStatusResponse, _envoy_service_status_v3_ClientStatusRequest__Output, _envoy_service_status_v3_ClientStatusResponse__Output>
}
