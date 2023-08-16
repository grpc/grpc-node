// Original file: deps/envoy-api/envoy/config/core/v3/base.proto

import type { Struct as _google_protobuf_Struct, Struct__Output as _google_protobuf_Struct__Output } from '../../../../google/protobuf/Struct';
import type { Locality as _envoy_config_core_v3_Locality, Locality__Output as _envoy_config_core_v3_Locality__Output } from '../../../../envoy/config/core/v3/Locality';
import type { BuildVersion as _envoy_config_core_v3_BuildVersion, BuildVersion__Output as _envoy_config_core_v3_BuildVersion__Output } from '../../../../envoy/config/core/v3/BuildVersion';
import type { Extension as _envoy_config_core_v3_Extension, Extension__Output as _envoy_config_core_v3_Extension__Output } from '../../../../envoy/config/core/v3/Extension';
import type { Address as _envoy_config_core_v3_Address, Address__Output as _envoy_config_core_v3_Address__Output } from '../../../../envoy/config/core/v3/Address';
import type { ContextParams as _xds_core_v3_ContextParams, ContextParams__Output as _xds_core_v3_ContextParams__Output } from '../../../../xds/core/v3/ContextParams';

/**
 * Identifies a specific Envoy instance. The node identifier is presented to the
 * management server, which may use this identifier to distinguish per Envoy
 * configuration for serving.
 * [#next-free-field: 13]
 */
export interface Node {
  /**
   * An opaque node identifier for the Envoy node. This also provides the local
   * service node name. It should be set if any of the following features are
   * used: :ref:`statsd <arch_overview_statistics>`, :ref:`CDS
   * <config_cluster_manager_cds>`, and :ref:`HTTP tracing
   * <arch_overview_tracing>`, either in this message or via
   * :option:`--service-node`.
   */
  'id'?: (string);
  /**
   * Defines the local service cluster name where Envoy is running. Though
   * optional, it should be set if any of the following features are used:
   * :ref:`statsd <arch_overview_statistics>`, :ref:`health check cluster
   * verification
   * <envoy_v3_api_field_config.core.v3.HealthCheck.HttpHealthCheck.service_name_matcher>`,
   * :ref:`runtime override directory <envoy_v3_api_msg_config.bootstrap.v3.Runtime>`,
   * :ref:`user agent addition
   * <envoy_v3_api_field_extensions.filters.network.http_connection_manager.v3.HttpConnectionManager.add_user_agent>`,
   * :ref:`HTTP global rate limiting <config_http_filters_rate_limit>`,
   * :ref:`CDS <config_cluster_manager_cds>`, and :ref:`HTTP tracing
   * <arch_overview_tracing>`, either in this message or via
   * :option:`--service-cluster`.
   */
  'cluster'?: (string);
  /**
   * Opaque metadata extending the node identifier. Envoy will pass this
   * directly to the management server.
   */
  'metadata'?: (_google_protobuf_Struct | null);
  /**
   * Locality specifying where the Envoy instance is running.
   */
  'locality'?: (_envoy_config_core_v3_Locality | null);
  /**
   * Free-form string that identifies the entity requesting config.
   * E.g. "envoy" or "grpc"
   */
  'user_agent_name'?: (string);
  /**
   * Free-form string that identifies the version of the entity requesting config.
   * E.g. "1.12.2" or "abcd1234", or "SpecialEnvoyBuild"
   */
  'user_agent_version'?: (string);
  /**
   * Structured version of the entity requesting config.
   */
  'user_agent_build_version'?: (_envoy_config_core_v3_BuildVersion | null);
  /**
   * List of extensions and their versions supported by the node.
   */
  'extensions'?: (_envoy_config_core_v3_Extension)[];
  /**
   * Client feature support list. These are well known features described
   * in the Envoy API repository for a given major version of an API. Client features
   * use reverse DNS naming scheme, for example ``com.acme.feature``.
   * See :ref:`the list of features <client_features>` that xDS client may
   * support.
   */
  'client_features'?: (string)[];
  /**
   * Known listening ports on the node as a generic hint to the management server
   * for filtering :ref:`listeners <config_listeners>` to be returned. For example,
   * if there is a listener bound to port 80, the list can optionally contain the
   * SocketAddress ``(0.0.0.0,80)``. The field is optional and just a hint.
   */
  'listening_addresses'?: (_envoy_config_core_v3_Address)[];
  /**
   * Map from xDS resource type URL to dynamic context parameters. These may vary at runtime (unlike
   * other fields in this message). For example, the xDS client may have a shard identifier that
   * changes during the lifetime of the xDS client. In Envoy, this would be achieved by updating the
   * dynamic context on the Server::Instance's LocalInfo context provider. The shard ID dynamic
   * parameter then appears in this field during future discovery requests.
   */
  'dynamic_parameters'?: ({[key: string]: _xds_core_v3_ContextParams});
  'user_agent_version_type'?: "user_agent_version"|"user_agent_build_version";
}

