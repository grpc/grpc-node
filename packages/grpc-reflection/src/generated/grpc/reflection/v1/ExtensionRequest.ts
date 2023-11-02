// Original file: proto/grpc/reflection/v1/reflection.proto


/**
 * The type name and extension number sent by the client when requesting
 * file_containing_extension.
 */
export interface ExtensionRequest {
  /**
   * Fully-qualified type name. The format should be <package>.<type>
   */
  'containingType'?: (string);
  'extensionNumber'?: (number);
}

/**
 * The type name and extension number sent by the client when requesting
 * file_containing_extension.
 */
export interface ExtensionRequest__Output {
  /**
   * Fully-qualified type name. The format should be <package>.<type>
   */
  'containingType': (string);
  'extensionNumber': (number);
}
