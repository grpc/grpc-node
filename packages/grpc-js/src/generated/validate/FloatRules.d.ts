// Original file: deps/protoc-gen-validate/validate/validate.proto


export interface FloatRules {
  'const'?: (number | string);
  'lt'?: (number | string);
  'lte'?: (number | string);
  'gt'?: (number | string);
  'gte'?: (number | string);
  'in'?: (number | string)[];
  'not_in'?: (number | string)[];
}

export interface FloatRules__Output {
  'const': (number | string);
  'lt': (number | string);
  'lte': (number | string);
  'gt': (number | string);
  'gte': (number | string);
  'in': (number | string)[];
  'not_in': (number | string)[];
}
