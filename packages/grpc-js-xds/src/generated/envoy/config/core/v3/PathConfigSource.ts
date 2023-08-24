// Original file: deps/envoy-api/envoy/config/core/v3/config_source.proto

import type { WatchedDirectory as _envoy_config_core_v3_WatchedDirectory, WatchedDirectory__Output as _envoy_config_core_v3_WatchedDirectory__Output } from '../../../../envoy/config/core/v3/WatchedDirectory';

/**
 * Local filesystem path configuration source.
 */
export interface PathConfigSource {
  /**
   * Path on the filesystem to source and watch for configuration updates.
   * When sourcing configuration for a :ref:`secret <envoy_v3_api_msg_extensions.transport_sockets.tls.v3.Secret>`,
   * the certificate and key files are also watched for updates.
   * 
   * .. note::
   * 
   * The path to the source must exist at config load time.
   * 
   * .. note::
   * 
   * If ``watched_directory`` is *not* configured, Envoy will watch the file path for *moves*.
   * This is because in general only moves are atomic. The same method of swapping files as is
   * demonstrated in the :ref:`runtime documentation <config_runtime_symbolic_link_swap>` can be
   * used here also. If ``watched_directory`` is configured, no watch will be placed directly on
   * this path. Instead, the configured ``watched_directory`` will be used to trigger reloads of
   * this path. This is required in certain deployment scenarios. See below for more information.
   */
  'path'?: (string);
  /**
   * If configured, this directory will be watched for *moves*. When an entry in this directory is
   * moved to, the ``path`` will be reloaded. This is required in certain deployment scenarios.
   * 
   * Specifically, if trying to load an xDS resource using a
   * `Kubernetes ConfigMap <https://kubernetes.io/docs/concepts/configuration/configmap/>`_, the
   * following configuration might be used:
   * 1. Store xds.yaml inside a ConfigMap.
   * 2. Mount the ConfigMap to ``/config_map/xds``
   * 3. Configure path ``/config_map/xds/xds.yaml``
   * 4. Configure watched directory ``/config_map/xds``
   * 
   * The above configuration will ensure that Envoy watches the owning directory for moves which is
   * required due to how Kubernetes manages ConfigMap symbolic links during atomic updates.
   */
  'watched_directory'?: (_envoy_config_core_v3_WatchedDirectory | null);
}

/**
 * Local filesystem path configuration source.
 */
export interface PathConfigSource__Output {
  /**
   * Path on the filesystem to source and watch for configuration updates.
   * When sourcing configuration for a :ref:`secret <envoy_v3_api_msg_extensions.transport_sockets.tls.v3.Secret>`,
   * the certificate and key files are also watched for updates.
   * 
   * .. note::
   * 
   * The path to the source must exist at config load time.
   * 
   * .. note::
   * 
   * If ``watched_directory`` is *not* configured, Envoy will watch the file path for *moves*.
   * This is because in general only moves are atomic. The same method of swapping files as is
   * demonstrated in the :ref:`runtime documentation <config_runtime_symbolic_link_swap>` can be
   * used here also. If ``watched_directory`` is configured, no watch will be placed directly on
   * this path. Instead, the configured ``watched_directory`` will be used to trigger reloads of
   * this path. This is required in certain deployment scenarios. See below for more information.
   */
  'path': (string);
  /**
   * If configured, this directory will be watched for *moves*. When an entry in this directory is
   * moved to, the ``path`` will be reloaded. This is required in certain deployment scenarios.
   * 
   * Specifically, if trying to load an xDS resource using a
   * `Kubernetes ConfigMap <https://kubernetes.io/docs/concepts/configuration/configmap/>`_, the
   * following configuration might be used:
   * 1. Store xds.yaml inside a ConfigMap.
   * 2. Mount the ConfigMap to ``/config_map/xds``
   * 3. Configure path ``/config_map/xds/xds.yaml``
   * 4. Configure watched directory ``/config_map/xds``
   * 
   * The above configuration will ensure that Envoy watches the owning directory for moves which is
   * required due to how Kubernetes manages ConfigMap symbolic links during atomic updates.
   */
  'watched_directory': (_envoy_config_core_v3_WatchedDirectory__Output | null);
}
