// Original file: deps/envoy-api/envoy/api/v2/core/health_check.proto

import { Duration as _google_protobuf_Duration, Duration__Output as _google_protobuf_Duration__Output } from '../../../../google/protobuf/Duration';
import { UInt32Value as _google_protobuf_UInt32Value, UInt32Value__Output as _google_protobuf_UInt32Value__Output } from '../../../../google/protobuf/UInt32Value';
import { BoolValue as _google_protobuf_BoolValue, BoolValue__Output as _google_protobuf_BoolValue__Output } from '../../../../google/protobuf/BoolValue';
import { EventServiceConfig as _envoy_api_v2_core_EventServiceConfig, EventServiceConfig__Output as _envoy_api_v2_core_EventServiceConfig__Output } from '../../../../envoy/api/v2/core/EventServiceConfig';
import { HeaderValueOption as _envoy_api_v2_core_HeaderValueOption, HeaderValueOption__Output as _envoy_api_v2_core_HeaderValueOption__Output } from '../../../../envoy/api/v2/core/HeaderValueOption';
import { Int64Range as _envoy_type_Int64Range, Int64Range__Output as _envoy_type_Int64Range__Output } from '../../../../envoy/type/Int64Range';
import { CodecClientType as _envoy_type_CodecClientType } from '../../../../envoy/type/CodecClientType';
import { StringMatcher as _envoy_type_matcher_StringMatcher, StringMatcher__Output as _envoy_type_matcher_StringMatcher__Output } from '../../../../envoy/type/matcher/StringMatcher';
import { Struct as _google_protobuf_Struct, Struct__Output as _google_protobuf_Struct__Output } from '../../../../google/protobuf/Struct';
import { Any as _google_protobuf_Any, Any__Output as _google_protobuf_Any__Output } from '../../../../google/protobuf/Any';
import { Long } from '@grpc/proto-loader';

/**
 * Custom health check.
 */
export interface _envoy_api_v2_core_HealthCheck_CustomHealthCheck {
  /**
   * The registered name of the custom health checker.
   */
  'name'?: (string);
  'config'?: (_google_protobuf_Struct);
  'typed_config'?: (_google_protobuf_Any);
  /**
   * A custom health checker specific configuration which depends on the custom health checker
   * being instantiated. See :api:`envoy/config/health_checker` for reference.
   */
  'config_type'?: "config"|"typed_config";
}

/**
 * Custom health check.
 */
export interface _envoy_api_v2_core_HealthCheck_CustomHealthCheck__Output {
  /**
   * The registered name of the custom health checker.
   */
  'name': (string);
  'config'?: (_google_protobuf_Struct__Output);
  'typed_config'?: (_google_protobuf_Any__Output);
  /**
   * A custom health checker specific configuration which depends on the custom health checker
   * being instantiated. See :api:`envoy/config/health_checker` for reference.
   */
  'config_type': "config"|"typed_config";
}

/**
 * `grpc.health.v1.Health
 * <https://github.com/grpc/grpc/blob/master/src/proto/grpc/health/v1/health.proto>`_-based
 * healthcheck. See `gRPC doc <https://github.com/grpc/grpc/blob/master/doc/health-checking.md>`_
 * for details.
 */
export interface _envoy_api_v2_core_HealthCheck_GrpcHealthCheck {
  /**
   * An optional service name parameter which will be sent to gRPC service in
   * `grpc.health.v1.HealthCheckRequest
   * <https://github.com/grpc/grpc/blob/master/src/proto/grpc/health/v1/health.proto#L20>`_.
   * message. See `gRPC health-checking overview
   * <https://github.com/grpc/grpc/blob/master/doc/health-checking.md>`_ for more information.
   */
  'service_name'?: (string);
  /**
   * The value of the :authority header in the gRPC health check request. If
   * left empty (default value), the name of the cluster this health check is associated
   * with will be used. The authority header can be customized for a specific endpoint by setting
   * the :ref:`hostname <envoy_api_field_endpoint.Endpoint.HealthCheckConfig.hostname>` field.
   */
  'authority'?: (string);
}

/**
 * `grpc.health.v1.Health
 * <https://github.com/grpc/grpc/blob/master/src/proto/grpc/health/v1/health.proto>`_-based
 * healthcheck. See `gRPC doc <https://github.com/grpc/grpc/blob/master/doc/health-checking.md>`_
 * for details.
 */
