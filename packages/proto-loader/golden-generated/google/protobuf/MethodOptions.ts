// Original file: null

import type { IFeatureSet as I_google_protobuf_FeatureSet, OFeatureSet as O_google_protobuf_FeatureSet } from '../../google/protobuf/FeatureSet';
import type { IUninterpretedOption as I_google_protobuf_UninterpretedOption, OUninterpretedOption as O_google_protobuf_UninterpretedOption } from '../../google/protobuf/UninterpretedOption';
import type { IOperationInfo as I_google_longrunning_OperationInfo, OOperationInfo as O_google_longrunning_OperationInfo } from '../../google/longrunning/OperationInfo';
import type { IHttpRule as I_google_api_HttpRule, OHttpRule as O_google_api_HttpRule } from '../../google/api/HttpRule';

// Original file: null

export const _google_protobuf_MethodOptions_IdempotencyLevel = {
  IDEMPOTENCY_UNKNOWN: 'IDEMPOTENCY_UNKNOWN',
  NO_SIDE_EFFECTS: 'NO_SIDE_EFFECTS',
  IDEMPOTENT: 'IDEMPOTENT',
} as const;

export type I_google_protobuf_MethodOptions_IdempotencyLevel =
  | 'IDEMPOTENCY_UNKNOWN'
  | 0
  | 'NO_SIDE_EFFECTS'
  | 1
  | 'IDEMPOTENT'
  | 2

export type O_google_protobuf_MethodOptions_IdempotencyLevel = typeof _google_protobuf_MethodOptions_IdempotencyLevel[keyof typeof _google_protobuf_MethodOptions_IdempotencyLevel]

export interface IMethodOptions {
  'deprecated'?: (boolean);
  'idempotencyLevel'?: (I_google_protobuf_MethodOptions_IdempotencyLevel);
  'features'?: (I_google_protobuf_FeatureSet | null);
  'uninterpretedOption'?: (I_google_protobuf_UninterpretedOption)[];
  '.google.longrunning.operation_info'?: (I_google_longrunning_OperationInfo | null);
  '.google.api.method_signature'?: (string)[];
  '.google.api.http'?: (I_google_api_HttpRule | null);
}

export interface OMethodOptions {
  'deprecated': (boolean);
  'idempotencyLevel': (O_google_protobuf_MethodOptions_IdempotencyLevel);
  'features': (O_google_protobuf_FeatureSet | null);
  'uninterpretedOption': (O_google_protobuf_UninterpretedOption)[];
  '.google.longrunning.operation_info': (O_google_longrunning_OperationInfo | null);
  '.google.api.method_signature': (string)[];
  '.google.api.http': (O_google_api_HttpRule | null);
}
