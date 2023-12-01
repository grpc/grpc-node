// Original file: proto/grpc/reflection/v1alpha/reflection.proto

import type { ServerReflectionRequest as _grpc_reflection_v1alpha_ServerReflectionRequest, ServerReflectionRequest__Output as _grpc_reflection_v1alpha_ServerReflectionRequest__Output } from '../../../grpc/reflection/v1alpha/ServerReflectionRequest';
import type { FileDescriptorResponse as _grpc_reflection_v1alpha_FileDescriptorResponse, FileDescriptorResponse__Output as _grpc_reflection_v1alpha_FileDescriptorResponse__Output } from '../../../grpc/reflection/v1alpha/FileDescriptorResponse';
import type { ExtensionNumberResponse as _grpc_reflection_v1alpha_ExtensionNumberResponse, ExtensionNumberResponse__Output as _grpc_reflection_v1alpha_ExtensionNumberResponse__Output } from '../../../grpc/reflection/v1alpha/ExtensionNumberResponse';
import type { ListServiceResponse as _grpc_reflection_v1alpha_ListServiceResponse, ListServiceResponse__Output as _grpc_reflection_v1alpha_ListServiceResponse__Output } from '../../../grpc/reflection/v1alpha/ListServiceResponse';
import type { ErrorResponse as _grpc_reflection_v1alpha_ErrorResponse, ErrorResponse__Output as _grpc_reflection_v1alpha_ErrorResponse__Output } from '../../../grpc/reflection/v1alpha/ErrorResponse';

/**
 * The message sent by the server to answer ServerReflectionInfo method.
 */
export interface ServerReflectionResponse {
  'validHost'?: (string);
  'originalRequest'?: (_grpc_reflection_v1alpha_ServerReflectionRequest | null);
  /**
   * This message is used to answer file_by_filename, file_containing_symbol,
   * file_containing_extension requests with transitive dependencies. As
   * the repeated label is not allowed in oneof fields, we use a
   * FileDescriptorResponse message to encapsulate the repeated fields.
   * The reflection service is allowed to avoid sending FileDescriptorProtos
   * that were previously sent in response to earlier requests in the stream.
   */
  'fileDescriptorResponse'?: (_grpc_reflection_v1alpha_FileDescriptorResponse | null);
  /**
   * This message is used to answer all_extension_numbers_of_type requst.
   */
  'allExtensionNumbersResponse'?: (_grpc_reflection_v1alpha_ExtensionNumberResponse | null);
  /**
   * This message is used to answer list_services request.
   */
  'listServicesResponse'?: (_grpc_reflection_v1alpha_ListServiceResponse | null);
  /**
   * This message is used when an error occurs.
   */
  'errorResponse'?: (_grpc_reflection_v1alpha_ErrorResponse | null);
  /**
   * The server set one of the following fields accroding to the message_request
   * in the request.
   */
  'messageResponse'?: "fileDescriptorResponse"|"allExtensionNumbersResponse"|"listServicesResponse"|"errorResponse";
}

/**
 * The message sent by the server to answer ServerReflectionInfo method.
 */
export interface ServerReflectionResponse__Output {
  'validHost': (string);
  'originalRequest': (_grpc_reflection_v1alpha_ServerReflectionRequest__Output | null);
  /**
   * This message is used to answer file_by_filename, file_containing_symbol,
   * file_containing_extension requests with transitive dependencies. As
   * the repeated label is not allowed in oneof fields, we use a
   * FileDescriptorResponse message to encapsulate the repeated fields.
   * The reflection service is allowed to avoid sending FileDescriptorProtos
   * that were previously sent in response to earlier requests in the stream.
   */
  'fileDescriptorResponse'?: (_grpc_reflection_v1alpha_FileDescriptorResponse__Output | null);
  /**
   * This message is used to answer all_extension_numbers_of_type requst.
   */
  'allExtensionNumbersResponse'?: (_grpc_reflection_v1alpha_ExtensionNumberResponse__Output | null);
  /**
   * This message is used to answer list_services request.
   */
  'listServicesResponse'?: (_grpc_reflection_v1alpha_ListServiceResponse__Output | null);
  /**
   * This message is used when an error occurs.
   */
  'errorResponse'?: (_grpc_reflection_v1alpha_ErrorResponse__Output | null);
  /**
   * The server set one of the following fields accroding to the message_request
   * in the request.
   */
  'messageResponse': "fileDescriptorResponse"|"allExtensionNumbersResponse"|"listServicesResponse"|"errorResponse";
}
