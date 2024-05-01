// Original file: deps/envoy-api/envoy/type/v3/http.proto

export const CodecClientType = {
  HTTP1: 'HTTP1',
  HTTP2: 'HTTP2',
  /**
   * [#not-implemented-hide:] QUIC implementation is not production ready yet. Use this enum with
   * caution to prevent accidental execution of QUIC code. I.e. `!= HTTP2` is no longer sufficient
   * to distinguish HTTP1 and HTTP2 traffic.
   */
  HTTP3: 'HTTP3',
} as const;

export type CodecClientType =
  | 'HTTP1'
  | 0
  | 'HTTP2'
  | 1
  /**
   * [#not-implemented-hide:] QUIC implementation is not production ready yet. Use this enum with
   * caution to prevent accidental execution of QUIC code. I.e. `!= HTTP2` is no longer sufficient
   * to distinguish HTTP1 and HTTP2 traffic.
   */
  | 'HTTP3'
  | 2

export type CodecClientType__Output = typeof CodecClientType[keyof typeof CodecClientType]
