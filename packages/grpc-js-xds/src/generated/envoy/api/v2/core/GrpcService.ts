// Original file: deps/envoy-api/envoy/api/v2/core/grpc_service.proto

import { Duration as _google_protobuf_Duration, Duration__Output as _google_protobuf_Duration__Output } from '../../../../google/protobuf/Duration';
import { HeaderValue as _envoy_api_v2_core_HeaderValue, HeaderValue__Output as _envoy_api_v2_core_HeaderValue__Output } from '../../../../envoy/api/v2/core/HeaderValue';
import { Struct as _google_protobuf_Struct, Struct__Output as _google_protobuf_Struct__Output } from '../../../../google/protobuf/Struct';
import { DataSource as _envoy_api_v2_core_DataSource, DataSource__Output as _envoy_api_v2_core_DataSource__Output } from '../../../../envoy/api/v2/core/DataSource';
import { Empty as _google_protobuf_Empty, Empty__Output as _google_protobuf_Empty__Output } from '../../../../google/protobuf/Empty';
import { Any as _google_protobuf_Any, Any__Output as _google_protobuf_Any__Output } from '../../../../google/protobuf/Any';
import { Long } from '@grpc/proto-loader';

/**
 * [#next-free-field: 8]
 */
export interface _envoy_api_v2_core_GrpcService_GoogleGrpc_CallCredentials {
  /**
   * Access token credentials.
   * https://grpc.io/grpc/cpp/namespacegrpc.html#ad3a80da696ffdaea943f0f858d7a360d.
   */
  'access_token'?: (string);
  /**
   * Google Compute Engine credentials.
   * https://grpc.io/grpc/cpp/namespacegrpc.html#a6beb3ac70ff94bd2ebbd89b8f21d1f61
   */
  'google_compute_engine'?: (_google_protobuf_Empty);
  /**
   * Google refresh token credentials.
   * https://grpc.io/grpc/cpp/namespacegrpc.html#a96901c997b91bc6513b08491e0dca37c.
   */
  'google_refresh_token'?: (string);
  /**
   * Service Account JWT Access credentials.
   * https://grpc.io/grpc/cpp/namespacegrpc.html#a92a9f959d6102461f66ee973d8e9d3aa.
   */
  'service_account_jwt_access'?: (_envoy_api_v2_core_GrpcService_GoogleGrpc_CallCredentials_ServiceAccountJWTAccessCredentials);
  /**
   * Google IAM credentials.
   * https://grpc.io/grpc/cpp/namespacegrpc.html#a9fc1fc101b41e680d47028166e76f9d0.
   */
  'google_iam'?: (_envoy_api_v2_core_GrpcService_GoogleGrpc_CallCredentials_GoogleIAMCredentials);
  /**
   * Custom authenticator credentials.
   * https://grpc.io/grpc/cpp/namespacegrpc.html#a823c6a4b19ffc71fb33e90154ee2ad07.
   * https://grpc.io/docs/guides/auth.html#extending-grpc-to-support-other-authentication-mechanisms.
   */
  'from_plugin'?: (_envoy_api_v2_core_GrpcService_GoogleGrpc_CallCredentials_MetadataCredentialsFromPlugin);
  /**
   * Custom security token service which implements OAuth 2.0 token exchange.
   * https://tools.ietf.org/html/draft-ietf-oauth-token-exchange-16
   * See https://github.com/grpc/grpc/pull/19587.
   */
  'sts_service'?: (_envoy_api_v2_core_GrpcService_GoogleGrpc_CallCredentials_StsService);
  'credential_specifier'?: "access_token"|"google_compute_engine"|"google_refresh_token"|"service_account_jwt_access"|"google_iam"|"from_plugin"|"sts_service";
}

/**
 * [#next-free-field: 8]
 */
