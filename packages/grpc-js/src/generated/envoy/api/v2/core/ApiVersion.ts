// Original file: deps/envoy-api/envoy/api/v2/core/config_source.proto

/**
 * xDS API version. This is used to describe both resource and transport
 * protocol versions (in distinct configuration fields).
 */
export enum ApiVersion {
  /**
   * When not specified, we assume v2, to ease migration to Envoy's stable API
   * versioning. If a client does not support v2 (e.g. due to deprecation), this
   * is an invalid value.
   */
  AUTO = 0,
  /**
   * Use xDS v2 API.
   */
  V2 = 1,
  /**
   * Use xDS v3 API.
   */
  V3 = 2,
}
