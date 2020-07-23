// Original file: deps/protoc-gen-validate/validate/validate.proto

import { Duration as _google_protobuf_Duration, Duration__Output as _google_protobuf_Duration__Output } from '../google/protobuf/Duration';

/**
 * DurationRules describe the constraints applied exclusively to the
 * `google.protobuf.Duration` well-known type
 */
export interface DurationRules {
  /**
   * Required specifies that this field must be set
   */
  'required'?: (boolean);
  /**
   * Const specifies that this field must be exactly the specified value
   */
  'const'?: (_google_protobuf_Duration);
  /**
   * Lt specifies that this field must be less than the specified value,
   * exclusive
   */
  'lt'?: (_google_protobuf_Duration);
  /**
   * Lt specifies that this field must be less than the specified value,
   * inclusive
   */
  'lte'?: (_google_protobuf_Duration);
  /**
   * Gt specifies that this field must be greater than the specified value,
   * exclusive
   */
  'gt'?: (_google_protobuf_Duration);
  /**
   * Gte specifies that this field must be greater than the specified value,
   * inclusive
   */
  'gte'?: (_google_protobuf_Duration);
  /**
   * In specifies that this field must be equal to one of the specified
   * values
   */
  'in'?: (_google_protobuf_Duration)[];
  /**
   * NotIn specifies that this field cannot be equal to one of the specified
   * values
   */
  'not_in'?: (_google_protobuf_Duration)[];
}

/**
 * DurationRules describe the constraints applied exclusively to the
 * `google.protobuf.Duration` well-known type
 */
export interface DurationRules__Output {
  /**
   * Required specifies that this field must be set
   */
  'required': (boolean);
  /**
   * Const specifies that this field must be exactly the specified value
   */
  'const'?: (_google_protobuf_Duration__Output);
  /**
   * Lt specifies that this field must be less than the specified value,
   * exclusive
   */
  'lt'?: (_google_protobuf_Duration__Output);
  /**
   * Lt specifies that this field must be less than the specified value,
   * inclusive
   */
  'lte'?: (_google_protobuf_Duration__Output);
  /**
   * Gt specifies that this field must be greater than the specified value,
   * exclusive
   */
  'gt'?: (_google_protobuf_Duration__Output);
  /**
   * Gte specifies that this field must be greater than the specified value,
   * inclusive
   */
  'gte'?: (_google_protobuf_Duration__Output);
  /**
   * In specifies that this field must be equal to one of the specified
   * values
   */
  'in': (_google_protobuf_Duration__Output)[];
  /**
   * NotIn specifies that this field cannot be equal to one of the specified
   * values
   */
  'not_in': (_google_protobuf_Duration__Output)[];
}
