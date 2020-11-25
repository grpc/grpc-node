// Original file: deps/envoy-api/envoy/api/v2/auth/common.proto

import { Struct as _google_protobuf_Struct, Struct__Output as _google_protobuf_Struct__Output } from '../../../../google/protobuf/Struct';
import { Any as _google_protobuf_Any, Any__Output as _google_protobuf_Any__Output } from '../../../../google/protobuf/Any';

/**
 * BoringSSL private key method configuration. The private key methods are used for external
 * (potentially asynchronous) signing and decryption operations. Some use cases for private key
 * methods would be TPM support and TLS acceleration.
 */
export interface PrivateKeyProvider {
  /**
   * Private key method provider name. The name must match a
   * supported private key method provider type.
   */
  'provider_name'?: (string);
  'config'?: (_google_protobuf_Struct);
  'typed_config'?: (_google_protobuf_Any);
  /**
   * Private key method provider specific configuration.
   */
  'config_type'?: "config"|"typed_config";
}

/**
 * BoringSSL private key method configuration. The private key methods are used for external
 * (potentially asynchronous) signing and decryption operations. Some use cases for private key
 * methods would be TPM support and TLS acceleration.
 */
export interface PrivateKeyProvider__Output {
  /**
   * Private key method provider name. The name must match a
   * supported private key method provider type.
   */
  'provider_name': (string);
  'config'?: (_google_protobuf_Struct__Output);
  'typed_config'?: (_google_protobuf_Any__Output);
  /**
   * Private key method provider specific configuration.
   */
  'config_type': "config"|"typed_config";
}
