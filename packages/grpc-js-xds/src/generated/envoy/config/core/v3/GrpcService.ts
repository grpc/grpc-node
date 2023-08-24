// Original file: deps/envoy-api/envoy/config/core/v3/grpc_service.proto

import type { Duration as _google_protobuf_Duration, Duration__Output as _google_protobuf_Duration__Output } from '../../../../google/protobuf/Duration';
import type { HeaderValue as _envoy_config_core_v3_HeaderValue, HeaderValue__Output as _envoy_config_core_v3_HeaderValue__Output } from '../../../../envoy/config/core/v3/HeaderValue';
import type { RetryPolicy as _envoy_config_core_v3_RetryPolicy, RetryPolicy__Output as _envoy_config_core_v3_RetryPolicy__Output } from '../../../../envoy/config/core/v3/RetryPolicy';
import type { Struct as _google_protobuf_Struct, Struct__Output as _google_protobuf_Struct__Output } from '../../../../google/protobuf/Struct';
import type { UInt32Value as _google_protobuf_UInt32Value, UInt32Value__Output as _google_protobuf_UInt32Value__Output } from '../../../../google/protobuf/UInt32Value';
import type { DataSource as _envoy_config_core_v3_DataSource, DataSource__Output as _envoy_config_core_v3_DataSource__Output } from '../../../../envoy/config/core/v3/DataSource';
import type { Empty as _google_protobuf_Empty, Empty__Output as _google_protobuf_Empty__Output } from '../../../../google/protobuf/Empty';
import type { Any as _google_protobuf_Any, Any__Output as _google_protobuf_Any__Output } from '../../../../google/protobuf/Any';
import type { Long } from '@grpc/proto-loader';

/**
 * [#next-free-field: 8]
 */
export interface _envoy_config_core_v3_GrpcService_GoogleGrpc_CallCredentials {
  /**
   * Access token credentials.
   * https://grpc.io/grpc/cpp/namespacegrpc.html#ad3a80da696ffdaea943f0f858d7a360d.
   */
  'access_token'?: (string);
  /**
   * Google Compute Engine credentials.
   * https://grpc.io/grpc/cpp/namespacegrpc.html#a6beb3ac70ff94bd2ebbd89b8f21d1f61
   */
  'google_compute_engine'?: (_google_protobuf_Empty | null);
  /**
   * Google refresh token credentials.
   * https://grpc.io/grpc/cpp/namespacegrpc.html#a96901c997b91bc6513b08491e0dca37c.
   */
  'google_refresh_token'?: (string);
  /**
   * Service Account JWT Access credentials.
   * https://grpc.io/grpc/cpp/namespacegrpc.html#a92a9f959d6102461f66ee973d8e9d3aa.
   */
  'service_account_jwt_access'?: (_envoy_config_core_v3_GrpcService_GoogleGrpc_CallCredentials_ServiceAccountJWTAccessCredentials | null);
  /**
   * Google IAM credentials.
   * https://grpc.io/grpc/cpp/namespacegrpc.html#a9fc1fc101b41e680d47028166e76f9d0.
   */
  'google_iam'?: (_envoy_config_core_v3_GrpcService_GoogleGrpc_CallCredentials_GoogleIAMCredentials | null);
  /**
   * Custom authenticator credentials.
   * https://grpc.io/grpc/cpp/namespacegrpc.html#a823c6a4b19ffc71fb33e90154ee2ad07.
   * https://grpc.io/docs/guides/auth.html#extending-grpc-to-support-other-authentication-mechanisms.
   */
  'from_plugin'?: (_envoy_config_core_v3_GrpcService_GoogleGrpc_CallCredentials_MetadataCredentialsFromPlugin | null);
  /**
   * Custom security token service which implements OAuth 2.0 token exchange.
   * https://tools.ietf.org/html/draft-ietf-oauth-token-exchange-16
   * See https://github.com/grpc/grpc/pull/19587.
   */
  'sts_service'?: (_envoy_config_core_v3_GrpcService_GoogleGrpc_CallCredentials_StsService | null);
  'credential_specifier'?: "access_token"|"google_compute_engine"|"google_refresh_token"|"service_account_jwt_access"|"google_iam"|"from_plugin"|"sts_service";
}

/**
 * [#next-free-field: 8]
 */
