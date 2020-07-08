// Original file: deps/envoy-api/envoy/api/v2/core/base.proto

import { BuildVersion as _envoy_api_v2_core_BuildVersion, BuildVersion__Output as _envoy_api_v2_core_BuildVersion__Output } from '../../../../envoy/api/v2/core/BuildVersion';

export interface Extension {
  'name'?: (string);
  'category'?: (string);
  'type_descriptor'?: (string);
  'version'?: (_envoy_api_v2_core_BuildVersion);
  'disabled'?: (boolean);
}

export interface Extension__Output {
  'name': (string);
  'category': (string);
  'type_descriptor': (string);
  'version': (_envoy_api_v2_core_BuildVersion__Output);
  'disabled': (boolean);
}
