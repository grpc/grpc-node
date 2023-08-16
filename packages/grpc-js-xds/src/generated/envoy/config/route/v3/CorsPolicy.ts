// Original file: deps/envoy-api/envoy/config/route/v3/route_components.proto

import type { BoolValue as _google_protobuf_BoolValue, BoolValue__Output as _google_protobuf_BoolValue__Output } from '../../../../google/protobuf/BoolValue';
import type { RuntimeFractionalPercent as _envoy_config_core_v3_RuntimeFractionalPercent, RuntimeFractionalPercent__Output as _envoy_config_core_v3_RuntimeFractionalPercent__Output } from '../../../../envoy/config/core/v3/RuntimeFractionalPercent';
import type { StringMatcher as _envoy_type_matcher_v3_StringMatcher, StringMatcher__Output as _envoy_type_matcher_v3_StringMatcher__Output } from '../../../../envoy/type/matcher/v3/StringMatcher';

/**
 * Cors policy configuration.
 * 
 * .. attention::
 * 
 * This message has been deprecated. Please use
 * :ref:`CorsPolicy in filter extension <envoy_v3_api_msg_extensions.filters.http.cors.v3.CorsPolicy>`
 * as as alternative.
 * 
 * [#next-free-field: 13]
 */
export interface CorsPolicy {
  /**
   * Specifies the content for the ``access-control-allow-methods`` header.
   */
  'allow_methods'?: (string);
  /**
   * Specifies the content for the ``access-control-allow-headers`` header.
   */
  'allow_headers'?: (string);
  /**
   * Specifies the content for the ``access-control-expose-headers`` header.
   */
  'expose_headers'?: (string);
  /**
   * Specifies the content for the ``access-control-max-age`` header.
   */
  'max_age'?: (string);
  /**
   * Specifies whether the resource allows credentials.
   */
  'allow_credentials'?: (_google_protobuf_BoolValue | null);
  /**
   * Specifies the % of requests for which the CORS filter is enabled.
   * 
   * If neither ``enabled``, ``filter_enabled``, nor ``shadow_enabled`` are specified, the CORS
   * filter will be enabled for 100% of the requests.
   * 
   * If :ref:`runtime_key <envoy_v3_api_field_config.core.v3.RuntimeFractionalPercent.runtime_key>` is
   * specified, Envoy will lookup the runtime key to get the percentage of requests to filter.
   */
  'filter_enabled'?: (_envoy_config_core_v3_RuntimeFractionalPercent | null);
  /**
   * Specifies the % of requests for which the CORS policies will be evaluated and tracked, but not
   * enforced.
   * 
   * This field is intended to be used when ``filter_enabled`` and ``enabled`` are off. One of those
   * fields have to explicitly disable the filter in order for this setting to take effect.
   * 
   * If :ref:`runtime_key <envoy_v3_api_field_config.core.v3.RuntimeFractionalPercent.runtime_key>` is specified,
   * Envoy will lookup the runtime key to get the percentage of requests for which it will evaluate
   * and track the request's ``Origin`` to determine if it's valid but will not enforce any policies.
   */
  'shadow_enabled'?: (_envoy_config_core_v3_RuntimeFractionalPercent | null);
  /**
   * Specifies string patterns that match allowed origins. An origin is allowed if any of the
   * string matchers match.
   */
  'allow_origin_string_match'?: (_envoy_type_matcher_v3_StringMatcher)[];
  /**
   * Specify whether allow requests whose target server's IP address is more private than that from
   * which the request initiator was fetched.
   * 
   * More details refer to https://developer.chrome.com/blog/private-network-access-preflight.
   */
  'allow_private_network_access'?: (_google_protobuf_BoolValue | null);
  'enabled_specifier'?: "filter_enabled";
}

/**
 * Cors policy configuration.
 * 
 * .. attention::
 * 
 * This message has been deprecated. Please use
 * :ref:`CorsPolicy in filter extension <envoy_v3_api_msg_extensions.filters.http.cors.v3.CorsPolicy>`
 * as as alternative.
 * 
 * [#next-free-field: 13]
 */
export interface CorsPolicy__Output {
  /**
   * Specifies the content for the ``access-control-allow-methods`` header.
   */
  'allow_methods': (string);
  /**
   * Specifies the content for the ``access-control-allow-headers`` header.
   */
  'allow_headers': (string);
  /**
   * Specifies the content for the ``access-control-expose-headers`` header.
   */
  'expose_headers': (string);
  /**
   * Specifies the content for the ``access-control-max-age`` header.
   */
  'max_age': (string);
  /**
   * Specifies whether the resource allows credentials.
   */
  'allow_credentials': (_google_protobuf_BoolValue__Output | null);
  /**
   * Specifies the % of requests for which the CORS filter is enabled.
   * 
   * If neither ``enabled``, ``filter_enabled``, nor ``shadow_enabled`` are specified, the CORS
   * filter will be enabled for 100% of the requests.
   * 
   * If :ref:`runtime_key <envoy_v3_api_field_config.core.v3.RuntimeFractionalPercent.runtime_key>` is
   * specified, Envoy will lookup the runtime key to get the percentage of requests to filter.
   */
  'filter_enabled'?: (_envoy_config_core_v3_RuntimeFractionalPercent__Output | null);
  /**
   * Specifies the % of requests for which the CORS policies will be evaluated and tracked, but not
   * enforced.
   * 
   * This field is intended to be used when ``filter_enabled`` and ``enabled`` are off. One of those
   * fields have to explicitly disable the filter in order for this setting to take effect.
   * 
   * If :ref:`runtime_key <envoy_v3_api_field_config.core.v3.RuntimeFractionalPercent.runtime_key>` is specified,
   * Envoy will lookup the runtime key to get the percentage of requests for which it will evaluate
   * and track the request's ``Origin`` to determine if it's valid but will not enforce any policies.
   */
  'shadow_enabled': (_envoy_config_core_v3_RuntimeFractionalPercent__Output | null);
  /**
   * Specifies string patterns that match allowed origins. An origin is allowed if any of the
   * string matchers match.
   */
  'allow_origin_string_match': (_envoy_type_matcher_v3_StringMatcher__Output)[];
  /**
   * Specify whether allow requests whose target server's IP address is more private than that from
   * which the request initiator was fetched.
   * 
   * More details refer to https://developer.chrome.com/blog/private-network-access-preflight.
   */
  'allow_private_network_access': (_google_protobuf_BoolValue__Output | null);
  'enabled_specifier': "filter_enabled";
}
