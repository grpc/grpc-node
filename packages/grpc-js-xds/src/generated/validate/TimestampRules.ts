// Original file: deps/protoc-gen-validate/validate/validate.proto

import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from '../google/protobuf/Timestamp';
import type { Duration as _google_protobuf_Duration, Duration__Output as _google_protobuf_Duration__Output } from '../google/protobuf/Duration';

/**
 * TimestampRules describe the constraints applied exclusively to the
 * `google.protobuf.Timestamp` well-known type
 */
export interface TimestampRules {
  /**
   * Required specifies that this field must be set
   */
  'required'?: (boolean);
  /**
   * Const specifies that this field must be exactly the specified value
   */
  'const'?: (_google_protobuf_Timestamp);
  /**
   * Lt specifies that this field must be less than the specified value,
   * exclusive
   */
  'lt'?: (_google_protobuf_Timestamp);
  /**
   * Lte specifies that this field must be less than the specified value,
   * inclusive
   */
  'lte'?: (_google_protobuf_Timestamp);
  /**
   * Gt specifies that this field must be greater than the specified value,
   * exclusive
   */
  'gt'?: (_google_protobuf_Timestamp);
  /**
   * Gte specifies that this field must be greater than the specified value,
   * inclusive
   */
  'gte'?: (_google_protobuf_Timestamp);
  /**
   * LtNow specifies that this must be less than the current time. LtNow
   * can only be used with the Within rule.
   */
  'lt_now'?: (boolean);
  /**
   * GtNow specifies that this must be greater than the current time. GtNow
   * can only be used with the Within rule.
   */
  'gt_now'?: (boolean);
  /**
   * Within specifies that this field must be within this duration of the
   * current time. This constraint can be used alone or with the LtNow and
   * GtNow rules.
   */
  'within'?: (_google_protobuf_Duration);
}

/**
 * TimestampRules describe the constraints applied exclusively to the
 * `google.protobuf.Timestamp` well-known type
 */
export interface TimestampRules__Output {
  /**
   * Required specifies that this field must be set
   */
  'required': (boolean);
  /**
   * Const specifies that this field must be exactly the specified value
   */
  'const'?: (_google_protobuf_Timestamp__Output);
  /**
   * Lt specifies that this field must be less than the specified value,
   * exclusive
   */
  'lt'?: (_google_protobuf_Timestamp__Output);
  /**
   * Lte specifies that this field must be less than the specified value,
   * inclusive
   */
  'lte'?: (_google_protobuf_Timestamp__Output);
  /**
   * Gt specifies that this field must be greater than the specified value,
   * exclusive
   */
  'gt'?: (_google_protobuf_Timestamp__Output);
  /**
   * Gte specifies that this field must be greater than the specified value,
   * inclusive
   */
  'gte'?: (_google_protobuf_Timestamp__Output);
  /**
   * LtNow specifies that this must be less than the current time. LtNow
   * can only be used with the Within rule.
   */
  'lt_now': (boolean);
  /**
   * GtNow specifies that this must be greater than the current time. GtNow
   * can only be used with the Within rule.
   */
  'gt_now': (boolean);
  /**
   * Within specifies that this field must be within this duration of the
   * current time. This constraint can be used alone or with the LtNow and
   * GtNow rules.
   */
  'within'?: (_google_protobuf_Duration__Output);
}
