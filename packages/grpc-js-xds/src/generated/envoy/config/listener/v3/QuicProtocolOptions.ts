// Original file: deps/envoy-api/envoy/config/listener/v3/quic_config.proto

import type { QuicProtocolOptions as _envoy_config_core_v3_QuicProtocolOptions, QuicProtocolOptions__Output as _envoy_config_core_v3_QuicProtocolOptions__Output } from '../../../../envoy/config/core/v3/QuicProtocolOptions';
import type { Duration as _google_protobuf_Duration, Duration__Output as _google_protobuf_Duration__Output } from '../../../../google/protobuf/Duration';
import type { RuntimeFeatureFlag as _envoy_config_core_v3_RuntimeFeatureFlag, RuntimeFeatureFlag__Output as _envoy_config_core_v3_RuntimeFeatureFlag__Output } from '../../../../envoy/config/core/v3/RuntimeFeatureFlag';
import type { UInt32Value as _google_protobuf_UInt32Value, UInt32Value__Output as _google_protobuf_UInt32Value__Output } from '../../../../google/protobuf/UInt32Value';
import type { TypedExtensionConfig as _envoy_config_core_v3_TypedExtensionConfig, TypedExtensionConfig__Output as _envoy_config_core_v3_TypedExtensionConfig__Output } from '../../../../envoy/config/core/v3/TypedExtensionConfig';

/**
 * Configuration specific to the UDP QUIC listener.
 * [#next-free-field: 10]
 */
export interface QuicProtocolOptions {
  'quic_protocol_options'?: (_envoy_config_core_v3_QuicProtocolOptions | null);
  /**
   * Maximum number of milliseconds that connection will be alive when there is
   * no network activity.
   * 
   * If it is less than 1ms, Envoy will use 1ms. 300000ms if not specified.
   */
  'idle_timeout'?: (_google_protobuf_Duration | null);
  /**
   * Connection timeout in milliseconds before the crypto handshake is finished.
   * 
   * If it is less than 5000ms, Envoy will use 5000ms. 20000ms if not specified.
   */
  'crypto_handshake_timeout'?: (_google_protobuf_Duration | null);
  /**
   * Runtime flag that controls whether the listener is enabled or not. If not specified, defaults
   * to enabled.
   */
  'enabled'?: (_envoy_config_core_v3_RuntimeFeatureFlag | null);
  /**
   * A multiplier to number of connections which is used to determine how many packets to read per
   * event loop. A reasonable number should allow the listener to process enough payload but not
   * starve TCP and other UDP sockets and also prevent long event loop duration.
   * The default value is 32. This means if there are N QUIC connections, the total number of
   * packets to read in each read event will be 32 * N.
   * The actual number of packets to read in total by the UDP listener is also
   * bound by 6000, regardless of this field or how many connections there are.
   */
  'packets_to_read_to_connection_count_ratio'?: (_google_protobuf_UInt32Value | null);
  /**
   * Configure which implementation of ``quic::QuicCryptoClientStreamBase`` to be used for this listener.
   * If not specified the :ref:`QUICHE default one configured by <envoy_v3_api_msg_extensions.quic.crypto_stream.v3.CryptoServerStreamConfig>` will be used.
   * [#extension-category: envoy.quic.server.crypto_stream]
   */
  'crypto_stream_config'?: (_envoy_config_core_v3_TypedExtensionConfig | null);
  /**
   * Configure which implementation of ``quic::ProofSource`` to be used for this listener.
   * If not specified the :ref:`default one configured by <envoy_v3_api_msg_extensions.quic.proof_source.v3.ProofSourceConfig>` will be used.
   * [#extension-category: envoy.quic.proof_source]
   */
  'proof_source_config'?: (_envoy_config_core_v3_TypedExtensionConfig | null);
  /**
   * Config which implementation of ``quic::ConnectionIdGeneratorInterface`` to be used for this listener.
   * If not specified the :ref:`default one configured by <envoy_v3_api_msg_extensions.quic.connection_id_generator.v3.DeterministicConnectionIdGeneratorConfig>` will be used.
   * [#extension-category: envoy.quic.connection_id_generator]
   */
  'connection_id_generator_config'?: (_envoy_config_core_v3_TypedExtensionConfig | null);
  /**
   * Configure the server's preferred address to advertise so that client can migrate to it. See :ref:`example <envoy_v3_api_msg_extensions.quic.server_preferred_address.v3.FixedServerPreferredAddressConfig>` which configures a pair of v4 and v6 preferred addresses.
   * The current QUICHE implementation will advertise only one of the preferred IPv4 and IPv6 addresses based on the address family the client initially connects with, and only if the client is also QUICHE-based.
   * If not specified, Envoy will not advertise any server's preferred address.
   * [#extension-category: envoy.quic.server_preferred_address]
   */
  'server_preferred_address_config'?: (_envoy_config_core_v3_TypedExtensionConfig | null);
}

