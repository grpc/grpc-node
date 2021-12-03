// Original file: deps/envoy-api/envoy/service/status/v3/csds.proto

/**
 * Config status from a client-side view.
 */
export enum ClientConfigStatus {
  /**
   * Config status is not available/unknown.
   */
  CLIENT_UNKNOWN = 0,
  /**
   * Client requested the config but hasn't received any config from management
   * server yet.
   */
  CLIENT_REQUESTED = 1,
  /**
   * Client received the config and replied with ACK.
   */
  CLIENT_ACKED = 2,
  /**
   * Client received the config and replied with NACK. Notably, the attached
   * config dump is not the NACKed version, but the most recent accepted one. If
   * no config is accepted yet, the attached config dump will be empty.
   */
  CLIENT_NACKED = 3,
}
