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
  'host_redirect'?: (string);
  'path_redirect'?: (string);
  'response_code'?: (_envoy_api_v2_route_RedirectAction_RedirectResponseCode | keyof typeof _envoy_api_v2_route_RedirectAction_RedirectResponseCode);
  'https_redirect'?: (boolean);
  'prefix_rewrite'?: (string);
  'strip_query'?: (boolean);
  'scheme_redirect'?: (string);
  'port_redirect'?: (number);
  'scheme_rewrite_specifier'?: "https_redirect"|"scheme_redirect";
  'path_rewrite_specifier'?: "path_redirect"|"prefix_rewrite";
}

export interface RedirectAction__Output {
  'host_redirect': (string);
  'path_redirect'?: (string);
  'response_code': (keyof typeof _envoy_api_v2_route_RedirectAction_RedirectResponseCode);
  'https_redirect'?: (boolean);
  'prefix_rewrite'?: (string);
  'strip_query': (boolean);
  'scheme_redirect'?: (string);
  'port_redirect': (number);
  'scheme_rewrite_specifier': "https_redirect"|"scheme_redirect";
  'path_rewrite_specifier': "path_redirect"|"prefix_rewrite";
}
