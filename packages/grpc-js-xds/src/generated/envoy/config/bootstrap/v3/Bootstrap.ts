// Original file: deps/envoy-api/envoy/config/bootstrap/v3/bootstrap.proto

import type { Node as _envoy_config_core_v3_Node, Node__Output as _envoy_config_core_v3_Node__Output } from '../../../../envoy/config/core/v3/Node';
import type { ClusterManager as _envoy_config_bootstrap_v3_ClusterManager, ClusterManager__Output as _envoy_config_bootstrap_v3_ClusterManager__Output } from '../../../../envoy/config/bootstrap/v3/ClusterManager';
import type { StatsSink as _envoy_config_metrics_v3_StatsSink, StatsSink__Output as _envoy_config_metrics_v3_StatsSink__Output } from '../../../../envoy/config/metrics/v3/StatsSink';
import type { Duration as _google_protobuf_Duration, Duration__Output as _google_protobuf_Duration__Output } from '../../../../google/protobuf/Duration';
import type { Watchdog as _envoy_config_bootstrap_v3_Watchdog, Watchdog__Output as _envoy_config_bootstrap_v3_Watchdog__Output } from '../../../../envoy/config/bootstrap/v3/Watchdog';
import type { Tracing as _envoy_config_trace_v3_Tracing, Tracing__Output as _envoy_config_trace_v3_Tracing__Output } from '../../../../envoy/config/trace/v3/Tracing';
import type { Admin as _envoy_config_bootstrap_v3_Admin, Admin__Output as _envoy_config_bootstrap_v3_Admin__Output } from '../../../../envoy/config/bootstrap/v3/Admin';
import type { StatsConfig as _envoy_config_metrics_v3_StatsConfig, StatsConfig__Output as _envoy_config_metrics_v3_StatsConfig__Output } from '../../../../envoy/config/metrics/v3/StatsConfig';
import type { ApiConfigSource as _envoy_config_core_v3_ApiConfigSource, ApiConfigSource__Output as _envoy_config_core_v3_ApiConfigSource__Output } from '../../../../envoy/config/core/v3/ApiConfigSource';
import type { OverloadManager as _envoy_config_overload_v3_OverloadManager, OverloadManager__Output as _envoy_config_overload_v3_OverloadManager__Output } from '../../../../envoy/config/overload/v3/OverloadManager';
import type { LayeredRuntime as _envoy_config_bootstrap_v3_LayeredRuntime, LayeredRuntime__Output as _envoy_config_bootstrap_v3_LayeredRuntime__Output } from '../../../../envoy/config/bootstrap/v3/LayeredRuntime';
import type { UInt64Value as _google_protobuf_UInt64Value, UInt64Value__Output as _google_protobuf_UInt64Value__Output } from '../../../../google/protobuf/UInt64Value';
import type { TypedExtensionConfig as _envoy_config_core_v3_TypedExtensionConfig, TypedExtensionConfig__Output as _envoy_config_core_v3_TypedExtensionConfig__Output } from '../../../../envoy/config/core/v3/TypedExtensionConfig';
import type { ConfigSource as _envoy_config_core_v3_ConfigSource, ConfigSource__Output as _envoy_config_core_v3_ConfigSource__Output } from '../../../../envoy/config/core/v3/ConfigSource';
import type { Watchdogs as _envoy_config_bootstrap_v3_Watchdogs, Watchdogs__Output as _envoy_config_bootstrap_v3_Watchdogs__Output } from '../../../../envoy/config/bootstrap/v3/Watchdogs';
import type { FatalAction as _envoy_config_bootstrap_v3_FatalAction, FatalAction__Output as _envoy_config_bootstrap_v3_FatalAction__Output } from '../../../../envoy/config/bootstrap/v3/FatalAction';
import type { DnsResolutionConfig as _envoy_config_core_v3_DnsResolutionConfig, DnsResolutionConfig__Output as _envoy_config_core_v3_DnsResolutionConfig__Output } from '../../../../envoy/config/core/v3/DnsResolutionConfig';
import type { CustomInlineHeader as _envoy_config_bootstrap_v3_CustomInlineHeader, CustomInlineHeader__Output as _envoy_config_bootstrap_v3_CustomInlineHeader__Output } from '../../../../envoy/config/bootstrap/v3/CustomInlineHeader';
import type { Listener as _envoy_config_listener_v3_Listener, Listener__Output as _envoy_config_listener_v3_Listener__Output } from '../../../../envoy/config/listener/v3/Listener';
import type { Cluster as _envoy_config_cluster_v3_Cluster, Cluster__Output as _envoy_config_cluster_v3_Cluster__Output } from '../../../../envoy/config/cluster/v3/Cluster';
import type { Secret as _envoy_extensions_transport_sockets_tls_v3_Secret, Secret__Output as _envoy_extensions_transport_sockets_tls_v3_Secret__Output } from '../../../../envoy/extensions/transport_sockets/tls/v3/Secret';
import type { Long } from '@grpc/proto-loader';

