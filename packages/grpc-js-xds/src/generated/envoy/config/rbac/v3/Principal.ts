// Original file: deps/envoy-api/envoy/config/rbac/v3/rbac.proto

import type { CidrRange as _envoy_config_core_v3_CidrRange, CidrRange__Output as _envoy_config_core_v3_CidrRange__Output } from '../../../../envoy/config/core/v3/CidrRange';
import type { HeaderMatcher as _envoy_config_route_v3_HeaderMatcher, HeaderMatcher__Output as _envoy_config_route_v3_HeaderMatcher__Output } from '../../../../envoy/config/route/v3/HeaderMatcher';
import type { MetadataMatcher as _envoy_type_matcher_v3_MetadataMatcher, MetadataMatcher__Output as _envoy_type_matcher_v3_MetadataMatcher__Output } from '../../../../envoy/type/matcher/v3/MetadataMatcher';
import type { Principal as _envoy_config_rbac_v3_Principal, Principal__Output as _envoy_config_rbac_v3_Principal__Output } from '../../../../envoy/config/rbac/v3/Principal';
import type { PathMatcher as _envoy_type_matcher_v3_PathMatcher, PathMatcher__Output as _envoy_type_matcher_v3_PathMatcher__Output } from '../../../../envoy/type/matcher/v3/PathMatcher';
import type { FilterStateMatcher as _envoy_type_matcher_v3_FilterStateMatcher, FilterStateMatcher__Output as _envoy_type_matcher_v3_FilterStateMatcher__Output } from '../../../../envoy/type/matcher/v3/FilterStateMatcher';
import type { StringMatcher as _envoy_type_matcher_v3_StringMatcher, StringMatcher__Output as _envoy_type_matcher_v3_StringMatcher__Output } from '../../../../envoy/type/matcher/v3/StringMatcher';

/**
 * Authentication attributes for a downstream.
 */
export interface _envoy_config_rbac_v3_Principal_Authenticated {
  /**
   * The name of the principal. If set, The URI SAN or DNS SAN in that order
   * is used from the certificate, otherwise the subject field is used. If
   * unset, it applies to any user that is authenticated.
   */
  'principal_name'?: (_envoy_type_matcher_v3_StringMatcher | null);
}

/**
 * Authentication attributes for a downstream.
 */
export interface _envoy_config_rbac_v3_Principal_Authenticated__Output {
  /**
   * The name of the principal. If set, The URI SAN or DNS SAN in that order
   * is used from the certificate, otherwise the subject field is used. If
   * unset, it applies to any user that is authenticated.
   */
  'principal_name': (_envoy_type_matcher_v3_StringMatcher__Output | null);
}

/**
 * Used in the ``and_ids`` and ``or_ids`` fields in the ``identifier`` oneof.
 * Depending on the context, each are applied with the associated behavior.
 */
export interface _envoy_config_rbac_v3_Principal_Set {
  'ids'?: (_envoy_config_rbac_v3_Principal)[];
}

/**
 * Used in the ``and_ids`` and ``or_ids`` fields in the ``identifier`` oneof.
 * Depending on the context, each are applied with the associated behavior.
 */
export interface _envoy_config_rbac_v3_Principal_Set__Output {
  'ids': (_envoy_config_rbac_v3_Principal__Output)[];
}

/**
 * Principal defines an identity or a group of identities for a downstream
 * subject.
 * [#next-free-field: 13]
 */
export interface Principal {
  /**
   * A set of identifiers that all must match in order to define the
   * downstream.
   */
  'and_ids'?: (_envoy_config_rbac_v3_Principal_Set | null);
  /**
   * A set of identifiers at least one must match in order to define the
   * downstream.
   */
  'or_ids'?: (_envoy_config_rbac_v3_Principal_Set | null);
  /**
   * When any is set, it matches any downstream.
   */
  'any'?: (boolean);
  /**
   * Authenticated attributes that identify the downstream.
   */
  'authenticated'?: (_envoy_config_rbac_v3_Principal_Authenticated | null);
  /**
   * A CIDR block that describes the downstream IP.
   * This address will honor proxy protocol, but will not honor XFF.
   * 
   * This field is deprecated; either use :ref:`remote_ip
   * <envoy_v3_api_field_config.rbac.v3.Principal.remote_ip>` for the same
   * behavior, or use
   * :ref:`direct_remote_ip <envoy_v3_api_field_config.rbac.v3.Principal.direct_remote_ip>`.
   * @deprecated
   */
  'source_ip'?: (_envoy_config_core_v3_CidrRange | null);
  /**
   * A header (or pseudo-header such as :path or :method) on the incoming HTTP
   * request. Only available for HTTP request. Note: the pseudo-header :path
   * includes the query and fragment string. Use the ``url_path`` field if you
   * want to match the URL path without the query and fragment string.
   */
  'header'?: (_envoy_config_route_v3_HeaderMatcher | null);
  /**
   * Metadata that describes additional information about the principal.
   */
  'metadata'?: (_envoy_type_matcher_v3_MetadataMatcher | null);
  /**
   * Negates matching the provided principal. For instance, if the value of
   * ``not_id`` would match, this principal would not match. Conversely, if the
   * value of ``not_id`` would not match, this principal would match.
   */
  'not_id'?: (_envoy_config_rbac_v3_Principal | null);
  /**
   * A URL path on the incoming HTTP request. Only available for HTTP.
   */
  'url_path'?: (_envoy_type_matcher_v3_PathMatcher | null);
  /**
   * A CIDR block that describes the downstream remote/origin address.
   * Note: This is always the physical peer even if the
   * :ref:`remote_ip <envoy_v3_api_field_config.rbac.v3.Principal.remote_ip>` is
   * inferred from for example the x-forwarder-for header, proxy protocol,
   * etc.
   */
  'direct_remote_ip'?: (_envoy_config_core_v3_CidrRange | null);
  /**
   * A CIDR block that describes the downstream remote/origin address.
   * Note: This may not be the physical peer and could be different from the
   * :ref:`direct_remote_ip
   * <envoy_v3_api_field_config.rbac.v3.Principal.direct_remote_ip>`. E.g, if the
   * remote ip is inferred from for example the x-forwarder-for header, proxy
   * protocol, etc.
   */
  'remote_ip'?: (_envoy_config_core_v3_CidrRange | null);
  /**
   * Identifies the principal using a filter state object.
   */
  'filter_state'?: (_envoy_type_matcher_v3_FilterStateMatcher | null);
  'identifier'?: "and_ids"|"or_ids"|"any"|"authenticated"|"source_ip"|"direct_remote_ip"|"remote_ip"|"header"|"url_path"|"metadata"|"filter_state"|"not_id";
}

