// Original file: deps/envoy-api/envoy/api/v2/core/base.proto

import { Struct as _google_protobuf_Struct, Struct__Output as _google_protobuf_Struct__Output } from '../../../../google/protobuf/Struct';
import { Locality as _envoy_api_v2_core_Locality, Locality__Output as _envoy_api_v2_core_Locality__Output } from '../../../../envoy/api/v2/core/Locality';
import { BuildVersion as _envoy_api_v2_core_BuildVersion, BuildVersion__Output as _envoy_api_v2_core_BuildVersion__Output } from '../../../../envoy/api/v2/core/BuildVersion';
import { Extension as _envoy_api_v2_core_Extension, Extension__Output as _envoy_api_v2_core_Extension__Output } from '../../../../envoy/api/v2/core/Extension';
import { Address as _envoy_api_v2_core_Address, Address__Output as _envoy_api_v2_core_Address__Output } from '../../../../envoy/api/v2/core/Address';

/**
 * Identifies a specific Envoy instance. The node identifier is presented to the
 * management server, which may use this identifier to distinguish per Envoy
 * configuration for serving.
 * [#next-free-field: 12]
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
   * <envoy_api_field_core.HealthCheck.HttpHealthCheck.service_name_matcher>`,
   * :ref:`runtime override directory <envoy_api_msg_config.bootstrap.v2.Runtime>`,
   * :ref:`user agent addition
   * <envoy_api_field_config.filter.network.http_connection_manager.v2.HttpConnectionManager.add_user_agent>`,
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
  'metadata'?: (_google_protobuf_Struct);
  /**
   * Locality specifying where the Envoy instance is running.
   */
  'locality'?: (_envoy_api_v2_core_Locality);
  /**
   * This is motivated by informing a management server during canary which
   * version of Envoy is being tested in a heterogeneous fleet. This will be set
   * by Envoy in management server RPCs.
   * This field is deprecated in favor of the user_agent_name and user_agent_version values.
   */
  'build_version'?: (string);
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
  'user_agent_build_version'?: (_envoy_api_v2_core_BuildVersion);
  /**
   * List of extensions and their versions supported by the node.
   */
  'extensions'?: (_envoy_api_v2_core_Extension)[];
  /**
   * Client feature support list. These are well known features described
   * in the Envoy API repository for a given major version of an API. Client features
   * use reverse DNS naming scheme, for example `com.acme.feature`.
   * See :ref:`the list of features <client_features>` that xDS client may
   * support.
   */
  'client_features'?: (string)[];
  /**
   * Known listening ports on the node as a generic hint to the management server
   * for filtering :ref:`listeners <config_listeners>` to be returned. For example,
   * if there is a listener bound to port 80, the list can optionally contain the
   * SocketAddress `(0.0.0.0,80)`. The field is optional and just a hint.
   */
  'listening_addresses'?: (_envoy_api_v2_core_Address)[];
  'user_agent_version_type'?: "user_agent_version"|"user_agent_build_version";
}

/**
 * Identifies a specific Envoy instance. The node identifier is presented to the
 * management server, which may use this identifier to distinguish per Envoy
 * configuration for serving.
 * [#next-free-field: 12]
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
   * <envoy_api_field_core.HealthCheck.HttpHealthCheck.service_name_matcher>`,
   * :ref:`runtime override directory <envoy_api_msg_config.bootstrap.v2.Runtime>`,
   * :ref:`user agent addition
   * <envoy_api_field_config.filter.network.http_connection_manager.v2.HttpConnectionManager.add_user_agent>`,
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
  'metadata'?: (_google_protobuf_Struct__Output);
  /**
   * Locality specifying where the Envoy instance is running.
   */
  'locality'?: (_envoy_api_v2_core_Locality__Output);
  /**
   * This is motivated by informing a management server during canary which
   * version of Envoy is being tested in a heterogeneous fleet. This will be set
   * by Envoy in management server RPCs.
   * This field is deprecated in favor of the user_agent_name and user_agent_version values.
   */
  'build_version': (string);
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
  'user_agent_build_version'?: (_envoy_api_v2_core_BuildVersion__Output);
  /**
   * List of extensions and their versions supported by the node.
   */
  'extensions': (_envoy_api_v2_core_Extension__Output)[];
  /**
   * Client feature support list. These are well known features described
   * in the Envoy API repository for a given major version of an API. Client features
   * use reverse DNS naming scheme, for example `com.acme.feature`.
   * See :ref:`the list of features <client_features>` that xDS client may
   * support.
   */
  'client_features': (string)[];
  /**
   * Known listening ports on the node as a generic hint to the management server
   * for filtering :ref:`listeners <config_listeners>` to be returned. For example,
   * if there is a listener bound to port 80, the list can optionally contain the
   * SocketAddress `(0.0.0.0,80)`. The field is optional and just a hint.
   */
  'listening_addresses': (_envoy_api_v2_core_Address__Output)[];
  'user_agent_version_type': "user_agent_version"|"user_agent_build_version";
}