export interface _envoy_api_v2_core_HealthCheck_GrpcHealthCheck__Output {
  /**
   * An optional service name parameter which will be sent to gRPC service in
   * `grpc.health.v1.HealthCheckRequest
   * <https://github.com/grpc/grpc/blob/master/src/proto/grpc/health/v1/health.proto#L20>`_.
   * message. See `gRPC health-checking overview
   * <https://github.com/grpc/grpc/blob/master/doc/health-checking.md>`_ for more information.
   */
  'service_name': (string);
  /**
   * The value of the :authority header in the gRPC health check request. If
   * left empty (default value), the name of the cluster this health check is associated
   * with will be used. The authority header can be customized for a specific endpoint by setting
   * the :ref:`hostname <envoy_api_field_endpoint.Endpoint.HealthCheckConfig.hostname>` field.
   */
  'authority': (string);
}

/**
 * [#next-free-field: 12]
 */
export interface _envoy_api_v2_core_HealthCheck_HttpHealthCheck {
  /**
   * The value of the host header in the HTTP health check request. If
   * left empty (default value), the name of the cluster this health check is associated
   * with will be used. The host header can be customized for a specific endpoint by setting the
   * :ref:`hostname <envoy_api_field_endpoint.Endpoint.HealthCheckConfig.hostname>` field.
   */
  'host'?: (string);
  /**
   * Specifies the HTTP path that will be requested during health checking. For example
   * * /healthcheck*.
   */
  'path'?: (string);
  /**
   * [#not-implemented-hide:] HTTP specific payload.
   */
  'send'?: (_envoy_api_v2_core_HealthCheck_Payload);
  /**
   * [#not-implemented-hide:] HTTP specific response.
   */
  'receive'?: (_envoy_api_v2_core_HealthCheck_Payload);
  /**
   * An optional service name parameter which is used to validate the identity of
   * the health checked cluster. See the :ref:`architecture overview
   * <arch_overview_health_checking_identity>` for more information.
   * 
   * .. attention::
   * 
   * This field has been deprecated in favor of `service_name_matcher` for better flexibility
   * over matching with service-cluster name.
   */
  'service_name'?: (string);
  /**
   * Specifies a list of HTTP headers that should be added to each request that is sent to the
   * health checked cluster. For more information, including details on header value syntax, see
   * the documentation on :ref:`custom request headers
   * <config_http_conn_man_headers_custom_request_headers>`.
   */
  'request_headers_to_add'?: (_envoy_api_v2_core_HeaderValueOption)[];
  /**
   * Specifies a list of HTTP headers that should be removed from each request that is sent to the
   * health checked cluster.
   */
  'request_headers_to_remove'?: (string)[];
  /**
   * If set, health checks will be made using http/2.
   * Deprecated, use :ref:`codec_client_type
   * <envoy_api_field_core.HealthCheck.HttpHealthCheck.codec_client_type>` instead.
   */
  'use_http2'?: (boolean);
  /**
   * Specifies a list of HTTP response statuses considered healthy. If provided, replaces default
   * 200-only policy - 200 must be included explicitly as needed. Ranges follow half-open
   * semantics of :ref:`Int64Range <envoy_api_msg_type.Int64Range>`. The start and end of each
   * range are required. Only statuses in the range [100, 600) are allowed.
   */
  'expected_statuses'?: (_envoy_type_Int64Range)[];
  /**
   * Use specified application protocol for health checks.
   */
  'codec_client_type'?: (_envoy_type_CodecClientType | keyof typeof _envoy_type_CodecClientType);
  /**
   * An optional service name parameter which is used to validate the identity of
   * the health checked cluster using a :ref:`StringMatcher
   * <envoy_api_msg_type.matcher.StringMatcher>`. See the :ref:`architecture overview
   * <arch_overview_health_checking_identity>` for more information.
   */
  'service_name_matcher'?: (_envoy_type_matcher_StringMatcher);
}

/**
 * [#next-free-field: 12]
 */
