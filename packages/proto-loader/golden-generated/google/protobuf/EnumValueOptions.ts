// Original file: null

import type { IFeatureSet as I_google_protobuf_FeatureSet, OFeatureSet as O_google_protobuf_FeatureSet } from '../../google/protobuf/FeatureSet';
import type { I_google_protobuf_FieldOptions_FeatureSupport, O_google_protobuf_FieldOptions_FeatureSupport } from '../../google/protobuf/FieldOptions';
import type { IUninterpretedOption as I_google_protobuf_UninterpretedOption, OUninterpretedOption as O_google_protobuf_UninterpretedOption } from '../../google/protobuf/UninterpretedOption';

export interface IEnumValueOptions {
  'deprecated'?: (boolean);
  'features'?: (I_google_protobuf_FeatureSet | null);
  'debugRedact'?: (boolean);
  'featureSupport'?: (I_google_protobuf_FieldOptions_FeatureSupport | null);
  'uninterpretedOption'?: (I_google_protobuf_UninterpretedOption)[];
}

export interface OEnumValueOptions {
  'deprecated': (boolean);
  'features': (O_google_protobuf_FeatureSet | null);
  'debugRedact': (boolean);
  'featureSupport': (O_google_protobuf_FieldOptions_FeatureSupport | null);
  'uninterpretedOption': (O_google_protobuf_UninterpretedOption)[];
}
