// Original file: deps/envoy-api/envoy/extensions/load_balancing_policies/common/v3/common.proto

import type { Duration as _google_protobuf_Duration, Duration__Output as _google_protobuf_Duration__Output } from '../../../../../google/protobuf/Duration';
import type { RuntimeDouble as _envoy_config_core_v3_RuntimeDouble, RuntimeDouble__Output as _envoy_config_core_v3_RuntimeDouble__Output } from '../../../../../envoy/config/core/v3/RuntimeDouble';
import type { Percent as _envoy_type_v3_Percent, Percent__Output as _envoy_type_v3_Percent__Output } from '../../../../../envoy/type/v3/Percent';

/**
 * Configuration for :ref:`slow start mode <arch_overview_load_balancing_slow_start>`.
 */
export interface SlowStartConfig {
  /**
   * Represents the size of slow start window.
   * If set, the newly created host remains in slow start mode starting from its creation time
   * for the duration of slow start window.
   */
  'slow_start_window'?: (_google_protobuf_Duration | null);
  /**
   * This parameter controls the speed of traffic increase over the slow start window. Defaults to 1.0,
   * so that endpoint would get linearly increasing amount of traffic.
   * When increasing the value for this parameter, the speed of traffic ramp-up increases non-linearly.
   * The value of aggression parameter should be greater than 0.0.
   * By tuning the parameter, is possible to achieve polynomial or exponential shape of ramp-up curve.
   * 
   * During slow start window, effective weight of an endpoint would be scaled with time factor and aggression:
   * ``new_weight = weight * max(min_weight_percent, time_factor ^ (1 / aggression))``,
   * where ``time_factor=(time_since_start_seconds / slow_start_time_seconds)``.
   * 
   * As time progresses, more and more traffic would be sent to endpoint, which is in slow start window.
   * Once host exits slow start, time_factor and aggression no longer affect its weight.
   */
  'aggression'?: (_envoy_config_core_v3_RuntimeDouble | null);
  /**
   * Configures the minimum percentage of origin weight that avoids too small new weight,
   * which may cause endpoints in slow start mode receive no traffic in slow start window.
   * If not specified, the default is 10%.
   */
  'min_weight_percent'?: (_envoy_type_v3_Percent | null);
}

/**
 * Configuration for :ref:`slow start mode <arch_overview_load_balancing_slow_start>`.
 */
export interface SlowStartConfig__Output {
  /**
   * Represents the size of slow start window.
   * If set, the newly created host remains in slow start mode starting from its creation time
   * for the duration of slow start window.
   */
  'slow_start_window': (_google_protobuf_Duration__Output | null);
  /**
   * This parameter controls the speed of traffic increase over the slow start window. Defaults to 1.0,
   * so that endpoint would get linearly increasing amount of traffic.
   * When increasing the value for this parameter, the speed of traffic ramp-up increases non-linearly.
   * The value of aggression parameter should be greater than 0.0.
   * By tuning the parameter, is possible to achieve polynomial or exponential shape of ramp-up curve.
   * 
   * During slow start window, effective weight of an endpoint would be scaled with time factor and aggression:
   * ``new_weight = weight * max(min_weight_percent, time_factor ^ (1 / aggression))``,
   * where ``time_factor=(time_since_start_seconds / slow_start_time_seconds)``.
   * 
   * As time progresses, more and more traffic would be sent to endpoint, which is in slow start window.
   * Once host exits slow start, time_factor and aggression no longer affect its weight.
   */
  'aggression': (_envoy_config_core_v3_RuntimeDouble__Output | null);
  /**
   * Configures the minimum percentage of origin weight that avoids too small new weight,
   * which may cause endpoints in slow start mode receive no traffic in slow start window.
   * If not specified, the default is 10%.
   */
  'min_weight_percent': (_envoy_type_v3_Percent__Output | null);
}