export interface _envoy_api_v2_core_HealthCheck_HttpHealthCheck__Output {
  /**
   * The value of the host header in the HTTP health check request. If
   * left empty (default value), the name of the cluster this health check is associated
   * with will be used. The host header can be customized for a specific endpoint by setting the
   * :ref:`hostname <envoy_api_field_endpoint.Endpoint.HealthCheckConfig.hostname>` field.
   */
  'host': (string);
  /**
   * Specifies the HTTP path that will be requested during health checking. For example
   * * /healthcheck*.
   */
  'path': (string);
  /**
   * [#not-implemented-hide:] HTTP specific payload.
   */
  'send'?: (_envoy_api_v2_core_HealthCheck_Payload__Output);
  /**
   * [#not-implemented-hide:] HTTP specific response.
   */
  'receive'?: (_envoy_api_v2_core_HealthCheck_Payload__Output);
  /**
   * An optional service name parameter which is used to validate the identity of
   * the health checked cluster. See the :ref:`architecture overview
   * <arch_overview_health_checking_identity>` for more information.
   * 
   * .. attention::
   * 
   * This field has been deprecated in favor of `service_name_matcher` for better flexibility
   * over matching with service-cluster name.
   */
  'service_name': (string);
  /**
   * Specifies a list of HTTP headers that should be added to each request that is sent to the
   * health checked cluster. For more information, including details on header value syntax, see
   * the documentation on :ref:`custom request headers
   * <config_http_conn_man_headers_custom_request_headers>`.
   */
  'request_headers_to_add': (_envoy_api_v2_core_HeaderValueOption__Output)[];
  /**
   * Specifies a list of HTTP headers that should be removed from each request that is sent to the
   * health checked cluster.
   */
  'request_headers_to_remove': (string)[];
  /**
   * If set, health checks will be made using http/2.
   * Deprecated, use :ref:`codec_client_type
   * <envoy_api_field_core.HealthCheck.HttpHealthCheck.codec_client_type>` instead.
   */
  'use_http2': (boolean);
  /**
   * Specifies a list of HTTP response statuses considered healthy. If provided, replaces default
   * 200-only policy - 200 must be included explicitly as needed. Ranges follow half-open
   * semantics of :ref:`Int64Range <envoy_api_msg_type.Int64Range>`. The start and end of each
   * range are required. Only statuses in the range [100, 600) are allowed.
   */
  'expected_statuses': (_envoy_type_Int64Range__Output)[];
  /**
   * Use specified application protocol for health checks.
   */
  'codec_client_type': (keyof typeof _envoy_type_CodecClientType);
  /**
   * An optional service name parameter which is used to validate the identity of
   * the health checked cluster using a :ref:`StringMatcher
   * <envoy_api_msg_type.matcher.StringMatcher>`. See the :ref:`architecture overview
   * <arch_overview_health_checking_identity>` for more information.
   */
  'service_name_matcher'?: (_envoy_type_matcher_StringMatcher__Output);
}

/**
 * Describes the encoding of the payload bytes in the payload.
 */
export interface _envoy_api_v2_core_HealthCheck_Payload {
  /**
   * Hex encoded payload. E.g., "000000FF".
   */
  'text'?: (string);
  /**
   * [#not-implemented-hide:] Binary payload.
   */
  'binary'?: (Buffer | Uint8Array | string);
  'payload'?: "text"|"binary";
}

/**
 * Describes the encoding of the payload bytes in the payload.
 */
export interface _envoy_api_v2_core_HealthCheck_Payload__Output {
  /**
   * Hex encoded payload. E.g., "000000FF".
   */
  'text'?: (string);
  /**
   * [#not-implemented-hide:] Binary payload.
   */
  'binary'?: (Buffer);
  'payload': "text"|"binary";
}

export interface _envoy_api_v2_core_HealthCheck_RedisHealthCheck {
  /**
   * If set, optionally perform ``EXISTS <key>`` instead of ``PING``. A return value
   * from Redis of 0 (does not exist) is considered a passing healthcheck. A return value other
   * than 0 is considered a failure. This allows the user to mark a Redis instance for maintenance
   * by setting the specified key to any value and waiting for traffic to drain.
   */
  'key'?: (string);
}

export interface _envoy_api_v2_core_HealthCheck_RedisHealthCheck__Output {
  /**
   * If set, optionally perform ``EXISTS <key>`` instead of ``PING``. A return value
   * from Redis of 0 (does not exist) is considered a passing healthcheck. A return value other
   * than 0 is considered a failure. This allows the user to mark a Redis instance for maintenance
   * by setting the specified key to any value and waiting for traffic to drain.
   */
  'key': (string);
}

