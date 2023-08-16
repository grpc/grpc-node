// Original file: deps/envoy-api/envoy/service/discovery/v3/discovery.proto


/**
 * Specifies a resource to be subscribed to.
 */
export interface ResourceLocator {
  /**
   * The resource name to subscribe to.
   */
  'name'?: (string);
  /**
   * A set of dynamic parameters used to match against the dynamic parameter
   * constraints on the resource. This allows clients to select between
   * multiple variants of the same resource.
   */
  'dynamic_parameters'?: ({[key: string]: string});
}

/**
 * Specifies a resource to be subscribed to.
 */
export interface ResourceLocator__Output {
  /**
   * The resource name to subscribe to.
   */
  'name': (string);
  /**
   * A set of dynamic parameters used to match against the dynamic parameter
   * constraints on the resource. This allows clients to select between
   * multiple variants of the same resource.
   */
  'dynamic_parameters': ({[key: string]: string});
}
