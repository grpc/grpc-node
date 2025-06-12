// Original file: null

import type { IFeatureSet as I_google_protobuf_FeatureSet, OFeatureSet as O_google_protobuf_FeatureSet } from '../../google/protobuf/FeatureSet';
import type { IUninterpretedOption as I_google_protobuf_UninterpretedOption, OUninterpretedOption as O_google_protobuf_UninterpretedOption } from '../../google/protobuf/UninterpretedOption';
import type { IFieldBehavior as I_google_api_FieldBehavior, OFieldBehavior as O_google_api_FieldBehavior } from '../../google/api/FieldBehavior';
import type { IEdition as I_google_protobuf_Edition, OEdition as O_google_protobuf_Edition } from '../../google/protobuf/Edition';

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

export interface I_google_protobuf_FieldOptions_EditionDefault {
  'edition'?: (I_google_protobuf_Edition);
  'value'?: (string);
}

export interface O_google_protobuf_FieldOptions_EditionDefault {
  'edition': (O_google_protobuf_Edition);
  'value': (string);
}

export interface I_google_protobuf_FieldOptions_FeatureSupport {
  'editionIntroduced'?: (I_google_protobuf_Edition);
  'editionDeprecated'?: (I_google_protobuf_Edition);
  'deprecationWarning'?: (string);
  'editionRemoved'?: (I_google_protobuf_Edition);
}

export interface O_google_protobuf_FieldOptions_FeatureSupport {
  'editionIntroduced': (O_google_protobuf_Edition);
  'editionDeprecated': (O_google_protobuf_Edition);
  'deprecationWarning': (string);
  'editionRemoved': (O_google_protobuf_Edition);
}

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

// Original file: null

export const _google_protobuf_FieldOptions_OptionRetention = {
  RETENTION_UNKNOWN: 'RETENTION_UNKNOWN',
  RETENTION_RUNTIME: 'RETENTION_RUNTIME',
  RETENTION_SOURCE: 'RETENTION_SOURCE',
} as const;

export type I_google_protobuf_FieldOptions_OptionRetention =
  | 'RETENTION_UNKNOWN'
  | 0
  | 'RETENTION_RUNTIME'
  | 1
  | 'RETENTION_SOURCE'
  | 2

export type O_google_protobuf_FieldOptions_OptionRetention = typeof _google_protobuf_FieldOptions_OptionRetention[keyof typeof _google_protobuf_FieldOptions_OptionRetention]

// Original file: null

export const _google_protobuf_FieldOptions_OptionTargetType = {
  TARGET_TYPE_UNKNOWN: 'TARGET_TYPE_UNKNOWN',
  TARGET_TYPE_FILE: 'TARGET_TYPE_FILE',
  TARGET_TYPE_EXTENSION_RANGE: 'TARGET_TYPE_EXTENSION_RANGE',
  TARGET_TYPE_MESSAGE: 'TARGET_TYPE_MESSAGE',
  TARGET_TYPE_FIELD: 'TARGET_TYPE_FIELD',
  TARGET_TYPE_ONEOF: 'TARGET_TYPE_ONEOF',
  TARGET_TYPE_ENUM: 'TARGET_TYPE_ENUM',
  TARGET_TYPE_ENUM_ENTRY: 'TARGET_TYPE_ENUM_ENTRY',
  TARGET_TYPE_SERVICE: 'TARGET_TYPE_SERVICE',
  TARGET_TYPE_METHOD: 'TARGET_TYPE_METHOD',
} as const;

export type I_google_protobuf_FieldOptions_OptionTargetType =
  | 'TARGET_TYPE_UNKNOWN'
  | 0
  | 'TARGET_TYPE_FILE'
  | 1
  | 'TARGET_TYPE_EXTENSION_RANGE'
  | 2
  | 'TARGET_TYPE_MESSAGE'
  | 3
  | 'TARGET_TYPE_FIELD'
  | 4
  | 'TARGET_TYPE_ONEOF'
  | 5
  | 'TARGET_TYPE_ENUM'
  | 6
  | 'TARGET_TYPE_ENUM_ENTRY'
  | 7
  | 'TARGET_TYPE_SERVICE'
  | 8
  | 'TARGET_TYPE_METHOD'
  | 9

export type O_google_protobuf_FieldOptions_OptionTargetType = typeof _google_protobuf_FieldOptions_OptionTargetType[keyof typeof _google_protobuf_FieldOptions_OptionTargetType]

export interface IFieldOptions {
  'ctype'?: (I_google_protobuf_FieldOptions_CType);
  'packed'?: (boolean);
  'deprecated'?: (boolean);
  'lazy'?: (boolean);
  'jstype'?: (I_google_protobuf_FieldOptions_JSType);
  /**
   * @deprecated
   */
  'weak'?: (boolean);
  'unverifiedLazy'?: (boolean);
  'debugRedact'?: (boolean);
  'retention'?: (I_google_protobuf_FieldOptions_OptionRetention);
  'targets'?: (I_google_protobuf_FieldOptions_OptionTargetType)[];
  'editionDefaults'?: (I_google_protobuf_FieldOptions_EditionDefault)[];
  'features'?: (I_google_protobuf_FeatureSet | null);
  'featureSupport'?: (I_google_protobuf_FieldOptions_FeatureSupport | null);
  'uninterpretedOption'?: (I_google_protobuf_UninterpretedOption)[];
  '.google.api.field_behavior'?: (I_google_api_FieldBehavior)[];
}

export interface OFieldOptions {
  'ctype': (O_google_protobuf_FieldOptions_CType);
  'packed': (boolean);
  'deprecated': (boolean);
  'lazy': (boolean);
  'jstype': (O_google_protobuf_FieldOptions_JSType);
  /**
   * @deprecated
   */
  'weak': (boolean);
  'unverifiedLazy': (boolean);
  'debugRedact': (boolean);
  'retention': (O_google_protobuf_FieldOptions_OptionRetention);
  'targets': (O_google_protobuf_FieldOptions_OptionTargetType)[];
  'editionDefaults': (O_google_protobuf_FieldOptions_EditionDefault)[];
  'features': (O_google_protobuf_FeatureSet | null);
  'featureSupport': (O_google_protobuf_FieldOptions_FeatureSupport | null);
  'uninterpretedOption': (O_google_protobuf_UninterpretedOption)[];
  '.google.api.field_behavior': (O_google_api_FieldBehavior)[];
}