/**
 * [#next-free-field: 7]
 */
export interface _envoy_config_bootstrap_v3_Bootstrap_DynamicResources {
  /**
   * All :ref:`Listeners <envoy_v3_api_msg_config.listener.v3.Listener>` are provided by a single
   * :ref:`LDS <arch_overview_dynamic_config_lds>` configuration source.
   */
  'lds_config'?: (_envoy_config_core_v3_ConfigSource | null);
  /**
   * xdstp:// resource locator for listener collection.
   * [#not-implemented-hide:]
   */
  'lds_resources_locator'?: (string);
  /**
   * All post-bootstrap :ref:`Cluster <envoy_v3_api_msg_config.cluster.v3.Cluster>` definitions are
   * provided by a single :ref:`CDS <arch_overview_dynamic_config_cds>`
   * configuration source.
   */
  'cds_config'?: (_envoy_config_core_v3_ConfigSource | null);
  /**
   * xdstp:// resource locator for cluster collection.
   * [#not-implemented-hide:]
   */
  'cds_resources_locator'?: (string);
  /**
   * A single :ref:`ADS <config_overview_ads>` source may be optionally
   * specified. This must have :ref:`api_type
   * <envoy_v3_api_field_config.core.v3.ApiConfigSource.api_type>` :ref:`GRPC
   * <envoy_v3_api_enum_value_config.core.v3.ApiConfigSource.ApiType.GRPC>`. Only
   * :ref:`ConfigSources <envoy_v3_api_msg_config.core.v3.ConfigSource>` that have
   * the :ref:`ads <envoy_v3_api_field_config.core.v3.ConfigSource.ads>` field set will be
   * streamed on the ADS channel.
   */
  'ads_config'?: (_envoy_config_core_v3_ApiConfigSource | null);
}

/**
 * [#next-free-field: 7]
 */
export interface _envoy_config_bootstrap_v3_Bootstrap_DynamicResources__Output {
  /**
   * All :ref:`Listeners <envoy_v3_api_msg_config.listener.v3.Listener>` are provided by a single
   * :ref:`LDS <arch_overview_dynamic_config_lds>` configuration source.
   */
  'lds_config': (_envoy_config_core_v3_ConfigSource__Output | null);
  /**
   * xdstp:// resource locator for listener collection.
   * [#not-implemented-hide:]
   */
  'lds_resources_locator': (string);
  /**
   * All post-bootstrap :ref:`Cluster <envoy_v3_api_msg_config.cluster.v3.Cluster>` definitions are
   * provided by a single :ref:`CDS <arch_overview_dynamic_config_cds>`
   * configuration source.
   */
  'cds_config': (_envoy_config_core_v3_ConfigSource__Output | null);
  /**
   * xdstp:// resource locator for cluster collection.
   * [#not-implemented-hide:]
   */
  'cds_resources_locator': (string);
  /**
   * A single :ref:`ADS <config_overview_ads>` source may be optionally
   * specified. This must have :ref:`api_type
   * <envoy_v3_api_field_config.core.v3.ApiConfigSource.api_type>` :ref:`GRPC
   * <envoy_v3_api_enum_value_config.core.v3.ApiConfigSource.ApiType.GRPC>`. Only
   * :ref:`ConfigSources <envoy_v3_api_msg_config.core.v3.ConfigSource>` that have
   * the :ref:`ads <envoy_v3_api_field_config.core.v3.ConfigSource.ads>` field set will be
   * streamed on the ADS channel.
   */
  'ads_config': (_envoy_config_core_v3_ApiConfigSource__Output | null);
}

