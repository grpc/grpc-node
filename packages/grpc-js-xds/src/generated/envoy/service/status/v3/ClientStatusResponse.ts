// Original file: deps/envoy-api/envoy/service/status/v3/csds.proto

import type { ClientConfig as _envoy_service_status_v3_ClientConfig, ClientConfig__Output as _envoy_service_status_v3_ClientConfig__Output } from '../../../../envoy/service/status/v3/ClientConfig';

export interface ClientStatusResponse {
  /**
   * Client configs for the clients specified in the ClientStatusRequest.
   */
  'config'?: (_envoy_service_status_v3_ClientConfig)[];
}

export interface ClientStatusResponse__Output {
  /**
   * Client configs for the clients specified in the ClientStatusRequest.
   */
  'config': (_envoy_service_status_v3_ClientConfig__Output)[];
}
