// Original file: deps/envoy-api/envoy/admin/v3/config_dump.proto

import type { Bootstrap as _envoy_config_bootstrap_v3_Bootstrap, Bootstrap__Output as _envoy_config_bootstrap_v3_Bootstrap__Output } from '../../../envoy/config/bootstrap/v3/Bootstrap';
import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from '../../../google/protobuf/Timestamp';

/**
 * This message describes the bootstrap configuration that Envoy was started with. This includes
 * any CLI overrides that were merged. Bootstrap configuration information can be used to recreate
 * the static portions of an Envoy configuration by reusing the output as the bootstrap
 * configuration for another Envoy.
 */
export interface BootstrapConfigDump {
  'bootstrap'?: (_envoy_config_bootstrap_v3_Bootstrap | null);
  /**
   * The timestamp when the BootstrapConfig was last updated.
   */
  'last_updated'?: (_google_protobuf_Timestamp | null);
}

/**
 * This message describes the bootstrap configuration that Envoy was started with. This includes
 * any CLI overrides that were merged. Bootstrap configuration information can be used to recreate
 * the static portions of an Envoy configuration by reusing the output as the bootstrap
 * configuration for another Envoy.
 */
export interface BootstrapConfigDump__Output {
  'bootstrap': (_envoy_config_bootstrap_v3_Bootstrap__Output | null);
  /**
   * The timestamp when the BootstrapConfig was last updated.
   */
  'last_updated': (_google_protobuf_Timestamp__Output | null);
}
