// Original file: deps/protoc-gen-validate/validate/validate.proto

import { KnownRegex as _validate_KnownRegex } from '../validate/KnownRegex';
import { Long } from '@grpc/proto-loader';

export interface StringRules {
  'const'?: (string);
  'min_len'?: (number | string | Long);
  'max_len'?: (number | string | Long);
  'min_bytes'?: (number | string | Long);
  'max_bytes'?: (number | string | Long);
  'pattern'?: (string);
  'prefix'?: (string);
  'suffix'?: (string);
  'contains'?: (string);
  'in'?: (string)[];
  'not_in'?: (string)[];
  'email'?: (boolean);
  'hostname'?: (boolean);
  'ip'?: (boolean);
  'ipv4'?: (boolean);
  'ipv6'?: (boolean);
  'uri'?: (boolean);
  'uri_ref'?: (boolean);
  'len'?: (number | string | Long);
  'len_bytes'?: (number | string | Long);
  'address'?: (boolean);
  'uuid'?: (boolean);
  'not_contains'?: (string);
  'well_known_regex'?: (_validate_KnownRegex | keyof typeof _validate_KnownRegex);
  'strict'?: (boolean);
  'well_known'?: "email"|"hostname"|"ip"|"ipv4"|"ipv6"|"uri"|"uri_ref"|"address"|"uuid"|"well_known_regex";
}

export interface StringRules__Output {
  'const': (string);
  'min_len': (string);
  'max_len': (string);
  'min_bytes': (string);
  'max_bytes': (string);
  'pattern': (string);
  'prefix': (string);
  'suffix': (string);
  'contains': (string);
  'in': (string)[];
  'not_in': (string)[];
  'email'?: (boolean);
  'hostname'?: (boolean);
  'ip'?: (boolean);
  'ipv4'?: (boolean);
  'ipv6'?: (boolean);
  'uri'?: (boolean);
  'uri_ref'?: (boolean);
  'len': (string);
  'len_bytes': (string);
  'address'?: (boolean);
  'uuid'?: (boolean);
  'not_contains': (string);
  'well_known_regex'?: (keyof typeof _validate_KnownRegex);
  'strict': (boolean);
  'well_known': "email"|"hostname"|"ip"|"ipv4"|"ipv6"|"uri"|"uri_ref"|"address"|"uuid"|"well_known_regex";
}
