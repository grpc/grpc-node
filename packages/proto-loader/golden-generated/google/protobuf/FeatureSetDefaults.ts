// Original file: null

import type { IEdition as I_google_protobuf_Edition, OEdition as O_google_protobuf_Edition } from '../../google/protobuf/Edition';
import type { IFeatureSet as I_google_protobuf_FeatureSet, OFeatureSet as O_google_protobuf_FeatureSet } from '../../google/protobuf/FeatureSet';

export interface I_google_protobuf_FeatureSetDefaults_FeatureSetEditionDefault {
  'edition'?: (I_google_protobuf_Edition);
  'overridableFeatures'?: (I_google_protobuf_FeatureSet | null);
  'fixedFeatures'?: (I_google_protobuf_FeatureSet | null);
}

export interface O_google_protobuf_FeatureSetDefaults_FeatureSetEditionDefault {
  'edition': (O_google_protobuf_Edition);
  'overridableFeatures': (O_google_protobuf_FeatureSet | null);
  'fixedFeatures': (O_google_protobuf_FeatureSet | null);
}

export interface IFeatureSetDefaults {
  'defaults'?: (I_google_protobuf_FeatureSetDefaults_FeatureSetEditionDefault)[];
  'minimumEdition'?: (I_google_protobuf_Edition);
  'maximumEdition'?: (I_google_protobuf_Edition);
}

export interface OFeatureSetDefaults {
  'defaults': (O_google_protobuf_FeatureSetDefaults_FeatureSetEditionDefault)[];
  'minimumEdition': (O_google_protobuf_Edition);
  'maximumEdition': (O_google_protobuf_Edition);
}