export interface _envoy_api_v2_core_GrpcService_GoogleGrpc_CallCredentials__Output {
  /**
   * Access token credentials.
   * https://grpc.io/grpc/cpp/namespacegrpc.html#ad3a80da696ffdaea943f0f858d7a360d.
   */
  'access_token'?: (string);
  /**
   * Google Compute Engine credentials.
   * https://grpc.io/grpc/cpp/namespacegrpc.html#a6beb3ac70ff94bd2ebbd89b8f21d1f61
   */
  'google_compute_engine'?: (_google_protobuf_Empty__Output);
  /**
   * Google refresh token credentials.
   * https://grpc.io/grpc/cpp/namespacegrpc.html#a96901c997b91bc6513b08491e0dca37c.
   */
  'google_refresh_token'?: (string);
  /**
   * Service Account JWT Access credentials.
   * https://grpc.io/grpc/cpp/namespacegrpc.html#a92a9f959d6102461f66ee973d8e9d3aa.
   */
  'service_account_jwt_access'?: (_envoy_api_v2_core_GrpcService_GoogleGrpc_CallCredentials_ServiceAccountJWTAccessCredentials__Output);
  /**
   * Google IAM credentials.
   * https://grpc.io/grpc/cpp/namespacegrpc.html#a9fc1fc101b41e680d47028166e76f9d0.
   */
  'google_iam'?: (_envoy_api_v2_core_GrpcService_GoogleGrpc_CallCredentials_GoogleIAMCredentials__Output);
  /**
   * Custom authenticator credentials.
   * https://grpc.io/grpc/cpp/namespacegrpc.html#a823c6a4b19ffc71fb33e90154ee2ad07.
   * https://grpc.io/docs/guides/auth.html#extending-grpc-to-support-other-authentication-mechanisms.
   */
  'from_plugin'?: (_envoy_api_v2_core_GrpcService_GoogleGrpc_CallCredentials_MetadataCredentialsFromPlugin__Output);
  /**
   * Custom security token service which implements OAuth 2.0 token exchange.
   * https://tools.ietf.org/html/draft-ietf-oauth-token-exchange-16
   * See https://github.com/grpc/grpc/pull/19587.
   */
  'sts_service'?: (_envoy_api_v2_core_GrpcService_GoogleGrpc_CallCredentials_StsService__Output);
  'credential_specifier': "access_token"|"google_compute_engine"|"google_refresh_token"|"service_account_jwt_access"|"google_iam"|"from_plugin"|"sts_service";
}

/**
 * See https://grpc.io/docs/guides/auth.html#credential-types to understand Channel and Call
 * credential types.
 */
export interface _envoy_api_v2_core_GrpcService_GoogleGrpc_ChannelCredentials {
  'ssl_credentials'?: (_envoy_api_v2_core_GrpcService_GoogleGrpc_SslCredentials);
  /**
   * https://grpc.io/grpc/cpp/namespacegrpc.html#a6beb3ac70ff94bd2ebbd89b8f21d1f61
   */
  'google_default'?: (_google_protobuf_Empty);
  'local_credentials'?: (_envoy_api_v2_core_GrpcService_GoogleGrpc_GoogleLocalCredentials);
  'credential_specifier'?: "ssl_credentials"|"google_default"|"local_credentials";
}

/**
 * See https://grpc.io/docs/guides/auth.html#credential-types to understand Channel and Call
 * credential types.
 */
export interface _envoy_api_v2_core_GrpcService_GoogleGrpc_ChannelCredentials__Output {
  'ssl_credentials'?: (_envoy_api_v2_core_GrpcService_GoogleGrpc_SslCredentials__Output);
  /**
   * https://grpc.io/grpc/cpp/namespacegrpc.html#a6beb3ac70ff94bd2ebbd89b8f21d1f61
   */
  'google_default'?: (_google_protobuf_Empty__Output);
  'local_credentials'?: (_envoy_api_v2_core_GrpcService_GoogleGrpc_GoogleLocalCredentials__Output);
  'credential_specifier': "ssl_credentials"|"google_default"|"local_credentials";
}

export interface _envoy_api_v2_core_GrpcService_EnvoyGrpc {
  /**
   * The name of the upstream gRPC cluster. SSL credentials will be supplied
   * in the :ref:`Cluster <envoy_api_msg_Cluster>` :ref:`transport_socket
   * <envoy_api_field_Cluster.transport_socket>`.
   */
  'cluster_name'?: (string);
}

export interface _envoy_api_v2_core_GrpcService_EnvoyGrpc__Output {
  /**
   * The name of the upstream gRPC cluster. SSL credentials will be supplied
   * in the :ref:`Cluster <envoy_api_msg_Cluster>` :ref:`transport_socket
   * <envoy_api_field_Cluster.transport_socket>`.
   */
  'cluster_name': (string);
}

/**
 * [#next-free-field: 7]
 */
