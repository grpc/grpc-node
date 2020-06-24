// Original file: deps/protoc-gen-validate/validate/validate.proto

import { FieldRules as _validate_FieldRules, FieldRules__Output as _validate_FieldRules__Output } from '../validate/FieldRules';
import { Long } from '@grpc/proto-loader';

export interface MapRules {
  'min_pairs'?: (number | string | Long);
  'max_pairs'?: (number | string | Long);
  'no_sparse'?: (boolean);
  'keys'?: (_validate_FieldRules);
  'values'?: (_validate_FieldRules);
}

export interface MapRules__Output {
  'min_pairs': (string);
  'max_pairs': (string);
  'no_sparse': (boolean);
  'keys': (_validate_FieldRules__Output);
  'values': (_validate_FieldRules__Output);
}
