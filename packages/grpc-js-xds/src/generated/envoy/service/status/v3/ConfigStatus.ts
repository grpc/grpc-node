// Original file: deps/envoy-api/envoy/service/status/v3/csds.proto

/**
 * Status of a config from a management server view.
 */
export enum ConfigStatus {
  /**
   * Status info is not available/unknown.
   */
  UNKNOWN = 0,
  /**
   * Management server has sent the config to client and received ACK.
   */
  SYNCED = 1,
  /**
   * Config is not sent.
   */
  NOT_SENT = 2,
  /**
   * Management server has sent the config to client but hasn’t received
   * ACK/NACK.
   */
  STALE = 3,
  /**
   * Management server has sent the config to client but received NACK. The
   * attached config dump will be the latest config (the rejected one), since
   * it is the persisted version in the management server.
   */
  ERROR = 4,
}
