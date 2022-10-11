// Original file: deps/googleapis/google/api/http.proto

import type { IHttpRule as I_google_api_HttpRule, OHttpRule as O_google_api_HttpRule } from '../../google/api/HttpRule';

/**
 * Defines the HTTP configuration for an API service. It contains a list of
 * [HttpRule][google.api.HttpRule], each specifying the mapping of an RPC method
 * to one or more HTTP REST API methods.
 */
export interface IHttp {
  /**
   * A list of HTTP configuration rules that apply to individual API methods.
   * 
   * **NOTE:** All service configuration rules follow "last one wins" order.
   */
  'rules'?: (I_google_api_HttpRule)[];
  /**
   * When set to true, URL path parameters will be fully URI-decoded except in
   * cases of single segment matches in reserved expansion, where "%2F" will be
   * left encoded.
   * 
   * The default behavior is to not decode RFC 6570 reserved characters in multi
   * segment matches.
   */
  'fully_decode_reserved_expansion'?: (boolean);
}

/**
 * Defines the HTTP configuration for an API service. It contains a list of
 * [HttpRule][google.api.HttpRule], each specifying the mapping of an RPC method
 * to one or more HTTP REST API methods.
 */
export interface OHttp {
  /**
   * A list of HTTP configuration rules that apply to individual API methods.
   * 
   * **NOTE:** All service configuration rules follow "last one wins" order.
   */
  'rules': (O_google_api_HttpRule)[];
  /**
   * When set to true, URL path parameters will be fully URI-decoded except in
   * cases of single segment matches in reserved expansion, where "%2F" will be
   * left encoded.
   * 
   * The default behavior is to not decode RFC 6570 reserved characters in multi
   * segment matches.
   */
  'fully_decode_reserved_expansion': (boolean);
}
