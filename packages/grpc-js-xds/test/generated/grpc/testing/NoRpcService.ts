// Original file: proto/grpc/testing/echo.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'

/**
 * A service without any rpc defined to test coverage.
 */
export interface NoRpcServiceClient extends grpc.Client {
}

/**
 * A service without any rpc defined to test coverage.
 */
export interface NoRpcServiceHandlers extends grpc.UntypedServiceImplementation {
}

export interface NoRpcServiceDefinition extends grpc.ServiceDefinition {
}
