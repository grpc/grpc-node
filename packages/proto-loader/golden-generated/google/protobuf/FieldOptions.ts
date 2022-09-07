// Original file: null

import type { IUninterpretedOption as I_google_protobuf_UninterpretedOption, OUninterpretedOption as O_google_protobuf_UninterpretedOption } from '../../google/protobuf/UninterpretedOption';
import type { FieldBehavior as _google_api_FieldBehavior } from '../../google/api/FieldBehavior';

// Original file: null

export enum _google_protobuf_FieldOptions_CType {
  STRING = 0,
  CORD = 1,
  STRING_PIECE = 2,
}

// Original file: null

export enum _google_protobuf_FieldOptions_JSType {
  JS_NORMAL = 0,
  JS_STRING = 1,
  JS_NUMBER = 2,
}

export interface IFieldOptions {
  'ctype'?: (_google_protobuf_FieldOptions_CType | keyof typeof _google_protobuf_FieldOptions_CType);
  'packed'?: (boolean);
  'deprecated'?: (boolean);
  'lazy'?: (boolean);
  'jstype'?: (_google_protobuf_FieldOptions_JSType | keyof typeof _google_protobuf_FieldOptions_JSType);
  'weak'?: (boolean);
  'uninterpretedOption'?: (I_google_protobuf_UninterpretedOption)[];
  '.google.api.field_behavior'?: (_google_api_FieldBehavior | keyof typeof _google_api_FieldBehavior)[];
}

export interface OFieldOptions {
  'ctype': (keyof typeof _google_protobuf_FieldOptions_CType);
  'packed': (boolean);
  'deprecated': (boolean);
  'lazy': (boolean);
  'jstype': (keyof typeof _google_protobuf_FieldOptions_JSType);
  'weak': (boolean);
  'uninterpretedOption': (O_google_protobuf_UninterpretedOption)[];
  '.google.api.field_behavior': (keyof typeof _google_api_FieldBehavior)[];
}
