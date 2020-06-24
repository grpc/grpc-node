// Original file: deps/envoy-api/envoy/type/tracing/v2/custom_tag.proto

import { MetadataKind as _envoy_type_metadata_v2_MetadataKind, MetadataKind__Output as _envoy_type_metadata_v2_MetadataKind__Output } from '../../../../envoy/type/metadata/v2/MetadataKind';
import { MetadataKey as _envoy_type_metadata_v2_MetadataKey, MetadataKey__Output as _envoy_type_metadata_v2_MetadataKey__Output } from '../../../../envoy/type/metadata/v2/MetadataKey';

export interface _envoy_type_tracing_v2_CustomTag_Literal {
  'value'?: (string);
}

export interface _envoy_type_tracing_v2_CustomTag_Literal__Output {
  'value': (string);
}

export interface _envoy_type_tracing_v2_CustomTag_Environment {
  'name'?: (string);
  'default_value'?: (string);
}

export interface _envoy_type_tracing_v2_CustomTag_Environment__Output {
  'name': (string);
  'default_value': (string);
}

export interface _envoy_type_tracing_v2_CustomTag_Header {
  'name'?: (string);
  'default_value'?: (string);
}

export interface _envoy_type_tracing_v2_CustomTag_Header__Output {
  'name': (string);
  'default_value': (string);
}

export interface _envoy_type_tracing_v2_CustomTag_Metadata {
  'kind'?: (_envoy_type_metadata_v2_MetadataKind);
  'metadata_key'?: (_envoy_type_metadata_v2_MetadataKey);
  'default_value'?: (string);
}

export interface _envoy_type_tracing_v2_CustomTag_Metadata__Output {
  'kind': (_envoy_type_metadata_v2_MetadataKind__Output);
  'metadata_key': (_envoy_type_metadata_v2_MetadataKey__Output);
  'default_value': (string);
}

export interface CustomTag {
  'tag'?: (string);
  'literal'?: (_envoy_type_tracing_v2_CustomTag_Literal);
  'environment'?: (_envoy_type_tracing_v2_CustomTag_Environment);
  'request_header'?: (_envoy_type_tracing_v2_CustomTag_Header);
  'metadata'?: (_envoy_type_tracing_v2_CustomTag_Metadata);
  'type'?: "literal"|"environment"|"request_header"|"metadata";
}

export interface CustomTag__Output {
  'tag': (string);
  'literal'?: (_envoy_type_tracing_v2_CustomTag_Literal__Output);
  'environment'?: (_envoy_type_tracing_v2_CustomTag_Environment__Output);
  'request_header'?: (_envoy_type_tracing_v2_CustomTag_Header__Output);
  'metadata'?: (_envoy_type_tracing_v2_CustomTag_Metadata__Output);
  'type': "literal"|"environment"|"request_header"|"metadata";
}
