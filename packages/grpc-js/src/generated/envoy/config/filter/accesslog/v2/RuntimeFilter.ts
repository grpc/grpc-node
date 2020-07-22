// Original file: deps/envoy-api/envoy/config/filter/accesslog/v2/accesslog.proto

import { FractionalPercent as _envoy_type_FractionalPercent, FractionalPercent__Output as _envoy_type_FractionalPercent__Output } from '../../../../../envoy/type/FractionalPercent';

/**
 * Filters for random sampling of requests.
 */
export interface RuntimeFilter {
  /**
   * Runtime key to get an optional overridden numerator for use in the *percent_sampled* field.
   * If found in runtime, this value will replace the default numerator.
   */
  'runtime_key'?: (string);
  /**
   * The default sampling percentage. If not specified, defaults to 0% with denominator of 100.
   */
  'percent_sampled'?: (_envoy_type_FractionalPercent);
  /**
   * By default, sampling pivots on the header
   * :ref:`x-request-id<config_http_conn_man_headers_x-request-id>` being present. If
   * :ref:`x-request-id<config_http_conn_man_headers_x-request-id>` is present, the filter will
   * consistently sample across multiple hosts based on the runtime key value and the value
   * extracted from :ref:`x-request-id<config_http_conn_man_headers_x-request-id>`. If it is
   * missing, or *use_independent_randomness* is set to true, the filter will randomly sample based
   * on the runtime key value alone. *use_independent_randomness* can be used for logging kill
   * switches within complex nested :ref:`AndFilter
   * <envoy_api_msg_config.filter.accesslog.v2.AndFilter>` and :ref:`OrFilter
   * <envoy_api_msg_config.filter.accesslog.v2.OrFilter>` blocks that are easier to reason about
   * from a probability perspective (i.e., setting to true will cause the filter to behave like
   * an independent random variable when composed within logical operator filters).
   */
  'use_independent_randomness'?: (boolean);
}

/**
 * Filters for random sampling of requests.
 */
export interface RuntimeFilter__Output {
  /**
   * Runtime key to get an optional overridden numerator for use in the *percent_sampled* field.
   * If found in runtime, this value will replace the default numerator.
   */
  'runtime_key': (string);
  /**
   * The default sampling percentage. If not specified, defaults to 0% with denominator of 100.
   */
  'percent_sampled'?: (_envoy_type_FractionalPercent__Output);
  /**
   * By default, sampling pivots on the header
   * :ref:`x-request-id<config_http_conn_man_headers_x-request-id>` being present. If
   * :ref:`x-request-id<config_http_conn_man_headers_x-request-id>` is present, the filter will
   * consistently sample across multiple hosts based on the runtime key value and the value
   * extracted from :ref:`x-request-id<config_http_conn_man_headers_x-request-id>`. If it is
   * missing, or *use_independent_randomness* is set to true, the filter will randomly sample based
   * on the runtime key value alone. *use_independent_randomness* can be used for logging kill
   * switches within complex nested :ref:`AndFilter
   * <envoy_api_msg_config.filter.accesslog.v2.AndFilter>` and :ref:`OrFilter
   * <envoy_api_msg_config.filter.accesslog.v2.OrFilter>` blocks that are easier to reason about
   * from a probability perspective (i.e., setting to true will cause the filter to behave like
   * an independent random variable when composed within logical operator filters).
   */
  'use_independent_randomness': (boolean);
}
