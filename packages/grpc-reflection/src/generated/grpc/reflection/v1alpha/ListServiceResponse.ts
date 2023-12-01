// Original file: proto/grpc/reflection/v1alpha/reflection.proto

import type { ServiceResponse as _grpc_reflection_v1alpha_ServiceResponse, ServiceResponse__Output as _grpc_reflection_v1alpha_ServiceResponse__Output } from '../../../grpc/reflection/v1alpha/ServiceResponse';

/**
 * A list of ServiceResponse sent by the server answering list_services request.
 */
export interface ListServiceResponse {
  /**
   * The information of each service may be expanded in the future, so we use
   * ServiceResponse message to encapsulate it.
   */
  'service'?: (_grpc_reflection_v1alpha_ServiceResponse)[];
}

/**
 * A list of ServiceResponse sent by the server answering list_services request.
 */
export interface ListServiceResponse__Output {
  /**
   * The information of each service may be expanded in the future, so we use
   * ServiceResponse message to encapsulate it.
   */
  'service': (_grpc_reflection_v1alpha_ServiceResponse__Output)[];
}
