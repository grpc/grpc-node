// Original file: deps/envoy-api/envoy/api/v2/route/route_components.proto

import { UInt32Value as _google_protobuf_UInt32Value, UInt32Value__Output as _google_protobuf_UInt32Value__Output } from '../../../../google/protobuf/UInt32Value';
import { FractionalPercent as _envoy_type_FractionalPercent, FractionalPercent__Output as _envoy_type_FractionalPercent__Output } from '../../../../envoy/type/FractionalPercent';

/**
 * HTTP request hedging :ref:`architecture overview <arch_overview_http_routing_hedging>`.
 */
export interface HedgePolicy {
  /**
   * Specifies the number of initial requests that should be sent upstream.
   * Must be at least 1.
   * Defaults to 1.
   * [#not-implemented-hide:]
   */
  'initial_requests'?: (_google_protobuf_UInt32Value);
  /**
   * Specifies a probability that an additional upstream request should be sent
   * on top of what is specified by initial_requests.
   * Defaults to 0.
   * [#not-implemented-hide:]
   */
  'additional_request_chance'?: (_envoy_type_FractionalPercent);
  /**
   * Indicates that a hedged request should be sent when the per-try timeout
   * is hit. This will only occur if the retry policy also indicates that a
   * timed out request should be retried.
   * Once a timed out request is retried due to per try timeout, the router
   * filter will ensure that it is not retried again even if the returned
   * response headers would otherwise be retried according the specified
   * :ref:`RetryPolicy <envoy_api_msg_route.RetryPolicy>`.
   * Defaults to false.
   */
  'hedge_on_per_try_timeout'?: (boolean);
}

/**
 * HTTP request hedging :ref:`architecture overview <arch_overview_http_routing_hedging>`.
 */
export interface HedgePolicy__Output {
  /**
   * Specifies the number of initial requests that should be sent upstream.
   * Must be at least 1.
   * Defaults to 1.
   * [#not-implemented-hide:]
   */
  'initial_requests'?: (_google_protobuf_UInt32Value__Output);
  /**
   * Specifies a probability that an additional upstream request should be sent
   * on top of what is specified by initial_requests.
   * Defaults to 0.
   * [#not-implemented-hide:]
   */
  'additional_request_chance'?: (_envoy_type_FractionalPercent__Output);
  /**
   * Indicates that a hedged request should be sent when the per-try timeout
   * is hit. This will only occur if the retry policy also indicates that a
   * timed out request should be retried.
   * Once a timed out request is retried due to per try timeout, the router
   * filter will ensure that it is not retried again even if the returned
   * response headers would otherwise be retried according the specified
   * :ref:`RetryPolicy <envoy_api_msg_route.RetryPolicy>`.
   * Defaults to false.
   */
  'hedge_on_per_try_timeout': (boolean);
}
