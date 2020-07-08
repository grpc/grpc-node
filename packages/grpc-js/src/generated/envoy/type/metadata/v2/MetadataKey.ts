// Original file: deps/envoy-api/envoy/type/metadata/v2/metadata.proto


export interface _envoy_type_metadata_v2_MetadataKey_PathSegment {
  'key'?: (string);
  'segment'?: "key";
}

export interface _envoy_type_metadata_v2_MetadataKey_PathSegment__Output {
  'key'?: (string);
  'segment': "key";
}

export interface MetadataKey {
  'key'?: (string);
  'path'?: (_envoy_type_metadata_v2_MetadataKey_PathSegment)[];
}

export interface MetadataKey__Output {
  'key': (string);
  'path': (_envoy_type_metadata_v2_MetadataKey_PathSegment__Output)[];
}