export interface _envoy_config_bootstrap_v3_Bootstrap_StaticResources {
  /**
   * Static :ref:`Listeners <envoy_v3_api_msg_config.listener.v3.Listener>`. These listeners are
   * available regardless of LDS configuration.
   */
  'listeners'?: (_envoy_config_listener_v3_Listener)[];
  /**
   * If a network based configuration source is specified for :ref:`cds_config
   * <envoy_v3_api_field_config.bootstrap.v3.Bootstrap.DynamicResources.cds_config>`, it's necessary
   * to have some initial cluster definitions available to allow Envoy to know
   * how to speak to the management server. These cluster definitions may not
   * use :ref:`EDS <arch_overview_dynamic_config_eds>` (i.e. they should be static
   * IP or DNS-based).
   */
  'clusters'?: (_envoy_config_cluster_v3_Cluster)[];
  /**
   * These static secrets can be used by :ref:`SdsSecretConfig
   * <envoy_v3_api_msg_extensions.transport_sockets.tls.v3.SdsSecretConfig>`
   */
  'secrets'?: (_envoy_extensions_transport_sockets_tls_v3_Secret)[];
}

export interface _envoy_config_bootstrap_v3_Bootstrap_StaticResources__Output {
  /**
   * Static :ref:`Listeners <envoy_v3_api_msg_config.listener.v3.Listener>`. These listeners are
   * available regardless of LDS configuration.
   */
  'listeners': (_envoy_config_listener_v3_Listener__Output)[];
  /**
   * If a network based configuration source is specified for :ref:`cds_config
   * <envoy_v3_api_field_config.bootstrap.v3.Bootstrap.DynamicResources.cds_config>`, it's necessary
   * to have some initial cluster definitions available to allow Envoy to know
   * how to speak to the management server. These cluster definitions may not
   * use :ref:`EDS <arch_overview_dynamic_config_eds>` (i.e. they should be static
   * IP or DNS-based).
   */
  'clusters': (_envoy_config_cluster_v3_Cluster__Output)[];
  /**
   * These static secrets can be used by :ref:`SdsSecretConfig
   * <envoy_v3_api_msg_extensions.transport_sockets.tls.v3.SdsSecretConfig>`
   */
  'secrets': (_envoy_extensions_transport_sockets_tls_v3_Secret__Output)[];
}

/**
 * Bootstrap :ref:`configuration overview <config_overview_bootstrap>`.
 * [#next-free-field: 33]
 */
