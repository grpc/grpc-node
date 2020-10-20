// Original file: null

import { NullValue as _google_protobuf_NullValue } from '../../google/protobuf/NullValue';
import { Struct as _google_protobuf_Struct, Struct__Output as _google_protobuf_Struct__Output } from '../../google/protobuf/Struct';
import { ListValue as _google_protobuf_ListValue, ListValue__Output as _google_protobuf_ListValue__Output } from '../../google/protobuf/ListValue';

export interface Value {
  'nullValue'?: (_google_protobuf_NullValue | keyof typeof _google_protobuf_NullValue);
  'numberValue'?: (number | string);
  'stringValue'?: (string);
  'boolValue'?: (boolean);
  'structValue'?: (_google_protobuf_Struct);
  'listValue'?: (_google_protobuf_ListValue);
  'kind'?: "nullValue"|"numberValue"|"stringValue"|"boolValue"|"structValue"|"listValue";
}

export interface Value__Output {
  'nullValue'?: (keyof typeof _google_protobuf_NullValue);
  'numberValue'?: (number | string);
  'stringValue'?: (string);
  'boolValue'?: (boolean);
  'structValue'?: (_google_protobuf_Struct__Output);
  'listValue'?: (_google_protobuf_ListValue__Output);
  'kind': "nullValue"|"numberValue"|"stringValue"|"boolValue"|"structValue"|"listValue";
}
