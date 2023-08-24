// Original file: deps/envoy-api/envoy/config/route/v3/route_components.proto

import type { UInt32Value as _google_protobuf_UInt32Value, UInt32Value__Output as _google_protobuf_UInt32Value__Output } from '../../../../google/protobuf/UInt32Value';
import type { Duration as _google_protobuf_Duration, Duration__Output as _google_protobuf_Duration__Output } from '../../../../google/protobuf/Duration';
import type { HeaderMatcher as _envoy_config_route_v3_HeaderMatcher, HeaderMatcher__Output as _envoy_config_route_v3_HeaderMatcher__Output } from '../../../../envoy/config/route/v3/HeaderMatcher';
import type { TypedExtensionConfig as _envoy_config_core_v3_TypedExtensionConfig, TypedExtensionConfig__Output as _envoy_config_core_v3_TypedExtensionConfig__Output } from '../../../../envoy/config/core/v3/TypedExtensionConfig';
import type { Any as _google_protobuf_Any, Any__Output as _google_protobuf_Any__Output } from '../../../../google/protobuf/Any';
import type { Long } from '@grpc/proto-loader';

/**
 * A retry back-off strategy that applies when the upstream server rate limits
 * the request.
 * 
 * Given this configuration:
 * 
 * .. code-block:: yaml
 * 
 * rate_limited_retry_back_off:
 * reset_headers:
 * - name: Retry-After
 * format: SECONDS
 * - name: X-RateLimit-Reset
 * format: UNIX_TIMESTAMP
 * max_interval: "300s"
 * 
 * The following algorithm will apply:
 * 
 * 1. If the response contains the header ``Retry-After`` its value must be on
 * the form ``120`` (an integer that represents the number of seconds to
 * wait before retrying). If so, this value is used as the back-off interval.
 * 2. Otherwise, if the response contains the header ``X-RateLimit-Reset`` its
 * value must be on the form ``1595320702`` (an integer that represents the
 * point in time at which to retry, as a Unix timestamp in seconds). If so,
 * the current time is subtracted from this value and the result is used as
 * the back-off interval.
 * 3. Otherwise, Envoy will use the default
 * :ref:`exponential back-off <envoy_v3_api_field_config.route.v3.RetryPolicy.retry_back_off>`
 * strategy.
 * 
 * No matter which format is used, if the resulting back-off interval exceeds
 * ``max_interval`` it is discarded and the next header in ``reset_headers``
 * is tried. If a request timeout is configured for the route it will further
 * limit how long the request will be allowed to run.
 * 
 * To prevent many clients retrying at the same point in time jitter is added
 * to the back-off interval, so the resulting interval is decided by taking:
 * ``random(interval, interval * 1.5)``.
 * 
 * .. attention::
 * 
 * Configuring ``rate_limited_retry_back_off`` will not by itself cause a request
 * to be retried. You will still need to configure the right retry policy to match
 * the responses from the upstream server.
 */
export interface _envoy_config_route_v3_RetryPolicy_RateLimitedRetryBackOff {
  /**
   * Specifies the reset headers (like ``Retry-After`` or ``X-RateLimit-Reset``)
   * to match against the response. Headers are tried in order, and matched case
   * insensitive. The first header to be parsed successfully is used. If no headers
   * match the default exponential back-off is used instead.
   */
  'reset_headers'?: (_envoy_config_route_v3_RetryPolicy_ResetHeader)[];
  /**
   * Specifies the maximum back off interval that Envoy will allow. If a reset
   * header contains an interval longer than this then it will be discarded and
   * the next header will be tried. Defaults to 300 seconds.
   */
  'max_interval'?: (_google_protobuf_Duration | null);
}

