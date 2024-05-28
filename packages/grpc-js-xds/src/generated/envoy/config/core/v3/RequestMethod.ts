// Original file: deps/envoy-api/envoy/config/core/v3/base.proto

/**
 * HTTP request method.
 */
export const RequestMethod = {
  METHOD_UNSPECIFIED: 'METHOD_UNSPECIFIED',
  GET: 'GET',
  HEAD: 'HEAD',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
  CONNECT: 'CONNECT',
  OPTIONS: 'OPTIONS',
  TRACE: 'TRACE',
  PATCH: 'PATCH',
} as const;

/**
 * HTTP request method.
 */
export type RequestMethod =
  | 'METHOD_UNSPECIFIED'
  | 0
  | 'GET'
  | 1
  | 'HEAD'
  | 2
  | 'POST'
  | 3
  | 'PUT'
  | 4
  | 'DELETE'
  | 5
  | 'CONNECT'
  | 6
  | 'OPTIONS'
  | 7
  | 'TRACE'
  | 8
  | 'PATCH'
  | 9

/**
 * HTTP request method.
 */
export type RequestMethod__Output = typeof RequestMethod[keyof typeof RequestMethod]
