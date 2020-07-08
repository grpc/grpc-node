// Original file: deps/envoy-api/envoy/config/filter/accesslog/v2/accesslog.proto

import { Struct as _google_protobuf_Struct, Struct__Output as _google_protobuf_Struct__Output } from '../../../../../google/protobuf/Struct';
import { Any as _google_protobuf_Any, Any__Output as _google_protobuf_Any__Output } from '../../../../../google/protobuf/Any';

export interface ExtensionFilter {
  'name'?: (string);
  'config'?: (_google_protobuf_Struct);
  'typed_config'?: (_google_protobuf_Any);
  'config_type'?: "config"|"typed_config";
}

export interface ExtensionFilter__Output {
  'name': (string);
  'config'?: (_google_protobuf_Struct__Output);
  'typed_config'?: (_google_protobuf_Any__Output);
  'config_type': "config"|"typed_config";
}
