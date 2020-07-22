// Original file: deps/envoy-api/envoy/api/v2/core/base.proto

/**
 * Identifies the direction of the traffic relative to the local Envoy.
 */
export enum TrafficDirection {
  /**
   * Default option is unspecified.
   */
  UNSPECIFIED = 0,
  /**
   * The transport is used for incoming traffic.
   */
  INBOUND = 1,
  /**
   * The transport is used for outgoing traffic.
   */
  OUTBOUND = 2,
}
