// Original file: deps/envoy-api/envoy/api/v2/listener/listener_components.proto

import { FilterChainMatch as _envoy_api_v2_listener_FilterChainMatch, FilterChainMatch__Output as _envoy_api_v2_listener_FilterChainMatch__Output } from '../../../../envoy/api/v2/listener/FilterChainMatch';
import { DownstreamTlsContext as _envoy_api_v2_auth_DownstreamTlsContext, DownstreamTlsContext__Output as _envoy_api_v2_auth_DownstreamTlsContext__Output } from '../../../../envoy/api/v2/auth/DownstreamTlsContext';
import { Filter as _envoy_api_v2_listener_Filter, Filter__Output as _envoy_api_v2_listener_Filter__Output } from '../../../../envoy/api/v2/listener/Filter';
import { BoolValue as _google_protobuf_BoolValue, BoolValue__Output as _google_protobuf_BoolValue__Output } from '../../../../google/protobuf/BoolValue';
import { Metadata as _envoy_api_v2_core_Metadata, Metadata__Output as _envoy_api_v2_core_Metadata__Output } from '../../../../envoy/api/v2/core/Metadata';
import { TransportSocket as _envoy_api_v2_core_TransportSocket, TransportSocket__Output as _envoy_api_v2_core_TransportSocket__Output } from '../../../../envoy/api/v2/core/TransportSocket';

export interface FilterChain {
  'filter_chain_match'?: (_envoy_api_v2_listener_FilterChainMatch);
  'tls_context'?: (_envoy_api_v2_auth_DownstreamTlsContext);
  'filters'?: (_envoy_api_v2_listener_Filter)[];
  'use_proxy_proto'?: (_google_protobuf_BoolValue);
  'metadata'?: (_envoy_api_v2_core_Metadata);
  'transport_socket'?: (_envoy_api_v2_core_TransportSocket);
  'name'?: (string);
}

export interface FilterChain__Output {
  'filter_chain_match': (_envoy_api_v2_listener_FilterChainMatch__Output);
  'tls_context': (_envoy_api_v2_auth_DownstreamTlsContext__Output);
  'filters': (_envoy_api_v2_listener_Filter__Output)[];
  'use_proxy_proto': (_google_protobuf_BoolValue__Output);
  'metadata': (_envoy_api_v2_core_Metadata__Output);
  'transport_socket': (_envoy_api_v2_core_TransportSocket__Output);
  'name': (string);
}
