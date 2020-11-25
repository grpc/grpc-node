// Original file: deps/envoy-api/envoy/api/v2/core/base.proto

import { BoolValue as _google_protobuf_BoolValue, BoolValue__Output as _google_protobuf_BoolValue__Output } from '../../../../google/protobuf/BoolValue';

/**
 * Runtime derived bool with a default when not specified.
 */
export interface RuntimeFeatureFlag {
  /**
   * Default value if runtime value is not available.
   */
  'default_value'?: (_google_protobuf_BoolValue);
  /**
   * Runtime key to get value for comparison. This value is used if defined. The boolean value must
   * be represented via its
   * `canonical JSON encoding <https://developers.google.com/protocol-buffers/docs/proto3#json>`_.
   */
  'runtime_key'?: (string);
}

/**
 * Runtime derived bool with a default when not specified.
 */
export interface RuntimeFeatureFlag__Output {
  /**
   * Default value if runtime value is not available.
   */
  'default_value'?: (_google_protobuf_BoolValue__Output);
  /**
   * Runtime key to get value for comparison. This value is used if defined. The boolean value must
   * be represented via its
   * `canonical JSON encoding <https://developers.google.com/protocol-buffers/docs/proto3#json>`_.
   */
  'runtime_key': (string);
}