export interface _envoy_config_core_v3_GrpcService_GoogleGrpc_CallCredentials__Output {
  /**
   * Access token credentials.
   * https://grpc.io/grpc/cpp/namespacegrpc.html#ad3a80da696ffdaea943f0f858d7a360d.
   */
  'access_token'?: (string);
  /**
   * Google Compute Engine credentials.
   * https://grpc.io/grpc/cpp/namespacegrpc.html#a6beb3ac70ff94bd2ebbd89b8f21d1f61
   */
  'google_compute_engine'?: (_google_protobuf_Empty__Output | null);
  /**
   * Google refresh token credentials.
   * https://grpc.io/grpc/cpp/namespacegrpc.html#a96901c997b91bc6513b08491e0dca37c.
   */
  'google_refresh_token'?: (string);
  /**
   * Service Account JWT Access credentials.
   * https://grpc.io/grpc/cpp/namespacegrpc.html#a92a9f959d6102461f66ee973d8e9d3aa.
   */
  'service_account_jwt_access'?: (_envoy_config_core_v3_GrpcService_GoogleGrpc_CallCredentials_ServiceAccountJWTAccessCredentials__Output | null);
  /**
   * Google IAM credentials.
   * https://grpc.io/grpc/cpp/namespacegrpc.html#a9fc1fc101b41e680d47028166e76f9d0.
   */
  'google_iam'?: (_envoy_config_core_v3_GrpcService_GoogleGrpc_CallCredentials_GoogleIAMCredentials__Output | null);
  /**
   * Custom authenticator credentials.
   * https://grpc.io/grpc/cpp/namespacegrpc.html#a823c6a4b19ffc71fb33e90154ee2ad07.
   * https://grpc.io/docs/guides/auth.html#extending-grpc-to-support-other-authentication-mechanisms.
   */
  'from_plugin'?: (_envoy_config_core_v3_GrpcService_GoogleGrpc_CallCredentials_MetadataCredentialsFromPlugin__Output | null);
  /**
   * Custom security token service which implements OAuth 2.0 token exchange.
   * https://tools.ietf.org/html/draft-ietf-oauth-token-exchange-16
   * See https://github.com/grpc/grpc/pull/19587.
   */
  'sts_service'?: (_envoy_config_core_v3_GrpcService_GoogleGrpc_CallCredentials_StsService__Output | null);
  'credential_specifier': "access_token"|"google_compute_engine"|"google_refresh_token"|"service_account_jwt_access"|"google_iam"|"from_plugin"|"sts_service";
}

/**
 * Channel arguments.
 */
export interface _envoy_config_core_v3_GrpcService_GoogleGrpc_ChannelArgs {
  /**
   * See grpc_types.h GRPC_ARG #defines for keys that work here.
   */
  'args'?: ({[key: string]: _envoy_config_core_v3_GrpcService_GoogleGrpc_ChannelArgs_Value});
}

/**
 * Channel arguments.
 */
export interface _envoy_config_core_v3_GrpcService_GoogleGrpc_ChannelArgs__Output {
  /**
   * See grpc_types.h GRPC_ARG #defines for keys that work here.
   */
  'args': ({[key: string]: _envoy_config_core_v3_GrpcService_GoogleGrpc_ChannelArgs_Value__Output});
}

/**
 * See https://grpc.io/docs/guides/auth.html#credential-types to understand Channel and Call
 * credential types.
 */
export interface _envoy_config_core_v3_GrpcService_GoogleGrpc_ChannelCredentials {
  'ssl_credentials'?: (_envoy_config_core_v3_GrpcService_GoogleGrpc_SslCredentials | null);
  /**
   * https://grpc.io/grpc/cpp/namespacegrpc.html#a6beb3ac70ff94bd2ebbd89b8f21d1f61
   */
  'google_default'?: (_google_protobuf_Empty | null);
  'local_credentials'?: (_envoy_config_core_v3_GrpcService_GoogleGrpc_GoogleLocalCredentials | null);
  'credential_specifier'?: "ssl_credentials"|"google_default"|"local_credentials";
}

/**
 * See https://grpc.io/docs/guides/auth.html#credential-types to understand Channel and Call
 * credential types.
 */
