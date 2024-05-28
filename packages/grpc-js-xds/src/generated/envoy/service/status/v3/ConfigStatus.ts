// Original file: deps/envoy-api/envoy/service/status/v3/csds.proto

/**
 * Status of a config from a management server view.
 */
export const ConfigStatus = {
  /**
   * Status info is not available/unknown.
   */
  UNKNOWN: 'UNKNOWN',
  /**
   * Management server has sent the config to client and received ACK.
   */
  SYNCED: 'SYNCED',
  /**
   * Config is not sent.
   */
  NOT_SENT: 'NOT_SENT',
  /**
   * Management server has sent the config to client but hasn’t received
   * ACK/NACK.
   */
  STALE: 'STALE',
  /**
   * Management server has sent the config to client but received NACK. The
   * attached config dump will be the latest config (the rejected one), since
   * it is the persisted version in the management server.
   */
  ERROR: 'ERROR',
} as const;

/**
 * Status of a config from a management server view.
 */
export type ConfigStatus =
  /**
   * Status info is not available/unknown.
   */
  | 'UNKNOWN'
  | 0
  /**
   * Management server has sent the config to client and received ACK.
   */
  | 'SYNCED'
  | 1
  /**
   * Config is not sent.
   */
  | 'NOT_SENT'
  | 2
  /**
   * Management server has sent the config to client but hasn’t received
   * ACK/NACK.
   */
  | 'STALE'
  | 3
  /**
   * Management server has sent the config to client but received NACK. The
   * attached config dump will be the latest config (the rejected one), since
   * it is the persisted version in the management server.
   */
  | 'ERROR'
  | 4

/**
 * Status of a config from a management server view.
 */
export type ConfigStatus__Output = typeof ConfigStatus[keyof typeof ConfigStatus]
