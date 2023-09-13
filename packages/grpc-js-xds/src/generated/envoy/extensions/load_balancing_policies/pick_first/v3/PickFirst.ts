// Original file: deps/envoy-api/envoy/extensions/load_balancing_policies/pick_first/v3/pick_first.proto


/**
 * This configuration allows the built-in PICK_FIRST LB policy to be configured
 * via the LB policy extension point.
 */
export interface PickFirst {
  /**
   * If set to true, instructs the LB policy to shuffle the list of addresses
   * received from the name resolver before attempting to connect to them.
   */
  'shuffle_address_list'?: (boolean);
}

/**
 * This configuration allows the built-in PICK_FIRST LB policy to be configured
 * via the LB policy extension point.
 */
export interface PickFirst__Output {
  /**
   * If set to true, instructs the LB policy to shuffle the list of addresses
   * received from the name resolver before attempting to connect to them.
   */
  'shuffle_address_list': (boolean);
}
