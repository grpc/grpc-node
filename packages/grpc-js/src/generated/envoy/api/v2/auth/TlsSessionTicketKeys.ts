// Original file: deps/envoy-api/envoy/api/v2/auth/common.proto

import { DataSource as _envoy_api_v2_core_DataSource, DataSource__Output as _envoy_api_v2_core_DataSource__Output } from '../../../../envoy/api/v2/core/DataSource';

export interface TlsSessionTicketKeys {
  /**
   * Keys for encrypting and decrypting TLS session tickets. The
   * first key in the array contains the key to encrypt all new sessions created by this context.
   * All keys are candidates for decrypting received tickets. This allows for easy rotation of keys
   * by, for example, putting the new key first, and the previous key second.
   * 
   * If :ref:`session_ticket_keys <envoy_api_field_auth.DownstreamTlsContext.session_ticket_keys>`
   * is not specified, the TLS library will still support resuming sessions via tickets, but it will
   * use an internally-generated and managed key, so sessions cannot be resumed across hot restarts
   * or on different hosts.
   * 
   * Each key must contain exactly 80 bytes of cryptographically-secure random data. For
   * example, the output of ``openssl rand 80``.
   * 
   * .. attention::
   * 
   * Using this feature has serious security considerations and risks. Improper handling of keys
   * may result in loss of secrecy in connections, even if ciphers supporting perfect forward
   * secrecy are used. See https://www.imperialviolet.org/2013/06/27/botchingpfs.html for some
   * discussion. To minimize the risk, you must:
   * 
   * * Keep the session ticket keys at least as secure as your TLS certificate private keys
   * * Rotate session ticket keys at least daily, and preferably hourly
   * * Always generate keys using a cryptographically-secure random data source
   */
  'keys'?: (_envoy_api_v2_core_DataSource)[];
}

export interface TlsSessionTicketKeys__Output {
  /**
   * Keys for encrypting and decrypting TLS session tickets. The
   * first key in the array contains the key to encrypt all new sessions created by this context.
   * All keys are candidates for decrypting received tickets. This allows for easy rotation of keys
   * by, for example, putting the new key first, and the previous key second.
   * 
   * If :ref:`session_ticket_keys <envoy_api_field_auth.DownstreamTlsContext.session_ticket_keys>`
   * is not specified, the TLS library will still support resuming sessions via tickets, but it will
   * use an internally-generated and managed key, so sessions cannot be resumed across hot restarts
   * or on different hosts.
   * 
   * Each key must contain exactly 80 bytes of cryptographically-secure random data. For
   * example, the output of ``openssl rand 80``.
   * 
   * .. attention::
   * 
   * Using this feature has serious security considerations and risks. Improper handling of keys
   * may result in loss of secrecy in connections, even if ciphers supporting perfect forward
   * secrecy are used. See https://www.imperialviolet.org/2013/06/27/botchingpfs.html for some
   * discussion. To minimize the risk, you must:
   * 
   * * Keep the session ticket keys at least as secure as your TLS certificate private keys
   * * Rotate session ticket keys at least daily, and preferably hourly
   * * Always generate keys using a cryptographically-secure random data source
   */
  'keys': (_envoy_api_v2_core_DataSource__Output)[];
}
