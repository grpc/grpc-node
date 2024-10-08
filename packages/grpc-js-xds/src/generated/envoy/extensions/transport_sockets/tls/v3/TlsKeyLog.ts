// Original file: deps/envoy-api/envoy/extensions/transport_sockets/tls/v3/tls.proto

import type { CidrRange as _envoy_config_core_v3_CidrRange, CidrRange__Output as _envoy_config_core_v3_CidrRange__Output } from '../../../../../envoy/config/core/v3/CidrRange';

/**
 * TLS key log configuration.
 * The key log file format is "format used by NSS for its SSLKEYLOGFILE debugging output" (text taken from openssl man page)
 */
export interface TlsKeyLog {
  /**
   * The path to save the TLS key log.
   */
  'path'?: (string);
  /**
   * The local IP address that will be used to filter the connection which should save the TLS key log
   * If it is not set, any local IP address  will be matched.
   */
  'local_address_range'?: (_envoy_config_core_v3_CidrRange)[];
  /**
   * The remote IP address that will be used to filter the connection which should save the TLS key log
   * If it is not set, any remote IP address will be matched.
   */
  'remote_address_range'?: (_envoy_config_core_v3_CidrRange)[];
}

/**
 * TLS key log configuration.
 * The key log file format is "format used by NSS for its SSLKEYLOGFILE debugging output" (text taken from openssl man page)
 */
export interface TlsKeyLog__Output {
  /**
   * The path to save the TLS key log.
   */
  'path': (string);
  /**
   * The local IP address that will be used to filter the connection which should save the TLS key log
   * If it is not set, any local IP address  will be matched.
   */
  'local_address_range': (_envoy_config_core_v3_CidrRange__Output)[];
  /**
   * The remote IP address that will be used to filter the connection which should save the TLS key log
   * If it is not set, any remote IP address will be matched.
   */
  'remote_address_range': (_envoy_config_core_v3_CidrRange__Output)[];
}
