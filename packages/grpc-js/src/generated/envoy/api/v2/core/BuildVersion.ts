// Original file: deps/envoy-api/envoy/api/v2/core/base.proto

import { SemanticVersion as _envoy_type_SemanticVersion, SemanticVersion__Output as _envoy_type_SemanticVersion__Output } from '../../../../envoy/type/SemanticVersion';
import { Struct as _google_protobuf_Struct, Struct__Output as _google_protobuf_Struct__Output } from '../../../../google/protobuf/Struct';

export interface BuildVersion {
  'version'?: (_envoy_type_SemanticVersion);
  'metadata'?: (_google_protobuf_Struct);
}

export interface BuildVersion__Output {
  'version': (_envoy_type_SemanticVersion__Output);
  'metadata': (_google_protobuf_Struct__Output);
}