/**
 * A retry back-off strategy that applies when the upstream server rate limits
 * the request.
 * 
 * Given this configuration:
 * 
 * .. code-block:: yaml
 * 
 * rate_limited_retry_back_off:
 * reset_headers:
 * - name: Retry-After
 * format: SECONDS
 * - name: X-RateLimit-Reset
 * format: UNIX_TIMESTAMP
 * max_interval: "300s"
 * 
 * The following algorithm will apply:
 * 
 * 1. If the response contains the header ``Retry-After`` its value must be on
 * the form ``120`` (an integer that represents the number of seconds to
 * wait before retrying). If so, this value is used as the back-off interval.
 * 2. Otherwise, if the response contains the header ``X-RateLimit-Reset`` its
 * value must be on the form ``1595320702`` (an integer that represents the
 * point in time at which to retry, as a Unix timestamp in seconds). If so,
 * the current time is subtracted from this value and the result is used as
 * the back-off interval.
 * 3. Otherwise, Envoy will use the default
 * :ref:`exponential back-off <envoy_v3_api_field_config.route.v3.RetryPolicy.retry_back_off>`
 * strategy.
 * 
 * No matter which format is used, if the resulting back-off interval exceeds
 * ``max_interval`` it is discarded and the next header in ``reset_headers``
 * is tried. If a request timeout is configured for the route it will further
 * limit how long the request will be allowed to run.
 * 
 * To prevent many clients retrying at the same point in time jitter is added
 * to the back-off interval, so the resulting interval is decided by taking:
 * ``random(interval, interval * 1.5)``.
 * 
 * .. attention::
 * 
 * Configuring ``rate_limited_retry_back_off`` will not by itself cause a request
 * to be retried. You will still need to configure the right retry policy to match
 * the responses from the upstream server.
 */
export interface _envoy_config_route_v3_RetryPolicy_RateLimitedRetryBackOff__Output {
  /**
   * Specifies the reset headers (like ``Retry-After`` or ``X-RateLimit-Reset``)
   * to match against the response. Headers are tried in order, and matched case
   * insensitive. The first header to be parsed successfully is used. If no headers
   * match the default exponential back-off is used instead.
   */
  'reset_headers': (_envoy_config_route_v3_RetryPolicy_ResetHeader__Output)[];
  /**
   * Specifies the maximum back off interval that Envoy will allow. If a reset
   * header contains an interval longer than this then it will be discarded and
   * the next header will be tried. Defaults to 300 seconds.
   */
  'max_interval': (_google_protobuf_Duration__Output | null);
}

export interface _envoy_config_route_v3_RetryPolicy_ResetHeader {
  /**
   * The name of the reset header.
   * 
   * .. note::
   * 
   * If the header appears multiple times only the first value is used.
   */
  'name'?: (string);
  /**
   * The format of the reset header.
   */
  'format'?: (_envoy_config_route_v3_RetryPolicy_ResetHeaderFormat | keyof typeof _envoy_config_route_v3_RetryPolicy_ResetHeaderFormat);
}

export interface _envoy_config_route_v3_RetryPolicy_ResetHeader__Output {
  /**
   * The name of the reset header.
   * 
   * .. note::
   * 
   * If the header appears multiple times only the first value is used.
   */
  'name': (string);
  /**
   * The format of the reset header.
   */
  'format': (keyof typeof _envoy_config_route_v3_RetryPolicy_ResetHeaderFormat);
}

// Original file: deps/envoy-api/envoy/config/route/v3/route_components.proto

export enum _envoy_config_route_v3_RetryPolicy_ResetHeaderFormat {
  SECONDS = 0,
  UNIX_TIMESTAMP = 1,
}

export interface _envoy_config_route_v3_RetryPolicy_RetryBackOff {
  /**
   * Specifies the base interval between retries. This parameter is required and must be greater
   * than zero. Values less than 1 ms are rounded up to 1 ms.
   * See :ref:`config_http_filters_router_x-envoy-max-retries` for a discussion of Envoy's
   * back-off algorithm.
   */
  'base_interval'?: (_google_protobuf_Duration | null);
  /**
   * Specifies the maximum interval between retries. This parameter is optional, but must be
   * greater than or equal to the ``base_interval`` if set. The default is 10 times the
   * ``base_interval``. See :ref:`config_http_filters_router_x-envoy-max-retries` for a discussion
   * of Envoy's back-off algorithm.
   */
  'max_interval'?: (_google_protobuf_Duration | null);
}

