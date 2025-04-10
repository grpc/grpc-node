// Original file: deps/envoy-api/envoy/config/rbac/v3/rbac.proto

import type { HeaderMatcher as _envoy_config_route_v3_HeaderMatcher, HeaderMatcher__Output as _envoy_config_route_v3_HeaderMatcher__Output } from '../../../../envoy/config/route/v3/HeaderMatcher';
import type { CidrRange as _envoy_config_core_v3_CidrRange, CidrRange__Output as _envoy_config_core_v3_CidrRange__Output } from '../../../../envoy/config/core/v3/CidrRange';
import type { MetadataMatcher as _envoy_type_matcher_v3_MetadataMatcher, MetadataMatcher__Output as _envoy_type_matcher_v3_MetadataMatcher__Output } from '../../../../envoy/type/matcher/v3/MetadataMatcher';
import type { Permission as _envoy_config_rbac_v3_Permission, Permission__Output as _envoy_config_rbac_v3_Permission__Output } from '../../../../envoy/config/rbac/v3/Permission';
import type { StringMatcher as _envoy_type_matcher_v3_StringMatcher, StringMatcher__Output as _envoy_type_matcher_v3_StringMatcher__Output } from '../../../../envoy/type/matcher/v3/StringMatcher';
import type { PathMatcher as _envoy_type_matcher_v3_PathMatcher, PathMatcher__Output as _envoy_type_matcher_v3_PathMatcher__Output } from '../../../../envoy/type/matcher/v3/PathMatcher';
import type { Int32Range as _envoy_type_v3_Int32Range, Int32Range__Output as _envoy_type_v3_Int32Range__Output } from '../../../../envoy/type/v3/Int32Range';
import type { TypedExtensionConfig as _envoy_config_core_v3_TypedExtensionConfig, TypedExtensionConfig__Output as _envoy_config_core_v3_TypedExtensionConfig__Output } from '../../../../envoy/config/core/v3/TypedExtensionConfig';

/**
 * Used in the ``and_rules`` and ``or_rules`` fields in the ``rule`` oneof. Depending on the context,
 * each are applied with the associated behavior.
 */
export interface _envoy_config_rbac_v3_Permission_Set {
  'rules'?: (_envoy_config_rbac_v3_Permission)[];
}

/**
 * Used in the ``and_rules`` and ``or_rules`` fields in the ``rule`` oneof. Depending on the context,
 * each are applied with the associated behavior.
 */
export interface _envoy_config_rbac_v3_Permission_Set__Output {
  'rules': (_envoy_config_rbac_v3_Permission__Output)[];
}

/**
 * Permission defines an action (or actions) that a principal can take.
 * [#next-free-field: 14]
 */
export interface Permission {
  /**
   * A set of rules that all must match in order to define the action.
   */
  'and_rules'?: (_envoy_config_rbac_v3_Permission_Set | null);
  /**
   * A set of rules where at least one must match in order to define the action.
   */
  'or_rules'?: (_envoy_config_rbac_v3_Permission_Set | null);
  /**
   * When any is set, it matches any action.
   */
  'any'?: (boolean);
  /**
   * A header (or pseudo-header such as :path or :method) on the incoming HTTP request. Only
   * available for HTTP request.
   * Note: the pseudo-header :path includes the query and fragment string. Use the ``url_path``
   * field if you want to match the URL path without the query and fragment string.
   */
  'header'?: (_envoy_config_route_v3_HeaderMatcher | null);
  /**
   * A CIDR block that describes the destination IP.
   */
  'destination_ip'?: (_envoy_config_core_v3_CidrRange | null);
  /**
   * A port number that describes the destination port connecting to.
   */
  'destination_port'?: (number);
  /**
   * Metadata that describes additional information about the action.
   */
  'metadata'?: (_envoy_type_matcher_v3_MetadataMatcher | null);
  /**
   * Negates matching the provided permission. For instance, if the value of
   * ``not_rule`` would match, this permission would not match. Conversely, if
   * the value of ``not_rule`` would not match, this permission would match.
   */
  'not_rule'?: (_envoy_config_rbac_v3_Permission | null);
  /**
   * The request server from the client's connection request. This is
   * typically TLS SNI.
   * 
   * .. attention::
   * 
   * The behavior of this field may be affected by how Envoy is configured
   * as explained below.
   * 
   * * If the :ref:`TLS Inspector <config_listener_filters_tls_inspector>`
   * filter is not added, and if a ``FilterChainMatch`` is not defined for
   * the :ref:`server name
   * <envoy_v3_api_field_config.listener.v3.FilterChainMatch.server_names>`,
   * a TLS connection's requested SNI server name will be treated as if it
   * wasn't present.
   * 
   * * A :ref:`listener filter <arch_overview_listener_filters>` may
   * overwrite a connection's requested server name within Envoy.
   * 
   * Please refer to :ref:`this FAQ entry <faq_how_to_setup_sni>` to learn to
   * setup SNI.
   */
  'requested_server_name'?: (_envoy_type_matcher_v3_StringMatcher | null);
  /**
   * A URL path on the incoming HTTP request. Only available for HTTP.
   */
  'url_path'?: (_envoy_type_matcher_v3_PathMatcher | null);
  /**
   * A port number range that describes a range of destination ports connecting to.
   */
  'destination_port_range'?: (_envoy_type_v3_Int32Range | null);
  /**
   * Extension for configuring custom matchers for RBAC.
   * [#extension-category: envoy.rbac.matchers]
   */
  'matcher'?: (_envoy_config_core_v3_TypedExtensionConfig | null);
  /**
   * URI template path matching.
   * [#extension-category: envoy.path.match]
   */
  'uri_template'?: (_envoy_config_core_v3_TypedExtensionConfig | null);
  'rule'?: "and_rules"|"or_rules"|"any"|"header"|"url_path"|"destination_ip"|"destination_port"|"destination_port_range"|"metadata"|"not_rule"|"requested_server_name"|"matcher"|"uri_template";
}

