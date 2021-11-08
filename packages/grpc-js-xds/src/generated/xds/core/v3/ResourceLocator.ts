// Original file: deps/xds/xds/core/v3/resource_locator.proto

import type { ContextParams as _xds_core_v3_ContextParams, ContextParams__Output as _xds_core_v3_ContextParams__Output } from '../../../xds/core/v3/ContextParams';
import type { ResourceLocator as _xds_core_v3_ResourceLocator, ResourceLocator__Output as _xds_core_v3_ResourceLocator__Output } from '../../../xds/core/v3/ResourceLocator';

/**
 * Directives provide information to data-plane load balancers on how xDS
 * resource names are to be interpreted and potentially further resolved. For
 * example, they may provide alternative resource locators for when primary
 * resolution fails. Directives are not part of resource names and do not
 * appear in a xDS transport discovery request.
 * 
 * When encoding to URIs, directives take the form:
 * 
 * <directive name>=<string representation of directive value>
 * 
 * For example, we can have alt=xdstp://foo/bar or entry=some%20thing. Each
 * directive value type may have its own string encoding, in the case of
 * ResourceLocator there is a recursive URI encoding.
 * 
 * Percent encoding applies to the URI encoding of the directive value.
 * Multiple directives are comma-separated, so the reserved characters that
 * require percent encoding in a directive value are [',', '#', '[', ']',
 * '%']. These are the RFC3986 fragment reserved characters with the addition
 * of the xDS scheme specific ','. See
 * https://tools.ietf.org/html/rfc3986#page-49 for further details on URI ABNF
 * and reserved characters.
 */
export interface _xds_core_v3_ResourceLocator_Directive {
  /**
   * An alternative resource locator for fallback if the resource is
   * unavailable. For example, take the resource locator:
   * 
   * xdstp://foo/some-type/some-route-table#alt=xdstp://bar/some-type/another-route-table
   * 
   * If the data-plane load balancer is unable to reach `foo` to fetch the
   * resource, it will fallback to `bar`. Alternative resources do not need
   * to have equivalent content, but they should be functional substitutes.
   */
  'alt'?: (_xds_core_v3_ResourceLocator | null);
  /**
   * List collections support inlining of resources via the entry field in
   * Resource. These inlined Resource objects may have an optional name
   * field specified. When specified, the entry directive allows
   * ResourceLocator to directly reference these inlined resources, e.g.
   * xdstp://.../foo#entry=bar.
   */
  'entry'?: (string);
  'directive'?: "alt"|"entry";
}

/**
 * Directives provide information to data-plane load balancers on how xDS
 * resource names are to be interpreted and potentially further resolved. For
 * example, they may provide alternative resource locators for when primary
 * resolution fails. Directives are not part of resource names and do not
 * appear in a xDS transport discovery request.
 * 
 * When encoding to URIs, directives take the form:
 * 
 * <directive name>=<string representation of directive value>
 * 
 * For example, we can have alt=xdstp://foo/bar or entry=some%20thing. Each
 * directive value type may have its own string encoding, in the case of
 * ResourceLocator there is a recursive URI encoding.
 * 
 * Percent encoding applies to the URI encoding of the directive value.
 * Multiple directives are comma-separated, so the reserved characters that
 * require percent encoding in a directive value are [',', '#', '[', ']',
 * '%']. These are the RFC3986 fragment reserved characters with the addition
 * of the xDS scheme specific ','. See
 * https://tools.ietf.org/html/rfc3986#page-49 for further details on URI ABNF
 * and reserved characters.
 */
export interface _xds_core_v3_ResourceLocator_Directive__Output {
  /**
   * An alternative resource locator for fallback if the resource is
   * unavailable. For example, take the resource locator:
   * 
   * xdstp://foo/some-type/some-route-table#alt=xdstp://bar/some-type/another-route-table
   * 
   * If the data-plane load balancer is unable to reach `foo` to fetch the
   * resource, it will fallback to `bar`. Alternative resources do not need
   * to have equivalent content, but they should be functional substitutes.
   */
  'alt'?: (_xds_core_v3_ResourceLocator__Output | null);
  /**
   * List collections support inlining of resources via the entry field in
   * Resource. These inlined Resource objects may have an optional name
   * field specified. When specified, the entry directive allows
   * ResourceLocator to directly reference these inlined resources, e.g.
   * xdstp://.../foo#entry=bar.
   */
  'entry'?: (string);
  'directive': "alt"|"entry";
}

