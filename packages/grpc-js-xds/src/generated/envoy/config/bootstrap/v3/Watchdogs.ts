// Original file: deps/envoy-api/envoy/config/bootstrap/v3/bootstrap.proto

import type { Watchdog as _envoy_config_bootstrap_v3_Watchdog, Watchdog__Output as _envoy_config_bootstrap_v3_Watchdog__Output } from '../../../../envoy/config/bootstrap/v3/Watchdog';

/**
 * Allows you to specify different watchdog configs for different subsystems.
 * This allows finer tuned policies for the watchdog. If a subsystem is omitted
 * the default values for that system will be used.
 */
export interface Watchdogs {
  /**
   * Watchdog for the main thread.
   */
  'main_thread_watchdog'?: (_envoy_config_bootstrap_v3_Watchdog | null);
  /**
   * Watchdog for the worker threads.
   */
  'worker_watchdog'?: (_envoy_config_bootstrap_v3_Watchdog | null);
}

/**
 * Allows you to specify different watchdog configs for different subsystems.
 * This allows finer tuned policies for the watchdog. If a subsystem is omitted
 * the default values for that system will be used.
 */
export interface Watchdogs__Output {
  /**
   * Watchdog for the main thread.
   */
  'main_thread_watchdog': (_envoy_config_bootstrap_v3_Watchdog__Output | null);
  /**
   * Watchdog for the worker threads.
   */
  'worker_watchdog': (_envoy_config_bootstrap_v3_Watchdog__Output | null);
}