/**
 * Identifies a specific Envoy instance. The node identifier is presented to the
 * management server, which may use this identifier to distinguish per Envoy
 * configuration for serving.
 * [#next-free-field: 13]
 */
export interface Node__Output {
  /**
   * An opaque node identifier for the Envoy node. This also provides the local
   * service node name. It should be set if any of the following features are
   * used: :ref:`statsd <arch_overview_statistics>`, :ref:`CDS
   * <config_cluster_manager_cds>`, and :ref:`HTTP tracing
   * <arch_overview_tracing>`, either in this message or via
   * :option:`--service-node`.
   */
  'id': (string);
  /**
   * Defines the local service cluster name where Envoy is running. Though
   * optional, it should be set if any of the following features are used:
   * :ref:`statsd <arch_overview_statistics>`, :ref:`health check cluster
   * verification
   * <envoy_v3_api_field_config.core.v3.HealthCheck.HttpHealthCheck.service_name_matcher>`,
   * :ref:`runtime override directory <envoy_v3_api_msg_config.bootstrap.v3.Runtime>`,
   * :ref:`user agent addition
   * <envoy_v3_api_field_extensions.filters.network.http_connection_manager.v3.HttpConnectionManager.add_user_agent>`,
   * :ref:`HTTP global rate limiting <config_http_filters_rate_limit>`,
   * :ref:`CDS <config_cluster_manager_cds>`, and :ref:`HTTP tracing
   * <arch_overview_tracing>`, either in this message or via
   * :option:`--service-cluster`.
   */
  'cluster': (string);
  /**
   * Opaque metadata extending the node identifier. Envoy will pass this
   * directly to the management server.
   */
  'metadata': (_google_protobuf_Struct__Output | null);
  /**
   * Locality specifying where the Envoy instance is running.
   */
  'locality': (_envoy_config_core_v3_Locality__Output | null);
  /**
   * Free-form string that identifies the entity requesting config.
   * E.g. "envoy" or "grpc"
   */
  'user_agent_name': (string);
  /**
   * Free-form string that identifies the version of the entity requesting config.
   * E.g. "1.12.2" or "abcd1234", or "SpecialEnvoyBuild"
   */
  'user_agent_version'?: (string);
  /**
   * Structured version of the entity requesting config.
   */
  'user_agent_build_version'?: (_envoy_config_core_v3_BuildVersion__Output | null);
  /**
   * List of extensions and their versions supported by the node.
   */
  'extensions': (_envoy_config_core_v3_Extension__Output)[];
  /**
   * Client feature support list. These are well known features described
   * in the Envoy API repository for a given major version of an API. Client features
   * use reverse DNS naming scheme, for example ``com.acme.feature``.
   * See :ref:`the list of features <client_features>` that xDS client may
   * support.
   */
  'client_features': (string)[];
  /**
   * Known listening ports on the node as a generic hint to the management server
   * for filtering :ref:`listeners <config_listeners>` to be returned. For example,
   * if there is a listener bound to port 80, the list can optionally contain the
   * SocketAddress ``(0.0.0.0,80)``. The field is optional and just a hint.
   */
  'listening_addresses': (_envoy_config_core_v3_Address__Output)[];
  /**
   * Map from xDS resource type URL to dynamic context parameters. These may vary at runtime (unlike
   * other fields in this message). For example, the xDS client may have a shard identifier that
   * changes during the lifetime of the xDS client. In Envoy, this would be achieved by updating the
   * dynamic context on the Server::Instance's LocalInfo context provider. The shard ID dynamic
   * parameter then appears in this field during future discovery requests.
   */
  'dynamic_parameters': ({[key: string]: _xds_core_v3_ContextParams__Output});
  'user_agent_version_type': "user_agent_version"|"user_agent_build_version";
}
