// Original file: null


// Original file: null

export const _google_protobuf_FeatureSet_VisibilityFeature_DefaultSymbolVisibility = {
  DEFAULT_SYMBOL_VISIBILITY_UNKNOWN: 'DEFAULT_SYMBOL_VISIBILITY_UNKNOWN',
  EXPORT_ALL: 'EXPORT_ALL',
  EXPORT_TOP_LEVEL: 'EXPORT_TOP_LEVEL',
  LOCAL_ALL: 'LOCAL_ALL',
  STRICT: 'STRICT',
} as const;

export type I_google_protobuf_FeatureSet_VisibilityFeature_DefaultSymbolVisibility =
  | 'DEFAULT_SYMBOL_VISIBILITY_UNKNOWN'
  | 0
  | 'EXPORT_ALL'
  | 1
  | 'EXPORT_TOP_LEVEL'
  | 2
  | 'LOCAL_ALL'
  | 3
  | 'STRICT'
  | 4

export type O_google_protobuf_FeatureSet_VisibilityFeature_DefaultSymbolVisibility = typeof _google_protobuf_FeatureSet_VisibilityFeature_DefaultSymbolVisibility[keyof typeof _google_protobuf_FeatureSet_VisibilityFeature_DefaultSymbolVisibility]

// Original file: null

export const _google_protobuf_FeatureSet_EnforceNamingStyle = {
  ENFORCE_NAMING_STYLE_UNKNOWN: 'ENFORCE_NAMING_STYLE_UNKNOWN',
  STYLE2024: 'STYLE2024',
  STYLE_LEGACY: 'STYLE_LEGACY',
} as const;

export type I_google_protobuf_FeatureSet_EnforceNamingStyle =
  | 'ENFORCE_NAMING_STYLE_UNKNOWN'
  | 0
  | 'STYLE2024'
  | 1
  | 'STYLE_LEGACY'
  | 2

export type O_google_protobuf_FeatureSet_EnforceNamingStyle = typeof _google_protobuf_FeatureSet_EnforceNamingStyle[keyof typeof _google_protobuf_FeatureSet_EnforceNamingStyle]

// Original file: null

export const _google_protobuf_FeatureSet_EnumType = {
  ENUM_TYPE_UNKNOWN: 'ENUM_TYPE_UNKNOWN',
  OPEN: 'OPEN',
  CLOSED: 'CLOSED',
} as const;

export type I_google_protobuf_FeatureSet_EnumType =
  | 'ENUM_TYPE_UNKNOWN'
  | 0
  | 'OPEN'
  | 1
  | 'CLOSED'
  | 2

export type O_google_protobuf_FeatureSet_EnumType = typeof _google_protobuf_FeatureSet_EnumType[keyof typeof _google_protobuf_FeatureSet_EnumType]

// Original file: null

export const _google_protobuf_FeatureSet_FieldPresence = {
  FIELD_PRESENCE_UNKNOWN: 'FIELD_PRESENCE_UNKNOWN',
  EXPLICIT: 'EXPLICIT',
  IMPLICIT: 'IMPLICIT',
  LEGACY_REQUIRED: 'LEGACY_REQUIRED',
} as const;

export type I_google_protobuf_FeatureSet_FieldPresence =
  | 'FIELD_PRESENCE_UNKNOWN'
  | 0
  | 'EXPLICIT'
  | 1
  | 'IMPLICIT'
  | 2
  | 'LEGACY_REQUIRED'
  | 3

export type O_google_protobuf_FeatureSet_FieldPresence = typeof _google_protobuf_FeatureSet_FieldPresence[keyof typeof _google_protobuf_FeatureSet_FieldPresence]

// Original file: null

export const _google_protobuf_FeatureSet_JsonFormat = {
  JSON_FORMAT_UNKNOWN: 'JSON_FORMAT_UNKNOWN',
  ALLOW: 'ALLOW',
  LEGACY_BEST_EFFORT: 'LEGACY_BEST_EFFORT',
} as const;

export type I_google_protobuf_FeatureSet_JsonFormat =
  | 'JSON_FORMAT_UNKNOWN'
  | 0
  | 'ALLOW'
  | 1
  | 'LEGACY_BEST_EFFORT'
  | 2

