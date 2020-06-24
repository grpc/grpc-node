// Original file: deps/envoy-api/envoy/api/v2/endpoint/endpoint_components.proto

import { Address as _envoy_api_v2_core_Address, Address__Output as _envoy_api_v2_core_Address__Output } from '../../../../envoy/api/v2/core/Address';

export interface _envoy_api_v2_endpoint_Endpoint_HealthCheckConfig {
  'port_value'?: (number);
  'hostname'?: (string);
}

export interface _envoy_api_v2_endpoint_Endpoint_HealthCheckConfig__Output {
  'port_value': (number);
  'hostname': (string);
}

export interface Endpoint {
  'address'?: (_envoy_api_v2_core_Address);
  'health_check_config'?: (_envoy_api_v2_endpoint_Endpoint_HealthCheckConfig);
  'hostname'?: (string);
}

export interface Endpoint__Output {
  'address': (_envoy_api_v2_core_Address__Output);
  'health_check_config': (_envoy_api_v2_endpoint_Endpoint_HealthCheckConfig__Output);
  'hostname': (string);
}
