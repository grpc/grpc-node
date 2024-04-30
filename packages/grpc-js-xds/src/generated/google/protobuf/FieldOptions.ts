// Original file: null

import type { UninterpretedOption as _google_protobuf_UninterpretedOption, UninterpretedOption__Output as _google_protobuf_UninterpretedOption__Output } from '../../google/protobuf/UninterpretedOption';

// Original file: null

export const _google_protobuf_FieldOptions_CType = {
  STRING: 'STRING',
  CORD: 'CORD',
  STRING_PIECE: 'STRING_PIECE',
} as const;

export type _google_protobuf_FieldOptions_CType =
  | 'STRING'
  | 0
  | 'CORD'
  | 1
  | 'STRING_PIECE'
  | 2

export type _google_protobuf_FieldOptions_CType__Output = typeof _google_protobuf_FieldOptions_CType[keyof typeof _google_protobuf_FieldOptions_CType]

// Original file: null

export const _google_protobuf_FieldOptions_JSType = {
  JS_NORMAL: 'JS_NORMAL',
  JS_STRING: 'JS_STRING',
  JS_NUMBER: 'JS_NUMBER',
} as const;

export type _google_protobuf_FieldOptions_JSType =
  | 'JS_NORMAL'
  | 0
  | 'JS_STRING'
  | 1
  | 'JS_NUMBER'
  | 2

export type _google_protobuf_FieldOptions_JSType__Output = typeof _google_protobuf_FieldOptions_JSType[keyof typeof _google_protobuf_FieldOptions_JSType]

export interface FieldOptions {
  'ctype'?: (_google_protobuf_FieldOptions_CType);
  'packed'?: (boolean);
  'deprecated'?: (boolean);
  'lazy'?: (boolean);
  'jstype'?: (_google_protobuf_FieldOptions_JSType);
  'weak'?: (boolean);
  'uninterpretedOption'?: (_google_protobuf_UninterpretedOption)[];
}

export interface FieldOptions__Output {
  'ctype': (_google_protobuf_FieldOptions_CType__Output);
  'packed': (boolean);
  'deprecated': (boolean);
  'lazy': (boolean);
  'jstype': (_google_protobuf_FieldOptions_JSType__Output);
  'weak': (boolean);
  'uninterpretedOption': (_google_protobuf_UninterpretedOption__Output)[];
}
