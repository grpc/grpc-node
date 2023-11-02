// Original file: proto/grpc/reflection/v1alpha/reflection.proto


/**
 * The information of a single service used by ListServiceResponse to answer
 * list_services request.
 */
export interface ServiceResponse {
  /**
   * Full name of a registered service, including its package name. The format
   * is <package>.<service>
   */
  'name'?: (string);
}

/**
 * The information of a single service used by ListServiceResponse to answer
 * list_services request.
 */
export interface ServiceResponse__Output {
  /**
   * Full name of a registered service, including its package name. The format
   * is <package>.<service>
   */
  'name': (string);
}
