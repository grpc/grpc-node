// Original file: deps/envoy-api/envoy/config/route/v3/route_components.proto

import type { RegexMatchAndSubstitute as _envoy_type_matcher_v3_RegexMatchAndSubstitute, RegexMatchAndSubstitute__Output as _envoy_type_matcher_v3_RegexMatchAndSubstitute__Output } from '../../../../envoy/type/matcher/v3/RegexMatchAndSubstitute';

// Original file: deps/envoy-api/envoy/config/route/v3/route_components.proto

export enum _envoy_config_route_v3_RedirectAction_RedirectResponseCode {
  /**
   * Moved Permanently HTTP Status Code - 301.
   */
  MOVED_PERMANENTLY = 0,
  /**
   * Found HTTP Status Code - 302.
   */
  FOUND = 1,
  /**
   * See Other HTTP Status Code - 303.
   */
  SEE_OTHER = 2,
  /**
   * Temporary Redirect HTTP Status Code - 307.
   */
  TEMPORARY_REDIRECT = 3,
  /**
   * Permanent Redirect HTTP Status Code - 308.
   */
  PERMANENT_REDIRECT = 4,
}

/**
 * [#next-free-field: 10]
 */
export interface RedirectAction {
  /**
   * The host portion of the URL will be swapped with this value.
   */
  'host_redirect'?: (string);
  /**
   * The path portion of the URL will be swapped with this value.
   * Please note that query string in path_redirect will override the
   * request's query string and will not be stripped.
   * 
   * For example, let's say we have the following routes:
   * 
   * - match: { path: "/old-path-1" }
   * redirect: { path_redirect: "/new-path-1" }
   * - match: { path: "/old-path-2" }
   * redirect: { path_redirect: "/new-path-2", strip-query: "true" }
   * - match: { path: "/old-path-3" }
   * redirect: { path_redirect: "/new-path-3?foo=1", strip_query: "true" }
   * 
   * 1. if request uri is "/old-path-1?bar=1", users will be redirected to "/new-path-1?bar=1"
   * 2. if request uri is "/old-path-2?bar=1", users will be redirected to "/new-path-2"
   * 3. if request uri is "/old-path-3?bar=1", users will be redirected to "/new-path-3?foo=1"
   */
  'path_redirect'?: (string);
  /**
   * The HTTP status code to use in the redirect response. The default response
   * code is MOVED_PERMANENTLY (301).
   */
  'response_code'?: (_envoy_config_route_v3_RedirectAction_RedirectResponseCode | keyof typeof _envoy_config_route_v3_RedirectAction_RedirectResponseCode);
  /**
   * The scheme portion of the URL will be swapped with "https".
   */
  'https_redirect'?: (boolean);
  /**
   * Indicates that during redirection, the matched prefix (or path)
   * should be swapped with this value. This option allows redirect URLs be dynamically created
   * based on the request.
   * 
   * .. attention::
   * 
   * Pay attention to the use of trailing slashes as mentioned in
   * :ref:`RouteAction's prefix_rewrite <envoy_v3_api_field_config.route.v3.RouteAction.prefix_rewrite>`.
   */
  'prefix_rewrite'?: (string);
  /**
   * Indicates that during redirection, the query portion of the URL will
   * be removed. Default value is false.
   */
  'strip_query'?: (boolean);
  /**
   * The scheme portion of the URL will be swapped with this value.
   */
  'scheme_redirect'?: (string);
  /**
   * The port value of the URL will be swapped with this value.
   */
  'port_redirect'?: (number);
  /**
   * Indicates that during redirect, portions of the path that match the
   * pattern should be rewritten, even allowing the substitution of capture
   * groups from the pattern into the new path as specified by the rewrite
   * substitution string. This is useful to allow application paths to be
   * rewritten in a way that is aware of segments with variable content like
   * identifiers.
   * 
   * Examples using Google's `RE2 <https://github.com/google/re2>`_ engine:
   * 
   * * The path pattern ``^/service/([^/]+)(/.*)$`` paired with a substitution
   * string of ``\2/instance/\1`` would transform ``/service/foo/v1/api``
   * into ``/v1/api/instance/foo``.
   * 
   * * The pattern ``one`` paired with a substitution string of ``two`` would
   * transform ``/xxx/one/yyy/one/zzz`` into ``/xxx/two/yyy/two/zzz``.
   * 
   * * The pattern ``^(.*?)one(.*)$`` paired with a substitution string of
   * ``\1two\2`` would replace only the first occurrence of ``one``,
   * transforming path ``/xxx/one/yyy/one/zzz`` into ``/xxx/two/yyy/one/zzz``.
   * 
   * * The pattern ``(?i)/xxx/`` paired with a substitution string of ``/yyy/``
   * would do a case-insensitive match and transform path ``/aaa/XxX/bbb`` to
   * ``/aaa/yyy/bbb``.
   */
  'regex_rewrite'?: (_envoy_type_matcher_v3_RegexMatchAndSubstitute | null);
  /**
   * When the scheme redirection take place, the following rules apply:
   * 1. If the source URI scheme is ``http`` and the port is explicitly
   * set to ``:80``, the port will be removed after the redirection
   * 2. If the source URI scheme is ``https`` and the port is explicitly
   * set to ``:443``, the port will be removed after the redirection
   */
  'scheme_rewrite_specifier'?: "https_redirect"|"scheme_redirect";
  'path_rewrite_specifier'?: "path_redirect"|"prefix_rewrite"|"regex_rewrite";
}

