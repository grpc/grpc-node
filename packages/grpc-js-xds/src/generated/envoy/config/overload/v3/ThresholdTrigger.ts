// Original file: deps/envoy-api/envoy/config/overload/v3/overload.proto


export interface ThresholdTrigger {
  /**
   * If the resource pressure is greater than or equal to this value, the trigger
   * will enter saturation.
   */
  'value'?: (number | string);
}

export interface ThresholdTrigger__Output {
  /**
   * If the resource pressure is greater than or equal to this value, the trigger
   * will enter saturation.
   */
  'value': (number);
}
