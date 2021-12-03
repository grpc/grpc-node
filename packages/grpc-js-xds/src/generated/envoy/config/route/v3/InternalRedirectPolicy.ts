// Original file: deps/envoy-api/envoy/config/route/v3/route_components.proto

import type { UInt32Value as _google_protobuf_UInt32Value, UInt32Value__Output as _google_protobuf_UInt32Value__Output } from '../../../../google/protobuf/UInt32Value';
import type { TypedExtensionConfig as _envoy_config_core_v3_TypedExtensionConfig, TypedExtensionConfig__Output as _envoy_config_core_v3_TypedExtensionConfig__Output } from '../../../../envoy/config/core/v3/TypedExtensionConfig';

/**
 * HTTP Internal Redirect :ref:`architecture overview <arch_overview_internal_redirects>`.
 */
export interface InternalRedirectPolicy {
  /**
   * An internal redirect is not handled, unless the number of previous internal redirects that a
   * downstream request has encountered is lower than this value.
   * In the case where a downstream request is bounced among multiple routes by internal redirect,
   * the first route that hits this threshold, or does not set :ref:`internal_redirect_policy
   * <envoy_v3_api_field_config.route.v3.RouteAction.internal_redirect_policy>`
   * will pass the redirect back to downstream.
   * 
   * If not specified, at most one redirect will be followed.
   */
  'max_internal_redirects'?: (_google_protobuf_UInt32Value | null);
  /**
   * Defines what upstream response codes are allowed to trigger internal redirect. If unspecified,
   * only 302 will be treated as internal redirect.
   * Only 301, 302, 303, 307 and 308 are valid values. Any other codes will be ignored.
   */
  'redirect_response_codes'?: (number)[];
  /**
   * Specifies a list of predicates that are queried when an upstream response is deemed
   * to trigger an internal redirect by all other criteria. Any predicate in the list can reject
   * the redirect, causing the response to be proxied to downstream.
   * [#extension-category: envoy.internal_redirect_predicates]
   */
  'predicates'?: (_envoy_config_core_v3_TypedExtensionConfig)[];
  /**
   * Allow internal redirect to follow a target URI with a different scheme than the value of
   * x-forwarded-proto. The default is false.
   */
  'allow_cross_scheme_redirect'?: (boolean);
}

/**
 * HTTP Internal Redirect :ref:`architecture overview <arch_overview_internal_redirects>`.
 */
export interface InternalRedirectPolicy__Output {
  /**
   * An internal redirect is not handled, unless the number of previous internal redirects that a
   * downstream request has encountered is lower than this value.
   * In the case where a downstream request is bounced among multiple routes by internal redirect,
   * the first route that hits this threshold, or does not set :ref:`internal_redirect_policy
   * <envoy_v3_api_field_config.route.v3.RouteAction.internal_redirect_policy>`
   * will pass the redirect back to downstream.
   * 
   * If not specified, at most one redirect will be followed.
   */
  'max_internal_redirects': (_google_protobuf_UInt32Value__Output | null);
  /**
   * Defines what upstream response codes are allowed to trigger internal redirect. If unspecified,
   * only 302 will be treated as internal redirect.
   * Only 301, 302, 303, 307 and 308 are valid values. Any other codes will be ignored.
   */
  'redirect_response_codes': (number)[];
  /**
   * Specifies a list of predicates that are queried when an upstream response is deemed
   * to trigger an internal redirect by all other criteria. Any predicate in the list can reject
   * the redirect, causing the response to be proxied to downstream.
   * [#extension-category: envoy.internal_redirect_predicates]
   */
  'predicates': (_envoy_config_core_v3_TypedExtensionConfig__Output)[];
  /**
   * Allow internal redirect to follow a target URI with a different scheme than the value of
   * x-forwarded-proto. The default is false.
   */
  'allow_cross_scheme_redirect': (boolean);
}
