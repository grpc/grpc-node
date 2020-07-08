// Original file: deps/envoy-api/envoy/api/v2/core/grpc_service.proto

import { Duration as _google_protobuf_Duration, Duration__Output as _google_protobuf_Duration__Output } from '../../../../google/protobuf/Duration';
import { HeaderValue as _envoy_api_v2_core_HeaderValue, HeaderValue__Output as _envoy_api_v2_core_HeaderValue__Output } from '../../../../envoy/api/v2/core/HeaderValue';
import { Struct as _google_protobuf_Struct, Struct__Output as _google_protobuf_Struct__Output } from '../../../../google/protobuf/Struct';
import { DataSource as _envoy_api_v2_core_DataSource, DataSource__Output as _envoy_api_v2_core_DataSource__Output } from '../../../../envoy/api/v2/core/DataSource';
import { Empty as _google_protobuf_Empty, Empty__Output as _google_protobuf_Empty__Output } from '../../../../google/protobuf/Empty';
import { Any as _google_protobuf_Any, Any__Output as _google_protobuf_Any__Output } from '../../../../google/protobuf/Any';
import { Long } from '@grpc/proto-loader';

export interface _envoy_api_v2_core_GrpcService_EnvoyGrpc {
  'cluster_name'?: (string);
}

export interface _envoy_api_v2_core_GrpcService_EnvoyGrpc__Output {
  'cluster_name': (string);
}

export interface _envoy_api_v2_core_GrpcService_GoogleGrpc {
  'target_uri'?: (string);
  'channel_credentials'?: (_envoy_api_v2_core_GrpcService_GoogleGrpc_ChannelCredentials);
  'call_credentials'?: (_envoy_api_v2_core_GrpcService_GoogleGrpc_CallCredentials)[];
  'stat_prefix'?: (string);
  'credentials_factory_name'?: (string);
  'config'?: (_google_protobuf_Struct);
}

export interface _envoy_api_v2_core_GrpcService_GoogleGrpc__Output {
  'target_uri': (string);
  'channel_credentials': (_envoy_api_v2_core_GrpcService_GoogleGrpc_ChannelCredentials__Output);
  'call_credentials': (_envoy_api_v2_core_GrpcService_GoogleGrpc_CallCredentials__Output)[];
  'stat_prefix': (string);
  'credentials_factory_name': (string);
  'config': (_google_protobuf_Struct__Output);
}

export interface _envoy_api_v2_core_GrpcService_GoogleGrpc_SslCredentials {
  'root_certs'?: (_envoy_api_v2_core_DataSource);
  'private_key'?: (_envoy_api_v2_core_DataSource);
  'cert_chain'?: (_envoy_api_v2_core_DataSource);
}

export interface _envoy_api_v2_core_GrpcService_GoogleGrpc_SslCredentials__Output {
  'root_certs': (_envoy_api_v2_core_DataSource__Output);
  'private_key': (_envoy_api_v2_core_DataSource__Output);
  'cert_chain': (_envoy_api_v2_core_DataSource__Output);
}

export interface _envoy_api_v2_core_GrpcService_GoogleGrpc_GoogleLocalCredentials {
}

export interface _envoy_api_v2_core_GrpcService_GoogleGrpc_GoogleLocalCredentials__Output {
}

export interface _envoy_api_v2_core_GrpcService_GoogleGrpc_ChannelCredentials {
  'ssl_credentials'?: (_envoy_api_v2_core_GrpcService_GoogleGrpc_SslCredentials);
  'google_default'?: (_google_protobuf_Empty);
  'local_credentials'?: (_envoy_api_v2_core_GrpcService_GoogleGrpc_GoogleLocalCredentials);
  'credential_specifier'?: "ssl_credentials"|"google_default"|"local_credentials";
}

export interface _envoy_api_v2_core_GrpcService_GoogleGrpc_ChannelCredentials__Output {
  'ssl_credentials'?: (_envoy_api_v2_core_GrpcService_GoogleGrpc_SslCredentials__Output);
  'google_default'?: (_google_protobuf_Empty__Output);
  'local_credentials'?: (_envoy_api_v2_core_GrpcService_GoogleGrpc_GoogleLocalCredentials__Output);
  'credential_specifier': "ssl_credentials"|"google_default"|"local_credentials";
}

