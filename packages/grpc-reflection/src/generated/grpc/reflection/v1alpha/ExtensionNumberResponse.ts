// Original file: proto/grpc/reflection/v1alpha/reflection.proto


/**
 * A list of extension numbers sent by the server answering
 * all_extension_numbers_of_type request.
 */
export interface ExtensionNumberResponse {
  /**
   * Full name of the base type, including the package name. The format
   * is <package>.<type>
   */
  'baseTypeName'?: (string);
  'extensionNumber'?: (number)[];
}

/**
 * A list of extension numbers sent by the server answering
 * all_extension_numbers_of_type request.
 */
export interface ExtensionNumberResponse__Output {
  /**
   * Full name of the base type, including the package name. The format
   * is <package>.<type>
   */
  'baseTypeName': (string);
  'extensionNumber': (number)[];
}
