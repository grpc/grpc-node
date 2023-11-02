// Original file: proto/grpc/reflection/v1alpha/reflection.proto


/**
 * Serialized FileDescriptorProto messages sent by the server answering
 * a file_by_filename, file_containing_symbol, or file_containing_extension
 * request.
 */
export interface FileDescriptorResponse {
  /**
   * Serialized FileDescriptorProto messages. We avoid taking a dependency on
   * descriptor.proto, which uses proto2 only features, by making them opaque
   * bytes instead.
   */
  'fileDescriptorProto'?: (Buffer | Uint8Array | string)[];
}

/**
 * Serialized FileDescriptorProto messages sent by the server answering
 * a file_by_filename, file_containing_symbol, or file_containing_extension
 * request.
 */
export interface FileDescriptorResponse__Output {
  /**
   * Serialized FileDescriptorProto messages. We avoid taking a dependency on
   * descriptor.proto, which uses proto2 only features, by making them opaque
   * bytes instead.
   */
  'fileDescriptorProto': (Uint8Array)[];
}
