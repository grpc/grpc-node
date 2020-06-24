// Original file: deps/envoy-api/envoy/api/v2/core/base.proto

import { Struct as _google_protobuf_Struct, Struct__Output as _google_protobuf_Struct__Output } from '../../../../google/protobuf/Struct';
import { Locality as _envoy_api_v2_core_Locality, Locality__Output as _envoy_api_v2_core_Locality__Output } from '../../../../envoy/api/v2/core/Locality';
import { BuildVersion as _envoy_api_v2_core_BuildVersion, BuildVersion__Output as _envoy_api_v2_core_BuildVersion__Output } from '../../../../envoy/api/v2/core/BuildVersion';
import { Extension as _envoy_api_v2_core_Extension, Extension__Output as _envoy_api_v2_core_Extension__Output } from '../../../../envoy/api/v2/core/Extension';
import { Address as _envoy_api_v2_core_Address, Address__Output as _envoy_api_v2_core_Address__Output } from '../../../../envoy/api/v2/core/Address';

export interface Node {
  'id'?: (string);
  'cluster'?: (string);
  'metadata'?: (_google_protobuf_Struct);
  'locality'?: (_envoy_api_v2_core_Locality);
  'build_version'?: (string);
  'user_agent_name'?: (string);
  'user_agent_version'?: (string);
  'user_agent_build_version'?: (_envoy_api_v2_core_BuildVersion);
  'extensions'?: (_envoy_api_v2_core_Extension)[];
  'client_features'?: (string)[];
  'listening_addresses'?: (_envoy_api_v2_core_Address)[];
  'user_agent_version_type'?: "user_agent_version"|"user_agent_build_version";
}

export interface Node__Output {
  'id': (string);
  'cluster': (string);
  'metadata': (_google_protobuf_Struct__Output);
  'locality': (_envoy_api_v2_core_Locality__Output);
  'build_version': (string);
  'user_agent_name': (string);
  'user_agent_version'?: (string);
  'user_agent_build_version'?: (_envoy_api_v2_core_BuildVersion__Output);
  'extensions': (_envoy_api_v2_core_Extension__Output)[];
  'client_features': (string)[];
  'listening_addresses': (_envoy_api_v2_core_Address__Output)[];
  'user_agent_version_type': "user_agent_version"|"user_agent_build_version";
}
