// Original file: proto/grpc/testing/messages.proto


/**
 * Metadata to be attached for the given type of RPCs.
 */
export interface _grpc_testing_ClientConfigureRequest_Metadata {
  'type'?: (_grpc_testing_ClientConfigureRequest_RpcType | keyof typeof _grpc_testing_ClientConfigureRequest_RpcType);
  'key'?: (string);
  'value'?: (string);
}

/**
 * Metadata to be attached for the given type of RPCs.
 */
export interface _grpc_testing_ClientConfigureRequest_Metadata__Output {
  'type': (keyof typeof _grpc_testing_ClientConfigureRequest_RpcType);
  'key': (string);
  'value': (string);
}

// Original file: proto/grpc/testing/messages.proto

/**
 * Type of RPCs to send.
 */
export enum _grpc_testing_ClientConfigureRequest_RpcType {
  EMPTY_CALL = 0,
  UNARY_CALL = 1,
}

/**
 * Configurations for a test client.
 */
export interface ClientConfigureRequest {
  /**
   * The types of RPCs the client sends.
   */
  'types'?: (_grpc_testing_ClientConfigureRequest_RpcType | keyof typeof _grpc_testing_ClientConfigureRequest_RpcType)[];
  /**
   * The collection of custom metadata to be attached to RPCs sent by the client.
   */
  'metadata'?: (_grpc_testing_ClientConfigureRequest_Metadata)[];
  /**
   * The deadline to use, in seconds, for all RPCs.  If unset or zero, the
   * client will use the default from the command-line.
   */
  'timeout_sec'?: (number);
}

/**
 * Configurations for a test client.
 */
export interface ClientConfigureRequest__Output {
  /**
   * The types of RPCs the client sends.
   */
  'types': (keyof typeof _grpc_testing_ClientConfigureRequest_RpcType)[];
  /**
   * The collection of custom metadata to be attached to RPCs sent by the client.
   */
  'metadata': (_grpc_testing_ClientConfigureRequest_Metadata__Output)[];
  /**
   * The deadline to use, in seconds, for all RPCs.  If unset or zero, the
   * client will use the default from the command-line.
   */
  'timeout_sec': (number);
}
