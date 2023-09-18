// Original file: proto/health/v1/health.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { HealthCheckRequest as _grpc_health_v1_HealthCheckRequest, HealthCheckRequest__Output as _grpc_health_v1_HealthCheckRequest__Output } from '../../../grpc/health/v1/HealthCheckRequest';
import type { HealthCheckResponse as _grpc_health_v1_HealthCheckResponse, HealthCheckResponse__Output as _grpc_health_v1_HealthCheckResponse__Output } from '../../../grpc/health/v1/HealthCheckResponse';

/**
 * Health is gRPC's mechanism for checking whether a server is able to handle
 * RPCs. Its semantics are documented in
 * https://github.com/grpc/grpc/blob/master/doc/health-checking.md.
 */
export interface HealthClient extends grpc.Client {
  /**
   * Check gets the health of the specified service. If the requested service
   * is unknown, the call will fail with status NOT_FOUND. If the caller does
   * not specify a service name, the server should respond with its overall
   * health status.
   * 
   * Clients should set a deadline when calling Check, and can declare the
   * server unhealthy if they do not receive a timely response.
   * 
   * Check implementations should be idempotent and side effect free.
   */
  Check(argument: _grpc_health_v1_HealthCheckRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_grpc_health_v1_HealthCheckResponse__Output>): grpc.ClientUnaryCall;
  Check(argument: _grpc_health_v1_HealthCheckRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_grpc_health_v1_HealthCheckResponse__Output>): grpc.ClientUnaryCall;
  Check(argument: _grpc_health_v1_HealthCheckRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_grpc_health_v1_HealthCheckResponse__Output>): grpc.ClientUnaryCall;
  Check(argument: _grpc_health_v1_HealthCheckRequest, callback: grpc.requestCallback<_grpc_health_v1_HealthCheckResponse__Output>): grpc.ClientUnaryCall;
  /**
   * Check gets the health of the specified service. If the requested service
   * is unknown, the call will fail with status NOT_FOUND. If the caller does
   * not specify a service name, the server should respond with its overall
   * health status.
   * 
   * Clients should set a deadline when calling Check, and can declare the
   * server unhealthy if they do not receive a timely response.
   * 
   * Check implementations should be idempotent and side effect free.
   */
  check(argument: _grpc_health_v1_HealthCheckRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_grpc_health_v1_HealthCheckResponse__Output>): grpc.ClientUnaryCall;
  check(argument: _grpc_health_v1_HealthCheckRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_grpc_health_v1_HealthCheckResponse__Output>): grpc.ClientUnaryCall;
  check(argument: _grpc_health_v1_HealthCheckRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_grpc_health_v1_HealthCheckResponse__Output>): grpc.ClientUnaryCall;
  check(argument: _grpc_health_v1_HealthCheckRequest, callback: grpc.requestCallback<_grpc_health_v1_HealthCheckResponse__Output>): grpc.ClientUnaryCall;
  
  /**
   * Performs a watch for the serving status of the requested service.
   * The server will immediately send back a message indicating the current
   * serving status.  It will then subsequently send a new message whenever
   * the service's serving status changes.
   * 
   * If the requested service is unknown when the call is received, the
   * server will send a message setting the serving status to
   * SERVICE_UNKNOWN but will *not* terminate the call.  If at some
   * future point, the serving status of the service becomes known, the
   * server will send a new message with the service's serving status.
   * 
   * If the call terminates with status UNIMPLEMENTED, then clients
   * should assume this method is not supported and should not retry the
   * call.  If the call terminates with any other status (including OK),
   * clients should retry the call with appropriate exponential backoff.
   */
  Watch(argument: _grpc_health_v1_HealthCheckRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_grpc_health_v1_HealthCheckResponse__Output>;
  Watch(argument: _grpc_health_v1_HealthCheckRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_grpc_health_v1_HealthCheckResponse__Output>;
  /**
   * Performs a watch for the serving status of the requested service.
   * The server will immediately send back a message indicating the current
   * serving status.  It will then subsequently send a new message whenever
   * the service's serving status changes.
   * 
   * If the requested service is unknown when the call is received, the
   * server will send a message setting the serving status to
   * SERVICE_UNKNOWN but will *not* terminate the call.  If at some
   * future point, the serving status of the service becomes known, the
   * server will send a new message with the service's serving status.
   * 
   * If the call terminates with status UNIMPLEMENTED, then clients
   * should assume this method is not supported and should not retry the
   * call.  If the call terminates with any other status (including OK),
   * clients should retry the call with appropriate exponential backoff.
   */
  watch(argument: _grpc_health_v1_HealthCheckRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_grpc_health_v1_HealthCheckResponse__Output>;
  watch(argument: _grpc_health_v1_HealthCheckRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_grpc_health_v1_HealthCheckResponse__Output>;
  
}

/**
 * Health is gRPC's mechanism for checking whether a server is able to handle
 * RPCs. Its semantics are documented in
 * https://github.com/grpc/grpc/blob/master/doc/health-checking.md.
 */
export interface HealthHandlers extends grpc.UntypedServiceImplementation {
  /**
   * Check gets the health of the specified service. If the requested service
   * is unknown, the call will fail with status NOT_FOUND. If the caller does
   * not specify a service name, the server should respond with its overall
   * health status.
   * 
   * Clients should set a deadline when calling Check, and can declare the
   * server unhealthy if they do not receive a timely response.
   * 
   * Check implementations should be idempotent and side effect free.
   */
  Check: grpc.handleUnaryCall<_grpc_health_v1_HealthCheckRequest__Output, _grpc_health_v1_HealthCheckResponse>;
  
  /**
   * Performs a watch for the serving status of the requested service.
   * The server will immediately send back a message indicating the current
   * serving status.  It will then subsequently send a new message whenever
   * the service's serving status changes.
   * 
   * If the requested service is unknown when the call is received, the
   * server will send a message setting the serving status to
   * SERVICE_UNKNOWN but will *not* terminate the call.  If at some
   * future point, the serving status of the service becomes known, the
   * server will send a new message with the service's serving status.
   * 
   * If the call terminates with status UNIMPLEMENTED, then clients
   * should assume this method is not supported and should not retry the
   * call.  If the call terminates with any other status (including OK),
   * clients should retry the call with appropriate exponential backoff.
   */
  Watch: grpc.handleServerStreamingCall<_grpc_health_v1_HealthCheckRequest__Output, _grpc_health_v1_HealthCheckResponse>;
  
}

export interface HealthDefinition extends grpc.ServiceDefinition {
  Check: MethodDefinition<_grpc_health_v1_HealthCheckRequest, _grpc_health_v1_HealthCheckResponse, _grpc_health_v1_HealthCheckRequest__Output, _grpc_health_v1_HealthCheckResponse__Output>
  Watch: MethodDefinition<_grpc_health_v1_HealthCheckRequest, _grpc_health_v1_HealthCheckResponse, _grpc_health_v1_HealthCheckRequest__Output, _grpc_health_v1_HealthCheckResponse__Output>
}
