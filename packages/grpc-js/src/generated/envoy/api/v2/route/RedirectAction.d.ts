// Original file: deps/envoy-api/envoy/api/v2/route/route_components.proto


// Original file: deps/envoy-api/envoy/api/v2/route/route_components.proto

export enum _envoy_api_v2_route_RedirectAction_RedirectResponseCode {
  MOVED_PERMANENTLY = 0,
  FOUND = 1,
  SEE_OTHER = 2,
  TEMPORARY_REDIRECT = 3,
  PERMANENT_REDIRECT = 4,
}

export interface RedirectAction {
  'https_redirect'?: (boolean);
  'scheme_redirect'?: (string);
  'host_redirect'?: (string);
  'port_redirect'?: (number);
  'path_redirect'?: (string);
  'prefix_rewrite'?: (string);
  'response_code'?: (_envoy_api_v2_route_RedirectAction_RedirectResponseCode | keyof typeof _envoy_api_v2_route_RedirectAction_RedirectResponseCode);
  'strip_query'?: (boolean);
  'scheme_rewrite_specifier'?: "https_redirect"|"scheme_redirect";
  'path_rewrite_specifier'?: "path_redirect"|"prefix_rewrite";
}

export interface RedirectAction__Output {
  'https_redirect'?: (boolean);
  'scheme_redirect'?: (string);
  'host_redirect': (string);
  'port_redirect': (number);
  'path_redirect'?: (string);
  'prefix_rewrite'?: (string);
  'response_code': (keyof typeof _envoy_api_v2_route_RedirectAction_RedirectResponseCode);
  'strip_query': (boolean);
  'scheme_rewrite_specifier': "https_redirect"|"scheme_redirect";
  'path_rewrite_specifier': "path_redirect"|"prefix_rewrite";
}
