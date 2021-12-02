// Original file: deps/envoy-api/envoy/config/core/v3/config_source.proto

import type { ApiConfigSource as _envoy_config_core_v3_ApiConfigSource, ApiConfigSource__Output as _envoy_config_core_v3_ApiConfigSource__Output } from '../../../../envoy/config/core/v3/ApiConfigSource';
import type { AggregatedConfigSource as _envoy_config_core_v3_AggregatedConfigSource, AggregatedConfigSource__Output as _envoy_config_core_v3_AggregatedConfigSource__Output } from '../../../../envoy/config/core/v3/AggregatedConfigSource';
import type { Duration as _google_protobuf_Duration, Duration__Output as _google_protobuf_Duration__Output } from '../../../../google/protobuf/Duration';
import type { SelfConfigSource as _envoy_config_core_v3_SelfConfigSource, SelfConfigSource__Output as _envoy_config_core_v3_SelfConfigSource__Output } from '../../../../envoy/config/core/v3/SelfConfigSource';
import type { ApiVersion as _envoy_config_core_v3_ApiVersion } from '../../../../envoy/config/core/v3/ApiVersion';
import type { Authority as _xds_core_v3_Authority, Authority__Output as _xds_core_v3_Authority__Output } from '../../../../xds/core/v3/Authority';

/**
 * Configuration for :ref:`listeners <config_listeners>`, :ref:`clusters
 * <config_cluster_manager>`, :ref:`routes
 * <envoy_v3_api_msg_config.route.v3.RouteConfiguration>`, :ref:`endpoints
 * <arch_overview_service_discovery>` etc. may either be sourced from the
 * filesystem or from an xDS API source. Filesystem configs are watched with
 * inotify for updates.
 * [#next-free-field: 8]
 */
export interface ConfigSource {
  /**
   * Path on the filesystem to source and watch for configuration updates.
   * When sourcing configuration for :ref:`secret <envoy_v3_api_msg_extensions.transport_sockets.tls.v3.Secret>`,
   * the certificate and key files are also watched for updates.
   * 
   * .. note::
   * 
   * The path to the source must exist at config load time.
   * 
   * .. note::
   * 
   * Envoy will only watch the file path for *moves.* This is because in general only moves
   * are atomic. The same method of swapping files as is demonstrated in the
   * :ref:`runtime documentation <config_runtime_symbolic_link_swap>` can be used here also.
   */
  'path'?: (string);
  /**
   * API configuration source.
   */
  'api_config_source'?: (_envoy_config_core_v3_ApiConfigSource | null);
  /**
   * When set, ADS will be used to fetch resources. The ADS API configuration
   * source in the bootstrap configuration is used.
   */
  'ads'?: (_envoy_config_core_v3_AggregatedConfigSource | null);
  /**
   * When this timeout is specified, Envoy will wait no longer than the specified time for first
   * config response on this xDS subscription during the :ref:`initialization process
   * <arch_overview_initialization>`. After reaching the timeout, Envoy will move to the next
   * initialization phase, even if the first config is not delivered yet. The timer is activated
   * when the xDS API subscription starts, and is disarmed on first config update or on error. 0
   * means no timeout - Envoy will wait indefinitely for the first xDS config (unless another
   * timeout applies). The default is 15s.
   */
  'initial_fetch_timeout'?: (_google_protobuf_Duration | null);
  /**
   * [#not-implemented-hide:]
   * When set, the client will access the resources from the same server it got the
   * ConfigSource from, although not necessarily from the same stream. This is similar to the
   * :ref:`ads<envoy_v3_api_field.ConfigSource.ads>` field, except that the client may use a
   * different stream to the same server. As a result, this field can be used for things
   * like LRS that cannot be sent on an ADS stream. It can also be used to link from (e.g.)
   * LDS to RDS on the same server without requiring the management server to know its name
   * or required credentials.
   * [#next-major-version: In xDS v3, consider replacing the ads field with this one, since
   * this field can implicitly mean to use the same stream in the case where the ConfigSource
   * is provided via ADS and the specified data can also be obtained via ADS.]
   */
  'self'?: (_envoy_config_core_v3_SelfConfigSource | null);
  /**
   * API version for xDS resources. This implies the type URLs that the client
   * will request for resources and the resource type that the client will in
   * turn expect to be delivered.
   */
  'resource_api_version'?: (_envoy_config_core_v3_ApiVersion | keyof typeof _envoy_config_core_v3_ApiVersion);
  /**
   * Authorities that this config source may be used for. An authority specified in a xdstp:// URL
   * is resolved to a *ConfigSource* prior to configuration fetch. This field provides the
   * association between authority name and configuration source.
   * [#not-implemented-hide:]
   */
  'authorities'?: (_xds_core_v3_Authority)[];
  'config_source_specifier'?: "path"|"api_config_source"|"ads"|"self";
}

