// Original file: deps/envoy-api/envoy/config/bootstrap/v3/bootstrap.proto

import type { TypedExtensionConfig as _envoy_config_core_v3_TypedExtensionConfig, TypedExtensionConfig__Output as _envoy_config_core_v3_TypedExtensionConfig__Output } from '../../../../envoy/config/core/v3/TypedExtensionConfig';

/**
 * Fatal actions to run while crashing. Actions can be safe (meaning they are
 * async-signal safe) or unsafe. We run all safe actions before we run unsafe actions.
 * If using an unsafe action that could get stuck or deadlock, it important to
 * have an out of band system to terminate the process.
 * 
 * The interface for the extension is ``Envoy::Server::Configuration::FatalAction``.
 * *FatalAction* extensions live in the ``envoy.extensions.fatal_actions`` API
 * namespace.
 */
export interface FatalAction {
  /**
   * Extension specific configuration for the action. It's expected to conform
   * to the ``Envoy::Server::Configuration::FatalAction`` interface.
   */
  'config'?: (_envoy_config_core_v3_TypedExtensionConfig | null);
}

/**
 * Fatal actions to run while crashing. Actions can be safe (meaning they are
 * async-signal safe) or unsafe. We run all safe actions before we run unsafe actions.
 * If using an unsafe action that could get stuck or deadlock, it important to
 * have an out of band system to terminate the process.
 * 
 * The interface for the extension is ``Envoy::Server::Configuration::FatalAction``.
 * *FatalAction* extensions live in the ``envoy.extensions.fatal_actions`` API
 * namespace.
 */
export interface FatalAction__Output {
  /**
   * Extension specific configuration for the action. It's expected to conform
   * to the ``Envoy::Server::Configuration::FatalAction`` interface.
   */
  'config': (_envoy_config_core_v3_TypedExtensionConfig__Output | null);
}
