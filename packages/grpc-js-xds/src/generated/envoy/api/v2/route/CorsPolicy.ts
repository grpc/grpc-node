// Original file: deps/envoy-api/envoy/api/v2/route/route_components.proto

import { BoolValue as _google_protobuf_BoolValue, BoolValue__Output as _google_protobuf_BoolValue__Output } from '../../../../google/protobuf/BoolValue';
import { RuntimeFractionalPercent as _envoy_api_v2_core_RuntimeFractionalPercent, RuntimeFractionalPercent__Output as _envoy_api_v2_core_RuntimeFractionalPercent__Output } from '../../../../envoy/api/v2/core/RuntimeFractionalPercent';
import { StringMatcher as _envoy_type_matcher_StringMatcher, StringMatcher__Output as _envoy_type_matcher_StringMatcher__Output } from '../../../../envoy/type/matcher/StringMatcher';

/**
 * [#next-free-field: 12]
 */
export interface CorsPolicy {
  /**
   * Specifies the origins that will be allowed to do CORS requests.
   * 
   * An origin is allowed if either allow_origin or allow_origin_regex match.
   * 
   * .. attention::
   * This field has been deprecated in favor of `allow_origin_string_match`.
   */
  'allow_origin'?: (string)[];
  /**
   * Specifies the content for the *access-control-allow-methods* header.
   */
  'allow_methods'?: (string);
  /**
   * Specifies the content for the *access-control-allow-headers* header.
   */
  'allow_headers'?: (string);
  /**
   * Specifies the content for the *access-control-expose-headers* header.
   */
  'expose_headers'?: (string);
  /**
   * Specifies the content for the *access-control-max-age* header.
   */
  'max_age'?: (string);
  /**
   * Specifies whether the resource allows credentials.
   */
  'allow_credentials'?: (_google_protobuf_BoolValue);
  /**
   * Specifies if the CORS filter is enabled. Defaults to true. Only effective on route.
   * 
   * .. attention::
   * 
   * **This field is deprecated**. Set the
   * :ref:`filter_enabled<envoy_api_field_route.CorsPolicy.filter_enabled>` field instead.
   */
  'enabled'?: (_google_protobuf_BoolValue);
  /**
   * Specifies regex patterns that match allowed origins.
   * 
   * An origin is allowed if either allow_origin or allow_origin_regex match.
   * 
   * .. attention::
   * This field has been deprecated in favor of `allow_origin_string_match` as it is not safe for
   * use with untrusted input in all cases.
   */
  'allow_origin_regex'?: (string)[];
  /**
   * Specifies the % of requests for which the CORS filter is enabled.
   * 
   * If neither ``enabled``, ``filter_enabled``, nor ``shadow_enabled`` are specified, the CORS
   * filter will be enabled for 100% of the requests.
   * 
   * If :ref:`runtime_key <envoy_api_field_core.RuntimeFractionalPercent.runtime_key>` is
   * specified, Envoy will lookup the runtime key to get the percentage of requests to filter.
   */
  'filter_enabled'?: (_envoy_api_v2_core_RuntimeFractionalPercent);
  /**
   * Specifies the % of requests for which the CORS policies will be evaluated and tracked, but not
   * enforced.
   * 
   * This field is intended to be used when ``filter_enabled`` and ``enabled`` are off. One of those
   * fields have to explicitly disable the filter in order for this setting to take effect.
   * 
   * If :ref:`runtime_key <envoy_api_field_core.RuntimeFractionalPercent.runtime_key>` is specified,
   * Envoy will lookup the runtime key to get the percentage of requests for which it will evaluate
   * and track the request's *Origin* to determine if it's valid but will not enforce any policies.
   */
  'shadow_enabled'?: (_envoy_api_v2_core_RuntimeFractionalPercent);
  /**
   * Specifies string patterns that match allowed origins. An origin is allowed if any of the
   * string matchers match.
   */
  'allow_origin_string_match'?: (_envoy_type_matcher_StringMatcher)[];
  'enabled_specifier'?: "enabled"|"filter_enabled";
}

/**
 * [#next-free-field: 12]
 */
export interface CorsPolicy__Output {
  /**
   * Specifies the origins that will be allowed to do CORS requests.
   * 
   * An origin is allowed if either allow_origin or allow_origin_regex match.
   * 
   * .. attention::
   * This field has been deprecated in favor of `allow_origin_string_match`.
   */
  'allow_origin': (string)[];
  /**
   * Specifies the content for the *access-control-allow-methods* header.
   */
  'allow_methods': (string);
  /**
   * Specifies the content for the *access-control-allow-headers* header.
   */
  'allow_headers': (string);
  /**
   * Specifies the content for the *access-control-expose-headers* header.
   */
  'expose_headers': (string);
  /**
   * Specifies the content for the *access-control-max-age* header.
   */
  'max_age': (string);
  /**
   * Specifies whether the resource allows credentials.
   */
  'allow_credentials'?: (_google_protobuf_BoolValue__Output);
  /**
   * Specifies if the CORS filter is enabled. Defaults to true. Only effective on route.
   * 
   * .. attention::
   * 
   * **This field is deprecated**. Set the
   * :ref:`filter_enabled<envoy_api_field_route.CorsPolicy.filter_enabled>` field instead.
   */
  'enabled'?: (_google_protobuf_BoolValue__Output);
  /**
   * Specifies regex patterns that match allowed origins.
   * 
   * An origin is allowed if either allow_origin or allow_origin_regex match.
   * 
   * .. attention::
   * This field has been deprecated in favor of `allow_origin_string_match` as it is not safe for
   * use with untrusted input in all cases.
   */
  'allow_origin_regex': (string)[];
  /**
   * Specifies the % of requests for which the CORS filter is enabled.
   * 
   * If neither ``enabled``, ``filter_enabled``, nor ``shadow_enabled`` are specified, the CORS
   * filter will be enabled for 100% of the requests.
   * 
   * If :ref:`runtime_key <envoy_api_field_core.RuntimeFractionalPercent.runtime_key>` is
   * specified, Envoy will lookup the runtime key to get the percentage of requests to filter.
   */
  'filter_enabled'?: (_envoy_api_v2_core_RuntimeFractionalPercent__Output);
  /**
   * Specifies the % of requests for which the CORS policies will be evaluated and tracked, but not
   * enforced.
   * 
   * This field is intended to be used when ``filter_enabled`` and ``enabled`` are off. One of those
   * fields have to explicitly disable the filter in order for this setting to take effect.
   * 
   * If :ref:`runtime_key <envoy_api_field_core.RuntimeFractionalPercent.runtime_key>` is specified,
   * Envoy will lookup the runtime key to get the percentage of requests for which it will evaluate
   * and track the request's *Origin* to determine if it's valid but will not enforce any policies.
   */
  'shadow_enabled'?: (_envoy_api_v2_core_RuntimeFractionalPercent__Output);
  /**
   * Specifies string patterns that match allowed origins. An origin is allowed if any of the
   * string matchers match.
   */
  'allow_origin_string_match': (_envoy_type_matcher_StringMatcher__Output)[];
  'enabled_specifier': "enabled"|"filter_enabled";
}
