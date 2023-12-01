// Original file: proto/grpc/reflection/v1alpha/reflection.proto

import type { ExtensionRequest as _grpc_reflection_v1alpha_ExtensionRequest, ExtensionRequest__Output as _grpc_reflection_v1alpha_ExtensionRequest__Output } from '../../../grpc/reflection/v1alpha/ExtensionRequest';

/**
 * The message sent by the client when calling ServerReflectionInfo method.
 */
export interface ServerReflectionRequest {
  'host'?: (string);
  /**
   * Find a proto file by the file name.
   */
  'fileByFilename'?: (string);
  /**
   * Find the proto file that declares the given fully-qualified symbol name.
   * This field should be a fully-qualified symbol name
   * (e.g. <package>.<service>[.<method>] or <package>.<type>).
   */
  'fileContainingSymbol'?: (string);
  /**
   * Find the proto file which defines an extension extending the given
   * message type with the given field number.
   */
  'fileContainingExtension'?: (_grpc_reflection_v1alpha_ExtensionRequest | null);
  /**
   * Finds the tag numbers used by all known extensions of the given message
   * type, and appends them to ExtensionNumberResponse in an undefined order.
   * Its corresponding method is best-effort: it's not guaranteed that the
   * reflection service will implement this method, and it's not guaranteed
   * that this method will provide all extensions. Returns
   * StatusCode::UNIMPLEMENTED if it's not implemented.
   * This field should be a fully-qualified type name. The format is
   * <package>.<type>
   */
  'allExtensionNumbersOfType'?: (string);
  /**
   * List the full names of registered services. The content will not be
   * checked.
   */
  'listServices'?: (string);
  /**
   * To use reflection service, the client should set one of the following
   * fields in message_request. The server distinguishes requests by their
   * defined field and then handles them using corresponding methods.
   */
  'messageRequest'?: "fileByFilename"|"fileContainingSymbol"|"fileContainingExtension"|"allExtensionNumbersOfType"|"listServices";
}

/**
 * The message sent by the client when calling ServerReflectionInfo method.
 */
export interface ServerReflectionRequest__Output {
  'host': (string);
  /**
   * Find a proto file by the file name.
   */
  'fileByFilename'?: (string);
  /**
   * Find the proto file that declares the given fully-qualified symbol name.
   * This field should be a fully-qualified symbol name
   * (e.g. <package>.<service>[.<method>] or <package>.<type>).
   */
  'fileContainingSymbol'?: (string);
  /**
   * Find the proto file which defines an extension extending the given
   * message type with the given field number.
   */
  'fileContainingExtension'?: (_grpc_reflection_v1alpha_ExtensionRequest__Output | null);
  /**
   * Finds the tag numbers used by all known extensions of the given message
   * type, and appends them to ExtensionNumberResponse in an undefined order.
   * Its corresponding method is best-effort: it's not guaranteed that the
   * reflection service will implement this method, and it's not guaranteed
   * that this method will provide all extensions. Returns
   * StatusCode::UNIMPLEMENTED if it's not implemented.
   * This field should be a fully-qualified type name. The format is
   * <package>.<type>
   */
  'allExtensionNumbersOfType'?: (string);
  /**
   * List the full names of registered services. The content will not be
   * checked.
   */
  'listServices'?: (string);
  /**
   * To use reflection service, the client should set one of the following
   * fields in message_request. The server distinguishes requests by their
   * defined field and then handles them using corresponding methods.
   */
  'messageRequest': "fileByFilename"|"fileContainingSymbol"|"fileContainingExtension"|"allExtensionNumbersOfType"|"listServices";
}