export interface _envoy_api_v2_core_GrpcService_GoogleGrpc {
  /**
   * The target URI when using the `Google C++ gRPC client
   * <https://github.com/grpc/grpc>`_. SSL credentials will be supplied in
   * :ref:`channel_credentials <envoy_api_field_core.GrpcService.GoogleGrpc.channel_credentials>`.
   */
  'target_uri'?: (string);
  'channel_credentials'?: (_envoy_api_v2_core_GrpcService_GoogleGrpc_ChannelCredentials);
  /**
   * A set of call credentials that can be composed with `channel credentials
   * <https://grpc.io/docs/guides/auth.html#credential-types>`_.
   */
  'call_credentials'?: (_envoy_api_v2_core_GrpcService_GoogleGrpc_CallCredentials)[];
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
  'config'?: (_google_protobuf_Struct);
}

/**
 * [#next-free-field: 7]
 */
export interface _envoy_api_v2_core_GrpcService_GoogleGrpc__Output {
  /**
   * The target URI when using the `Google C++ gRPC client
   * <https://github.com/grpc/grpc>`_. SSL credentials will be supplied in
   * :ref:`channel_credentials <envoy_api_field_core.GrpcService.GoogleGrpc.channel_credentials>`.
   */
  'target_uri': (string);
  'channel_credentials'?: (_envoy_api_v2_core_GrpcService_GoogleGrpc_ChannelCredentials__Output);
  /**
   * A set of call credentials that can be composed with `channel credentials
   * <https://grpc.io/docs/guides/auth.html#credential-types>`_.
   */
  'call_credentials': (_envoy_api_v2_core_GrpcService_GoogleGrpc_CallCredentials__Output)[];
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
  'config'?: (_google_protobuf_Struct__Output);
}

export interface _envoy_api_v2_core_GrpcService_GoogleGrpc_CallCredentials_GoogleIAMCredentials {
  'authorization_token'?: (string);
  'authority_selector'?: (string);
}

export interface _envoy_api_v2_core_GrpcService_GoogleGrpc_CallCredentials_GoogleIAMCredentials__Output {
  'authorization_token': (string);
  'authority_selector': (string);
}

/**
 * Local channel credentials. Only UDS is supported for now.
 * See https://github.com/grpc/grpc/pull/15909.
 */
export interface _envoy_api_v2_core_GrpcService_GoogleGrpc_GoogleLocalCredentials {
}

/**
 * Local channel credentials. Only UDS is supported for now.
 * See https://github.com/grpc/grpc/pull/15909.
 */
export interface _envoy_api_v2_core_GrpcService_GoogleGrpc_GoogleLocalCredentials__Output {
}

export interface _envoy_api_v2_core_GrpcService_GoogleGrpc_CallCredentials_MetadataCredentialsFromPlugin {
  'name'?: (string);
  'config'?: (_google_protobuf_Struct);
  'typed_config'?: (_google_protobuf_Any);
  'config_type'?: "config"|"typed_config";
}

export interface _envoy_api_v2_core_GrpcService_GoogleGrpc_CallCredentials_MetadataCredentialsFromPlugin__Output {
  'name': (string);
  'config'?: (_google_protobuf_Struct__Output);
  'typed_config'?: (_google_protobuf_Any__Output);
  'config_type': "config"|"typed_config";
}

export interface _envoy_api_v2_core_GrpcService_GoogleGrpc_CallCredentials_ServiceAccountJWTAccessCredentials {
  'json_key'?: (string);
  'token_lifetime_seconds'?: (number | string | Long);
}

export interface _envoy_api_v2_core_GrpcService_GoogleGrpc_CallCredentials_ServiceAccountJWTAccessCredentials__Output {
  'json_key': (string);
  'token_lifetime_seconds': (string);
}

/**
 * See https://grpc.io/grpc/cpp/structgrpc_1_1_ssl_credentials_options.html.
 */
export interface _envoy_api_v2_core_GrpcService_GoogleGrpc_SslCredentials {
  /**
   * PEM encoded server root certificates.
   */
  'root_certs'?: (_envoy_api_v2_core_DataSource);
  /**
   * PEM encoded client private key.
   */
  'private_key'?: (_envoy_api_v2_core_DataSource);
  /**
   * PEM encoded client certificate chain.
   */
  'cert_chain'?: (_envoy_api_v2_core_DataSource);
}

