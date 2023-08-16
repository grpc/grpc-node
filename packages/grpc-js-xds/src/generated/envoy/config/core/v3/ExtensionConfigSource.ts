// Original file: deps/envoy-api/envoy/config/core/v3/config_source.proto

import type { ConfigSource as _envoy_config_core_v3_ConfigSource, ConfigSource__Output as _envoy_config_core_v3_ConfigSource__Output } from '../../../../envoy/config/core/v3/ConfigSource';
import type { Any as _google_protobuf_Any, Any__Output as _google_protobuf_Any__Output } from '../../../../google/protobuf/Any';

/**
 * Configuration source specifier for a late-bound extension configuration. The
 * parent resource is warmed until all the initial extension configurations are
 * received, unless the flag to apply the default configuration is set.
 * Subsequent extension updates are atomic on a per-worker basis. Once an
 * extension configuration is applied to a request or a connection, it remains
 * constant for the duration of processing. If the initial delivery of the
 * extension configuration fails, due to a timeout for example, the optional
 * default configuration is applied. Without a default configuration, the
 * extension is disabled, until an extension configuration is received. The
 * behavior of a disabled extension depends on the context. For example, a
 * filter chain with a disabled extension filter rejects all incoming streams.
 */
export interface ExtensionConfigSource {
  'config_source'?: (_envoy_config_core_v3_ConfigSource | null);
  /**
   * Optional default configuration to use as the initial configuration if
   * there is a failure to receive the initial extension configuration or if
   * ``apply_default_config_without_warming`` flag is set.
   */
  'default_config'?: (_google_protobuf_Any | null);
  /**
   * Use the default config as the initial configuration without warming and
   * waiting for the first discovery response. Requires the default configuration
   * to be supplied.
   */
  'apply_default_config_without_warming'?: (boolean);
  /**
   * A set of permitted extension type URLs. Extension configuration updates are rejected
   * if they do not match any type URL in the set.
   */
  'type_urls'?: (string)[];
}

/**
 * Configuration source specifier for a late-bound extension configuration. The
 * parent resource is warmed until all the initial extension configurations are
 * received, unless the flag to apply the default configuration is set.
 * Subsequent extension updates are atomic on a per-worker basis. Once an
 * extension configuration is applied to a request or a connection, it remains
 * constant for the duration of processing. If the initial delivery of the
 * extension configuration fails, due to a timeout for example, the optional
 * default configuration is applied. Without a default configuration, the
 * extension is disabled, until an extension configuration is received. The
 * behavior of a disabled extension depends on the context. For example, a
 * filter chain with a disabled extension filter rejects all incoming streams.
 */
export interface ExtensionConfigSource__Output {
  'config_source': (_envoy_config_core_v3_ConfigSource__Output | null);
  /**
   * Optional default configuration to use as the initial configuration if
   * there is a failure to receive the initial extension configuration or if
   * ``apply_default_config_without_warming`` flag is set.
   */
  'default_config': (_google_protobuf_Any__Output | null);
  /**
   * Use the default config as the initial configuration without warming and
   * waiting for the first discovery response. Requires the default configuration
   * to be supplied.
   */
  'apply_default_config_without_warming': (boolean);
  /**
   * A set of permitted extension type URLs. Extension configuration updates are rejected
   * if they do not match any type URL in the set.
   */
  'type_urls': (string)[];
}
