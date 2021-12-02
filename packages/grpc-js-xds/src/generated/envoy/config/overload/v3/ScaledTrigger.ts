// Original file: deps/envoy-api/envoy/config/overload/v3/overload.proto


export interface ScaledTrigger {
  /**
   * If the resource pressure is greater than this value, the trigger will be in the
   * :ref:`scaling <arch_overview_overload_manager-triggers-state>` state with value
   * `(pressure - scaling_threshold) / (saturation_threshold - scaling_threshold)`.
   */
  'scaling_threshold'?: (number | string);
  /**
   * If the resource pressure is greater than this value, the trigger will enter saturation.
   */
  'saturation_threshold'?: (number | string);
}

export interface ScaledTrigger__Output {
  /**
   * If the resource pressure is greater than this value, the trigger will be in the
   * :ref:`scaling <arch_overview_overload_manager-triggers-state>` state with value
   * `(pressure - scaling_threshold) / (saturation_threshold - scaling_threshold)`.
   */
  'scaling_threshold': (number);
  /**
   * If the resource pressure is greater than this value, the trigger will enter saturation.
   */
  'saturation_threshold': (number);
}
