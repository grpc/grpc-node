// Original file: proto/grpc/testing/echo_messages.proto


/**
 * Error status client expects to see.
 */
export interface ErrorStatus {
  'code'?: (number);
  'error_message'?: (string);
  'binary_error_details'?: (string);
}

/**
 * Error status client expects to see.
 */
export interface ErrorStatus__Output {
  'code': (number);
  'error_message': (string);
  'binary_error_details': (string);
}
