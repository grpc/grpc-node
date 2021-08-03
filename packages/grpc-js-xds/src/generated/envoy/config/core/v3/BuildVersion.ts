// Original file: deps/envoy-api/envoy/config/core/v3/base.proto

import type { SemanticVersion as _envoy_type_v3_SemanticVersion, SemanticVersion__Output as _envoy_type_v3_SemanticVersion__Output } from '../../../../envoy/type/v3/SemanticVersion';
import type { Struct as _google_protobuf_Struct, Struct__Output as _google_protobuf_Struct__Output } from '../../../../google/protobuf/Struct';

/**
 * BuildVersion combines SemVer version of extension with free-form build information
 * (i.e. 'alpha', 'private-build') as a set of strings.
 */
export interface BuildVersion {
  /**
   * SemVer version of extension.
   */
  'version'?: (_envoy_type_v3_SemanticVersion | null);
  /**
   * Free-form build information.
   * Envoy defines several well known keys in the source/common/version/version.h file
   */
  'metadata'?: (_google_protobuf_Struct | null);
}

/**
 * BuildVersion combines SemVer version of extension with free-form build information
 * (i.e. 'alpha', 'private-build') as a set of strings.
 */
export interface BuildVersion__Output {
  /**
   * SemVer version of extension.
   */
  'version': (_envoy_type_v3_SemanticVersion__Output | null);
  /**
   * Free-form build information.
   * Envoy defines several well known keys in the source/common/version/version.h file
   */
  'metadata': (_google_protobuf_Struct__Output | null);
}
