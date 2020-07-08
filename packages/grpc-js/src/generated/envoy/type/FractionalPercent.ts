// Original file: deps/envoy-api/envoy/type/percent.proto


// Original file: deps/envoy-api/envoy/type/percent.proto

export enum _envoy_type_FractionalPercent_DenominatorType {
  HUNDRED = 0,
  TEN_THOUSAND = 1,
  MILLION = 2,
}

export interface FractionalPercent {
  'numerator'?: (number);
  'denominator'?: (_envoy_type_FractionalPercent_DenominatorType | keyof typeof _envoy_type_FractionalPercent_DenominatorType);
}

export interface FractionalPercent__Output {
  'numerator': (number);
  'denominator': (keyof typeof _envoy_type_FractionalPercent_DenominatorType);
}