export interface _envoy_api_v2_core_HealthCheck_TcpHealthCheck {
  /**
   * Empty payloads imply a connect-only health check.
   */
  'send'?: (_envoy_api_v2_core_HealthCheck_Payload);
  /**
   * When checking the response, “fuzzy” matching is performed such that each
   * binary block must be found, and in the order specified, but not
   * necessarily contiguous.
   */
  'receive'?: (_envoy_api_v2_core_HealthCheck_Payload)[];
}

export interface _envoy_api_v2_core_HealthCheck_TcpHealthCheck__Output {
  /**
   * Empty payloads imply a connect-only health check.
   */
  'send'?: (_envoy_api_v2_core_HealthCheck_Payload__Output);
  /**
   * When checking the response, “fuzzy” matching is performed such that each
   * binary block must be found, and in the order specified, but not
   * necessarily contiguous.
   */
  'receive': (_envoy_api_v2_core_HealthCheck_Payload__Output)[];
}

/**
 * Health checks occur over the transport socket specified for the cluster. This implies that if a
 * cluster is using a TLS-enabled transport socket, the health check will also occur over TLS.
 * 
 * This allows overriding the cluster TLS settings, just for health check connections.
 */
export interface _envoy_api_v2_core_HealthCheck_TlsOptions {
  /**
   * Specifies the ALPN protocols for health check connections. This is useful if the
   * corresponding upstream is using ALPN-based :ref:`FilterChainMatch
   * <envoy_api_msg_listener.FilterChainMatch>` along with different protocols for health checks
   * versus data connections. If empty, no ALPN protocols will be set on health check connections.
   */
  'alpn_protocols'?: (string)[];
}

/**
 * Health checks occur over the transport socket specified for the cluster. This implies that if a
 * cluster is using a TLS-enabled transport socket, the health check will also occur over TLS.
 * 
 * This allows overriding the cluster TLS settings, just for health check connections.
 */
export interface _envoy_api_v2_core_HealthCheck_TlsOptions__Output {
  /**
   * Specifies the ALPN protocols for health check connections. This is useful if the
   * corresponding upstream is using ALPN-based :ref:`FilterChainMatch
   * <envoy_api_msg_listener.FilterChainMatch>` along with different protocols for health checks
   * versus data connections. If empty, no ALPN protocols will be set on health check connections.
   */
  'alpn_protocols': (string)[];
}

/**
 * [#next-free-field: 23]
 */
