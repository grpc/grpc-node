// Original file: deps/envoy-api/envoy/api/v2/route/route_components.proto

import { FractionalPercent as _envoy_type_FractionalPercent, FractionalPercent__Output as _envoy_type_FractionalPercent__Output } from '../../../../envoy/type/FractionalPercent';
import { CustomTag as _envoy_type_tracing_v2_CustomTag, CustomTag__Output as _envoy_type_tracing_v2_CustomTag__Output } from '../../../../envoy/type/tracing/v2/CustomTag';

export interface Tracing {
  /**
   * Target percentage of requests managed by this HTTP connection manager that will be force
   * traced if the :ref:`x-client-trace-id <config_http_conn_man_headers_x-client-trace-id>`
   * header is set. This field is a direct analog for the runtime variable
   * 'tracing.client_sampling' in the :ref:`HTTP Connection Manager
   * <config_http_conn_man_runtime>`.
   * Default: 100%
   */
  'client_sampling'?: (_envoy_type_FractionalPercent);
  /**
   * Target percentage of requests managed by this HTTP connection manager that will be randomly
   * selected for trace generation, if not requested by the client or not forced. This field is
   * a direct analog for the runtime variable 'tracing.random_sampling' in the
   * :ref:`HTTP Connection Manager <config_http_conn_man_runtime>`.
   * Default: 100%
   */
  'random_sampling'?: (_envoy_type_FractionalPercent);
  /**
   * Target percentage of requests managed by this HTTP connection manager that will be traced
   * after all other sampling checks have been applied (client-directed, force tracing, random
   * sampling). This field functions as an upper limit on the total configured sampling rate. For
   * instance, setting client_sampling to 100% but overall_sampling to 1% will result in only 1%
   * of client requests with the appropriate headers to be force traced. This field is a direct
   * analog for the runtime variable 'tracing.global_enabled' in the
   * :ref:`HTTP Connection Manager <config_http_conn_man_runtime>`.
   * Default: 100%
   */
  'overall_sampling'?: (_envoy_type_FractionalPercent);
  /**
   * A list of custom tags with unique tag name to create tags for the active span.
   * It will take effect after merging with the :ref:`corresponding configuration
   * <envoy_api_field_config.filter.network.http_connection_manager.v2.HttpConnectionManager.Tracing.custom_tags>`
   * configured in the HTTP connection manager. If two tags with the same name are configured
   * each in the HTTP connection manager and the route level, the one configured here takes
   * priority.
   */
  'custom_tags'?: (_envoy_type_tracing_v2_CustomTag)[];
}

export interface Tracing__Output {
  /**
   * Target percentage of requests managed by this HTTP connection manager that will be force
   * traced if the :ref:`x-client-trace-id <config_http_conn_man_headers_x-client-trace-id>`
   * header is set. This field is a direct analog for the runtime variable
   * 'tracing.client_sampling' in the :ref:`HTTP Connection Manager
   * <config_http_conn_man_runtime>`.
   * Default: 100%
   */
  'client_sampling'?: (_envoy_type_FractionalPercent__Output);
  /**
   * Target percentage of requests managed by this HTTP connection manager that will be randomly
   * selected for trace generation, if not requested by the client or not forced. This field is
   * a direct analog for the runtime variable 'tracing.random_sampling' in the
   * :ref:`HTTP Connection Manager <config_http_conn_man_runtime>`.
   * Default: 100%
   */
  'random_sampling'?: (_envoy_type_FractionalPercent__Output);
  /**
   * Target percentage of requests managed by this HTTP connection manager that will be traced
   * after all other sampling checks have been applied (client-directed, force tracing, random
   * sampling). This field functions as an upper limit on the total configured sampling rate. For
   * instance, setting client_sampling to 100% but overall_sampling to 1% will result in only 1%
   * of client requests with the appropriate headers to be force traced. This field is a direct
   * analog for the runtime variable 'tracing.global_enabled' in the
   * :ref:`HTTP Connection Manager <config_http_conn_man_runtime>`.
   * Default: 100%
   */
  'overall_sampling'?: (_envoy_type_FractionalPercent__Output);
  /**
   * A list of custom tags with unique tag name to create tags for the active span.
   * It will take effect after merging with the :ref:`corresponding configuration
   * <envoy_api_field_config.filter.network.http_connection_manager.v2.HttpConnectionManager.Tracing.custom_tags>`
   * configured in the HTTP connection manager. If two tags with the same name are configured
   * each in the HTTP connection manager and the route level, the one configured here takes
   * priority.
   */
  'custom_tags': (_envoy_type_tracing_v2_CustomTag__Output)[];
}