/**
 * See https://grpc.io/grpc/cpp/structgrpc_1_1_ssl_credentials_options.html.
 */
export interface _envoy_api_v2_core_GrpcService_GoogleGrpc_SslCredentials__Output {
  /**
   * PEM encoded server root certificates.
   */
  'root_certs'?: (_envoy_api_v2_core_DataSource__Output);
  /**
   * PEM encoded client private key.
   */
  'private_key'?: (_envoy_api_v2_core_DataSource__Output);
  /**
   * PEM encoded client certificate chain.
   */
  'cert_chain'?: (_envoy_api_v2_core_DataSource__Output);
}

/**
 * Security token service configuration that allows Google gRPC to
 * fetch security token from an OAuth 2.0 authorization server.
 * See https://tools.ietf.org/html/draft-ietf-oauth-token-exchange-16 and
 * https://github.com/grpc/grpc/pull/19587.
 * [#next-free-field: 10]
 */
export interface _envoy_api_v2_core_GrpcService_GoogleGrpc_CallCredentials_StsService {
  /**
   * URI of the token exchange service that handles token exchange requests.
   * [#comment:TODO(asraa): Add URI validation when implemented. Tracked by
   * https://github.com/envoyproxy/protoc-gen-validate/issues/303]
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
export interface _envoy_api_v2_core_GrpcService_GoogleGrpc_CallCredentials_StsService__Output {
  /**
   * URI of the token exchange service that handles token exchange requests.
   * [#comment:TODO(asraa): Add URI validation when implemented. Tracked by
   * https://github.com/envoyproxy/protoc-gen-validate/issues/303]
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

/**
 * gRPC service configuration. This is used by :ref:`ApiConfigSource
 * <envoy_api_msg_core.ApiConfigSource>` and filter configurations.
 * [#next-free-field: 6]
 */
export interface GrpcService {
  /**
   * Envoy's in-built gRPC client.
   * See the :ref:`gRPC services overview <arch_overview_grpc_services>`
   * documentation for discussion on gRPC client selection.
   */
  'envoy_grpc'?: (_envoy_api_v2_core_GrpcService_EnvoyGrpc);
  /**
   * `Google C++ gRPC client <https://github.com/grpc/grpc>`_
   * See the :ref:`gRPC services overview <arch_overview_grpc_services>`
   * documentation for discussion on gRPC client selection.
   */
  'google_grpc'?: (_envoy_api_v2_core_GrpcService_GoogleGrpc);
  /**
   * The timeout for the gRPC request. This is the timeout for a specific
   * request.
   */
  'timeout'?: (_google_protobuf_Duration);
  /**
   * Additional metadata to include in streams initiated to the GrpcService.
   * This can be used for scenarios in which additional ad hoc authorization
   * headers (e.g. ``x-foo-bar: baz-key``) are to be injected.
   */
  'initial_metadata'?: (_envoy_api_v2_core_HeaderValue)[];
  'target_specifier'?: "envoy_grpc"|"google_grpc";
}

/**
 * gRPC service configuration. This is used by :ref:`ApiConfigSource
 * <envoy_api_msg_core.ApiConfigSource>` and filter configurations.
 * [#next-free-field: 6]
 */
export interface GrpcService__Output {
  /**
   * Envoy's in-built gRPC client.
   * See the :ref:`gRPC services overview <arch_overview_grpc_services>`
   * documentation for discussion on gRPC client selection.
   */
  'envoy_grpc'?: (_envoy_api_v2_core_GrpcService_EnvoyGrpc__Output);
  /**
   * `Google C++ gRPC client <https://github.com/grpc/grpc>`_
   * See the :ref:`gRPC services overview <arch_overview_grpc_services>`
   * documentation for discussion on gRPC client selection.
   */
  'google_grpc'?: (_envoy_api_v2_core_GrpcService_GoogleGrpc__Output);
  /**
   * The timeout for the gRPC request. This is the timeout for a specific
   * request.
   */
  'timeout'?: (_google_protobuf_Duration__Output);
  /**
   * Additional metadata to include in streams initiated to the GrpcService.
   * This can be used for scenarios in which additional ad hoc authorization
   * headers (e.g. ``x-foo-bar: baz-key``) are to be injected.
   */
  'initial_metadata': (_envoy_api_v2_core_HeaderValue__Output)[];
  'target_specifier': "envoy_grpc"|"google_grpc";
}
