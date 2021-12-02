// Original file: deps/envoy-api/envoy/config/bootstrap/v3/bootstrap.proto

import type { Duration as _google_protobuf_Duration, Duration__Output as _google_protobuf_Duration__Output } from '../../../../google/protobuf/Duration';
import type { Percent as _envoy_type_v3_Percent, Percent__Output as _envoy_type_v3_Percent__Output } from '../../../../envoy/type/v3/Percent';
import type { TypedExtensionConfig as _envoy_config_core_v3_TypedExtensionConfig, TypedExtensionConfig__Output as _envoy_config_core_v3_TypedExtensionConfig__Output } from '../../../../envoy/config/core/v3/TypedExtensionConfig';

export interface _envoy_config_bootstrap_v3_Watchdog_WatchdogAction {
  /**
   * Extension specific configuration for the action.
   */
  'config'?: (_envoy_config_core_v3_TypedExtensionConfig | null);
  'event'?: (_envoy_config_bootstrap_v3_Watchdog_WatchdogAction_WatchdogEvent | keyof typeof _envoy_config_bootstrap_v3_Watchdog_WatchdogAction_WatchdogEvent);
}

export interface _envoy_config_bootstrap_v3_Watchdog_WatchdogAction__Output {
  /**
   * Extension specific configuration for the action.
   */
  'config': (_envoy_config_core_v3_TypedExtensionConfig__Output | null);
  'event': (keyof typeof _envoy_config_bootstrap_v3_Watchdog_WatchdogAction_WatchdogEvent);
}

// Original file: deps/envoy-api/envoy/config/bootstrap/v3/bootstrap.proto

/**
 * The events are fired in this order: KILL, MULTIKILL, MEGAMISS, MISS.
 * Within an event type, actions execute in the order they are configured.
 * For KILL/MULTIKILL there is a default PANIC that will run after the
 * registered actions and kills the process if it wasn't already killed.
 * It might be useful to specify several debug actions, and possibly an
 * alternate FATAL action.
 */
export enum _envoy_config_bootstrap_v3_Watchdog_WatchdogAction_WatchdogEvent {
  UNKNOWN = 0,
  KILL = 1,
  MULTIKILL = 2,
  MEGAMISS = 3,
  MISS = 4,
}

/**
 * Envoy process watchdog configuration. When configured, this monitors for
 * nonresponsive threads and kills the process after the configured thresholds.
 * See the :ref:`watchdog documentation <operations_performance_watchdog>` for more information.
 * [#next-free-field: 8]
 */
export interface Watchdog {
  /**
   * The duration after which Envoy counts a nonresponsive thread in the
   * *watchdog_miss* statistic. If not specified the default is 200ms.
   */
  'miss_timeout'?: (_google_protobuf_Duration | null);
  /**
   * The duration after which Envoy counts a nonresponsive thread in the
   * *watchdog_mega_miss* statistic. If not specified the default is
   * 1000ms.
   */
  'megamiss_timeout'?: (_google_protobuf_Duration | null);
  /**
   * If a watched thread has been nonresponsive for this duration, assume a
   * programming error and kill the entire Envoy process. Set to 0 to disable
   * kill behavior. If not specified the default is 0 (disabled).
   */
  'kill_timeout'?: (_google_protobuf_Duration | null);
  /**
   * If max(2, ceil(registered_threads * Fraction(*multikill_threshold*)))
   * threads have been nonresponsive for at least this duration kill the entire
   * Envoy process. Set to 0 to disable this behavior. If not specified the
   * default is 0 (disabled).
   */
  'multikill_timeout'?: (_google_protobuf_Duration | null);
  /**
   * Sets the threshold for *multikill_timeout* in terms of the percentage of
   * nonresponsive threads required for the *multikill_timeout*.
   * If not specified the default is 0.
   */
  'multikill_threshold'?: (_envoy_type_v3_Percent | null);
  /**
   * Defines the maximum jitter used to adjust the *kill_timeout* if *kill_timeout* is
   * enabled. Enabling this feature would help to reduce risk of synchronized
   * watchdog kill events across proxies due to external triggers. Set to 0 to
   * disable. If not specified the default is 0 (disabled).
   */
  'max_kill_timeout_jitter'?: (_google_protobuf_Duration | null);
  /**
   * Register actions that will fire on given WatchDog events.
   * See *WatchDogAction* for priority of events.
   */
  'actions'?: (_envoy_config_bootstrap_v3_Watchdog_WatchdogAction)[];
}

/**
 * Envoy process watchdog configuration. When configured, this monitors for
 * nonresponsive threads and kills the process after the configured thresholds.
 * See the :ref:`watchdog documentation <operations_performance_watchdog>` for more information.
 * [#next-free-field: 8]
 */
export interface Watchdog__Output {
  /**
   * The duration after which Envoy counts a nonresponsive thread in the
   * *watchdog_miss* statistic. If not specified the default is 200ms.
   */
  'miss_timeout': (_google_protobuf_Duration__Output | null);
  /**
   * The duration after which Envoy counts a nonresponsive thread in the
   * *watchdog_mega_miss* statistic. If not specified the default is
   * 1000ms.
   */
  'megamiss_timeout': (_google_protobuf_Duration__Output | null);
  /**
   * If a watched thread has been nonresponsive for this duration, assume a
   * programming error and kill the entire Envoy process. Set to 0 to disable
   * kill behavior. If not specified the default is 0 (disabled).
   */
  'kill_timeout': (_google_protobuf_Duration__Output | null);
  /**
   * If max(2, ceil(registered_threads * Fraction(*multikill_threshold*)))
   * threads have been nonresponsive for at least this duration kill the entire
   * Envoy process. Set to 0 to disable this behavior. If not specified the
   * default is 0 (disabled).
   */
  'multikill_timeout': (_google_protobuf_Duration__Output | null);
  /**
   * Sets the threshold for *multikill_timeout* in terms of the percentage of
   * nonresponsive threads required for the *multikill_timeout*.
   * If not specified the default is 0.
   */
  'multikill_threshold': (_envoy_type_v3_Percent__Output | null);
  /**
   * Defines the maximum jitter used to adjust the *kill_timeout* if *kill_timeout* is
   * enabled. Enabling this feature would help to reduce risk of synchronized
   * watchdog kill events across proxies due to external triggers. Set to 0 to
   * disable. If not specified the default is 0 (disabled).
   */
  'max_kill_timeout_jitter': (_google_protobuf_Duration__Output | null);
  /**
   * Register actions that will fire on given WatchDog events.
   * See *WatchDogAction* for priority of events.
   */
  'actions': (_envoy_config_bootstrap_v3_Watchdog_WatchdogAction__Output)[];
}
