// Original file: null

import type { UninterpretedOption as _google_protobuf_UninterpretedOption, UninterpretedOption__Output as _google_protobuf_UninterpretedOption__Output } from '../../google/protobuf/UninterpretedOption';
import type { OperationInfo as _google_longrunning_OperationInfo, OperationInfo__Output as _google_longrunning_OperationInfo__Output } from '../../google/longrunning/OperationInfo';
import type { HttpRule as _google_api_HttpRule, HttpRule__Output as _google_api_HttpRule__Output } from '../../google/api/HttpRule';

export interface MethodOptions {
  'deprecated'?: (boolean);
  'uninterpretedOption'?: (_google_protobuf_UninterpretedOption)[];
  '.google.longrunning.operation_info'?: (_google_longrunning_OperationInfo);
  '.google.api.method_signature'?: (string)[];
  '.google.api.http'?: (_google_api_HttpRule);
}

export interface MethodOptions__Output {
  'deprecated': (boolean);
  'uninterpretedOption': (_google_protobuf_UninterpretedOption__Output)[];
  '.google.longrunning.operation_info'?: (_google_longrunning_OperationInfo__Output);
  '.google.api.method_signature': (string)[];
  '.google.api.http'?: (_google_api_HttpRule__Output);
}