export interface _envoy_api_v2_core_GrpcService_GoogleGrpc_CallCredentials {
  'access_token'?: (string);
  'google_compute_engine'?: (_google_protobuf_Empty);
  'google_refresh_token'?: (string);
  'service_account_jwt_access'?: (_envoy_api_v2_core_GrpcService_GoogleGrpc_CallCredentials_ServiceAccountJWTAccessCredentials);
  'google_iam'?: (_envoy_api_v2_core_GrpcService_GoogleGrpc_CallCredentials_GoogleIAMCredentials);
  'from_plugin'?: (_envoy_api_v2_core_GrpcService_GoogleGrpc_CallCredentials_MetadataCredentialsFromPlugin);
  'sts_service'?: (_envoy_api_v2_core_GrpcService_GoogleGrpc_CallCredentials_StsService);
  'credential_specifier'?: "access_token"|"google_compute_engine"|"google_refresh_token"|"service_account_jwt_access"|"google_iam"|"from_plugin"|"sts_service";
}

export interface _envoy_api_v2_core_GrpcService_GoogleGrpc_CallCredentials__Output {
  'access_token'?: (string);
  'google_compute_engine'?: (_google_protobuf_Empty__Output);
  'google_refresh_token'?: (string);
  'service_account_jwt_access'?: (_envoy_api_v2_core_GrpcService_GoogleGrpc_CallCredentials_ServiceAccountJWTAccessCredentials__Output);
  'google_iam'?: (_envoy_api_v2_core_GrpcService_GoogleGrpc_CallCredentials_GoogleIAMCredentials__Output);
  'from_plugin'?: (_envoy_api_v2_core_GrpcService_GoogleGrpc_CallCredentials_MetadataCredentialsFromPlugin__Output);
  'sts_service'?: (_envoy_api_v2_core_GrpcService_GoogleGrpc_CallCredentials_StsService__Output);
  'credential_specifier': "access_token"|"google_compute_engine"|"google_refresh_token"|"service_account_jwt_access"|"google_iam"|"from_plugin"|"sts_service";
}

export interface _envoy_api_v2_core_GrpcService_GoogleGrpc_CallCredentials_ServiceAccountJWTAccessCredentials {
  'json_key'?: (string);
  'token_lifetime_seconds'?: (number | string | Long);
}

export interface _envoy_api_v2_core_GrpcService_GoogleGrpc_CallCredentials_ServiceAccountJWTAccessCredentials__Output {
  'json_key': (string);
  'token_lifetime_seconds': (string);
}

export interface _envoy_api_v2_core_GrpcService_GoogleGrpc_CallCredentials_GoogleIAMCredentials {
  'authorization_token'?: (string);
  'authority_selector'?: (string);
}

export interface _envoy_api_v2_core_GrpcService_GoogleGrpc_CallCredentials_GoogleIAMCredentials__Output {
  'authorization_token': (string);
  'authority_selector': (string);
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

export interface _envoy_api_v2_core_GrpcService_GoogleGrpc_CallCredentials_StsService {
  'token_exchange_service_uri'?: (string);
  'resource'?: (string);
  'audience'?: (string);
  'scope'?: (string);
  'requested_token_type'?: (string);
  'subject_token_path'?: (string);
  'subject_token_type'?: (string);
  'actor_token_path'?: (string);
  'actor_token_type'?: (string);
}

export interface _envoy_api_v2_core_GrpcService_GoogleGrpc_CallCredentials_StsService__Output {
  'token_exchange_service_uri': (string);
  'resource': (string);
  'audience': (string);
  'scope': (string);
  'requested_token_type': (string);
  'subject_token_path': (string);
  'subject_token_type': (string);
  'actor_token_path': (string);
  'actor_token_type': (string);
}

export interface GrpcService {
  'envoy_grpc'?: (_envoy_api_v2_core_GrpcService_EnvoyGrpc);
  'google_grpc'?: (_envoy_api_v2_core_GrpcService_GoogleGrpc);
  'timeout'?: (_google_protobuf_Duration);
  'initial_metadata'?: (_envoy_api_v2_core_HeaderValue)[];
  'target_specifier'?: "envoy_grpc"|"google_grpc";
}

export interface GrpcService__Output {
  'envoy_grpc'?: (_envoy_api_v2_core_GrpcService_EnvoyGrpc__Output);
  'google_grpc'?: (_envoy_api_v2_core_GrpcService_GoogleGrpc__Output);
  'timeout': (_google_protobuf_Duration__Output);
  'initial_metadata': (_envoy_api_v2_core_HeaderValue__Output)[];
  'target_specifier': "envoy_grpc"|"google_grpc";
}
