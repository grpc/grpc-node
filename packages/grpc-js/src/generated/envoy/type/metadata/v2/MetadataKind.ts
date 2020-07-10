// Original file: deps/envoy-api/envoy/type/metadata/v2/metadata.proto


export interface _envoy_type_metadata_v2_MetadataKind_Cluster {
}

export interface _envoy_type_metadata_v2_MetadataKind_Cluster__Output {
}

export interface _envoy_type_metadata_v2_MetadataKind_Host {
}

export interface _envoy_type_metadata_v2_MetadataKind_Host__Output {
}

export interface _envoy_type_metadata_v2_MetadataKind_Request {
}

export interface _envoy_type_metadata_v2_MetadataKind_Request__Output {
}

export interface _envoy_type_metadata_v2_MetadataKind_Route {
}

export interface _envoy_type_metadata_v2_MetadataKind_Route__Output {
}

export interface MetadataKind {
  'request'?: (_envoy_type_metadata_v2_MetadataKind_Request);
  'route'?: (_envoy_type_metadata_v2_MetadataKind_Route);
  'cluster'?: (_envoy_type_metadata_v2_MetadataKind_Cluster);
  'host'?: (_envoy_type_metadata_v2_MetadataKind_Host);
  'kind'?: "request"|"route"|"cluster"|"host";
}

export interface MetadataKind__Output {
  'request'?: (_envoy_type_metadata_v2_MetadataKind_Request__Output);
  'route'?: (_envoy_type_metadata_v2_MetadataKind_Route__Output);
  'cluster'?: (_envoy_type_metadata_v2_MetadataKind_Cluster__Output);
  'host'?: (_envoy_type_metadata_v2_MetadataKind_Host__Output);
  'kind': "request"|"route"|"cluster"|"host";
}
