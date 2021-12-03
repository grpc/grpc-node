// Original file: deps/envoy-api/envoy/config/bootstrap/v3/bootstrap.proto


// Original file: deps/envoy-api/envoy/config/bootstrap/v3/bootstrap.proto

export enum _envoy_config_bootstrap_v3_CustomInlineHeader_InlineHeaderType {
  REQUEST_HEADER = 0,
  REQUEST_TRAILER = 1,
  RESPONSE_HEADER = 2,
  RESPONSE_TRAILER = 3,
}

/**
 * Used to specify the header that needs to be registered as an inline header.
 * 
 * If request or response contain multiple headers with the same name and the header
 * name is registered as an inline header. Then multiple headers will be folded
 * into one, and multiple header values will be concatenated by a suitable delimiter.
 * The delimiter is generally a comma.
 * 
 * For example, if 'foo' is registered as an inline header, and the headers contains
 * the following two headers:
 * 
 * .. code-block:: text
 * 
 * foo: bar
 * foo: eep
 * 
 * Then they will eventually be folded into:
 * 
 * .. code-block:: text
 * 
 * foo: bar, eep
 * 
 * Inline headers provide O(1) search performance, but each inline header imposes
 * an additional memory overhead on all instances of the corresponding type of
 * HeaderMap or TrailerMap.
 */
export interface CustomInlineHeader {
  /**
   * The name of the header that is expected to be set as the inline header.
   */
  'inline_header_name'?: (string);
  /**
   * The type of the header that is expected to be set as the inline header.
   */
  'inline_header_type'?: (_envoy_config_bootstrap_v3_CustomInlineHeader_InlineHeaderType | keyof typeof _envoy_config_bootstrap_v3_CustomInlineHeader_InlineHeaderType);
}

/**
 * Used to specify the header that needs to be registered as an inline header.
 * 
 * If request or response contain multiple headers with the same name and the header
 * name is registered as an inline header. Then multiple headers will be folded
 * into one, and multiple header values will be concatenated by a suitable delimiter.
 * The delimiter is generally a comma.
 * 
 * For example, if 'foo' is registered as an inline header, and the headers contains
 * the following two headers:
 * 
 * .. code-block:: text
 * 
 * foo: bar
 * foo: eep
 * 
 * Then they will eventually be folded into:
 * 
 * .. code-block:: text
 * 
 * foo: bar, eep
 * 
 * Inline headers provide O(1) search performance, but each inline header imposes
 * an additional memory overhead on all instances of the corresponding type of
 * HeaderMap or TrailerMap.
 */
export interface CustomInlineHeader__Output {
  /**
   * The name of the header that is expected to be set as the inline header.
   */
  'inline_header_name': (string);
  /**
   * The type of the header that is expected to be set as the inline header.
   */
  'inline_header_type': (keyof typeof _envoy_config_bootstrap_v3_CustomInlineHeader_InlineHeaderType);
}
