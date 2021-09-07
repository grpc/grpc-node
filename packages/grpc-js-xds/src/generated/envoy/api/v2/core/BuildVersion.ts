// Original file: deps/envoy-api/envoy/api/v2/core/base.proto

import type { SemanticVersion as _envoy_type_SemanticVersion, SemanticVersion__Output as _envoy_type_SemanticVersion__Output } from '../../../../envoy/type/SemanticVersion';
import type { Struct as _google_protobuf_Struct, Struct__Output as _google_protobuf_Struct__Output } from '../../../../google/protobuf/Struct';

/**
 * BuildVersion combines SemVer version of extension with free-form build information
 * (i.e. 'alpha', 'private-build') as a set of strings.
 */
export interface BuildVersion {
  /**
   * SemVer version of extension.
   */
  'version'?: (_envoy_type_SemanticVersion | null);
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
  'version': (_envoy_type_SemanticVersion__Output | null);
  /**
   * Free-form build information.
   * Envoy defines several well known keys in the source/common/version/version.h file
   */
  'metadata': (_google_protobuf_Struct__Output | null);
}
