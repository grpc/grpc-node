// Original file: null

import type { IFeatureSet as I_google_protobuf_FeatureSet, OFeatureSet as O_google_protobuf_FeatureSet } from '../../google/protobuf/FeatureSet';
import type { IUninterpretedOption as I_google_protobuf_UninterpretedOption, OUninterpretedOption as O_google_protobuf_UninterpretedOption } from '../../google/protobuf/UninterpretedOption';

export interface IMessageOptions {
  'messageSetWireFormat'?: (boolean);
  'noStandardDescriptorAccessor'?: (boolean);
  'deprecated'?: (boolean);
  'mapEntry'?: (boolean);
  /**
   * @deprecated
   */
  'deprecatedLegacyJsonFieldConflicts'?: (boolean);
  'features'?: (I_google_protobuf_FeatureSet | null);
  'uninterpretedOption'?: (I_google_protobuf_UninterpretedOption)[];
}

export interface OMessageOptions {
  'messageSetWireFormat': (boolean);
  'noStandardDescriptorAccessor': (boolean);
  'deprecated': (boolean);
  'mapEntry': (boolean);
  /**
   * @deprecated
   */
  'deprecatedLegacyJsonFieldConflicts': (boolean);
  'features': (O_google_protobuf_FeatureSet | null);
  'uninterpretedOption': (O_google_protobuf_UninterpretedOption)[];
}