export interface HealthCheck {
  /**
   * The time to wait for a health check response. If the timeout is reached the
   * health check attempt will be considered a failure.
   */
  'timeout'?: (_google_protobuf_Duration);
  /**
   * The interval between health checks.
   */
  'interval'?: (_google_protobuf_Duration);
  /**
   * An optional jitter amount in milliseconds. If specified, during every
   * interval Envoy will add interval_jitter to the wait time.
   */
  'interval_jitter'?: (_google_protobuf_Duration);
  /**
   * The number of unhealthy health checks required before a host is marked
   * unhealthy. Note that for *http* health checking if a host responds with 503
   * this threshold is ignored and the host is considered unhealthy immediately.
   */
  'unhealthy_threshold'?: (_google_protobuf_UInt32Value);
  /**
   * The number of healthy health checks required before a host is marked
   * healthy. Note that during startup, only a single successful health check is
   * required to mark a host healthy.
   */
  'healthy_threshold'?: (_google_protobuf_UInt32Value);
  /**
   * [#not-implemented-hide:] Non-serving port for health checking.
   */
  'alt_port'?: (_google_protobuf_UInt32Value);
  /**
   * Reuse health check connection between health checks. Default is true.
   */
  'reuse_connection'?: (_google_protobuf_BoolValue);
  /**
   * HTTP health check.
   */
  'http_health_check'?: (_envoy_api_v2_core_HealthCheck_HttpHealthCheck);
  /**
   * TCP health check.
   */
  'tcp_health_check'?: (_envoy_api_v2_core_HealthCheck_TcpHealthCheck);
  /**
   * gRPC health check.
   */
  'grpc_health_check'?: (_envoy_api_v2_core_HealthCheck_GrpcHealthCheck);
  /**
   * The "no traffic interval" is a special health check interval that is used when a cluster has
   * never had traffic routed to it. This lower interval allows cluster information to be kept up to
   * date, without sending a potentially large amount of active health checking traffic for no
   * reason. Once a cluster has been used for traffic routing, Envoy will shift back to using the
   * standard health check interval that is defined. Note that this interval takes precedence over
   * any other.
   * 
   * The default value for "no traffic interval" is 60 seconds.
   */
  'no_traffic_interval'?: (_google_protobuf_Duration);
  /**
   * Custom health check.
   */
  'custom_health_check'?: (_envoy_api_v2_core_HealthCheck_CustomHealthCheck);
  /**
   * The "unhealthy interval" is a health check interval that is used for hosts that are marked as
   * unhealthy. As soon as the host is marked as healthy, Envoy will shift back to using the
   * standard health check interval that is defined.
   * 
   * The default value for "unhealthy interval" is the same as "interval".
   */
  'unhealthy_interval'?: (_google_protobuf_Duration);
  /**
   * The "unhealthy edge interval" is a special health check interval that is used for the first
   * health check right after a host is marked as unhealthy. For subsequent health checks
   * Envoy will shift back to using either "unhealthy interval" if present or the standard health
   * check interval that is defined.
   * 
   * The default value for "unhealthy edge interval" is the same as "unhealthy interval".
   */
  'unhealthy_edge_interval'?: (_google_protobuf_Duration);
  /**
   * The "healthy edge interval" is a special health check interval that is used for the first
   * health check right after a host is marked as healthy. For subsequent health checks
   * Envoy will shift back to using the standard health check interval that is defined.
   * 
   * The default value for "healthy edge interval" is the same as the default interval.
   */
  'healthy_edge_interval'?: (_google_protobuf_Duration);
  /**
   * Specifies the path to the :ref:`health check event log <arch_overview_health_check_logging>`.
   * If empty, no event log will be written.
   */
  'event_log_path'?: (string);
  /**
   * An optional jitter amount as a percentage of interval_ms. If specified,
   * during every interval Envoy will add interval_ms *
   * interval_jitter_percent / 100 to the wait time.
   * 
   * If interval_jitter_ms and interval_jitter_percent are both set, both of
   * them will be used to increase the wait time.
   */
  'interval_jitter_percent'?: (number);
  /**
   * If set to true, health check failure events will always be logged. If set to false, only the
   * initial health check failure event will be logged.
   * The default value is false.
   */
  'always_log_health_check_failures'?: (boolean);
  /**
   * An optional jitter amount in milliseconds. If specified, Envoy will start health
   * checking after for a random time in ms between 0 and initial_jitter. This only
   * applies to the first health check.
   */
  'initial_jitter'?: (_google_protobuf_Duration);
  /**
   * This allows overriding the cluster TLS settings, just for health check connections.
   */
  'tls_options'?: (_envoy_api_v2_core_HealthCheck_TlsOptions);
  /**
   * [#not-implemented-hide:]
   * The gRPC service for the health check event service.
   * If empty, health check events won't be sent to a remote endpoint.
   */
  'event_service'?: (_envoy_api_v2_core_EventServiceConfig);
  'health_checker'?: "http_health_check"|"tcp_health_check"|"grpc_health_check"|"custom_health_check";
}

/**
 * [#next-free-field: 23]
 */
