// Original file: deps/envoy-api/envoy/config/filter/accesslog/v2/accesslog.proto

import { AccessLogFilter as _envoy_config_filter_accesslog_v2_AccessLogFilter, AccessLogFilter__Output as _envoy_config_filter_accesslog_v2_AccessLogFilter__Output } from '../../../../../envoy/config/filter/accesslog/v2/AccessLogFilter';
import { Struct as _google_protobuf_Struct, Struct__Output as _google_protobuf_Struct__Output } from '../../../../../google/protobuf/Struct';
import { Any as _google_protobuf_Any, Any__Output as _google_protobuf_Any__Output } from '../../../../../google/protobuf/Any';

export interface AccessLog {
  'name'?: (string);
  'filter'?: (_envoy_config_filter_accesslog_v2_AccessLogFilter);
  'config'?: (_google_protobuf_Struct);
  'typed_config'?: (_google_protobuf_Any);
  'config_type'?: "config"|"typed_config";
}

export interface AccessLog__Output {
  'name': (string);
  'filter': (_envoy_config_filter_accesslog_v2_AccessLogFilter__Output);
  'config'?: (_google_protobuf_Struct__Output);
  'typed_config'?: (_google_protobuf_Any__Output);
  'config_type': "config"|"typed_config";
}