/**
 * Principal defines an identity or a group of identities for a downstream
 * subject.
 * [#next-free-field: 13]
 */
export interface Principal__Output {
  /**
   * A set of identifiers that all must match in order to define the
   * downstream.
   */
  'and_ids'?: (_envoy_config_rbac_v3_Principal_Set__Output | null);
  /**
   * A set of identifiers at least one must match in order to define the
   * downstream.
   */
  'or_ids'?: (_envoy_config_rbac_v3_Principal_Set__Output | null);
  /**
   * When any is set, it matches any downstream.
   */
  'any'?: (boolean);
  /**
   * Authenticated attributes that identify the downstream.
   */
  'authenticated'?: (_envoy_config_rbac_v3_Principal_Authenticated__Output | null);
  /**
   * A CIDR block that describes the downstream IP.
   * This address will honor proxy protocol, but will not honor XFF.
   * 
   * This field is deprecated; either use :ref:`remote_ip
   * <envoy_v3_api_field_config.rbac.v3.Principal.remote_ip>` for the same
   * behavior, or use
   * :ref:`direct_remote_ip <envoy_v3_api_field_config.rbac.v3.Principal.direct_remote_ip>`.
   * @deprecated
   */
  'source_ip'?: (_envoy_config_core_v3_CidrRange__Output | null);
  /**
   * A header (or pseudo-header such as :path or :method) on the incoming HTTP
   * request. Only available for HTTP request. Note: the pseudo-header :path
   * includes the query and fragment string. Use the ``url_path`` field if you
   * want to match the URL path without the query and fragment string.
   */
  'header'?: (_envoy_config_route_v3_HeaderMatcher__Output | null);
  /**
   * Metadata that describes additional information about the principal.
   */
  'metadata'?: (_envoy_type_matcher_v3_MetadataMatcher__Output | null);
  /**
   * Negates matching the provided principal. For instance, if the value of
   * ``not_id`` would match, this principal would not match. Conversely, if the
   * value of ``not_id`` would not match, this principal would match.
   */
  'not_id'?: (_envoy_config_rbac_v3_Principal__Output | null);
  /**
   * A URL path on the incoming HTTP request. Only available for HTTP.
   */
  'url_path'?: (_envoy_type_matcher_v3_PathMatcher__Output | null);
  /**
   * A CIDR block that describes the downstream remote/origin address.
   * Note: This is always the physical peer even if the
   * :ref:`remote_ip <envoy_v3_api_field_config.rbac.v3.Principal.remote_ip>` is
   * inferred from for example the x-forwarder-for header, proxy protocol,
   * etc.
   */
  'direct_remote_ip'?: (_envoy_config_core_v3_CidrRange__Output | null);
  /**
   * A CIDR block that describes the downstream remote/origin address.
   * Note: This may not be the physical peer and could be different from the
   * :ref:`direct_remote_ip
   * <envoy_v3_api_field_config.rbac.v3.Principal.direct_remote_ip>`. E.g, if the
   * remote ip is inferred from for example the x-forwarder-for header, proxy
   * protocol, etc.
   */
  'remote_ip'?: (_envoy_config_core_v3_CidrRange__Output | null);
  /**
   * Identifies the principal using a filter state object.
   */
  'filter_state'?: (_envoy_type_matcher_v3_FilterStateMatcher__Output | null);
  'identifier'?: "and_ids"|"or_ids"|"any"|"authenticated"|"source_ip"|"direct_remote_ip"|"remote_ip"|"header"|"url_path"|"metadata"|"filter_state"|"not_id";
}
