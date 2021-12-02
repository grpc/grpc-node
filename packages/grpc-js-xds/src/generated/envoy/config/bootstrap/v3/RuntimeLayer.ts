// Original file: deps/envoy-api/envoy/config/bootstrap/v3/bootstrap.proto

import type { Struct as _google_protobuf_Struct, Struct__Output as _google_protobuf_Struct__Output } from '../../../../google/protobuf/Struct';
import type { ConfigSource as _envoy_config_core_v3_ConfigSource, ConfigSource__Output as _envoy_config_core_v3_ConfigSource__Output } from '../../../../envoy/config/core/v3/ConfigSource';

/**
 * :ref:`Admin console runtime <config_runtime_admin>` layer.
 */
export interface _envoy_config_bootstrap_v3_RuntimeLayer_AdminLayer {
}

/**
 * :ref:`Admin console runtime <config_runtime_admin>` layer.
 */
export interface _envoy_config_bootstrap_v3_RuntimeLayer_AdminLayer__Output {
}

/**
 * :ref:`Disk runtime <config_runtime_local_disk>` layer.
 */
export interface _envoy_config_bootstrap_v3_RuntimeLayer_DiskLayer {
  /**
   * The implementation assumes that the file system tree is accessed via a
   * symbolic link. An atomic link swap is used when a new tree should be
   * switched to. This parameter specifies the path to the symbolic link.
   * Envoy will watch the location for changes and reload the file system tree
   * when they happen. See documentation on runtime :ref:`atomicity
   * <config_runtime_atomicity>` for further details on how reloads are
   * treated.
   */
  'symlink_root'?: (string);
  /**
   * Specifies the subdirectory to load within the root directory. This is
   * useful if multiple systems share the same delivery mechanism. Envoy
   * configuration elements can be contained in a dedicated subdirectory.
   */
  'subdirectory'?: (string);
  /**
   * :ref:`Append <config_runtime_local_disk_service_cluster_subdirs>` the
   * service cluster to the path under symlink root.
   */
  'append_service_cluster'?: (boolean);
}

/**
 * :ref:`Disk runtime <config_runtime_local_disk>` layer.
 */
export interface _envoy_config_bootstrap_v3_RuntimeLayer_DiskLayer__Output {
  /**
   * The implementation assumes that the file system tree is accessed via a
   * symbolic link. An atomic link swap is used when a new tree should be
   * switched to. This parameter specifies the path to the symbolic link.
   * Envoy will watch the location for changes and reload the file system tree
   * when they happen. See documentation on runtime :ref:`atomicity
   * <config_runtime_atomicity>` for further details on how reloads are
   * treated.
   */
  'symlink_root': (string);
  /**
   * Specifies the subdirectory to load within the root directory. This is
   * useful if multiple systems share the same delivery mechanism. Envoy
   * configuration elements can be contained in a dedicated subdirectory.
   */
  'subdirectory': (string);
  /**
   * :ref:`Append <config_runtime_local_disk_service_cluster_subdirs>` the
   * service cluster to the path under symlink root.
   */
  'append_service_cluster': (boolean);
}

/**
 * :ref:`Runtime Discovery Service (RTDS) <config_runtime_rtds>` layer.
 */
export interface _envoy_config_bootstrap_v3_RuntimeLayer_RtdsLayer {
  /**
   * Resource to subscribe to at *rtds_config* for the RTDS layer.
   */
  'name'?: (string);
  /**
   * RTDS configuration source.
   */
  'rtds_config'?: (_envoy_config_core_v3_ConfigSource | null);
}

/**
 * :ref:`Runtime Discovery Service (RTDS) <config_runtime_rtds>` layer.
 */
export interface _envoy_config_bootstrap_v3_RuntimeLayer_RtdsLayer__Output {
  /**
   * Resource to subscribe to at *rtds_config* for the RTDS layer.
   */
  'name': (string);
  /**
   * RTDS configuration source.
   */
  'rtds_config': (_envoy_config_core_v3_ConfigSource__Output | null);
}

/**
 * [#next-free-field: 6]
 */
export interface RuntimeLayer {
  /**
   * Descriptive name for the runtime layer. This is only used for the runtime
   * :http:get:`/runtime` output.
   */
  'name'?: (string);
  /**
   * :ref:`Static runtime <config_runtime_bootstrap>` layer.
   * This follows the :ref:`runtime protobuf JSON representation encoding
   * <config_runtime_proto_json>`. Unlike static xDS resources, this static
   * layer is overridable by later layers in the runtime virtual filesystem.
   */
  'static_layer'?: (_google_protobuf_Struct | null);
  'disk_layer'?: (_envoy_config_bootstrap_v3_RuntimeLayer_DiskLayer | null);
  'admin_layer'?: (_envoy_config_bootstrap_v3_RuntimeLayer_AdminLayer | null);
  'rtds_layer'?: (_envoy_config_bootstrap_v3_RuntimeLayer_RtdsLayer | null);
  'layer_specifier'?: "static_layer"|"disk_layer"|"admin_layer"|"rtds_layer";
}

/**
 * [#next-free-field: 6]
 */
export interface RuntimeLayer__Output {
  /**
   * Descriptive name for the runtime layer. This is only used for the runtime
   * :http:get:`/runtime` output.
   */
  'name': (string);
  /**
   * :ref:`Static runtime <config_runtime_bootstrap>` layer.
   * This follows the :ref:`runtime protobuf JSON representation encoding
   * <config_runtime_proto_json>`. Unlike static xDS resources, this static
   * layer is overridable by later layers in the runtime virtual filesystem.
   */
  'static_layer'?: (_google_protobuf_Struct__Output | null);
  'disk_layer'?: (_envoy_config_bootstrap_v3_RuntimeLayer_DiskLayer__Output | null);
  'admin_layer'?: (_envoy_config_bootstrap_v3_RuntimeLayer_AdminLayer__Output | null);
  'rtds_layer'?: (_envoy_config_bootstrap_v3_RuntimeLayer_RtdsLayer__Output | null);
  'layer_specifier': "static_layer"|"disk_layer"|"admin_layer"|"rtds_layer";
}