export interface _envoy_config_core_v3_GrpcService_GoogleGrpc_ChannelCredentials__Output {
  'ssl_credentials'?: (_envoy_config_core_v3_GrpcService_GoogleGrpc_SslCredentials__Output | null);
  /**
   * https://grpc.io/grpc/cpp/namespacegrpc.html#a6beb3ac70ff94bd2ebbd89b8f21d1f61
   */
  'google_default'?: (_google_protobuf_Empty__Output | null);
  'local_credentials'?: (_envoy_config_core_v3_GrpcService_GoogleGrpc_GoogleLocalCredentials__Output | null);
  'credential_specifier': "ssl_credentials"|"google_default"|"local_credentials";
}

export interface _envoy_config_core_v3_GrpcService_EnvoyGrpc {
  /**
   * The name of the upstream gRPC cluster. SSL credentials will be supplied
   * in the :ref:`Cluster <envoy_v3_api_msg_config.cluster.v3.Cluster>` :ref:`transport_socket
   * <envoy_v3_api_field_config.cluster.v3.Cluster.transport_socket>`.
   */
  'cluster_name'?: (string);
  /**
   * The ``:authority`` header in the grpc request. If this field is not set, the authority header value will be ``cluster_name``.
   * Note that this authority does not override the SNI. The SNI is provided by the transport socket of the cluster.
   */
  'authority'?: (string);
  /**
   * Indicates the retry policy for re-establishing the gRPC stream
   * This field is optional. If max interval is not provided, it will be set to ten times the provided base interval.
   * Currently only supported for xDS gRPC streams.
   * If not set, xDS gRPC streams default base interval:500ms, maximum interval:30s will be applied.
   */
  'retry_policy'?: (_envoy_config_core_v3_RetryPolicy | null);
}

export interface _envoy_config_core_v3_GrpcService_EnvoyGrpc__Output {
  /**
   * The name of the upstream gRPC cluster. SSL credentials will be supplied
   * in the :ref:`Cluster <envoy_v3_api_msg_config.cluster.v3.Cluster>` :ref:`transport_socket
   * <envoy_v3_api_field_config.cluster.v3.Cluster.transport_socket>`.
   */
  'cluster_name': (string);
  /**
   * The ``:authority`` header in the grpc request. If this field is not set, the authority header value will be ``cluster_name``.
   * Note that this authority does not override the SNI. The SNI is provided by the transport socket of the cluster.
   */
  'authority': (string);
  /**
   * Indicates the retry policy for re-establishing the gRPC stream
   * This field is optional. If max interval is not provided, it will be set to ten times the provided base interval.
   * Currently only supported for xDS gRPC streams.
   * If not set, xDS gRPC streams default base interval:500ms, maximum interval:30s will be applied.
   */
  'retry_policy': (_envoy_config_core_v3_RetryPolicy__Output | null);
}

/**
 * [#next-free-field: 9]
 */
export interface _envoy_config_core_v3_GrpcService_GoogleGrpc {
  /**
   * The target URI when using the `Google C++ gRPC client
   * <https://github.com/grpc/grpc>`_. SSL credentials will be supplied in
   * :ref:`channel_credentials <envoy_v3_api_field_config.core.v3.GrpcService.GoogleGrpc.channel_credentials>`.
   */
  'target_uri'?: (string);
  'channel_credentials'?: (_envoy_config_core_v3_GrpcService_GoogleGrpc_ChannelCredentials | null);
  /**
   * A set of call credentials that can be composed with `channel credentials
   * <https://grpc.io/docs/guides/auth.html#credential-types>`_.
   */
  'call_credentials'?: (_envoy_config_core_v3_GrpcService_GoogleGrpc_CallCredentials)[];
  /**
   * The human readable prefix to use when emitting statistics for the gRPC
   * service.
   * 
   * .. csv-table::
   * :header: Name, Type, Description
   * :widths: 1, 1, 2
   * 
   * streams_total, Counter, Total number of streams opened
   * streams_closed_<gRPC status code>, Counter, Total streams closed with <gRPC status code>
   */
  'stat_prefix'?: (string);
  /**
   * The name of the Google gRPC credentials factory to use. This must have been registered with
   * Envoy. If this is empty, a default credentials factory will be used that sets up channel
   * credentials based on other configuration parameters.
   */
  'credentials_factory_name'?: (string);
  /**
   * Additional configuration for site-specific customizations of the Google
   * gRPC library.
   */
  'config'?: (_google_protobuf_Struct | null);
  /**
   * How many bytes each stream can buffer internally.
   * If not set an implementation defined default is applied (1MiB).
   */
  'per_stream_buffer_limit_bytes'?: (_google_protobuf_UInt32Value | null);
  /**
   * Custom channels args.
   */
  'channel_args'?: (_envoy_config_core_v3_GrpcService_GoogleGrpc_ChannelArgs | null);
}

