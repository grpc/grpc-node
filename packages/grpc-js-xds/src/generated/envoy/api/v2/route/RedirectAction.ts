// Original file: deps/envoy-api/envoy/api/v2/route/route_components.proto


// Original file: deps/envoy-api/envoy/api/v2/route/route_components.proto

export enum _envoy_api_v2_route_RedirectAction_RedirectResponseCode {
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
 * [#next-free-field: 9]
 */
export interface RedirectAction {
  /**
   * The host portion of the URL will be swapped with this value.
   */
  'host_redirect'?: (string);
  /**
   * The path portion of the URL will be swapped with this value.
   */
  'path_redirect'?: (string);
  /**
   * The HTTP status code to use in the redirect response. The default response
   * code is MOVED_PERMANENTLY (301).
   */
  'response_code'?: (_envoy_api_v2_route_RedirectAction_RedirectResponseCode | keyof typeof _envoy_api_v2_route_RedirectAction_RedirectResponseCode);
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
   * :ref:`RouteAction's prefix_rewrite <envoy_api_field_route.RouteAction.prefix_rewrite>`.
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
   * When the scheme redirection take place, the following rules apply:
   * 1. If the source URI scheme is `http` and the port is explicitly
   * set to `:80`, the port will be removed after the redirection
   * 2. If the source URI scheme is `https` and the port is explicitly
   * set to `:443`, the port will be removed after the redirection
   */
  'scheme_rewrite_specifier'?: "https_redirect"|"scheme_redirect";
  'path_rewrite_specifier'?: "path_redirect"|"prefix_rewrite";
}

/**
 * [#next-free-field: 9]
 */
export interface RedirectAction__Output {
  /**
   * The host portion of the URL will be swapped with this value.
   */
  'host_redirect': (string);
  /**
   * The path portion of the URL will be swapped with this value.
   */
  'path_redirect'?: (string);
  /**
   * The HTTP status code to use in the redirect response. The default response
   * code is MOVED_PERMANENTLY (301).
   */
  'response_code': (keyof typeof _envoy_api_v2_route_RedirectAction_RedirectResponseCode);
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
   * :ref:`RouteAction's prefix_rewrite <envoy_api_field_route.RouteAction.prefix_rewrite>`.
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
   * When the scheme redirection take place, the following rules apply:
   * 1. If the source URI scheme is `http` and the port is explicitly
   * set to `:80`, the port will be removed after the redirection
   * 2. If the source URI scheme is `https` and the port is explicitly
   * set to `:443`, the port will be removed after the redirection
   */
  'scheme_rewrite_specifier': "https_redirect"|"scheme_redirect";
  'path_rewrite_specifier': "path_redirect"|"prefix_rewrite";
}
