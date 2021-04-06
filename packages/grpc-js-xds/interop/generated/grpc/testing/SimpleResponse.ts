// Original file: proto/grpc/testing/messages.proto

import type { Payload as _grpc_testing_Payload, Payload__Output as _grpc_testing_Payload__Output } from '../../grpc/testing/Payload';
import type { GrpclbRouteType as _grpc_testing_GrpclbRouteType } from '../../grpc/testing/GrpclbRouteType';

/**
 * Unary response, as configured by the request.
 */
export interface SimpleResponse {
  /**
   * Payload to increase message size.
   */
  'payload'?: (_grpc_testing_Payload);
  /**
   * The user the request came from, for verifying authentication was
   * successful when the client expected it.
   */
  'username'?: (string);
  /**
   * OAuth scope.
   */
  'oauth_scope'?: (string);
  /**
   * Server ID. This must be unique among different server instances,
   * but the same across all RPC's made to a particular server instance.
   */
  'server_id'?: (string);
  /**
   * gRPCLB Path.
   */
  'grpclb_route_type'?: (_grpc_testing_GrpclbRouteType | keyof typeof _grpc_testing_GrpclbRouteType);
  /**
   * Server hostname.
   */
  'hostname'?: (string);
}

/**
 * Unary response, as configured by the request.
 */
export interface SimpleResponse__Output {
  /**
   * Payload to increase message size.
   */
  'payload'?: (_grpc_testing_Payload__Output);
  /**
   * The user the request came from, for verifying authentication was
   * successful when the client expected it.
   */
  'username': (string);
  /**
   * OAuth scope.
   */
  'oauth_scope': (string);
  /**
   * Server ID. This must be unique among different server instances,
   * but the same across all RPC's made to a particular server instance.
   */
  'server_id': (string);
  /**
   * gRPCLB Path.
   */
  'grpclb_route_type': (keyof typeof _grpc_testing_GrpclbRouteType);
  /**
   * Server hostname.
   */
  'hostname': (string);
}
