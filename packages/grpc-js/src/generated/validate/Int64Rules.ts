// Original file: deps/protoc-gen-validate/validate/validate.proto

import { Long } from '@grpc/proto-loader';

export interface Int64Rules {
  'const'?: (number | string | Long);
  'lt'?: (number | string | Long);
  'lte'?: (number | string | Long);
  'gt'?: (number | string | Long);
  'gte'?: (number | string | Long);
  'in'?: (number | string | Long)[];
  'not_in'?: (number | string | Long)[];
}

export interface Int64Rules__Output {
  'const': (string);
  'lt': (string);
  'lte': (string);
  'gt': (string);
  'gte': (string);
  'in': (string)[];
  'not_in': (string)[];
}
