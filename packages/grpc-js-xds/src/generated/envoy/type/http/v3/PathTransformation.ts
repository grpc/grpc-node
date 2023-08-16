// Original file: deps/envoy-api/envoy/type/http/v3/path_transformation.proto


/**
 * Determines if adjacent slashes are merged into one. A common use case is for a request path
 * header. Using this option in ``:ref: PathNormalizationOptions
 * <envoy_v3_api_msg_extensions.filters.network.http_connection_manager.v3.HttpConnectionManager.PathNormalizationOptions>``
 * will allow incoming requests with path ``//dir///file`` to match against route with ``prefix``
 * match set to ``/dir``. When using for header transformations, note that slash merging is not
 * part of `HTTP spec <https://tools.ietf.org/html/rfc3986>`_ and is provided for convenience.
 */
export interface _envoy_type_http_v3_PathTransformation_Operation_MergeSlashes {
}

/**
 * Determines if adjacent slashes are merged into one. A common use case is for a request path
 * header. Using this option in ``:ref: PathNormalizationOptions
 * <envoy_v3_api_msg_extensions.filters.network.http_connection_manager.v3.HttpConnectionManager.PathNormalizationOptions>``
 * will allow incoming requests with path ``//dir///file`` to match against route with ``prefix``
 * match set to ``/dir``. When using for header transformations, note that slash merging is not
 * part of `HTTP spec <https://tools.ietf.org/html/rfc3986>`_ and is provided for convenience.
 */
export interface _envoy_type_http_v3_PathTransformation_Operation_MergeSlashes__Output {
}

/**
 * Should text be normalized according to RFC 3986? This typically is used for path headers
 * before any processing of requests by HTTP filters or routing. This applies percent-encoded
 * normalization and path segment normalization. Fails on characters disallowed in URLs
 * (e.g. NULLs). See `Normalization and Comparison
 * <https://tools.ietf.org/html/rfc3986#section-6>`_ for details of normalization. Note that
 * this options does not perform `case normalization
 * <https://tools.ietf.org/html/rfc3986#section-6.2.2.1>`_
 */
export interface _envoy_type_http_v3_PathTransformation_Operation_NormalizePathRFC3986 {
}

/**
 * Should text be normalized according to RFC 3986? This typically is used for path headers
 * before any processing of requests by HTTP filters or routing. This applies percent-encoded
 * normalization and path segment normalization. Fails on characters disallowed in URLs
 * (e.g. NULLs). See `Normalization and Comparison
 * <https://tools.ietf.org/html/rfc3986#section-6>`_ for details of normalization. Note that
 * this options does not perform `case normalization
 * <https://tools.ietf.org/html/rfc3986#section-6.2.2.1>`_
 */
export interface _envoy_type_http_v3_PathTransformation_Operation_NormalizePathRFC3986__Output {
}

/**
 * A type of operation to alter text.
 */
export interface _envoy_type_http_v3_PathTransformation_Operation {
  /**
   * Enable path normalization per RFC 3986.
   */
  'normalize_path_rfc_3986'?: (_envoy_type_http_v3_PathTransformation_Operation_NormalizePathRFC3986 | null);
  /**
   * Enable merging adjacent slashes.
   */
  'merge_slashes'?: (_envoy_type_http_v3_PathTransformation_Operation_MergeSlashes | null);
  'operation_specifier'?: "normalize_path_rfc_3986"|"merge_slashes";
}

/**
 * A type of operation to alter text.
 */
export interface _envoy_type_http_v3_PathTransformation_Operation__Output {
  /**
   * Enable path normalization per RFC 3986.
   */
  'normalize_path_rfc_3986'?: (_envoy_type_http_v3_PathTransformation_Operation_NormalizePathRFC3986__Output | null);
  /**
   * Enable merging adjacent slashes.
   */
  'merge_slashes'?: (_envoy_type_http_v3_PathTransformation_Operation_MergeSlashes__Output | null);
  'operation_specifier': "normalize_path_rfc_3986"|"merge_slashes";
}

export interface PathTransformation {
  /**
   * A list of operations to apply. Transformations will be performed in the order that they appear.
   */
  'operations'?: (_envoy_type_http_v3_PathTransformation_Operation)[];
}

export interface PathTransformation__Output {
  /**
   * A list of operations to apply. Transformations will be performed in the order that they appear.
   */
  'operations': (_envoy_type_http_v3_PathTransformation_Operation__Output)[];
}
