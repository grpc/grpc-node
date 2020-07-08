// Original file: deps/protoc-gen-validate/validate/validate.proto


export interface SInt32Rules {
  'const'?: (number);
  'lt'?: (number);
  'lte'?: (number);
  'gt'?: (number);
  'gte'?: (number);
  'in'?: (number)[];
  'not_in'?: (number)[];
}

export interface SInt32Rules__Output {
  'const': (number);
  'lt': (number);
  'lte': (number);
  'gt': (number);
  'gte': (number);
  'in': (number)[];
  'not_in': (number)[];
}
