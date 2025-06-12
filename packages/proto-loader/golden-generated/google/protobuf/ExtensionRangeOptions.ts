// Original file: null

import type { IFeatureSet as I_google_protobuf_FeatureSet, OFeatureSet as O_google_protobuf_FeatureSet } from '../../google/protobuf/FeatureSet';
import type { IUninterpretedOption as I_google_protobuf_UninterpretedOption, OUninterpretedOption as O_google_protobuf_UninterpretedOption } from '../../google/protobuf/UninterpretedOption';

export interface I_google_protobuf_ExtensionRangeOptions_Declaration {
  'number'?: (number);
  'fullName'?: (string);
  'type'?: (string);
  'reserved'?: (boolean);
  'repeated'?: (boolean);
}

export interface O_google_protobuf_ExtensionRangeOptions_Declaration {
  'number': (number);
  'fullName': (string);
  'type': (string);
  'reserved': (boolean);
  'repeated': (boolean);
}

// Original file: null

export const _google_protobuf_ExtensionRangeOptions_VerificationState = {
  DECLARATION: 'DECLARATION',
  UNVERIFIED: 'UNVERIFIED',
} as const;

export type I_google_protobuf_ExtensionRangeOptions_VerificationState =
  | 'DECLARATION'
  | 0
  | 'UNVERIFIED'
  | 1

export type O_google_protobuf_ExtensionRangeOptions_VerificationState = typeof _google_protobuf_ExtensionRangeOptions_VerificationState[keyof typeof _google_protobuf_ExtensionRangeOptions_VerificationState]

export interface IExtensionRangeOptions {
  'declaration'?: (I_google_protobuf_ExtensionRangeOptions_Declaration)[];
  'verification'?: (I_google_protobuf_ExtensionRangeOptions_VerificationState);
  'features'?: (I_google_protobuf_FeatureSet | null);
  'uninterpretedOption'?: (I_google_protobuf_UninterpretedOption)[];
}

export interface OExtensionRangeOptions {
  'declaration': (O_google_protobuf_ExtensionRangeOptions_Declaration)[];
  'verification': (O_google_protobuf_ExtensionRangeOptions_VerificationState);
  'features': (O_google_protobuf_FeatureSet | null);
  'uninterpretedOption': (O_google_protobuf_UninterpretedOption)[];
}