export interface _envoy_config_route_v3_RetryPolicy_RetryBackOff__Output {
  /**
   * Specifies the base interval between retries. This parameter is required and must be greater
   * than zero. Values less than 1 ms are rounded up to 1 ms.
   * See :ref:`config_http_filters_router_x-envoy-max-retries` for a discussion of Envoy's
   * back-off algorithm.
   */
  'base_interval': (_google_protobuf_Duration__Output | null);
  /**
   * Specifies the maximum interval between retries. This parameter is optional, but must be
   * greater than or equal to the ``base_interval`` if set. The default is 10 times the
   * ``base_interval``. See :ref:`config_http_filters_router_x-envoy-max-retries` for a discussion
   * of Envoy's back-off algorithm.
   */
  'max_interval': (_google_protobuf_Duration__Output | null);
}

export interface _envoy_config_route_v3_RetryPolicy_RetryHostPredicate {
  'name'?: (string);
  'typed_config'?: (_google_protobuf_Any | null);
  /**
   * [#extension-category: envoy.retry_host_predicates]
   */
  'config_type'?: "typed_config";
}

export interface _envoy_config_route_v3_RetryPolicy_RetryHostPredicate__Output {
  'name': (string);
  'typed_config'?: (_google_protobuf_Any__Output | null);
  /**
   * [#extension-category: envoy.retry_host_predicates]
   */
  'config_type': "typed_config";
}

export interface _envoy_config_route_v3_RetryPolicy_RetryPriority {
  'name'?: (string);
  'typed_config'?: (_google_protobuf_Any | null);
  /**
   * [#extension-category: envoy.retry_priorities]
   */
  'config_type'?: "typed_config";
}

export interface _envoy_config_route_v3_RetryPolicy_RetryPriority__Output {
  'name': (string);
  'typed_config'?: (_google_protobuf_Any__Output | null);
  /**
   * [#extension-category: envoy.retry_priorities]
   */
  'config_type': "typed_config";
}

