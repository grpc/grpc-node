// Original file: deps/protoc-gen-validate/validate/validate.proto

/**
 * WellKnownRegex contain some well-known patterns.
 */
export enum KnownRegex {
  UNKNOWN = 0,
  /**
   * HTTP header name as defined by RFC 7230.
   */
  HTTP_HEADER_NAME = 1,
  /**
   * HTTP header value as defined by RFC 7230.
   */
  HTTP_HEADER_VALUE = 2,
}
