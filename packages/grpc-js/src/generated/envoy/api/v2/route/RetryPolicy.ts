// Original file: deps/envoy-api/envoy/api/v2/route/route_components.proto

import { UInt32Value as _google_protobuf_UInt32Value, UInt32Value__Output as _google_protobuf_UInt32Value__Output } from '../../../../google/protobuf/UInt32Value';
import { Duration as _google_protobuf_Duration, Duration__Output as _google_protobuf_Duration__Output } from '../../../../google/protobuf/Duration';
import { HeaderMatcher as _envoy_api_v2_route_HeaderMatcher, HeaderMatcher__Output as _envoy_api_v2_route_HeaderMatcher__Output } from '../../../../envoy/api/v2/route/HeaderMatcher';
import { Struct as _google_protobuf_Struct, Struct__Output as _google_protobuf_Struct__Output } from '../../../../google/protobuf/Struct';
import { Any as _google_protobuf_Any, Any__Output as _google_protobuf_Any__Output } from '../../../../google/protobuf/Any';
import { Long } from '@grpc/proto-loader';

export interface _envoy_api_v2_route_RetryPolicy_RetryBackOff {
  /**
   * Specifies the base interval between retries. This parameter is required and must be greater
   * than zero. Values less than 1 ms are rounded up to 1 ms.
   * See :ref:`config_http_filters_router_x-envoy-max-retries` for a discussion of Envoy's
   * back-off algorithm.
   */
  'base_interval'?: (_google_protobuf_Duration);
  /**
   * Specifies the maximum interval between retries. This parameter is optional, but must be
   * greater than or equal to the `base_interval` if set. The default is 10 times the
   * `base_interval`. See :ref:`config_http_filters_router_x-envoy-max-retries` for a discussion
   * of Envoy's back-off algorithm.
   */
  'max_interval'?: (_google_protobuf_Duration);
}

export interface _envoy_api_v2_route_RetryPolicy_RetryBackOff__Output {
  /**
   * Specifies the base interval between retries. This parameter is required and must be greater
   * than zero. Values less than 1 ms are rounded up to 1 ms.
   * See :ref:`config_http_filters_router_x-envoy-max-retries` for a discussion of Envoy's
   * back-off algorithm.
   */
  'base_interval'?: (_google_protobuf_Duration__Output);
  /**
   * Specifies the maximum interval between retries. This parameter is optional, but must be
   * greater than or equal to the `base_interval` if set. The default is 10 times the
   * `base_interval`. See :ref:`config_http_filters_router_x-envoy-max-retries` for a discussion
   * of Envoy's back-off algorithm.
   */
  'max_interval'?: (_google_protobuf_Duration__Output);
}

export interface _envoy_api_v2_route_RetryPolicy_RetryHostPredicate {
  'name'?: (string);
  'config'?: (_google_protobuf_Struct);
  'typed_config'?: (_google_protobuf_Any);
  'config_type'?: "config"|"typed_config";
}

export interface _envoy_api_v2_route_RetryPolicy_RetryHostPredicate__Output {
  'name': (string);
  'config'?: (_google_protobuf_Struct__Output);
  'typed_config'?: (_google_protobuf_Any__Output);
  'config_type': "config"|"typed_config";
}

export interface _envoy_api_v2_route_RetryPolicy_RetryPriority {
  'name'?: (string);
  'config'?: (_google_protobuf_Struct);
  'typed_config'?: (_google_protobuf_Any);
  'config_type'?: "config"|"typed_config";
}

export interface _envoy_api_v2_route_RetryPolicy_RetryPriority__Output {
  'name': (string);
  'config'?: (_google_protobuf_Struct__Output);
  'typed_config'?: (_google_protobuf_Any__Output);
  'config_type': "config"|"typed_config";
}

/**
 * HTTP retry :ref:`architecture overview <arch_overview_http_routing_retry>`.
 * [#next-free-field: 11]
 */
