// Original file: deps/protoc-gen-validate/validate/validate.proto

import { FieldRules as _validate_FieldRules, FieldRules__Output as _validate_FieldRules__Output } from '../validate/FieldRules';
import { Long } from '@grpc/proto-loader';

export interface RepeatedRules {
  'min_items'?: (number | string | Long);
  'max_items'?: (number | string | Long);
  'unique'?: (boolean);
  'items'?: (_validate_FieldRules);
}

export interface RepeatedRules__Output {
  'min_items': (string);
  'max_items': (string);
  'unique': (boolean);
  'items': (_validate_FieldRules__Output);
}
