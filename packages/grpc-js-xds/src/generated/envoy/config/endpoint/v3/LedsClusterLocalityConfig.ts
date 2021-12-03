// Original file: deps/envoy-api/envoy/config/endpoint/v3/endpoint_components.proto

import type { ConfigSource as _envoy_config_core_v3_ConfigSource, ConfigSource__Output as _envoy_config_core_v3_ConfigSource__Output } from '../../../../envoy/config/core/v3/ConfigSource';

/**
 * [#not-implemented-hide:]
 * A configuration for a LEDS collection.
 */
export interface LedsClusterLocalityConfig {
  /**
   * Configuration for the source of LEDS updates for a Locality.
   */
  'leds_config'?: (_envoy_config_core_v3_ConfigSource | null);
  /**
   * The xDS transport protocol glob collection resource name.
   * The service is only supported in delta xDS (incremental) mode.
   */
  'leds_collection_name'?: (string);
}

/**
 * [#not-implemented-hide:]
 * A configuration for a LEDS collection.
 */
export interface LedsClusterLocalityConfig__Output {
  /**
   * Configuration for the source of LEDS updates for a Locality.
   */
  'leds_config': (_envoy_config_core_v3_ConfigSource__Output | null);
  /**
   * The xDS transport protocol glob collection resource name.
   * The service is only supported in delta xDS (incremental) mode.
   */
  'leds_collection_name': (string);
}