export interface RetryPolicy {
  /**
   * Specifies the conditions under which retry takes place. These are the same
   * conditions documented for :ref:`config_http_filters_router_x-envoy-retry-on` and
   * :ref:`config_http_filters_router_x-envoy-retry-grpc-on`.
   */
  'retry_on'?: (string);
  /**
   * Specifies the allowed number of retries. This parameter is optional and
   * defaults to 1. These are the same conditions documented for
   * :ref:`config_http_filters_router_x-envoy-max-retries`.
   */
  'num_retries'?: (_google_protobuf_UInt32Value);
  /**
   * Specifies a non-zero upstream timeout per retry attempt. This parameter is optional. The
   * same conditions documented for
   * :ref:`config_http_filters_router_x-envoy-upstream-rq-per-try-timeout-ms` apply.
   * 
   * .. note::
   * 
   * If left unspecified, Envoy will use the global
   * :ref:`route timeout <envoy_api_field_route.RouteAction.timeout>` for the request.
   * Consequently, when using a :ref:`5xx <config_http_filters_router_x-envoy-retry-on>` based
   * retry policy, a request that times out will not be retried as the total timeout budget
   * would have been exhausted.
   */
  'per_try_timeout'?: (_google_protobuf_Duration);
  /**
   * Specifies an implementation of a RetryPriority which is used to determine the
   * distribution of load across priorities used for retries. Refer to
   * :ref:`retry plugin configuration <arch_overview_http_retry_plugins>` for more details.
   */
  'retry_priority'?: (_envoy_api_v2_route_RetryPolicy_RetryPriority);
  /**
   * Specifies a collection of RetryHostPredicates that will be consulted when selecting a host
   * for retries. If any of the predicates reject the host, host selection will be reattempted.
   * Refer to :ref:`retry plugin configuration <arch_overview_http_retry_plugins>` for more
   * details.
   */
  'retry_host_predicate'?: (_envoy_api_v2_route_RetryPolicy_RetryHostPredicate)[];
  /**
   * The maximum number of times host selection will be reattempted before giving up, at which
   * point the host that was last selected will be routed to. If unspecified, this will default to
   * retrying once.
   */
  'host_selection_retry_max_attempts'?: (number | string | Long);
  /**
   * HTTP status codes that should trigger a retry in addition to those specified by retry_on.
   */
  'retriable_status_codes'?: (number)[];
  /**
   * Specifies parameters that control retry back off. This parameter is optional, in which case the
   * default base interval is 25 milliseconds or, if set, the current value of the
   * `upstream.base_retry_backoff_ms` runtime parameter. The default maximum interval is 10 times
   * the base interval. The documentation for :ref:`config_http_filters_router_x-envoy-max-retries`
   * describes Envoy's back-off algorithm.
   */
  'retry_back_off'?: (_envoy_api_v2_route_RetryPolicy_RetryBackOff);
  /**
   * HTTP response headers that trigger a retry if present in the response. A retry will be
   * triggered if any of the header matches match the upstream response headers.
   * The field is only consulted if 'retriable-headers' retry policy is active.
   */
  'retriable_headers'?: (_envoy_api_v2_route_HeaderMatcher)[];
  /**
   * HTTP headers which must be present in the request for retries to be attempted.
   */
  'retriable_request_headers'?: (_envoy_api_v2_route_HeaderMatcher)[];
}

/**
 * HTTP retry :ref:`architecture overview <arch_overview_http_routing_retry>`.
 * [#next-free-field: 11]
 */
export interface RetryPolicy__Output {
  /**
   * Specifies the conditions under which retry takes place. These are the same
   * conditions documented for :ref:`config_http_filters_router_x-envoy-retry-on` and
   * :ref:`config_http_filters_router_x-envoy-retry-grpc-on`.
   */
  'retry_on': (string);
  /**
   * Specifies the allowed number of retries. This parameter is optional and
   * defaults to 1. These are the same conditions documented for
   * :ref:`config_http_filters_router_x-envoy-max-retries`.
   */
  'num_retries'?: (_google_protobuf_UInt32Value__Output);
  /**
   * Specifies a non-zero upstream timeout per retry attempt. This parameter is optional. The
   * same conditions documented for
   * :ref:`config_http_filters_router_x-envoy-upstream-rq-per-try-timeout-ms` apply.
   * 
   * .. note::
   * 
   * If left unspecified, Envoy will use the global
   * :ref:`route timeout <envoy_api_field_route.RouteAction.timeout>` for the request.
   * Consequently, when using a :ref:`5xx <config_http_filters_router_x-envoy-retry-on>` based
   * retry policy, a request that times out will not be retried as the total timeout budget
   * would have been exhausted.
   */
  'per_try_timeout'?: (_google_protobuf_Duration__Output);
  /**
   * Specifies an implementation of a RetryPriority which is used to determine the
   * distribution of load across priorities used for retries. Refer to
   * :ref:`retry plugin configuration <arch_overview_http_retry_plugins>` for more details.
   */
  'retry_priority'?: (_envoy_api_v2_route_RetryPolicy_RetryPriority__Output);
  /**
   * Specifies a collection of RetryHostPredicates that will be consulted when selecting a host
   * for retries. If any of the predicates reject the host, host selection will be reattempted.
   * Refer to :ref:`retry plugin configuration <arch_overview_http_retry_plugins>` for more
   * details.
   */
  'retry_host_predicate': (_envoy_api_v2_route_RetryPolicy_RetryHostPredicate__Output)[];
  /**
   * The maximum number of times host selection will be reattempted before giving up, at which
   * point the host that was last selected will be routed to. If unspecified, this will default to
   * retrying once.
   */
  'host_selection_retry_max_attempts': (string);
  /**
   * HTTP status codes that should trigger a retry in addition to those specified by retry_on.
   */
  'retriable_status_codes': (number)[];
  /**
   * Specifies parameters that control retry back off. This parameter is optional, in which case the
   * default base interval is 25 milliseconds or, if set, the current value of the
   * `upstream.base_retry_backoff_ms` runtime parameter. The default maximum interval is 10 times
   * the base interval. The documentation for :ref:`config_http_filters_router_x-envoy-max-retries`
   * describes Envoy's back-off algorithm.
   */
  'retry_back_off'?: (_envoy_api_v2_route_RetryPolicy_RetryBackOff__Output);
  /**
   * HTTP response headers that trigger a retry if present in the response. A retry will be
   * triggered if any of the header matches match the upstream response headers.
   * The field is only consulted if 'retriable-headers' retry policy is active.
   */
  'retriable_headers': (_envoy_api_v2_route_HeaderMatcher__Output)[];
  /**
   * HTTP headers which must be present in the request for retries to be attempted.
   */
  'retriable_request_headers': (_envoy_api_v2_route_HeaderMatcher__Output)[];
}
