// Original file: deps/envoy-api/envoy/config/core/v3/config_source.proto

import type { ApiVersion as _envoy_config_core_v3_ApiVersion } from '../../../../envoy/config/core/v3/ApiVersion';

/**
 * [#not-implemented-hide:]
 * Self-referencing config source options. This is currently empty, but when
 * set in :ref:`ConfigSource <envoy_v3_api_msg_config.core.v3.ConfigSource>` can be used to
 * specify that other data can be obtained from the same server.
 */
export interface SelfConfigSource {
  /**
   * API version for xDS transport protocol. This describes the xDS gRPC/REST
   * endpoint and version of [Delta]DiscoveryRequest/Response used on the wire.
   */
  'transport_api_version'?: (_envoy_config_core_v3_ApiVersion | keyof typeof _envoy_config_core_v3_ApiVersion);
}

/**
 * [#not-implemented-hide:]
 * Self-referencing config source options. This is currently empty, but when
 * set in :ref:`ConfigSource <envoy_v3_api_msg_config.core.v3.ConfigSource>` can be used to
 * specify that other data can be obtained from the same server.
 */
export interface SelfConfigSource__Output {
  /**
   * API version for xDS transport protocol. This describes the xDS gRPC/REST
   * endpoint and version of [Delta]DiscoveryRequest/Response used on the wire.
   */
  'transport_api_version': (keyof typeof _envoy_config_core_v3_ApiVersion);
}