/**
 * HTTP retry :ref:`architecture overview <arch_overview_http_routing_retry>`.
 * [#next-free-field: 14]
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
  'num_retries'?: (_google_protobuf_UInt32Value | null);
  /**
   * Specifies a non-zero upstream timeout per retry attempt (including the initial attempt). This
   * parameter is optional. The same conditions documented for
   * :ref:`config_http_filters_router_x-envoy-upstream-rq-per-try-timeout-ms` apply.
   * 
   * .. note::
   * 
   * If left unspecified, Envoy will use the global
   * :ref:`route timeout <envoy_v3_api_field_config.route.v3.RouteAction.timeout>` for the request.
   * Consequently, when using a :ref:`5xx <config_http_filters_router_x-envoy-retry-on>` based
   * retry policy, a request that times out will not be retried as the total timeout budget
   * would have been exhausted.
   */
  'per_try_timeout'?: (_google_protobuf_Duration | null);
  /**
   * Specifies an implementation of a RetryPriority which is used to determine the
   * distribution of load across priorities used for retries. Refer to
   * :ref:`retry plugin configuration <arch_overview_http_retry_plugins>` for more details.
   */
  'retry_priority'?: (_envoy_config_route_v3_RetryPolicy_RetryPriority | null);
  /**
   * Specifies a collection of RetryHostPredicates that will be consulted when selecting a host
   * for retries. If any of the predicates reject the host, host selection will be reattempted.
   * Refer to :ref:`retry plugin configuration <arch_overview_http_retry_plugins>` for more
   * details.
   */
  'retry_host_predicate'?: (_envoy_config_route_v3_RetryPolicy_RetryHostPredicate)[];
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
   * Specifies parameters that control exponential retry back off. This parameter is optional, in which case the
   * default base interval is 25 milliseconds or, if set, the current value of the
   * ``upstream.base_retry_backoff_ms`` runtime parameter. The default maximum interval is 10 times
   * the base interval. The documentation for :ref:`config_http_filters_router_x-envoy-max-retries`
   * describes Envoy's back-off algorithm.
   */
  'retry_back_off'?: (_envoy_config_route_v3_RetryPolicy_RetryBackOff | null);
  /**
   * HTTP response headers that trigger a retry if present in the response. A retry will be
   * triggered if any of the header matches match the upstream response headers.
   * The field is only consulted if 'retriable-headers' retry policy is active.
   */
  'retriable_headers'?: (_envoy_config_route_v3_HeaderMatcher)[];
  /**
   * HTTP headers which must be present in the request for retries to be attempted.
   */
  'retriable_request_headers'?: (_envoy_config_route_v3_HeaderMatcher)[];
  /**
   * Specifies parameters that control a retry back-off strategy that is used
   * when the request is rate limited by the upstream server. The server may
   * return a response header like ``Retry-After`` or ``X-RateLimit-Reset`` to
   * provide feedback to the client on how long to wait before retrying. If
   * configured, this back-off strategy will be used instead of the
   * default exponential back off strategy (configured using ``retry_back_off``)
   * whenever a response includes the matching headers.
   */
  'rate_limited_retry_back_off'?: (_envoy_config_route_v3_RetryPolicy_RateLimitedRetryBackOff | null);
  /**
   * Retry options predicates that will be applied prior to retrying a request. These predicates
   * allow customizing request behavior between retries.
   * [#comment: add [#extension-category: envoy.retry_options_predicates] when there are built-in extensions]
   */
  'retry_options_predicates'?: (_envoy_config_core_v3_TypedExtensionConfig)[];
  /**
   * Specifies an upstream idle timeout per retry attempt (including the initial attempt). This
   * parameter is optional and if absent there is no per try idle timeout. The semantics of the per
   * try idle timeout are similar to the
   * :ref:`route idle timeout <envoy_v3_api_field_config.route.v3.RouteAction.timeout>` and
   * :ref:`stream idle timeout
   * <envoy_v3_api_field_extensions.filters.network.http_connection_manager.v3.HttpConnectionManager.stream_idle_timeout>`
   * both enforced by the HTTP connection manager. The difference is that this idle timeout
   * is enforced by the router for each individual attempt and thus after all previous filters have
   * run, as opposed to *before* all previous filters run for the other idle timeouts. This timeout
   * is useful in cases in which total request timeout is bounded by a number of retries and a
   * :ref:`per_try_timeout <envoy_v3_api_field_config.route.v3.RetryPolicy.per_try_timeout>`, but
   * there is a desire to ensure each try is making incremental progress. Note also that similar
   * to :ref:`per_try_timeout <envoy_v3_api_field_config.route.v3.RetryPolicy.per_try_timeout>`,
   * this idle timeout does not start until after both the entire request has been received by the
   * router *and* a connection pool connection has been obtained. Unlike
   * :ref:`per_try_timeout <envoy_v3_api_field_config.route.v3.RetryPolicy.per_try_timeout>`,
   * the idle timer continues once the response starts streaming back to the downstream client.
   * This ensures that response data continues to make progress without using one of the HTTP
   * connection manager idle timeouts.
   */
  'per_try_idle_timeout'?: (_google_protobuf_Duration | null);
}