export type O_google_protobuf_FeatureSet_JsonFormat = typeof _google_protobuf_FeatureSet_JsonFormat[keyof typeof _google_protobuf_FeatureSet_JsonFormat]

// Original file: null

export const _google_protobuf_FeatureSet_MessageEncoding = {
  MESSAGE_ENCODING_UNKNOWN: 'MESSAGE_ENCODING_UNKNOWN',
  LENGTH_PREFIXED: 'LENGTH_PREFIXED',
  DELIMITED: 'DELIMITED',
} as const;

export type I_google_protobuf_FeatureSet_MessageEncoding =
  | 'MESSAGE_ENCODING_UNKNOWN'
  | 0
  | 'LENGTH_PREFIXED'
  | 1
  | 'DELIMITED'
  | 2

export type O_google_protobuf_FeatureSet_MessageEncoding = typeof _google_protobuf_FeatureSet_MessageEncoding[keyof typeof _google_protobuf_FeatureSet_MessageEncoding]

// Original file: null

export const _google_protobuf_FeatureSet_RepeatedFieldEncoding = {
  REPEATED_FIELD_ENCODING_UNKNOWN: 'REPEATED_FIELD_ENCODING_UNKNOWN',
  PACKED: 'PACKED',
  EXPANDED: 'EXPANDED',
} as const;

export type I_google_protobuf_FeatureSet_RepeatedFieldEncoding =
  | 'REPEATED_FIELD_ENCODING_UNKNOWN'
  | 0
  | 'PACKED'
  | 1
  | 'EXPANDED'
  | 2

export type O_google_protobuf_FeatureSet_RepeatedFieldEncoding = typeof _google_protobuf_FeatureSet_RepeatedFieldEncoding[keyof typeof _google_protobuf_FeatureSet_RepeatedFieldEncoding]

// Original file: null

export const _google_protobuf_FeatureSet_Utf8Validation = {
  UTF8_VALIDATION_UNKNOWN: 'UTF8_VALIDATION_UNKNOWN',
  VERIFY: 'VERIFY',
  NONE: 'NONE',
} as const;

export type I_google_protobuf_FeatureSet_Utf8Validation =
  | 'UTF8_VALIDATION_UNKNOWN'
  | 0
  | 'VERIFY'
  | 2
  | 'NONE'
  | 3

export type O_google_protobuf_FeatureSet_Utf8Validation = typeof _google_protobuf_FeatureSet_Utf8Validation[keyof typeof _google_protobuf_FeatureSet_Utf8Validation]

export interface I_google_protobuf_FeatureSet_VisibilityFeature {
}

export interface O_google_protobuf_FeatureSet_VisibilityFeature {
}

export interface IFeatureSet {
  'fieldPresence'?: (I_google_protobuf_FeatureSet_FieldPresence);
  'enumType'?: (I_google_protobuf_FeatureSet_EnumType);
  'repeatedFieldEncoding'?: (I_google_protobuf_FeatureSet_RepeatedFieldEncoding);
  'utf8Validation'?: (I_google_protobuf_FeatureSet_Utf8Validation);
  'messageEncoding'?: (I_google_protobuf_FeatureSet_MessageEncoding);
  'jsonFormat'?: (I_google_protobuf_FeatureSet_JsonFormat);
  'enforceNamingStyle'?: (I_google_protobuf_FeatureSet_EnforceNamingStyle);
  'defaultSymbolVisibility'?: (I_google_protobuf_FeatureSet_VisibilityFeature_DefaultSymbolVisibility);
}

export interface OFeatureSet {
  'fieldPresence': (O_google_protobuf_FeatureSet_FieldPresence);
  'enumType': (O_google_protobuf_FeatureSet_EnumType);
  'repeatedFieldEncoding': (O_google_protobuf_FeatureSet_RepeatedFieldEncoding);
  'utf8Validation': (O_google_protobuf_FeatureSet_Utf8Validation);
  'messageEncoding': (O_google_protobuf_FeatureSet_MessageEncoding);
  'jsonFormat': (O_google_protobuf_FeatureSet_JsonFormat);
  'enforceNamingStyle': (O_google_protobuf_FeatureSet_EnforceNamingStyle);
  'defaultSymbolVisibility': (O_google_protobuf_FeatureSet_VisibilityFeature_DefaultSymbolVisibility);
}