export interface Bootstrap {
  /**
   * Node identity to present to the management server and for instance
   * identification purposes (e.g. in generated headers).
   */
  'node'?: (_envoy_config_core_v3_Node | null);
  /**
   * Statically specified resources.
   */
  'static_resources'?: (_envoy_config_bootstrap_v3_Bootstrap_StaticResources | null);
  /**
   * xDS configuration sources.
   */
  'dynamic_resources'?: (_envoy_config_bootstrap_v3_Bootstrap_DynamicResources | null);
  /**
   * Configuration for the cluster manager which owns all upstream clusters
   * within the server.
   */
  'cluster_manager'?: (_envoy_config_bootstrap_v3_ClusterManager | null);
  /**
   * Optional file system path to search for startup flag files.
   */
  'flags_path'?: (string);
  /**
   * Optional set of stats sinks.
   */
  'stats_sinks'?: (_envoy_config_metrics_v3_StatsSink)[];
  /**
   * Optional duration between flushes to configured stats sinks. For
   * performance reasons Envoy latches counters and only flushes counters and
   * gauges at a periodic interval. If not specified the default is 5000ms (5
   * seconds). Only one of `stats_flush_interval` or `stats_flush_on_admin`
   * can be set.
   * Duration must be at least 1ms and at most 5 min.
   */
  'stats_flush_interval'?: (_google_protobuf_Duration | null);
  /**
   * Optional watchdog configuration.
   * This is for a single watchdog configuration for the entire system.
   * Deprecated in favor of *watchdogs* which has finer granularity.
   */
  'watchdog'?: (_envoy_config_bootstrap_v3_Watchdog | null);
  /**
   * Configuration for an external tracing provider.
   * 
   * .. attention::
   * This field has been deprecated in favor of :ref:`HttpConnectionManager.Tracing.provider
   * <envoy_v3_api_field_extensions.filters.network.http_connection_manager.v3.HttpConnectionManager.Tracing.provider>`.
   */
  'tracing'?: (_envoy_config_trace_v3_Tracing | null);
  /**
   * Configuration for the local administration HTTP server.
   */
  'admin'?: (_envoy_config_bootstrap_v3_Admin | null);
  /**
   * Configuration for internal processing of stats.
   */
  'stats_config'?: (_envoy_config_metrics_v3_StatsConfig | null);
  /**
   * Health discovery service config option.
   * (:ref:`core.ApiConfigSource <envoy_v3_api_msg_config.core.v3.ApiConfigSource>`)
   */
  'hds_config'?: (_envoy_config_core_v3_ApiConfigSource | null);
  /**
   * Optional overload manager configuration.
   */
  'overload_manager'?: (_envoy_config_overload_v3_OverloadManager | null);
  /**
   * Enable :ref:`stats for event dispatcher <operations_performance>`, defaults to false.
   * Note that this records a value for each iteration of the event loop on every thread. This
   * should normally be minimal overhead, but when using
   * :ref:`statsd <envoy_v3_api_msg_config.metrics.v3.StatsdSink>`, it will send each observed value
   * over the wire individually because the statsd protocol doesn't have any way to represent a
   * histogram summary. Be aware that this can be a very large volume of data.
   */
  'enable_dispatcher_stats'?: (boolean);
  /**
   * Configuration for the runtime configuration provider. If not
   * specified, a “null” provider will be used which will result in all defaults
   * being used.
   */
  'layered_runtime'?: (_envoy_config_bootstrap_v3_LayeredRuntime | null);
  /**
   * Optional string which will be used in lieu of x-envoy in prefixing headers.
   * 
   * For example, if this string is present and set to X-Foo, then x-envoy-retry-on will be
   * transformed into x-foo-retry-on etc.
   * 
   * Note this applies to the headers Envoy will generate, the headers Envoy will sanitize, and the
   * headers Envoy will trust for core code and core extensions only. Be VERY careful making
   * changes to this string, especially in multi-layer Envoy deployments or deployments using
   * extensions which are not upstream.
   */
  'header_prefix'?: (string);
  /**
   * Optional proxy version which will be used to set the value of :ref:`server.version statistic
   * <server_statistics>` if specified. Envoy will not process this value, it will be sent as is to
   * :ref:`stats sinks <envoy_v3_api_msg_config.metrics.v3.StatsSink>`.
   */
  'stats_server_version_override'?: (_google_protobuf_UInt64Value | null);
  /**
   * Always use TCP queries instead of UDP queries for DNS lookups.
   * This may be overridden on a per-cluster basis in cds_config,
   * when :ref:`dns_resolvers <envoy_v3_api_field_config.cluster.v3.Cluster.dns_resolvers>` and
   * :ref:`use_tcp_for_dns_lookups <envoy_v3_api_field_config.cluster.v3.Cluster.use_tcp_for_dns_lookups>` are
   * specified.
   * Setting this value causes failure if the
   * ``envoy.restart_features.use_apple_api_for_dns_lookups`` runtime value is true during
   * server startup. Apple' API only uses UDP for DNS resolution.
   * This field is deprecated in favor of *dns_resolution_config*
   * which aggregates all of the DNS resolver configuration in a single message.
   */
  'use_tcp_for_dns_lookups'?: (boolean);
  /**
   * Specifies optional bootstrap extensions to be instantiated at startup time.
   * Each item contains extension specific configuration.
   * [#extension-category: envoy.bootstrap]
   */
  'bootstrap_extensions'?: (_envoy_config_core_v3_TypedExtensionConfig)[];
  /**
   * Configuration sources that will participate in
   * xdstp:// URL authority resolution. The algorithm is as
   * follows:
   * 1. The authority field is taken from the xdstp:// URL, call
   * this *resource_authority*.
   * 2. *resource_authority* is compared against the authorities in any peer
   * *ConfigSource*. The peer *ConfigSource* is the configuration source
   * message which would have been used unconditionally for resolution
   * with opaque resource names. If there is a match with an authority, the
   * peer *ConfigSource* message is used.
   * 3. *resource_authority* is compared sequentially with the authorities in
   * each configuration source in *config_sources*. The first *ConfigSource*
   * to match wins.
   * 4. As a fallback, if no configuration source matches, then
   * *default_config_source* is used.
   * 5. If *default_config_source* is not specified, resolution fails.
   * [#not-implemented-hide:]
   */
  'config_sources'?: (_envoy_config_core_v3_ConfigSource)[];
  /**
   * Default configuration source for xdstp:// URLs if all
   * other resolution fails.
   * [#not-implemented-hide:]
   */
  'default_config_source'?: (_envoy_config_core_v3_ConfigSource | null);
  /**
   * Optional overriding of default socket interface. The value must be the name of one of the
   * socket interface factories initialized through a bootstrap extension
   */
  'default_socket_interface'?: (string);
  /**
   * Global map of CertificateProvider instances. These instances are referred to by name in the
   * :ref:`CommonTlsContext.CertificateProviderInstance.instance_name
   * <envoy_v3_api_field_extensions.transport_sockets.tls.v3.CommonTlsContext.CertificateProviderInstance.instance_name>`
   * field.
   * [#not-implemented-hide:]
   */
  'certificate_provider_instances'?: ({[key: string]: _envoy_config_core_v3_TypedExtensionConfig});
  /**
   * A list of :ref:`Node <envoy_v3_api_msg_config.core.v3.Node>` field names
   * that will be included in the context parameters of the effective
   * xdstp:// URL that is sent in a discovery request when resource
   * locators are used for LDS/CDS. Any non-string field will have its JSON
   * encoding set as the context parameter value, with the exception of
   * metadata, which will be flattened (see example below). The supported field
   * names are:
   * - "cluster"
   * - "id"
   * - "locality.region"
   * - "locality.sub_zone"
   * - "locality.zone"
   * - "metadata"
   * - "user_agent_build_version.metadata"
   * - "user_agent_build_version.version"
   * - "user_agent_name"
   * - "user_agent_version"
   * 
   * The node context parameters act as a base layer dictionary for the context
   * parameters (i.e. more specific resource specific context parameters will
   * override). Field names will be prefixed with “udpa.node.” when included in
   * context parameters.
   * 
   * For example, if node_context_params is ``["user_agent_name", "metadata"]``,
   * the implied context parameters might be::
   * 
   * node.user_agent_name: "envoy"
   * node.metadata.foo: "{\"bar\": \"baz\"}"
   * node.metadata.some: "42"
   * node.metadata.thing: "\"thing\""
   * 
   * [#not-implemented-hide:]
   */
  'node_context_params'?: (string)[];
  /**
   * Optional watchdogs configuration.
   * This is used for specifying different watchdogs for the different subsystems.
   * [#extension-category: envoy.guarddog_actions]
   */
  'watchdogs'?: (_envoy_config_bootstrap_v3_Watchdogs | null);
  /**
   * Specifies optional extensions instantiated at startup time and
   * invoked during crash time on the request that caused the crash.
   */
  'fatal_actions'?: (_envoy_config_bootstrap_v3_FatalAction)[];
  /**
   * Flush stats to sinks only when queried for on the admin interface. If set,
   * a flush timer is not created. Only one of `stats_flush_on_admin` or
   * `stats_flush_interval` can be set.
   */
  'stats_flush_on_admin'?: (boolean);
  /**
   * DNS resolution configuration which includes the underlying dns resolver addresses and options.
   * This may be overridden on a per-cluster basis in cds_config, when
   * :ref:`dns_resolution_config <envoy_v3_api_field_config.cluster.v3.Cluster.dns_resolution_config>`
   * is specified.
   * *dns_resolution_config* will be deprecated once
   * :ref:'typed_dns_resolver_config <envoy_v3_api_field_config.bootstrap.v3.Bootstrap.typed_dns_resolver_config>'
   * is fully supported.
   */
  'dns_resolution_config'?: (_envoy_config_core_v3_DnsResolutionConfig | null);
  /**
   * DNS resolver type configuration extension. This extension can be used to configure c-ares, apple,
   * or any other DNS resolver types and the related parameters.
   * For example, an object of :ref:`DnsResolutionConfig <envoy_v3_api_msg_config.core.v3.DnsResolutionConfig>`
   * can be packed into this *typed_dns_resolver_config*. This configuration will replace the
   * :ref:'dns_resolution_config <envoy_v3_api_field_config.bootstrap.v3.Bootstrap.dns_resolution_config>'
   * configuration eventually.
   * TODO(yanjunxiang): Investigate the deprecation plan for *dns_resolution_config*.
   * During the transition period when both *dns_resolution_config* and *typed_dns_resolver_config* exists,
   * this configuration is optional.
   * When *typed_dns_resolver_config* is in place, Envoy will use it and ignore *dns_resolution_config*.
   * When *typed_dns_resolver_config* is missing, the default behavior is in place.
   * [#not-implemented-hide:]
   */
  'typed_dns_resolver_config'?: (_envoy_config_core_v3_TypedExtensionConfig | null);
  /**
   * Specifies a set of headers that need to be registered as inline header. This configuration
   * allows users to customize the inline headers on-demand at Envoy startup without modifying
   * Envoy's source code.
   * 
   * Note that the 'set-cookie' header cannot be registered as inline header.
   */
  'inline_headers'?: (_envoy_config_bootstrap_v3_CustomInlineHeader)[];
  'stats_flush'?: "stats_flush_on_admin";
}