/**
 * HTTP retry :ref:`architecture overview <arch_overview_http_routing_retry>`.
 * [#next-free-field: 14]
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
  'num_retries': (_google_protobuf_UInt32Value__Output | null);
  /**
   * Specifies a non-zero upstream timeout per retry attempt (including the initial attempt). This
   * parameter is optional. The same conditions documented for
   * :ref:`config_http_filters_router_x-envoy-upstream-rq-per-try-timeout-ms` apply.
   * 
   * .. note::
   * 
   * If left unspecified, Envoy will use the global
   * :ref:`route timeout <envoy_v3_api_field_config.route.v3.RouteAction.timeout>` for the request.
   * Consequently, when using a :ref:`5xx <config_http_filters_router_x-envoy-retry-on>` based
   * retry policy, a request that times out will not be retried as the total timeout budget
   * would have been exhausted.
   */
  'per_try_timeout': (_google_protobuf_Duration__Output | null);
  /**
   * Specifies an implementation of a RetryPriority which is used to determine the
   * distribution of load across priorities used for retries. Refer to
   * :ref:`retry plugin configuration <arch_overview_http_retry_plugins>` for more details.
   */
  'retry_priority': (_envoy_config_route_v3_RetryPolicy_RetryPriority__Output | null);
  /**
   * Specifies a collection of RetryHostPredicates that will be consulted when selecting a host
   * for retries. If any of the predicates reject the host, host selection will be reattempted.
   * Refer to :ref:`retry plugin configuration <arch_overview_http_retry_plugins>` for more
   * details.
   */
  'retry_host_predicate': (_envoy_config_route_v3_RetryPolicy_RetryHostPredicate__Output)[];
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
   * Specifies parameters that control exponential retry back off. This parameter is optional, in which case the
   * default base interval is 25 milliseconds or, if set, the current value of the
   * ``upstream.base_retry_backoff_ms`` runtime parameter. The default maximum interval is 10 times
   * the base interval. The documentation for :ref:`config_http_filters_router_x-envoy-max-retries`
   * describes Envoy's back-off algorithm.
   */
  'retry_back_off': (_envoy_config_route_v3_RetryPolicy_RetryBackOff__Output | null);
  /**
   * HTTP response headers that trigger a retry if present in the response. A retry will be
   * triggered if any of the header matches match the upstream response headers.
   * The field is only consulted if 'retriable-headers' retry policy is active.
   */
  'retriable_headers': (_envoy_config_route_v3_HeaderMatcher__Output)[];
  /**
   * HTTP headers which must be present in the request for retries to be attempted.
   */
  'retriable_request_headers': (_envoy_config_route_v3_HeaderMatcher__Output)[];
  /**
   * Specifies parameters that control a retry back-off strategy that is used
   * when the request is rate limited by the upstream server. The server may
   * return a response header like ``Retry-After`` or ``X-RateLimit-Reset`` to
   * provide feedback to the client on how long to wait before retrying. If
   * configured, this back-off strategy will be used instead of the
   * default exponential back off strategy (configured using ``retry_back_off``)
   * whenever a response includes the matching headers.
   */
  'rate_limited_retry_back_off': (_envoy_config_route_v3_RetryPolicy_RateLimitedRetryBackOff__Output | null);
  /**
   * Retry options predicates that will be applied prior to retrying a request. These predicates
   * allow customizing request behavior between retries.
   * [#comment: add [#extension-category: envoy.retry_options_predicates] when there are built-in extensions]
   */
  'retry_options_predicates': (_envoy_config_core_v3_TypedExtensionConfig__Output)[];
  /**
   * Specifies an upstream idle timeout per retry attempt (including the initial attempt). This
   * parameter is optional and if absent there is no per try idle timeout. The semantics of the per
   * try idle timeout are similar to the
   * :ref:`route idle timeout <envoy_v3_api_field_config.route.v3.RouteAction.timeout>` and
   * :ref:`stream idle timeout
   * <envoy_v3_api_field_extensions.filters.network.http_connection_manager.v3.HttpConnectionManager.stream_idle_timeout>`
   * both enforced by the HTTP connection manager. The difference is that this idle timeout
   * is enforced by the router for each individual attempt and thus after all previous filters have
   * run, as opposed to *before* all previous filters run for the other idle timeouts. This timeout
   * is useful in cases in which total request timeout is bounded by a number of retries and a
   * :ref:`per_try_timeout <envoy_v3_api_field_config.route.v3.RetryPolicy.per_try_timeout>`, but
   * there is a desire to ensure each try is making incremental progress. Note also that similar
   * to :ref:`per_try_timeout <envoy_v3_api_field_config.route.v3.RetryPolicy.per_try_timeout>`,
   * this idle timeout does not start until after both the entire request has been received by the
   * router *and* a connection pool connection has been obtained. Unlike
   * :ref:`per_try_timeout <envoy_v3_api_field_config.route.v3.RetryPolicy.per_try_timeout>`,
   * the idle timer continues once the response starts streaming back to the downstream client.
   * This ensures that response data continues to make progress without using one of the HTTP
   * connection manager idle timeouts.
   */
  'per_try_idle_timeout': (_google_protobuf_Duration__Output | null);
}