/**
 * [#next-free-field: 9]
 */
export interface _envoy_config_core_v3_GrpcService_GoogleGrpc__Output {
  /**
   * The target URI when using the `Google C++ gRPC client
   * <https://github.com/grpc/grpc>`_. SSL credentials will be supplied in
   * :ref:`channel_credentials <envoy_v3_api_field_config.core.v3.GrpcService.GoogleGrpc.channel_credentials>`.
   */
  'target_uri': (string);
  'channel_credentials': (_envoy_config_core_v3_GrpcService_GoogleGrpc_ChannelCredentials__Output | null);
  /**
   * A set of call credentials that can be composed with `channel credentials
   * <https://grpc.io/docs/guides/auth.html#credential-types>`_.
   */
  'call_credentials': (_envoy_config_core_v3_GrpcService_GoogleGrpc_CallCredentials__Output)[];
  /**
   * The human readable prefix to use when emitting statistics for the gRPC
   * service.
   * 
   * .. csv-table::
   * :header: Name, Type, Description
   * :widths: 1, 1, 2
   * 
   * streams_total, Counter, Total number of streams opened
   * streams_closed_<gRPC status code>, Counter, Total streams closed with <gRPC status code>
   */
  'stat_prefix': (string);
  /**
   * The name of the Google gRPC credentials factory to use. This must have been registered with
   * Envoy. If this is empty, a default credentials factory will be used that sets up channel
   * credentials based on other configuration parameters.
   */
  'credentials_factory_name': (string);
  /**
   * Additional configuration for site-specific customizations of the Google
   * gRPC library.
   */
  'config': (_google_protobuf_Struct__Output | null);
  /**
   * How many bytes each stream can buffer internally.
   * If not set an implementation defined default is applied (1MiB).
   */
  'per_stream_buffer_limit_bytes': (_google_protobuf_UInt32Value__Output | null);
  /**
   * Custom channels args.
   */
  'channel_args': (_envoy_config_core_v3_GrpcService_GoogleGrpc_ChannelArgs__Output | null);
}

export interface _envoy_config_core_v3_GrpcService_GoogleGrpc_CallCredentials_GoogleIAMCredentials {
  'authorization_token'?: (string);
  'authority_selector'?: (string);
}

export interface _envoy_config_core_v3_GrpcService_GoogleGrpc_CallCredentials_GoogleIAMCredentials__Output {
  'authorization_token': (string);
  'authority_selector': (string);
}

/**
 * Local channel credentials. Only UDS is supported for now.
 * See https://github.com/grpc/grpc/pull/15909.
 */
export interface _envoy_config_core_v3_GrpcService_GoogleGrpc_GoogleLocalCredentials {
}

/**
 * Local channel credentials. Only UDS is supported for now.
 * See https://github.com/grpc/grpc/pull/15909.
 */
export interface _envoy_config_core_v3_GrpcService_GoogleGrpc_GoogleLocalCredentials__Output {
}

export interface _envoy_config_core_v3_GrpcService_GoogleGrpc_CallCredentials_MetadataCredentialsFromPlugin {
  'name'?: (string);
  'typed_config'?: (_google_protobuf_Any | null);
  /**
   * [#extension-category: envoy.grpc_credentials]
   */
  'config_type'?: "typed_config";
}

export interface _envoy_config_core_v3_GrpcService_GoogleGrpc_CallCredentials_MetadataCredentialsFromPlugin__Output {
  'name': (string);
  'typed_config'?: (_google_protobuf_Any__Output | null);
  /**
   * [#extension-category: envoy.grpc_credentials]
   */
  'config_type': "typed_config";
}

export interface _envoy_config_core_v3_GrpcService_GoogleGrpc_CallCredentials_ServiceAccountJWTAccessCredentials {
  'json_key'?: (string);
  'token_lifetime_seconds'?: (number | string | Long);
}