// Original file: deps/xds/xds/core/v3/resource_locator.proto

export enum _xds_core_v3_ResourceLocator_Scheme {
  XDSTP = 0,
  HTTP = 1,
  FILE = 2,
}

/**
 * xDS resource locators identify a xDS resource name and instruct the
 * data-plane load balancer on how the resource may be located.
 * 
 * Resource locators have a canonical xdstp:// URI representation:
 * 
 * xdstp://{authority}/{type_url}/{id}?{context_params}{#directive,*}
 * 
 * where context_params take the form of URI query parameters.
 * 
 * Resource locators have a similar canonical http:// URI representation:
 * 
 * http://{authority}/{type_url}/{id}?{context_params}{#directive,*}
 * 
 * Resource locators also have a simplified file:// URI representation:
 * 
 * file:///{id}{#directive,*}
 */
export interface ResourceLocator {
  /**
   * URI scheme.
   */
  'scheme'?: (_xds_core_v3_ResourceLocator_Scheme | keyof typeof _xds_core_v3_ResourceLocator_Scheme);
  /**
   * Opaque identifier for the resource. Any '/' will not be escaped during URI
   * encoding and will form part of the URI path. This may end
   * with ‘*’ for glob collection references.
   */
  'id'?: (string);
  /**
   * Logical authority for resource (not necessarily transport network address).
   * Authorities are opaque in the xDS API, data-plane load balancers will map
   * them to concrete network transports such as an xDS management server, e.g.
   * via envoy.config.core.v3.ConfigSource.
   */
  'authority'?: (string);
  /**
   * Fully qualified resource type (as in type URL without types.googleapis.com/
   * prefix).
   */
  'resource_type'?: (string);
  /**
   * Additional parameters that can be used to select resource variants.
   * Matches must be exact, i.e. all context parameters must match exactly and
   * there must be no additional context parameters set on the matched
   * resource.
   */
  'exact_context'?: (_xds_core_v3_ContextParams | null);
  /**
   * A list of directives that appear in the xDS resource locator #fragment.
   * 
   * When encoding to URI form, directives are percent encoded with comma
   * separation.
   */
  'directives'?: (_xds_core_v3_ResourceLocator_Directive)[];
  'context_param_specifier'?: "exact_context";
}

/**
 * xDS resource locators identify a xDS resource name and instruct the
 * data-plane load balancer on how the resource may be located.
 * 
 * Resource locators have a canonical xdstp:// URI representation:
 * 
 * xdstp://{authority}/{type_url}/{id}?{context_params}{#directive,*}
 * 
 * where context_params take the form of URI query parameters.
 * 
 * Resource locators have a similar canonical http:// URI representation:
 * 
 * http://{authority}/{type_url}/{id}?{context_params}{#directive,*}
 * 
 * Resource locators also have a simplified file:// URI representation:
 * 
 * file:///{id}{#directive,*}
 */
export interface ResourceLocator__Output {
  /**
   * URI scheme.
   */
  'scheme': (keyof typeof _xds_core_v3_ResourceLocator_Scheme);
  /**
   * Opaque identifier for the resource. Any '/' will not be escaped during URI
   * encoding and will form part of the URI path. This may end
   * with ‘*’ for glob collection references.
   */
  'id': (string);
  /**
   * Logical authority for resource (not necessarily transport network address).
   * Authorities are opaque in the xDS API, data-plane load balancers will map
   * them to concrete network transports such as an xDS management server, e.g.
   * via envoy.config.core.v3.ConfigSource.
   */
  'authority': (string);
  /**
   * Fully qualified resource type (as in type URL without types.googleapis.com/
   * prefix).
   */
  'resource_type': (string);
  /**
   * Additional parameters that can be used to select resource variants.
   * Matches must be exact, i.e. all context parameters must match exactly and
   * there must be no additional context parameters set on the matched
   * resource.
   */
  'exact_context'?: (_xds_core_v3_ContextParams__Output | null);
  /**
   * A list of directives that appear in the xDS resource locator #fragment.
   * 
   * When encoding to URI form, directives are percent encoded with comma
   * separation.
   */
  'directives': (_xds_core_v3_ResourceLocator_Directive__Output)[];
  'context_param_specifier': "exact_context";
}
