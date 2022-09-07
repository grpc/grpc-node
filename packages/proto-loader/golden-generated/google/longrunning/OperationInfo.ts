// Original file: deps/googleapis/google/longrunning/operations.proto


/**
 * A message representing the message types used by a long-running operation.
 * 
 * Example:
 * 
 * rpc LongRunningRecognize(LongRunningRecognizeRequest)
 * returns (google.longrunning.Operation) {
 * option (google.longrunning.operation_info) = {
 * response_type: "LongRunningRecognizeResponse"
 * metadata_type: "LongRunningRecognizeMetadata"
 * };
 * }
 */
export interface IOperationInfo {
  /**
   * Required. The message name of the primary return type for this
   * long-running operation.
   * This type will be used to deserialize the LRO's response.
   * 
   * If the response is in a different package from the rpc, a fully-qualified
   * message name must be used (e.g. `google.protobuf.Struct`).
   * 
   * Note: Altering this value constitutes a breaking change.
   */
  'response_type'?: (string);
  /**
   * Required. The message name of the metadata type for this long-running
   * operation.
   * 
   * If the response is in a different package from the rpc, a fully-qualified
   * message name must be used (e.g. `google.protobuf.Struct`).
   * 
   * Note: Altering this value constitutes a breaking change.
   */
  'metadata_type'?: (string);
}

/**
 * A message representing the message types used by a long-running operation.
 * 
 * Example:
 * 
 * rpc LongRunningRecognize(LongRunningRecognizeRequest)
 * returns (google.longrunning.Operation) {
 * option (google.longrunning.operation_info) = {
 * response_type: "LongRunningRecognizeResponse"
 * metadata_type: "LongRunningRecognizeMetadata"
 * };
 * }
 */
export interface OOperationInfo {
  /**
   * Required. The message name of the primary return type for this
   * long-running operation.
   * This type will be used to deserialize the LRO's response.
   * 
   * If the response is in a different package from the rpc, a fully-qualified
   * message name must be used (e.g. `google.protobuf.Struct`).
   * 
   * Note: Altering this value constitutes a breaking change.
   */
  'response_type': (string);
  /**
   * Required. The message name of the metadata type for this long-running
   * operation.
   * 
   * If the response is in a different package from the rpc, a fully-qualified
   * message name must be used (e.g. `google.protobuf.Struct`).
   * 
   * Note: Altering this value constitutes a breaking change.
   */
  'metadata_type': (string);
}