/**
 * Configuration specific to the UDP QUIC listener.
 * [#next-free-field: 10]
 */
export interface QuicProtocolOptions__Output {
  'quic_protocol_options': (_envoy_config_core_v3_QuicProtocolOptions__Output | null);
  /**
   * Maximum number of milliseconds that connection will be alive when there is
   * no network activity.
   * 
   * If it is less than 1ms, Envoy will use 1ms. 300000ms if not specified.
   */
  'idle_timeout': (_google_protobuf_Duration__Output | null);
  /**
   * Connection timeout in milliseconds before the crypto handshake is finished.
   * 
   * If it is less than 5000ms, Envoy will use 5000ms. 20000ms if not specified.
   */
  'crypto_handshake_timeout': (_google_protobuf_Duration__Output | null);
  /**
   * Runtime flag that controls whether the listener is enabled or not. If not specified, defaults
   * to enabled.
   */
  'enabled': (_envoy_config_core_v3_RuntimeFeatureFlag__Output | null);
  /**
   * A multiplier to number of connections which is used to determine how many packets to read per
   * event loop. A reasonable number should allow the listener to process enough payload but not
   * starve TCP and other UDP sockets and also prevent long event loop duration.
   * The default value is 32. This means if there are N QUIC connections, the total number of
   * packets to read in each read event will be 32 * N.
   * The actual number of packets to read in total by the UDP listener is also
   * bound by 6000, regardless of this field or how many connections there are.
   */
  'packets_to_read_to_connection_count_ratio': (_google_protobuf_UInt32Value__Output | null);
  /**
   * Configure which implementation of ``quic::QuicCryptoClientStreamBase`` to be used for this listener.
   * If not specified the :ref:`QUICHE default one configured by <envoy_v3_api_msg_extensions.quic.crypto_stream.v3.CryptoServerStreamConfig>` will be used.
   * [#extension-category: envoy.quic.server.crypto_stream]
   */
  'crypto_stream_config': (_envoy_config_core_v3_TypedExtensionConfig__Output | null);
  /**
   * Configure which implementation of ``quic::ProofSource`` to be used for this listener.
   * If not specified the :ref:`default one configured by <envoy_v3_api_msg_extensions.quic.proof_source.v3.ProofSourceConfig>` will be used.
   * [#extension-category: envoy.quic.proof_source]
   */
  'proof_source_config': (_envoy_config_core_v3_TypedExtensionConfig__Output | null);
  /**
   * Config which implementation of ``quic::ConnectionIdGeneratorInterface`` to be used for this listener.
   * If not specified the :ref:`default one configured by <envoy_v3_api_msg_extensions.quic.connection_id_generator.v3.DeterministicConnectionIdGeneratorConfig>` will be used.
   * [#extension-category: envoy.quic.connection_id_generator]
   */
  'connection_id_generator_config': (_envoy_config_core_v3_TypedExtensionConfig__Output | null);
  /**
   * Configure the server's preferred address to advertise so that client can migrate to it. See :ref:`example <envoy_v3_api_msg_extensions.quic.server_preferred_address.v3.FixedServerPreferredAddressConfig>` which configures a pair of v4 and v6 preferred addresses.
   * The current QUICHE implementation will advertise only one of the preferred IPv4 and IPv6 addresses based on the address family the client initially connects with, and only if the client is also QUICHE-based.
   * If not specified, Envoy will not advertise any server's preferred address.
   * [#extension-category: envoy.quic.server_preferred_address]
   */
  'server_preferred_address_config': (_envoy_config_core_v3_TypedExtensionConfig__Output | null);
}
