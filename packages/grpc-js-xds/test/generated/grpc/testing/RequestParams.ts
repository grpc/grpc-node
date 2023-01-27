// Original file: proto/grpc/testing/echo_messages.proto

import type { DebugInfo as _grpc_testing_DebugInfo, DebugInfo__Output as _grpc_testing_DebugInfo__Output } from '../../grpc/testing/DebugInfo';
import type { ErrorStatus as _grpc_testing_ErrorStatus, ErrorStatus__Output as _grpc_testing_ErrorStatus__Output } from '../../grpc/testing/ErrorStatus';
import type { OrcaLoadReport as _xds_data_orca_v3_OrcaLoadReport, OrcaLoadReport__Output as _xds_data_orca_v3_OrcaLoadReport__Output } from '../../xds/data/orca/v3/OrcaLoadReport';

export interface RequestParams {
  'echo_deadline'?: (boolean);
  'client_cancel_after_us'?: (number);
  'server_cancel_after_us'?: (number);
  'echo_metadata'?: (boolean);
  'check_auth_context'?: (boolean);
  'response_message_length'?: (number);
  'echo_peer'?: (boolean);
  /**
   * will force check_auth_context.
   */
  'expected_client_identity'?: (string);
  'skip_cancelled_check'?: (boolean);
  'expected_transport_security_type'?: (string);
  'debug_info'?: (_grpc_testing_DebugInfo | null);
  /**
   * Server should not see a request with this set.
   */
  'server_die'?: (boolean);
  'binary_error_details'?: (string);
  'expected_error'?: (_grpc_testing_ErrorStatus | null);
  /**
   * sleep when invoking server for deadline tests
   */
  'server_sleep_us'?: (number);
  /**
   * which backend to send request to
   */
  'backend_channel_idx'?: (number);
  'echo_metadata_initially'?: (boolean);
  'server_notify_client_when_started'?: (boolean);
  'backend_metrics'?: (_xds_data_orca_v3_OrcaLoadReport | null);
  'echo_host_from_authority_header'?: (boolean);
}

export interface RequestParams__Output {
  'echo_deadline': (boolean);
  'client_cancel_after_us': (number);
  'server_cancel_after_us': (number);
  'echo_metadata': (boolean);
  'check_auth_context': (boolean);
  'response_message_length': (number);
  'echo_peer': (boolean);
  /**
   * will force check_auth_context.
   */
  'expected_client_identity': (string);
  'skip_cancelled_check': (boolean);
  'expected_transport_security_type': (string);
  'debug_info': (_grpc_testing_DebugInfo__Output | null);
  /**
   * Server should not see a request with this set.
   */
  'server_die': (boolean);
  'binary_error_details': (string);
  'expected_error': (_grpc_testing_ErrorStatus__Output | null);
  /**
   * sleep when invoking server for deadline tests
   */
  'server_sleep_us': (number);
  /**
   * which backend to send request to
   */
  'backend_channel_idx': (number);
  'echo_metadata_initially': (boolean);
  'server_notify_client_when_started': (boolean);
  'backend_metrics': (_xds_data_orca_v3_OrcaLoadReport__Output | null);
  'echo_host_from_authority_header': (boolean);
}
