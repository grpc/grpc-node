// Original file: deps/envoy-api/envoy/api/v2/route/route_components.proto

import { DataSource as _envoy_api_v2_core_DataSource, DataSource__Output as _envoy_api_v2_core_DataSource__Output } from '../../../../envoy/api/v2/core/DataSource';

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
   * Headers can be specified using *response_headers_to_add* in the enclosing
   * :ref:`envoy_api_msg_route.Route`, :ref:`envoy_api_msg_RouteConfiguration` or
   * :ref:`envoy_api_msg_route.VirtualHost`.
   */
  'body'?: (_envoy_api_v2_core_DataSource);
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
   * Headers can be specified using *response_headers_to_add* in the enclosing
   * :ref:`envoy_api_msg_route.Route`, :ref:`envoy_api_msg_RouteConfiguration` or
   * :ref:`envoy_api_msg_route.VirtualHost`.
   */
  'body'?: (_envoy_api_v2_core_DataSource__Output);
}
