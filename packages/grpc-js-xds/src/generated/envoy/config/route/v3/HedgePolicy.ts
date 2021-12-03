// Original file: deps/envoy-api/envoy/config/route/v3/route_components.proto

import type { UInt32Value as _google_protobuf_UInt32Value, UInt32Value__Output as _google_protobuf_UInt32Value__Output } from '../../../../google/protobuf/UInt32Value';
import type { FractionalPercent as _envoy_type_v3_FractionalPercent, FractionalPercent__Output as _envoy_type_v3_FractionalPercent__Output } from '../../../../envoy/type/v3/FractionalPercent';

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
  'initial_requests'?: (_google_protobuf_UInt32Value | null);
  /**
   * Specifies a probability that an additional upstream request should be sent
   * on top of what is specified by initial_requests.
   * Defaults to 0.
   * [#not-implemented-hide:]
   */
  'additional_request_chance'?: (_envoy_type_v3_FractionalPercent | null);
  /**
   * Indicates that a hedged request should be sent when the per-try timeout is hit.
   * This means that a retry will be issued without resetting the original request, leaving multiple upstream requests in flight.
   * The first request to complete successfully will be the one returned to the caller.
   * 
   * * At any time, a successful response (i.e. not triggering any of the retry-on conditions) would be returned to the client.
   * * Before per-try timeout, an error response (per retry-on conditions) would be retried immediately or returned ot the client
   * if there are no more retries left.
   * * After per-try timeout, an error response would be discarded, as a retry in the form of a hedged request is already in progress.
   * 
   * Note: For this to have effect, you must have a :ref:`RetryPolicy <envoy_v3_api_msg_config.route.v3.RetryPolicy>` that retries at least
   * one error code and specifies a maximum number of retries.
   * 
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
  'initial_requests': (_google_protobuf_UInt32Value__Output | null);
  /**
   * Specifies a probability that an additional upstream request should be sent
   * on top of what is specified by initial_requests.
   * Defaults to 0.
   * [#not-implemented-hide:]
   */
  'additional_request_chance': (_envoy_type_v3_FractionalPercent__Output | null);
  /**
   * Indicates that a hedged request should be sent when the per-try timeout is hit.
   * This means that a retry will be issued without resetting the original request, leaving multiple upstream requests in flight.
   * The first request to complete successfully will be the one returned to the caller.
   * 
   * * At any time, a successful response (i.e. not triggering any of the retry-on conditions) would be returned to the client.
   * * Before per-try timeout, an error response (per retry-on conditions) would be retried immediately or returned ot the client
   * if there are no more retries left.
   * * After per-try timeout, an error response would be discarded, as a retry in the form of a hedged request is already in progress.
   * 
   * Note: For this to have effect, you must have a :ref:`RetryPolicy <envoy_v3_api_msg_config.route.v3.RetryPolicy>` that retries at least
   * one error code and specifies a maximum number of retries.
   * 
   * Defaults to false.
   */
  'hedge_on_per_try_timeout': (boolean);
}
