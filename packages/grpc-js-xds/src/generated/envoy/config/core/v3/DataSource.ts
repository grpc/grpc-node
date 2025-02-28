// Original file: deps/envoy-api/envoy/config/core/v3/base.proto

import type { WatchedDirectory as _envoy_config_core_v3_WatchedDirectory, WatchedDirectory__Output as _envoy_config_core_v3_WatchedDirectory__Output } from '../../../../envoy/config/core/v3/WatchedDirectory';

/**
 * Data source consisting of a file, an inline value, or an environment variable.
 * [#next-free-field: 6]
 */
export interface DataSource {
  /**
   * Local filesystem data source.
   */
  'filename'?: (string);
  /**
   * Bytes inlined in the configuration.
   */
  'inline_bytes'?: (Buffer | Uint8Array | string);
  /**
   * String inlined in the configuration.
   */
  'inline_string'?: (string);
  /**
   * Environment variable data source.
   */
  'environment_variable'?: (string);
  /**
   * Watched directory that is watched for file changes. If this is set explicitly, the file
   * specified in the ``filename`` field will be reloaded when relevant file move events occur.
   * 
   * .. note::
   * This field only makes sense when the ``filename`` field is set.
   * 
   * .. note::
   * Envoy only updates when the file is replaced by a file move, and not when the file is
   * edited in place.
   * 
   * .. note::
   * Not all use cases of ``DataSource`` support watching directories. It depends on the
   * specific usage of the ``DataSource``. See the documentation of the parent message for
   * details.
   */
  'watched_directory'?: (_envoy_config_core_v3_WatchedDirectory | null);
  'specifier'?: "filename"|"inline_bytes"|"inline_string"|"environment_variable";
}

/**
 * Data source consisting of a file, an inline value, or an environment variable.
 * [#next-free-field: 6]
 */
export interface DataSource__Output {
  /**
   * Local filesystem data source.
   */
  'filename'?: (string);
  /**
   * Bytes inlined in the configuration.
   */
  'inline_bytes'?: (Buffer);
  /**
   * String inlined in the configuration.
   */
  'inline_string'?: (string);
  /**
   * Environment variable data source.
   */
  'environment_variable'?: (string);
  /**
   * Watched directory that is watched for file changes. If this is set explicitly, the file
   * specified in the ``filename`` field will be reloaded when relevant file move events occur.
   * 
   * .. note::
   * This field only makes sense when the ``filename`` field is set.
   * 
   * .. note::
   * Envoy only updates when the file is replaced by a file move, and not when the file is
   * edited in place.
   * 
   * .. note::
   * Not all use cases of ``DataSource`` support watching directories. It depends on the
   * specific usage of the ``DataSource``. See the documentation of the parent message for
   * details.
   */
  'watched_directory': (_envoy_config_core_v3_WatchedDirectory__Output | null);
  'specifier'?: "filename"|"inline_bytes"|"inline_string"|"environment_variable";
}
