// Original file: deps/envoy-api/envoy/api/v2/core/address.proto


// Original file: deps/envoy-api/envoy/api/v2/core/address.proto

export enum _envoy_api_v2_core_SocketAddress_Protocol {
  TCP = 0,
  UDP = 1,
}

export interface SocketAddress {
  'protocol'?: (_envoy_api_v2_core_SocketAddress_Protocol | keyof typeof _envoy_api_v2_core_SocketAddress_Protocol);
  'address'?: (string);
  'port_value'?: (number);
  'named_port'?: (string);
  'resolver_name'?: (string);
  'ipv4_compat'?: (boolean);
  'port_specifier'?: "port_value"|"named_port";
}

export interface SocketAddress__Output {
  'protocol': (keyof typeof _envoy_api_v2_core_SocketAddress_Protocol);
  'address': (string);
  'port_value'?: (number);
  'named_port'?: (string);
  'resolver_name': (string);
  'ipv4_compat': (boolean);
  'port_specifier': "port_value"|"named_port";
}
