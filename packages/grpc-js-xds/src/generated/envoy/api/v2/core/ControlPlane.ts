// Original file: deps/envoy-api/envoy/api/v2/core/base.proto


/**
 * Identifies a specific ControlPlane instance that Envoy is connected to.
 */
export interface ControlPlane {
  /**
   * An opaque control plane identifier that uniquely identifies an instance
   * of control plane. This can be used to identify which control plane instance,
   * the Envoy is connected to.
   */
  'identifier'?: (string);
}

/**
 * Identifies a specific ControlPlane instance that Envoy is connected to.
 */
export interface ControlPlane__Output {
  /**
   * An opaque control plane identifier that uniquely identifies an instance
   * of control plane. This can be used to identify which control plane instance,
   * the Envoy is connected to.
   */
  'identifier': (string);
}