/**
 * Configuration for :ref:`listeners <config_listeners>`, :ref:`clusters
 * <config_cluster_manager>`, :ref:`routes
 * <envoy_v3_api_msg_config.route.v3.RouteConfiguration>`, :ref:`endpoints
 * <arch_overview_service_discovery>` etc. may either be sourced from the
 * filesystem or from an xDS API source. Filesystem configs are watched with
 * inotify for updates.
 * [#next-free-field: 8]
 */
export interface ConfigSource__Output {
  /**
   * Path on the filesystem to source and watch for configuration updates.
   * When sourcing configuration for :ref:`secret <envoy_v3_api_msg_extensions.transport_sockets.tls.v3.Secret>`,
   * the certificate and key files are also watched for updates.
   * 
   * .. note::
   * 
   * The path to the source must exist at config load time.
   * 
   * .. note::
   * 
   * Envoy will only watch the file path for *moves.* This is because in general only moves
   * are atomic. The same method of swapping files as is demonstrated in the
   * :ref:`runtime documentation <config_runtime_symbolic_link_swap>` can be used here also.
   */
  'path'?: (string);
  /**
   * API configuration source.
   */
  'api_config_source'?: (_envoy_config_core_v3_ApiConfigSource__Output | null);
  /**
   * When set, ADS will be used to fetch resources. The ADS API configuration
   * source in the bootstrap configuration is used.
   */
  'ads'?: (_envoy_config_core_v3_AggregatedConfigSource__Output | null);
  /**
   * When this timeout is specified, Envoy will wait no longer than the specified time for first
   * config response on this xDS subscription during the :ref:`initialization process
   * <arch_overview_initialization>`. After reaching the timeout, Envoy will move to the next
   * initialization phase, even if the first config is not delivered yet. The timer is activated
   * when the xDS API subscription starts, and is disarmed on first config update or on error. 0
   * means no timeout - Envoy will wait indefinitely for the first xDS config (unless another
   * timeout applies). The default is 15s.
   */
  'initial_fetch_timeout': (_google_protobuf_Duration__Output | null);
  /**
   * [#not-implemented-hide:]
   * When set, the client will access the resources from the same server it got the
   * ConfigSource from, although not necessarily from the same stream. This is similar to the
   * :ref:`ads<envoy_v3_api_field.ConfigSource.ads>` field, except that the client may use a
   * different stream to the same server. As a result, this field can be used for things
   * like LRS that cannot be sent on an ADS stream. It can also be used to link from (e.g.)
   * LDS to RDS on the same server without requiring the management server to know its name
   * or required credentials.
   * [#next-major-version: In xDS v3, consider replacing the ads field with this one, since
   * this field can implicitly mean to use the same stream in the case where the ConfigSource
   * is provided via ADS and the specified data can also be obtained via ADS.]
   */
  'self'?: (_envoy_config_core_v3_SelfConfigSource__Output | null);
  /**
   * API version for xDS resources. This implies the type URLs that the client
   * will request for resources and the resource type that the client will in
   * turn expect to be delivered.
   */
  'resource_api_version': (keyof typeof _envoy_config_core_v3_ApiVersion);
  /**
   * Authorities that this config source may be used for. An authority specified in a xdstp:// URL
   * is resolved to a *ConfigSource* prior to configuration fetch. This field provides the
   * association between authority name and configuration source.
   * [#not-implemented-hide:]
   */
  'authorities': (_xds_core_v3_Authority__Output)[];
  'config_source_specifier': "path"|"api_config_source"|"ads"|"self";
}
