// Original file: deps/envoy-api/envoy/config/core/v3/address.proto


/**
 * The address represents an envoy internal listener.
 * [#comment: TODO(asraa): When address available, remove workaround from test/server/server_fuzz_test.cc:30.]
 */
export interface EnvoyInternalAddress {
  /**
   * Specifies the :ref:`name <envoy_v3_api_field_config.listener.v3.Listener.name>` of the
   * internal listener.
   */
  'server_listener_name'?: (string);
  /**
   * Specifies an endpoint identifier to distinguish between multiple endpoints for the same internal listener in a
   * single upstream pool. Only used in the upstream addresses for tracking changes to individual endpoints. This, for
   * example, may be set to the final destination IP for the target internal listener.
   */
  'endpoint_id'?: (string);
  'address_name_specifier'?: "server_listener_name";
}

/**
 * The address represents an envoy internal listener.
 * [#comment: TODO(asraa): When address available, remove workaround from test/server/server_fuzz_test.cc:30.]
 */
export interface EnvoyInternalAddress__Output {
  /**
   * Specifies the :ref:`name <envoy_v3_api_field_config.listener.v3.Listener.name>` of the
   * internal listener.
   */
  'server_listener_name'?: (string);
  /**
   * Specifies an endpoint identifier to distinguish between multiple endpoints for the same internal listener in a
   * single upstream pool. Only used in the upstream addresses for tracking changes to individual endpoints. This, for
   * example, may be set to the final destination IP for the target internal listener.
   */
  'endpoint_id': (string);
  'address_name_specifier': "server_listener_name";
}
