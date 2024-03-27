// Original file: null

import type { IUninterpretedOption as I_google_protobuf_UninterpretedOption, OUninterpretedOption as O_google_protobuf_UninterpretedOption } from '../../google/protobuf/UninterpretedOption';
import type { IOperationInfo as I_google_longrunning_OperationInfo, OOperationInfo as O_google_longrunning_OperationInfo } from '../../google/longrunning/OperationInfo';
import type { IHttpRule as I_google_api_HttpRule, OHttpRule as O_google_api_HttpRule } from '../../google/api/HttpRule';

export interface IMethodOptions {
  'deprecated'?: (boolean);
  'uninterpretedOption'?: (I_google_protobuf_UninterpretedOption)[];
  '.google.longrunning.operation_info'?: (I_google_longrunning_OperationInfo | null);
  '.google.api.method_signature'?: (string)[];
  '.google.api.http'?: (I_google_api_HttpRule | null);
}

export interface OMethodOptions {
  'deprecated': (boolean);
  'uninterpretedOption': (O_google_protobuf_UninterpretedOption)[];
  '.google.longrunning.operation_info': (O_google_longrunning_OperationInfo | null);
  '.google.api.method_signature': (string)[];
  '.google.api.http': (O_google_api_HttpRule | null);
}
