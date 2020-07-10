// Original file: deps/envoy-api/envoy/type/http.proto

export enum CodecClientType {
  HTTP1 = 0,
  HTTP2 = 1,
  /**
   * [#not-implemented-hide:] QUIC implementation is not production ready yet. Use this enum with
   * caution to prevent accidental execution of QUIC code. I.e. `!= HTTP2` is no longer sufficient
   * to distinguish HTTP1 and HTTP2 traffic.
   */
  HTTP3 = 2,
}