export interface _envoy_config_core_v3_GrpcService_GoogleGrpc_CallCredentials_ServiceAccountJWTAccessCredentials__Output {
  'json_key': (string);
  'token_lifetime_seconds': (string);
}

/**
 * See https://grpc.io/grpc/cpp/structgrpc_1_1_ssl_credentials_options.html.
 */
export interface _envoy_config_core_v3_GrpcService_GoogleGrpc_SslCredentials {
  /**
   * PEM encoded server root certificates.
   */
  'root_certs'?: (_envoy_config_core_v3_DataSource | null);
  /**
   * PEM encoded client private key.
   */
  'private_key'?: (_envoy_config_core_v3_DataSource | null);
  /**
   * PEM encoded client certificate chain.
   */
  'cert_chain'?: (_envoy_config_core_v3_DataSource | null);
}

/**
 * See https://grpc.io/grpc/cpp/structgrpc_1_1_ssl_credentials_options.html.
 */
export interface _envoy_config_core_v3_GrpcService_GoogleGrpc_SslCredentials__Output {
  /**
   * PEM encoded server root certificates.
   */
  'root_certs': (_envoy_config_core_v3_DataSource__Output | null);
  /**
   * PEM encoded client private key.
   */
  'private_key': (_envoy_config_core_v3_DataSource__Output | null);
  /**
   * PEM encoded client certificate chain.
   */
  'cert_chain': (_envoy_config_core_v3_DataSource__Output | null);
}

/**
 * Security token service configuration that allows Google gRPC to
 * fetch security token from an OAuth 2.0 authorization server.
 * See https://tools.ietf.org/html/draft-ietf-oauth-token-exchange-16 and
 * https://github.com/grpc/grpc/pull/19587.
 * [#next-free-field: 10]
 */
export interface _envoy_config_core_v3_GrpcService_GoogleGrpc_CallCredentials_StsService {
  /**
   * URI of the token exchange service that handles token exchange requests.
   * [#comment:TODO(asraa): Add URI validation when implemented. Tracked by
   * https://github.com/bufbuild/protoc-gen-validate/issues/303]
   */
  'token_exchange_service_uri'?: (string);
  /**
   * Location of the target service or resource where the client
   * intends to use the requested security token.
   */
  'resource'?: (string);
  /**
   * Logical name of the target service where the client intends to
   * use the requested security token.
   */
  'audience'?: (string);
  /**
   * The desired scope of the requested security token in the
   * context of the service or resource where the token will be used.
   */
  'scope'?: (string);
  /**
   * Type of the requested security token.
   */
  'requested_token_type'?: (string);
  /**
   * The path of subject token, a security token that represents the
   * identity of the party on behalf of whom the request is being made.
   */
  'subject_token_path'?: (string);
  /**
   * Type of the subject token.
   */
  'subject_token_type'?: (string);
  /**
   * The path of actor token, a security token that represents the identity
   * of the acting party. The acting party is authorized to use the
   * requested security token and act on behalf of the subject.
   */
  'actor_token_path'?: (string);
  /**
   * Type of the actor token.
   */
  'actor_token_type'?: (string);
}

/**
 * Security token service configuration that allows Google gRPC to
 * fetch security token from an OAuth 2.0 authorization server.
 * See https://tools.ietf.org/html/draft-ietf-oauth-token-exchange-16 and
 * https://github.com/grpc/grpc/pull/19587.
 * [#next-free-field: 10]
 */
export interface _envoy_config_core_v3_GrpcService_GoogleGrpc_CallCredentials_StsService__Output {
  /**
   * URI of the token exchange service that handles token exchange requests.
   * [#comment:TODO(asraa): Add URI validation when implemented. Tracked by
   * https://github.com/bufbuild/protoc-gen-validate/issues/303]
   */
  'token_exchange_service_uri': (string);
  /**
   * Location of the target service or resource where the client
   * intends to use the requested security token.
   */
  'resource': (string);
  /**
   * Logical name of the target service where the client intends to
   * use the requested security token.
   */
  'audience': (string);
  /**
   * The desired scope of the requested security token in the
   * context of the service or resource where the token will be used.
   */
  'scope': (string);
  /**
   * Type of the requested security token.
   */
  'requested_token_type': (string);
  /**
   * The path of subject token, a security token that represents the
   * identity of the party on behalf of whom the request is being made.
   */
  'subject_token_path': (string);
  /**
   * Type of the subject token.
   */
  'subject_token_type': (string);
  /**
   * The path of actor token, a security token that represents the identity
   * of the acting party. The acting party is authorized to use the
   * requested security token and act on behalf of the subject.
   */
  'actor_token_path': (string);
  /**
   * Type of the actor token.
   */
  'actor_token_type': (string);
}

