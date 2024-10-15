// Original file: deps/envoy-api/envoy/extensions/transport_sockets/tls/v3/common.proto

import type { StringMatcher as _envoy_type_matcher_v3_StringMatcher, StringMatcher__Output as _envoy_type_matcher_v3_StringMatcher__Output } from '../../../../../envoy/type/matcher/v3/StringMatcher';

// Original file: deps/envoy-api/envoy/extensions/transport_sockets/tls/v3/common.proto

/**
 * Indicates the choice of GeneralName as defined in section 4.2.1.5 of RFC 5280 to match
 * against.
 */
export const _envoy_extensions_transport_sockets_tls_v3_SubjectAltNameMatcher_SanType = {
  SAN_TYPE_UNSPECIFIED: 'SAN_TYPE_UNSPECIFIED',
  EMAIL: 'EMAIL',
  DNS: 'DNS',
  URI: 'URI',
  IP_ADDRESS: 'IP_ADDRESS',
  OTHER_NAME: 'OTHER_NAME',
} as const;

/**
 * Indicates the choice of GeneralName as defined in section 4.2.1.5 of RFC 5280 to match
 * against.
 */
export type _envoy_extensions_transport_sockets_tls_v3_SubjectAltNameMatcher_SanType =
  | 'SAN_TYPE_UNSPECIFIED'
  | 0
  | 'EMAIL'
  | 1
  | 'DNS'
  | 2
  | 'URI'
  | 3
  | 'IP_ADDRESS'
  | 4
  | 'OTHER_NAME'
  | 5

/**
 * Indicates the choice of GeneralName as defined in section 4.2.1.5 of RFC 5280 to match
 * against.
 */
export type _envoy_extensions_transport_sockets_tls_v3_SubjectAltNameMatcher_SanType__Output = typeof _envoy_extensions_transport_sockets_tls_v3_SubjectAltNameMatcher_SanType[keyof typeof _envoy_extensions_transport_sockets_tls_v3_SubjectAltNameMatcher_SanType]

/**
 * Matcher for subject alternative names, to match both type and value of the SAN.
 */
export interface SubjectAltNameMatcher {
  /**
   * Specification of type of SAN. Note that the default enum value is an invalid choice.
   */
  'san_type'?: (_envoy_extensions_transport_sockets_tls_v3_SubjectAltNameMatcher_SanType);
  /**
   * Matcher for SAN value.
   * 
   * The string matching for OTHER_NAME SAN values depends on their ASN.1 type:
   * 
   * * OBJECT: Validated against its dotted numeric notation (e.g., "1.2.3.4")
   * * BOOLEAN: Validated against strings "true" or "false"
   * * INTEGER/ENUMERATED: Validated against a string containing the integer value
   * * NULL: Validated against an empty string
   * * Other types: Validated directly against the string value
   */
  'matcher'?: (_envoy_type_matcher_v3_StringMatcher | null);
  /**
   * OID Value which is required if OTHER_NAME SAN type is used.
   * For example, UPN OID is 1.3.6.1.4.1.311.20.2.3
   * (Reference: http://oid-info.com/get/1.3.6.1.4.1.311.20.2.3).
   * 
   * If set for SAN types other than OTHER_NAME, it will be ignored.
   */
  'oid'?: (string);
}

/**
 * Matcher for subject alternative names, to match both type and value of the SAN.
 */
export interface SubjectAltNameMatcher__Output {
  /**
   * Specification of type of SAN. Note that the default enum value is an invalid choice.
   */
  'san_type': (_envoy_extensions_transport_sockets_tls_v3_SubjectAltNameMatcher_SanType__Output);
  /**
   * Matcher for SAN value.
   * 
   * The string matching for OTHER_NAME SAN values depends on their ASN.1 type:
   * 
   * * OBJECT: Validated against its dotted numeric notation (e.g., "1.2.3.4")
   * * BOOLEAN: Validated against strings "true" or "false"
   * * INTEGER/ENUMERATED: Validated against a string containing the integer value
   * * NULL: Validated against an empty string
   * * Other types: Validated directly against the string value
   */
  'matcher': (_envoy_type_matcher_v3_StringMatcher__Output | null);
  /**
   * OID Value which is required if OTHER_NAME SAN type is used.
   * For example, UPN OID is 1.3.6.1.4.1.311.20.2.3
   * (Reference: http://oid-info.com/get/1.3.6.1.4.1.311.20.2.3).
   * 
   * If set for SAN types other than OTHER_NAME, it will be ignored.
   */
  'oid': (string);
}