/**
 * [#next-free-field: 10]
 */
export interface RedirectAction__Output {
  /**
   * The host portion of the URL will be swapped with this value.
   */
  'host_redirect': (string);
  /**
   * The path portion of the URL will be swapped with this value.
   * Please note that query string in path_redirect will override the
   * request's query string and will not be stripped.
   * 
   * For example, let's say we have the following routes:
   * 
   * - match: { path: "/old-path-1" }
   * redirect: { path_redirect: "/new-path-1" }
   * - match: { path: "/old-path-2" }
   * redirect: { path_redirect: "/new-path-2", strip-query: "true" }
   * - match: { path: "/old-path-3" }
   * redirect: { path_redirect: "/new-path-3?foo=1", strip_query: "true" }
   * 
   * 1. if request uri is "/old-path-1?bar=1", users will be redirected to "/new-path-1?bar=1"
   * 2. if request uri is "/old-path-2?bar=1", users will be redirected to "/new-path-2"
   * 3. if request uri is "/old-path-3?bar=1", users will be redirected to "/new-path-3?foo=1"
   */
  'path_redirect'?: (string);
  /**
   * The HTTP status code to use in the redirect response. The default response
   * code is MOVED_PERMANENTLY (301).
   */
  'response_code': (keyof typeof _envoy_config_route_v3_RedirectAction_RedirectResponseCode);
  /**
   * The scheme portion of the URL will be swapped with "https".
   */
  'https_redirect'?: (boolean);
  /**
   * Indicates that during redirection, the matched prefix (or path)
   * should be swapped with this value. This option allows redirect URLs be dynamically created
   * based on the request.
   * 
   * .. attention::
   * 
   * Pay attention to the use of trailing slashes as mentioned in
   * :ref:`RouteAction's prefix_rewrite <envoy_v3_api_field_config.route.v3.RouteAction.prefix_rewrite>`.
   */
  'prefix_rewrite'?: (string);
  /**
   * Indicates that during redirection, the query portion of the URL will
   * be removed. Default value is false.
   */
  'strip_query': (boolean);
  /**
   * The scheme portion of the URL will be swapped with this value.
   */
  'scheme_redirect'?: (string);
  /**
   * The port value of the URL will be swapped with this value.
   */
  'port_redirect': (number);
  /**
   * Indicates that during redirect, portions of the path that match the
   * pattern should be rewritten, even allowing the substitution of capture
   * groups from the pattern into the new path as specified by the rewrite
   * substitution string. This is useful to allow application paths to be
   * rewritten in a way that is aware of segments with variable content like
   * identifiers.
   * 
   * Examples using Google's `RE2 <https://github.com/google/re2>`_ engine:
   * 
   * * The path pattern ``^/service/([^/]+)(/.*)$`` paired with a substitution
   * string of ``\2/instance/\1`` would transform ``/service/foo/v1/api``
   * into ``/v1/api/instance/foo``.
   * 
   * * The pattern ``one`` paired with a substitution string of ``two`` would
   * transform ``/xxx/one/yyy/one/zzz`` into ``/xxx/two/yyy/two/zzz``.
   * 
   * * The pattern ``^(.*?)one(.*)$`` paired with a substitution string of
   * ``\1two\2`` would replace only the first occurrence of ``one``,
   * transforming path ``/xxx/one/yyy/one/zzz`` into ``/xxx/two/yyy/one/zzz``.
   * 
   * * The pattern ``(?i)/xxx/`` paired with a substitution string of ``/yyy/``
   * would do a case-insensitive match and transform path ``/aaa/XxX/bbb`` to
   * ``/aaa/yyy/bbb``.
   */
  'regex_rewrite'?: (_envoy_type_matcher_v3_RegexMatchAndSubstitute__Output | null);
  /**
   * When the scheme redirection take place, the following rules apply:
   * 1. If the source URI scheme is ``http`` and the port is explicitly
   * set to ``:80``, the port will be removed after the redirection
   * 2. If the source URI scheme is ``https`` and the port is explicitly
   * set to ``:443``, the port will be removed after the redirection
   */
  'scheme_rewrite_specifier': "https_redirect"|"scheme_redirect";
  'path_rewrite_specifier': "path_redirect"|"prefix_rewrite"|"regex_rewrite";
}
