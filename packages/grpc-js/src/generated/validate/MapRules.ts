// Original file: deps/protoc-gen-validate/validate/validate.proto

import { FieldRules as _validate_FieldRules, FieldRules__Output as _validate_FieldRules__Output } from '../validate/FieldRules';
import { Long } from '@grpc/proto-loader';

/**
 * MapRules describe the constraints applied to `map` values
 */
export interface MapRules {
  /**
   * MinPairs specifies that this field must have the specified number of
   * KVs at a minimum
   */
  'min_pairs'?: (number | string | Long);
  /**
   * MaxPairs specifies that this field must have the specified number of
   * KVs at a maximum
   */
  'max_pairs'?: (number | string | Long);
  /**
   * NoSparse specifies values in this field cannot be unset. This only
   * applies to map's with message value types.
   */
  'no_sparse'?: (boolean);
  /**
   * Keys specifies the constraints to be applied to each key in the field.
   */
  'keys'?: (_validate_FieldRules);
  /**
   * Values specifies the constraints to be applied to the value of each key
   * in the field. Message values will still have their validations evaluated
   * unless skip is specified here.
   */
  'values'?: (_validate_FieldRules);
}

/**
 * MapRules describe the constraints applied to `map` values
 */
export interface MapRules__Output {
  /**
   * MinPairs specifies that this field must have the specified number of
   * KVs at a minimum
   */
  'min_pairs': (string);
  /**
   * MaxPairs specifies that this field must have the specified number of
   * KVs at a maximum
   */
  'max_pairs': (string);
  /**
   * NoSparse specifies values in this field cannot be unset. This only
   * applies to map's with message value types.
   */
  'no_sparse': (boolean);
  /**
   * Keys specifies the constraints to be applied to each key in the field.
   */
  'keys'?: (_validate_FieldRules__Output);
  /**
   * Values specifies the constraints to be applied to the value of each key
   * in the field. Message values will still have their validations evaluated
   * unless skip is specified here.
   */
  'values'?: (_validate_FieldRules__Output);
}
