// Original file: deps/envoy-api/envoy/config/bootstrap/v3/bootstrap.proto

import type { Address as _envoy_config_core_v3_Address, Address__Output as _envoy_config_core_v3_Address__Output } from '../../../../envoy/config/core/v3/Address';
import type { SocketOption as _envoy_config_core_v3_SocketOption, SocketOption__Output as _envoy_config_core_v3_SocketOption__Output } from '../../../../envoy/config/core/v3/SocketOption';
import type { AccessLog as _envoy_config_accesslog_v3_AccessLog, AccessLog__Output as _envoy_config_accesslog_v3_AccessLog__Output } from '../../../../envoy/config/accesslog/v3/AccessLog';

/**
 * Administration interface :ref:`operations documentation
 * <operations_admin_interface>`.
 * [#next-free-field: 6]
 */
export interface Admin {
  /**
   * The path to write the access log for the administration server. If no
   * access log is desired specify ‘/dev/null’. This is only required if
   * :ref:`address <envoy_v3_api_field_config.bootstrap.v3.Admin.address>` is set.
   * Deprecated in favor of *access_log* which offers more options.
   */
  'access_log_path'?: (string);
  /**
   * The cpu profiler output path for the administration server. If no profile
   * path is specified, the default is ‘/var/log/envoy/envoy.prof’.
   */
  'profile_path'?: (string);
  /**
   * The TCP address that the administration server will listen on.
   * If not specified, Envoy will not start an administration server.
   */
  'address'?: (_envoy_config_core_v3_Address | null);
  /**
   * Additional socket options that may not be present in Envoy source code or
   * precompiled binaries.
   */
  'socket_options'?: (_envoy_config_core_v3_SocketOption)[];
  /**
   * Configuration for :ref:`access logs <arch_overview_access_logs>`
   * emitted by the administration server.
   */
  'access_log'?: (_envoy_config_accesslog_v3_AccessLog)[];
}

/**
 * Administration interface :ref:`operations documentation
 * <operations_admin_interface>`.
 * [#next-free-field: 6]
 */
export interface Admin__Output {
  /**
   * The path to write the access log for the administration server. If no
   * access log is desired specify ‘/dev/null’. This is only required if
   * :ref:`address <envoy_v3_api_field_config.bootstrap.v3.Admin.address>` is set.
   * Deprecated in favor of *access_log* which offers more options.
   */
  'access_log_path': (string);
  /**
   * The cpu profiler output path for the administration server. If no profile
   * path is specified, the default is ‘/var/log/envoy/envoy.prof’.
   */
  'profile_path': (string);
  /**
   * The TCP address that the administration server will listen on.
   * If not specified, Envoy will not start an administration server.
   */
  'address': (_envoy_config_core_v3_Address__Output | null);
  /**
   * Additional socket options that may not be present in Envoy source code or
   * precompiled binaries.
   */
  'socket_options': (_envoy_config_core_v3_SocketOption__Output)[];
  /**
   * Configuration for :ref:`access logs <arch_overview_access_logs>`
   * emitted by the administration server.
   */
  'access_log': (_envoy_config_accesslog_v3_AccessLog__Output)[];
}
