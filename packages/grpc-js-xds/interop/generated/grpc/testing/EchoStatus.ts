// Original file: proto/grpc/testing/messages.proto


/**
 * A protobuf representation for grpc status. This is used by test
 * clients to specify a status that the server should attempt to return.
 */
export interface EchoStatus {
  'code'?: (number);
  'message'?: (string);
}

/**
 * A protobuf representation for grpc status. This is used by test
 * clients to specify a status that the server should attempt to return.
 */
export interface EchoStatus__Output {
  'code': (number);
  'message': (string);
}
