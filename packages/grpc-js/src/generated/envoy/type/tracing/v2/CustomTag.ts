// Original file: deps/envoy-api/envoy/type/tracing/v2/custom_tag.proto

import { MetadataKind as _envoy_type_metadata_v2_MetadataKind, MetadataKind__Output as _envoy_type_metadata_v2_MetadataKind__Output } from '../../../../envoy/type/metadata/v2/MetadataKind';
import { MetadataKey as _envoy_type_metadata_v2_MetadataKey, MetadataKey__Output as _envoy_type_metadata_v2_MetadataKey__Output } from '../../../../envoy/type/metadata/v2/MetadataKey';

/**
 * Environment type custom tag with environment name and default value.
 */
export interface _envoy_type_tracing_v2_CustomTag_Environment {
  /**
   * Environment variable name to obtain the value to populate the tag value.
   */
  'name'?: (string);
  /**
   * When the environment variable is not found,
   * the tag value will be populated with this default value if specified,
   * otherwise no tag will be populated.
   */
  'default_value'?: (string);
}

/**
 * Environment type custom tag with environment name and default value.
 */
export interface _envoy_type_tracing_v2_CustomTag_Environment__Output {
  /**
   * Environment variable name to obtain the value to populate the tag value.
   */
  'name': (string);
  /**
   * When the environment variable is not found,
   * the tag value will be populated with this default value if specified,
   * otherwise no tag will be populated.
   */
  'default_value': (string);
}

/**
 * Header type custom tag with header name and default value.
 */
export interface _envoy_type_tracing_v2_CustomTag_Header {
  /**
   * Header name to obtain the value to populate the tag value.
   */
  'name'?: (string);
  /**
   * When the header does not exist,
   * the tag value will be populated with this default value if specified,
   * otherwise no tag will be populated.
   */
  'default_value'?: (string);
}

/**
 * Header type custom tag with header name and default value.
 */
export interface _envoy_type_tracing_v2_CustomTag_Header__Output {
  /**
   * Header name to obtain the value to populate the tag value.
   */
  'name': (string);
  /**
   * When the header does not exist,
   * the tag value will be populated with this default value if specified,
   * otherwise no tag will be populated.
   */
  'default_value': (string);
}

/**
 * Literal type custom tag with static value for the tag value.
 */
export interface _envoy_type_tracing_v2_CustomTag_Literal {
  /**
   * Static literal value to populate the tag value.
   */
  'value'?: (string);
}

/**
 * Literal type custom tag with static value for the tag value.
 */
export interface _envoy_type_tracing_v2_CustomTag_Literal__Output {
  /**
   * Static literal value to populate the tag value.
   */
  'value': (string);
}

/**
 * Metadata type custom tag using
 * :ref:`MetadataKey <envoy_api_msg_type.metadata.v2.MetadataKey>` to retrieve the protobuf value
 * from :ref:`Metadata <envoy_api_msg_core.Metadata>`, and populate the tag value with
 * `the canonical JSON <https://developers.google.com/protocol-buffers/docs/proto3#json>`_
 * representation of it.
 */
export interface _envoy_type_tracing_v2_CustomTag_Metadata {
  /**
   * Specify what kind of metadata to obtain tag value from.
   */
  'kind'?: (_envoy_type_metadata_v2_MetadataKind);
  /**
   * Metadata key to define the path to retrieve the tag value.
   */
  'metadata_key'?: (_envoy_type_metadata_v2_MetadataKey);
  /**
   * When no valid metadata is found,
   * the tag value would be populated with this default value if specified,
   * otherwise no tag would be populated.
   */
  'default_value'?: (string);
}

/**
 * Metadata type custom tag using
 * :ref:`MetadataKey <envoy_api_msg_type.metadata.v2.MetadataKey>` to retrieve the protobuf value
 * from :ref:`Metadata <envoy_api_msg_core.Metadata>`, and populate the tag value with
 * `the canonical JSON <https://developers.google.com/protocol-buffers/docs/proto3#json>`_
 * representation of it.
 */
export interface _envoy_type_tracing_v2_CustomTag_Metadata__Output {
  /**
   * Specify what kind of metadata to obtain tag value from.
   */
  'kind'?: (_envoy_type_metadata_v2_MetadataKind__Output);
  /**
   * Metadata key to define the path to retrieve the tag value.
   */
  'metadata_key'?: (_envoy_type_metadata_v2_MetadataKey__Output);
  /**
   * When no valid metadata is found,
   * the tag value would be populated with this default value if specified,
   * otherwise no tag would be populated.
   */
  'default_value': (string);
}

/**
 * Describes custom tags for the active span.
 * [#next-free-field: 6]
 */
export interface CustomTag {
  /**
   * Used to populate the tag name.
   */
  'tag'?: (string);
  /**
   * A literal custom tag.
   */
  'literal'?: (_envoy_type_tracing_v2_CustomTag_Literal);
  /**
   * An environment custom tag.
   */
  'environment'?: (_envoy_type_tracing_v2_CustomTag_Environment);
  /**
   * A request header custom tag.
   */
  'request_header'?: (_envoy_type_tracing_v2_CustomTag_Header);
  /**
   * A custom tag to obtain tag value from the metadata.
   */
  'metadata'?: (_envoy_type_tracing_v2_CustomTag_Metadata);
  /**
   * Used to specify what kind of custom tag.
   */
  'type'?: "literal"|"environment"|"request_header"|"metadata";
}

/**
 * Describes custom tags for the active span.
 * [#next-free-field: 6]
 */
export interface CustomTag__Output {
  /**
   * Used to populate the tag name.
   */
  'tag': (string);
  /**
   * A literal custom tag.
   */
  'literal'?: (_envoy_type_tracing_v2_CustomTag_Literal__Output);
  /**
   * An environment custom tag.
   */
  'environment'?: (_envoy_type_tracing_v2_CustomTag_Environment__Output);
  /**
   * A request header custom tag.
   */
  'request_header'?: (_envoy_type_tracing_v2_CustomTag_Header__Output);
  /**
   * A custom tag to obtain tag value from the metadata.
   */
  'metadata'?: (_envoy_type_tracing_v2_CustomTag_Metadata__Output);
  /**
   * Used to specify what kind of custom tag.
   */
  'type': "literal"|"environment"|"request_header"|"metadata";
}
