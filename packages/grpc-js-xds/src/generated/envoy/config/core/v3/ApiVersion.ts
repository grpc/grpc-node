// Original file: deps/envoy-api/envoy/config/core/v3/config_source.proto

/**
 * xDS API and non-xDS services version. This is used to describe both resource and transport
 * protocol versions (in distinct configuration fields).
 */
export const ApiVersion = {
  /**
   * When not specified, we assume v3; it is the only supported version.
   */
  AUTO: 'AUTO',
  /**
   * Use xDS v2 API. This is no longer supported.
   * @deprecated
   */
  V2: 'V2',
  /**
   * Use xDS v3 API.
   */
  V3: 'V3',
} as const;

/**
 * xDS API and non-xDS services version. This is used to describe both resource and transport
 * protocol versions (in distinct configuration fields).
 */
export type ApiVersion =
  /**
   * When not specified, we assume v3; it is the only supported version.
   */
  | 'AUTO'
  | 0
  /**
   * Use xDS v2 API. This is no longer supported.
   */
  | 'V2'
  | 1
  /**
   * Use xDS v3 API.
   */
  | 'V3'
  | 2

/**
 * xDS API and non-xDS services version. This is used to describe both resource and transport
 * protocol versions (in distinct configuration fields).
 */
export type ApiVersion__Output = typeof ApiVersion[keyof typeof ApiVersion]