/**
 * Bootstrap :ref:`configuration overview <config_overview_bootstrap>`.
 * [#next-free-field: 33]
 */
export interface Bootstrap__Output {
  /**
   * Node identity to present to the management server and for instance
   * identification purposes (e.g. in generated headers).
   */
  'node': (_envoy_config_core_v3_Node__Output | null);
  /**
   * Statically specified resources.
   */
  'static_resources': (_envoy_config_bootstrap_v3_Bootstrap_StaticResources__Output | null);
  /**
   * xDS configuration sources.
   */
  'dynamic_resources': (_envoy_config_bootstrap_v3_Bootstrap_DynamicResources__Output | null);
  /**
   * Configuration for the cluster manager which owns all upstream clusters
   * within the server.
   */
  'cluster_manager': (_envoy_config_bootstrap_v3_ClusterManager__Output | null);
  /**
   * Optional file system path to search for startup flag files.
   */
  'flags_path': (string);
  /**
   * Optional set of stats sinks.
   */
  'stats_sinks': (_envoy_config_metrics_v3_StatsSink__Output)[];
  /**
   * Optional duration between flushes to configured stats sinks. For
   * performance reasons Envoy latches counters and only flushes counters and
   * gauges at a periodic interval. If not specified the default is 5000ms (5
   * seconds). Only one of `stats_flush_interval` or `stats_flush_on_admin`
   * can be set.
   * Duration must be at least 1ms and at most 5 min.
   */
  'stats_flush_interval': (_google_protobuf_Duration__Output | null);
  /**
   * Optional watchdog configuration.
   * This is for a single watchdog configuration for the entire system.
   * Deprecated in favor of *watchdogs* which has finer granularity.
   */
  'watchdog': (_envoy_config_bootstrap_v3_Watchdog__Output | null);
  /**
   * Configuration for an external tracing provider.
   * 
   * .. attention::
   * This field has been deprecated in favor of :ref:`HttpConnectionManager.Tracing.provider
   * <envoy_v3_api_field_extensions.filters.network.http_connection_manager.v3.HttpConnectionManager.Tracing.provider>`.
   */
  'tracing': (_envoy_config_trace_v3_Tracing__Output | null);
  /**
   * Configuration for the local administration HTTP server.
   */
  'admin': (_envoy_config_bootstrap_v3_Admin__Output | null);
  /**
   * Configuration for internal processing of stats.
   */
  'stats_config': (_envoy_config_metrics_v3_StatsConfig__Output | null);
  /**
   * Health discovery service config option.
   * (:ref:`core.ApiConfigSource <envoy_v3_api_msg_config.core.v3.ApiConfigSource>`)
   */
  'hds_config': (_envoy_config_core_v3_ApiConfigSource__Output | null);
  /**
   * Optional overload manager configuration.
   */
  'overload_manager': (_envoy_config_overload_v3_OverloadManager__Output | null);
  /**
   * Enable :ref:`stats for event dispatcher <operations_performance>`, defaults to false.
   * Note that this records a value for each iteration of the event loop on every thread. This
   * should normally be minimal overhead, but when using
   * :ref:`statsd <envoy_v3_api_msg_config.metrics.v3.StatsdSink>`, it will send each observed value
   * over the wire individually because the statsd protocol doesn't have any way to represent a
   * histogram summary. Be aware that this can be a very large volume of data.
   */
  'enable_dispatcher_stats': (boolean);
  /**
   * Configuration for the runtime configuration provider. If not
   * specified, a “null” provider will be used which will result in all defaults
   * being used.
   */
  'layered_runtime': (_envoy_config_bootstrap_v3_LayeredRuntime__Output | null);
  /**
   * Optional string which will be used in lieu of x-envoy in prefixing headers.
   * 
   * For example, if this string is present and set to X-Foo, then x-envoy-retry-on will be
   * transformed into x-foo-retry-on etc.
   * 
   * Note this applies to the headers Envoy will generate, the headers Envoy will sanitize, and the
   * headers Envoy will trust for core code and core extensions only. Be VERY careful making
   * changes to this string, especially in multi-layer Envoy deployments or deployments using
   * extensions which are not upstream.
   */
  'header_prefix': (string);
  /**
   * Optional proxy version which will be used to set the value of :ref:`server.version statistic
   * <server_statistics>` if specified. Envoy will not process this value, it will be sent as is to
   * :ref:`stats sinks <envoy_v3_api_msg_config.metrics.v3.StatsSink>`.
   */
  'stats_server_version_override': (_google_protobuf_UInt64Value__Output | null);
  /**
   * Always use TCP queries instead of UDP queries for DNS lookups.
   * This may be overridden on a per-cluster basis in cds_config,
   * when :ref:`dns_resolvers <envoy_v3_api_field_config.cluster.v3.Cluster.dns_resolvers>` and
   * :ref:`use_tcp_for_dns_lookups <envoy_v3_api_field_config.cluster.v3.Cluster.use_tcp_for_dns_lookups>` are
   * specified.
   * Setting this value causes failure if the
   * ``envoy.restart_features.use_apple_api_for_dns_lookups`` runtime value is true during
   * server startup. Apple' API only uses UDP for DNS resolution.
   * This field is deprecated in favor of *dns_resolution_config*
   * which aggregates all of the DNS resolver configuration in a single message.
   */
  'use_tcp_for_dns_lookups': (boolean);
  /**
   * Specifies optional bootstrap extensions to be instantiated at startup time.
   * Each item contains extension specific configuration.
   * [#extension-category: envoy.bootstrap]
   */
  'bootstrap_extensions': (_envoy_config_core_v3_TypedExtensionConfig__Output)[];
  /**
   * Configuration sources that will participate in
   * xdstp:// URL authority resolution. The algorithm is as
   * follows:
   * 1. The authority field is taken from the xdstp:// URL, call
   * this *resource_authority*.
   * 2. *resource_authority* is compared against the authorities in any peer
   * *ConfigSource*. The peer *ConfigSource* is the configuration source
   * message which would have been used unconditionally for resolution
   * with opaque resource names. If there is a match with an authority, the
   * peer *ConfigSource* message is used.
   * 3. *resource_authority* is compared sequentially with the authorities in
   * each configuration source in *config_sources*. The first *ConfigSource*
   * to match wins.
   * 4. As a fallback, if no configuration source matches, then
   * *default_config_source* is used.
   * 5. If *default_config_source* is not specified, resolution fails.
   * [#not-implemented-hide:]
   */
  'config_sources': (_envoy_config_core_v3_ConfigSource__Output)[];
  /**
   * Default configuration source for xdstp:// URLs if all
   * other resolution fails.
   * [#not-implemented-hide:]
   */
  'default_config_source': (_envoy_config_core_v3_ConfigSource__Output | null);
  /**
   * Optional overriding of default socket interface. The value must be the name of one of the
   * socket interface factories initialized through a bootstrap extension
   */
  'default_socket_interface': (string);
  /**
   * Global map of CertificateProvider instances. These instances are referred to by name in the
   * :ref:`CommonTlsContext.CertificateProviderInstance.instance_name
   * <envoy_v3_api_field_extensions.transport_sockets.tls.v3.CommonTlsContext.CertificateProviderInstance.instance_name>`
   * field.
   * [#not-implemented-hide:]
   */
  'certificate_provider_instances': ({[key: string]: _envoy_config_core_v3_TypedExtensionConfig__Output});
  /**
   * A list of :ref:`Node <envoy_v3_api_msg_config.core.v3.Node>` field names
   * that will be included in the context parameters of the effective
   * xdstp:// URL that is sent in a discovery request when resource
   * locators are used for LDS/CDS. Any non-string field will have its JSON
   * encoding set as the context parameter value, with the exception of
   * metadata, which will be flattened (see example below). The supported field
   * names are:
   * - "cluster"
   * - "id"
   * - "locality.region"
   * - "locality.sub_zone"
   * - "locality.zone"
   * - "metadata"
   * - "user_agent_build_version.metadata"
   * - "user_agent_build_version.version"
   * - "user_agent_name"
   * - "user_agent_version"
   * 
   * The node context parameters act as a base layer dictionary for the context
   * parameters (i.e. more specific resource specific context parameters will
   * override). Field names will be prefixed with “udpa.node.” when included in
   * context parameters.
   * 
   * For example, if node_context_params is ``["user_agent_name", "metadata"]``,
   * the implied context parameters might be::
   * 
   * node.user_agent_name: "envoy"
   * node.metadata.foo: "{\"bar\": \"baz\"}"
   * node.metadata.some: "42"
   * node.metadata.thing: "\"thing\""
   * 
   * [#not-implemented-hide:]
   */
  'node_context_params': (string)[];
  /**
   * Optional watchdogs configuration.
   * This is used for specifying different watchdogs for the different subsystems.
   * [#extension-category: envoy.guarddog_actions]
   */
  'watchdogs': (_envoy_config_bootstrap_v3_Watchdogs__Output | null);
  /**
   * Specifies optional extensions instantiated at startup time and
   * invoked during crash time on the request that caused the crash.
   */
  'fatal_actions': (_envoy_config_bootstrap_v3_FatalAction__Output)[];
  /**
   * Flush stats to sinks only when queried for on the admin interface. If set,
   * a flush timer is not created. Only one of `stats_flush_on_admin` or
   * `stats_flush_interval` can be set.
   */
  'stats_flush_on_admin'?: (boolean);
  /**
   * DNS resolution configuration which includes the underlying dns resolver addresses and options.
   * This may be overridden on a per-cluster basis in cds_config, when
   * :ref:`dns_resolution_config <envoy_v3_api_field_config.cluster.v3.Cluster.dns_resolution_config>`
   * is specified.
   * *dns_resolution_config* will be deprecated once
   * :ref:'typed_dns_resolver_config <envoy_v3_api_field_config.bootstrap.v3.Bootstrap.typed_dns_resolver_config>'
   * is fully supported.
   */
  'dns_resolution_config': (_envoy_config_core_v3_DnsResolutionConfig__Output | null);
  /**
   * DNS resolver type configuration extension. This extension can be used to configure c-ares, apple,
   * or any other DNS resolver types and the related parameters.
   * For example, an object of :ref:`DnsResolutionConfig <envoy_v3_api_msg_config.core.v3.DnsResolutionConfig>`
   * can be packed into this *typed_dns_resolver_config*. This configuration will replace the
   * :ref:'dns_resolution_config <envoy_v3_api_field_config.bootstrap.v3.Bootstrap.dns_resolution_config>'
   * configuration eventually.
   * TODO(yanjunxiang): Investigate the deprecation plan for *dns_resolution_config*.
   * During the transition period when both *dns_resolution_config* and *typed_dns_resolver_config* exists,
   * this configuration is optional.
   * When *typed_dns_resolver_config* is in place, Envoy will use it and ignore *dns_resolution_config*.
   * When *typed_dns_resolver_config* is missing, the default behavior is in place.
   * [#not-implemented-hide:]
   */
  'typed_dns_resolver_config': (_envoy_config_core_v3_TypedExtensionConfig__Output | null);
  /**
   * Specifies a set of headers that need to be registered as inline header. This configuration
   * allows users to customize the inline headers on-demand at Envoy startup without modifying
   * Envoy's source code.
   * 
   * Note that the 'set-cookie' header cannot be registered as inline header.
   */
  'inline_headers': (_envoy_config_bootstrap_v3_CustomInlineHeader__Output)[];
  'stats_flush': "stats_flush_on_admin";
}
