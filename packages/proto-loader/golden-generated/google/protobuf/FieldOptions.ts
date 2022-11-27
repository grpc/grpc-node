// Original file: null

import type { IUninterpretedOption as I_google_protobuf_UninterpretedOption, OUninterpretedOption as O_google_protobuf_UninterpretedOption } from '../../google/protobuf/UninterpretedOption';
import type { IFieldBehavior as I_google_api_FieldBehavior, OFieldBehavior as O_google_api_FieldBehavior } from '../../google/api/FieldBehavior';

// Original file: null

export const _google_protobuf_FieldOptions_CType = {
  STRING: 'STRING',
  CORD: 'CORD',
  STRING_PIECE: 'STRING_PIECE',
} as const;

export type I_google_protobuf_FieldOptions_CType =
  | 'STRING'
  | 0
  | 'CORD'
  | 1
  | 'STRING_PIECE'
  | 2

export type O_google_protobuf_FieldOptions_CType = typeof _google_protobuf_FieldOptions_CType[keyof typeof _google_protobuf_FieldOptions_CType]

// Original file: null

export const _google_protobuf_FieldOptions_JSType = {
  JS_NORMAL: 'JS_NORMAL',
  JS_STRING: 'JS_STRING',
  JS_NUMBER: 'JS_NUMBER',
} as const;

export type I_google_protobuf_FieldOptions_JSType =
  | 'JS_NORMAL'
  | 0
  | 'JS_STRING'
  | 1
  | 'JS_NUMBER'
  | 2

export type O_google_protobuf_FieldOptions_JSType = typeof _google_protobuf_FieldOptions_JSType[keyof typeof _google_protobuf_FieldOptions_JSType]

export interface IFieldOptions {
  'ctype'?: (I_google_protobuf_FieldOptions_CType);
  'packed'?: (boolean);
  'deprecated'?: (boolean);
  'lazy'?: (boolean);
  'jstype'?: (I_google_protobuf_FieldOptions_JSType);
  'weak'?: (boolean);
  'uninterpretedOption'?: (I_google_protobuf_UninterpretedOption)[];
  '.google.api.field_behavior'?: (I_google_api_FieldBehavior)[];
}

export interface OFieldOptions {
  'ctype': (O_google_protobuf_FieldOptions_CType);
  'packed': (boolean);
  'deprecated': (boolean);
  'lazy': (boolean);
  'jstype': (O_google_protobuf_FieldOptions_JSType);
  'weak': (boolean);
  'uninterpretedOption': (O_google_protobuf_UninterpretedOption)[];
  '.google.api.field_behavior': (O_google_api_FieldBehavior)[];
}
