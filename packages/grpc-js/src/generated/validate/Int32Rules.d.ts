// Original file: deps/protoc-gen-validate/validate/validate.proto


export interface Int32Rules {
  'const'?: (number);
  'lt'?: (number);
  'lte'?: (number);
  'gt'?: (number);
  'gte'?: (number);
  'in'?: (number)[];
  'not_in'?: (number)[];
}

export interface Int32Rules__Output {
  'const': (number);
  'lt': (number);
  'lte': (number);
  'gt': (number);
  'gte': (number);
  'in': (number)[];
  'not_in': (number)[];
}
