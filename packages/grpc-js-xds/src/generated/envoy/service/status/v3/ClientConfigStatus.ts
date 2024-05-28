// Original file: deps/envoy-api/envoy/service/status/v3/csds.proto

/**
 * Config status from a client-side view.
 */
export const ClientConfigStatus = {
  /**
   * Config status is not available/unknown.
   */
  CLIENT_UNKNOWN: 'CLIENT_UNKNOWN',
  /**
   * Client requested the config but hasn't received any config from management
   * server yet.
   */
  CLIENT_REQUESTED: 'CLIENT_REQUESTED',
  /**
   * Client received the config and replied with ACK.
   */
  CLIENT_ACKED: 'CLIENT_ACKED',
  /**
   * Client received the config and replied with NACK. Notably, the attached
   * config dump is not the NACKed version, but the most recent accepted one. If
   * no config is accepted yet, the attached config dump will be empty.
   */
  CLIENT_NACKED: 'CLIENT_NACKED',
} as const;

/**
 * Config status from a client-side view.
 */
export type ClientConfigStatus =
  /**
   * Config status is not available/unknown.
   */
  | 'CLIENT_UNKNOWN'
  | 0
  /**
   * Client requested the config but hasn't received any config from management
   * server yet.
   */
  | 'CLIENT_REQUESTED'
  | 1
  /**
   * Client received the config and replied with ACK.
   */
  | 'CLIENT_ACKED'
  | 2
  /**
   * Client received the config and replied with NACK. Notably, the attached
   * config dump is not the NACKed version, but the most recent accepted one. If
   * no config is accepted yet, the attached config dump will be empty.
   */
  | 'CLIENT_NACKED'
  | 3

/**
 * Config status from a client-side view.
 */
export type ClientConfigStatus__Output = typeof ClientConfigStatus[keyof typeof ClientConfigStatus]
