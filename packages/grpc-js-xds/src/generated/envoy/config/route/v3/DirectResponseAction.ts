// Original file: deps/envoy-api/envoy/config/route/v3/route_components.proto

import type { DataSource as _envoy_config_core_v3_DataSource, DataSource__Output as _envoy_config_core_v3_DataSource__Output } from '../../../../envoy/config/core/v3/DataSource';

export interface DirectResponseAction {
  /**
   * Specifies the HTTP response status to be returned.
   */
  'status'?: (number);
  /**
   * Specifies the content of the response body. If this setting is omitted,
   * no body is included in the generated response.
   * 
   * .. note::
   * 
   * Headers can be specified using ``response_headers_to_add`` in the enclosing
   * :ref:`envoy_v3_api_msg_config.route.v3.Route`, :ref:`envoy_v3_api_msg_config.route.v3.RouteConfiguration` or
   * :ref:`envoy_v3_api_msg_config.route.v3.VirtualHost`.
   */
  'body'?: (_envoy_config_core_v3_DataSource | null);
}

export interface DirectResponseAction__Output {
  /**
   * Specifies the HTTP response status to be returned.
   */
  'status': (number);
  /**
   * Specifies the content of the response body. If this setting is omitted,
   * no body is included in the generated response.
   * 
   * .. note::
   * 
   * Headers can be specified using ``response_headers_to_add`` in the enclosing
   * :ref:`envoy_v3_api_msg_config.route.v3.Route`, :ref:`envoy_v3_api_msg_config.route.v3.RouteConfiguration` or
   * :ref:`envoy_v3_api_msg_config.route.v3.VirtualHost`.
   */
  'body': (_envoy_config_core_v3_DataSource__Output | null);
}
