// Original file: deps/envoy-api/envoy/config/bootstrap/v3/bootstrap.proto

import type { Struct as _google_protobuf_Struct, Struct__Output as _google_protobuf_Struct__Output } from '../../../../google/protobuf/Struct';

/**
 * Runtime :ref:`configuration overview <config_runtime>` (deprecated).
 */
export interface Runtime {
  /**
   * The implementation assumes that the file system tree is accessed via a
   * symbolic link. An atomic link swap is used when a new tree should be
   * switched to. This parameter specifies the path to the symbolic link. Envoy
   * will watch the location for changes and reload the file system tree when
   * they happen. If this parameter is not set, there will be no disk based
   * runtime.
   */
  'symlink_root'?: (string);
  /**
   * Specifies the subdirectory to load within the root directory. This is
   * useful if multiple systems share the same delivery mechanism. Envoy
   * configuration elements can be contained in a dedicated subdirectory.
   */
  'subdirectory'?: (string);
  /**
   * Specifies an optional subdirectory to load within the root directory. If
   * specified and the directory exists, configuration values within this
   * directory will override those found in the primary subdirectory. This is
   * useful when Envoy is deployed across many different types of servers.
   * Sometimes it is useful to have a per service cluster directory for runtime
   * configuration. See below for exactly how the override directory is used.
   */
  'override_subdirectory'?: (string);
  /**
   * Static base runtime. This will be :ref:`overridden
   * <config_runtime_layering>` by other runtime layers, e.g.
   * disk or admin. This follows the :ref:`runtime protobuf JSON representation
   * encoding <config_runtime_proto_json>`.
   */
  'base'?: (_google_protobuf_Struct | null);
}

/**
 * Runtime :ref:`configuration overview <config_runtime>` (deprecated).
 */
export interface Runtime__Output {
  /**
   * The implementation assumes that the file system tree is accessed via a
   * symbolic link. An atomic link swap is used when a new tree should be
   * switched to. This parameter specifies the path to the symbolic link. Envoy
   * will watch the location for changes and reload the file system tree when
   * they happen. If this parameter is not set, there will be no disk based
   * runtime.
   */
  'symlink_root': (string);
  /**
   * Specifies the subdirectory to load within the root directory. This is
   * useful if multiple systems share the same delivery mechanism. Envoy
   * configuration elements can be contained in a dedicated subdirectory.
   */
  'subdirectory': (string);
  /**
   * Specifies an optional subdirectory to load within the root directory. If
   * specified and the directory exists, configuration values within this
   * directory will override those found in the primary subdirectory. This is
   * useful when Envoy is deployed across many different types of servers.
   * Sometimes it is useful to have a per service cluster directory for runtime
   * configuration. See below for exactly how the override directory is used.
   */
  'override_subdirectory': (string);
  /**
   * Static base runtime. This will be :ref:`overridden
   * <config_runtime_layering>` by other runtime layers, e.g.
   * disk or admin. This follows the :ref:`runtime protobuf JSON representation
   * encoding <config_runtime_proto_json>`.
   */
  'base': (_google_protobuf_Struct__Output | null);
}
