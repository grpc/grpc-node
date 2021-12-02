// Original file: deps/envoy-api/envoy/config/core/v3/address.proto


/**
 * [#not-implemented-hide:] The address represents an envoy internal listener.
 * TODO(lambdai): Make this address available for listener and endpoint.
 * TODO(asraa): When address available, remove workaround from test/server/server_fuzz_test.cc:30.
 */
export interface EnvoyInternalAddress {
  /**
   * [#not-implemented-hide:] The :ref:`listener name <envoy_v3_api_field_config.listener.v3.Listener.name>` of the destination internal listener.
   */
  'server_listener_name'?: (string);
  'address_name_specifier'?: "server_listener_name";
}

/**
 * [#not-implemented-hide:] The address represents an envoy internal listener.
 * TODO(lambdai): Make this address available for listener and endpoint.
 * TODO(asraa): When address available, remove workaround from test/server/server_fuzz_test.cc:30.
 */
export interface EnvoyInternalAddress__Output {
  /**
   * [#not-implemented-hide:] The :ref:`listener name <envoy_v3_api_field_config.listener.v3.Listener.name>` of the destination internal listener.
   */
  'server_listener_name'?: (string);
  'address_name_specifier': "server_listener_name";
}
