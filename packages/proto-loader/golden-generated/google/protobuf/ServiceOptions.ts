// Original file: null

import type { IFeatureSet as I_google_protobuf_FeatureSet, OFeatureSet as O_google_protobuf_FeatureSet } from '../../google/protobuf/FeatureSet';
import type { IUninterpretedOption as I_google_protobuf_UninterpretedOption, OUninterpretedOption as O_google_protobuf_UninterpretedOption } from '../../google/protobuf/UninterpretedOption';

export interface IServiceOptions {
  'deprecated'?: (boolean);
  'features'?: (I_google_protobuf_FeatureSet | null);
  'uninterpretedOption'?: (I_google_protobuf_UninterpretedOption)[];
  '.google.api.default_host'?: (string);
  '.google.api.oauth_scopes'?: (string);
}

export interface OServiceOptions {
  'deprecated': (boolean);
  'features': (O_google_protobuf_FeatureSet | null);
  'uninterpretedOption': (O_google_protobuf_UninterpretedOption)[];
  '.google.api.default_host': (string);
  '.google.api.oauth_scopes': (string);
}