export interface _envoy_config_core_v3_GrpcService_GoogleGrpc_ChannelArgs_Value {
  'string_value'?: (string);
  'int_value'?: (number | string | Long);
  /**
   * Pointer values are not supported, since they don't make any sense when
   * delivered via the API.
   */
  'value_specifier'?: "string_value"|"int_value";
}

export interface _envoy_config_core_v3_GrpcService_GoogleGrpc_ChannelArgs_Value__Output {
  'string_value'?: (string);
  'int_value'?: (string);
  /**
   * Pointer values are not supported, since they don't make any sense when
   * delivered via the API.
   */
  'value_specifier': "string_value"|"int_value";
}

/**
 * gRPC service configuration. This is used by :ref:`ApiConfigSource
 * <envoy_v3_api_msg_config.core.v3.ApiConfigSource>` and filter configurations.
 * [#next-free-field: 6]
 */
export interface GrpcService {
  /**
   * Envoy's in-built gRPC client.
   * See the :ref:`gRPC services overview <arch_overview_grpc_services>`
   * documentation for discussion on gRPC client selection.
   */
  'envoy_grpc'?: (_envoy_config_core_v3_GrpcService_EnvoyGrpc | null);
  /**
   * `Google C++ gRPC client <https://github.com/grpc/grpc>`_
   * See the :ref:`gRPC services overview <arch_overview_grpc_services>`
   * documentation for discussion on gRPC client selection.
   */
  'google_grpc'?: (_envoy_config_core_v3_GrpcService_GoogleGrpc | null);
  /**
   * The timeout for the gRPC request. This is the timeout for a specific
   * request.
   */
  'timeout'?: (_google_protobuf_Duration | null);
  /**
   * Additional metadata to include in streams initiated to the GrpcService. This can be used for
   * scenarios in which additional ad hoc authorization headers (e.g. ``x-foo-bar: baz-key``) are to
   * be injected. For more information, including details on header value syntax, see the
   * documentation on :ref:`custom request headers
   * <config_http_conn_man_headers_custom_request_headers>`.
   */
  'initial_metadata'?: (_envoy_config_core_v3_HeaderValue)[];
  'target_specifier'?: "envoy_grpc"|"google_grpc";
}

/**
 * gRPC service configuration. This is used by :ref:`ApiConfigSource
 * <envoy_v3_api_msg_config.core.v3.ApiConfigSource>` and filter configurations.
 * [#next-free-field: 6]
 */
export interface GrpcService__Output {
  /**
   * Envoy's in-built gRPC client.
   * See the :ref:`gRPC services overview <arch_overview_grpc_services>`
   * documentation for discussion on gRPC client selection.
   */
  'envoy_grpc'?: (_envoy_config_core_v3_GrpcService_EnvoyGrpc__Output | null);
  /**
   * `Google C++ gRPC client <https://github.com/grpc/grpc>`_
   * See the :ref:`gRPC services overview <arch_overview_grpc_services>`
   * documentation for discussion on gRPC client selection.
   */
  'google_grpc'?: (_envoy_config_core_v3_GrpcService_GoogleGrpc__Output | null);
  /**
   * The timeout for the gRPC request. This is the timeout for a specific
   * request.
   */
  'timeout': (_google_protobuf_Duration__Output | null);
  /**
   * Additional metadata to include in streams initiated to the GrpcService. This can be used for
   * scenarios in which additional ad hoc authorization headers (e.g. ``x-foo-bar: baz-key``) are to
   * be injected. For more information, including details on header value syntax, see the
   * documentation on :ref:`custom request headers
   * <config_http_conn_man_headers_custom_request_headers>`.
   */
  'initial_metadata': (_envoy_config_core_v3_HeaderValue__Output)[];
  'target_specifier': "envoy_grpc"|"google_grpc";
}