export interface HealthCheck__Output {
  /**
   * The time to wait for a health check response. If the timeout is reached the
   * health check attempt will be considered a failure.
   */
  'timeout'?: (_google_protobuf_Duration__Output);
  /**
   * The interval between health checks.
   */
  'interval'?: (_google_protobuf_Duration__Output);
  /**
   * An optional jitter amount in milliseconds. If specified, during every
   * interval Envoy will add interval_jitter to the wait time.
   */
  'interval_jitter'?: (_google_protobuf_Duration__Output);
  /**
   * The number of unhealthy health checks required before a host is marked
   * unhealthy. Note that for *http* health checking if a host responds with 503
   * this threshold is ignored and the host is considered unhealthy immediately.
   */
  'unhealthy_threshold'?: (_google_protobuf_UInt32Value__Output);
  /**
   * The number of healthy health checks required before a host is marked
   * healthy. Note that during startup, only a single successful health check is
   * required to mark a host healthy.
   */
  'healthy_threshold'?: (_google_protobuf_UInt32Value__Output);
  /**
   * [#not-implemented-hide:] Non-serving port for health checking.
   */
  'alt_port'?: (_google_protobuf_UInt32Value__Output);
  /**
   * Reuse health check connection between health checks. Default is true.
   */
  'reuse_connection'?: (_google_protobuf_BoolValue__Output);
  /**
   * HTTP health check.
   */
  'http_health_check'?: (_envoy_api_v2_core_HealthCheck_HttpHealthCheck__Output);
  /**
   * TCP health check.
   */
  'tcp_health_check'?: (_envoy_api_v2_core_HealthCheck_TcpHealthCheck__Output);
  /**
   * gRPC health check.
   */
  'grpc_health_check'?: (_envoy_api_v2_core_HealthCheck_GrpcHealthCheck__Output);
  /**
   * The "no traffic interval" is a special health check interval that is used when a cluster has
   * never had traffic routed to it. This lower interval allows cluster information to be kept up to
   * date, without sending a potentially large amount of active health checking traffic for no
   * reason. Once a cluster has been used for traffic routing, Envoy will shift back to using the
   * standard health check interval that is defined. Note that this interval takes precedence over
   * any other.
   * 
   * The default value for "no traffic interval" is 60 seconds.
   */
  'no_traffic_interval'?: (_google_protobuf_Duration__Output);
  /**
   * Custom health check.
   */
  'custom_health_check'?: (_envoy_api_v2_core_HealthCheck_CustomHealthCheck__Output);
  /**
   * The "unhealthy interval" is a health check interval that is used for hosts that are marked as
   * unhealthy. As soon as the host is marked as healthy, Envoy will shift back to using the
   * standard health check interval that is defined.
   * 
   * The default value for "unhealthy interval" is the same as "interval".
   */
  'unhealthy_interval'?: (_google_protobuf_Duration__Output);
  /**
   * The "unhealthy edge interval" is a special health check interval that is used for the first
   * health check right after a host is marked as unhealthy. For subsequent health checks
   * Envoy will shift back to using either "unhealthy interval" if present or the standard health
   * check interval that is defined.
   * 
   * The default value for "unhealthy edge interval" is the same as "unhealthy interval".
   */
  'unhealthy_edge_interval'?: (_google_protobuf_Duration__Output);
  /**
   * The "healthy edge interval" is a special health check interval that is used for the first
   * health check right after a host is marked as healthy. For subsequent health checks
   * Envoy will shift back to using the standard health check interval that is defined.
   * 
   * The default value for "healthy edge interval" is the same as the default interval.
   */
  'healthy_edge_interval'?: (_google_protobuf_Duration__Output);
  /**
   * Specifies the path to the :ref:`health check event log <arch_overview_health_check_logging>`.
   * If empty, no event log will be written.
   */
  'event_log_path': (string);
  /**
   * An optional jitter amount as a percentage of interval_ms. If specified,
   * during every interval Envoy will add interval_ms *
   * interval_jitter_percent / 100 to the wait time.
   * 
   * If interval_jitter_ms and interval_jitter_percent are both set, both of
   * them will be used to increase the wait time.
   */
  'interval_jitter_percent': (number);
  /**
   * If set to true, health check failure events will always be logged. If set to false, only the
   * initial health check failure event will be logged.
   * The default value is false.
   */
  'always_log_health_check_failures': (boolean);
  /**
   * An optional jitter amount in milliseconds. If specified, Envoy will start health
   * checking after for a random time in ms between 0 and initial_jitter. This only
   * applies to the first health check.
   */
  'initial_jitter'?: (_google_protobuf_Duration__Output);
  /**
   * This allows overriding the cluster TLS settings, just for health check connections.
   */
  'tls_options'?: (_envoy_api_v2_core_HealthCheck_TlsOptions__Output);
  /**
   * [#not-implemented-hide:]
   * The gRPC service for the health check event service.
   * If empty, health check events won't be sent to a remote endpoint.
   */
  'event_service'?: (_envoy_api_v2_core_EventServiceConfig__Output);
  'health_checker': "http_health_check"|"tcp_health_check"|"grpc_health_check"|"custom_health_check";
}
