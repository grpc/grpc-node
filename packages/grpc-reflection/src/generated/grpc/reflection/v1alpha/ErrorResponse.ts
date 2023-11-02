// Original file: proto/grpc/reflection/v1alpha/reflection.proto


/**
 * The error code and error message sent by the server when an error occurs.
 */
export interface ErrorResponse {
  /**
   * This field uses the error codes defined in grpc::StatusCode.
   */
  'errorCode'?: (number);
  'errorMessage'?: (string);
}

/**
 * The error code and error message sent by the server when an error occurs.
 */
export interface ErrorResponse__Output {
  /**
   * This field uses the error codes defined in grpc::StatusCode.
   */
  'errorCode': (number);
  'errorMessage': (string);
}