/**
 * Permission defines an action (or actions) that a principal can take.
 * [#next-free-field: 14]
 */
export interface Permission__Output {
  /**
   * A set of rules that all must match in order to define the action.
   */
  'and_rules'?: (_envoy_config_rbac_v3_Permission_Set__Output | null);
  /**
   * A set of rules where at least one must match in order to define the action.
   */
  'or_rules'?: (_envoy_config_rbac_v3_Permission_Set__Output | null);
  /**
   * When any is set, it matches any action.
   */
  'any'?: (boolean);
  /**
   * A header (or pseudo-header such as :path or :method) on the incoming HTTP request. Only
   * available for HTTP request.
   * Note: the pseudo-header :path includes the query and fragment string. Use the ``url_path``
   * field if you want to match the URL path without the query and fragment string.
   */
  'header'?: (_envoy_config_route_v3_HeaderMatcher__Output | null);
  /**
   * A CIDR block that describes the destination IP.
   */
  'destination_ip'?: (_envoy_config_core_v3_CidrRange__Output | null);
  /**
   * A port number that describes the destination port connecting to.
   */
  'destination_port'?: (number);
  /**
   * Metadata that describes additional information about the action.
   */
  'metadata'?: (_envoy_type_matcher_v3_MetadataMatcher__Output | null);
  /**
   * Negates matching the provided permission. For instance, if the value of
   * ``not_rule`` would match, this permission would not match. Conversely, if
   * the value of ``not_rule`` would not match, this permission would match.
   */
  'not_rule'?: (_envoy_config_rbac_v3_Permission__Output | null);
  /**
   * The request server from the client's connection request. This is
   * typically TLS SNI.
   * 
   * .. attention::
   * 
   * The behavior of this field may be affected by how Envoy is configured
   * as explained below.
   * 
   * * If the :ref:`TLS Inspector <config_listener_filters_tls_inspector>`
   * filter is not added, and if a ``FilterChainMatch`` is not defined for
   * the :ref:`server name
   * <envoy_v3_api_field_config.listener.v3.FilterChainMatch.server_names>`,
   * a TLS connection's requested SNI server name will be treated as if it
   * wasn't present.
   * 
   * * A :ref:`listener filter <arch_overview_listener_filters>` may
   * overwrite a connection's requested server name within Envoy.
   * 
   * Please refer to :ref:`this FAQ entry <faq_how_to_setup_sni>` to learn to
   * setup SNI.
   */
  'requested_server_name'?: (_envoy_type_matcher_v3_StringMatcher__Output | null);
  /**
   * A URL path on the incoming HTTP request. Only available for HTTP.
   */
  'url_path'?: (_envoy_type_matcher_v3_PathMatcher__Output | null);
  /**
   * A port number range that describes a range of destination ports connecting to.
   */
  'destination_port_range'?: (_envoy_type_v3_Int32Range__Output | null);
  /**
   * Extension for configuring custom matchers for RBAC.
   * [#extension-category: envoy.rbac.matchers]
   */
  'matcher'?: (_envoy_config_core_v3_TypedExtensionConfig__Output | null);
  /**
   * URI template path matching.
   * [#extension-category: envoy.path.match]
   */
  'uri_template'?: (_envoy_config_core_v3_TypedExtensionConfig__Output | null);
  'rule'?: "and_rules"|"or_rules"|"any"|"header"|"url_path"|"destination_ip"|"destination_port"|"destination_port_range"|"metadata"|"not_rule"|"requested_server_name"|"matcher"|"uri_template";
}
