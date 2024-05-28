// Original file: deps/envoy-api/envoy/config/core/v3/base.proto

/**
 * Identifies the direction of the traffic relative to the local Envoy.
 */
export const TrafficDirection = {
  /**
   * Default option is unspecified.
   */
  UNSPECIFIED: 'UNSPECIFIED',
  /**
   * The transport is used for incoming traffic.
   */
  INBOUND: 'INBOUND',
  /**
   * The transport is used for outgoing traffic.
   */
  OUTBOUND: 'OUTBOUND',
} as const;

/**
 * Identifies the direction of the traffic relative to the local Envoy.
 */
export type TrafficDirection =
  /**
   * Default option is unspecified.
   */
  | 'UNSPECIFIED'
  | 0
  /**
   * The transport is used for incoming traffic.
   */
  | 'INBOUND'
  | 1
  /**
   * The transport is used for outgoing traffic.
   */
  | 'OUTBOUND'
  | 2

/**
 * Identifies the direction of the traffic relative to the local Envoy.
 */
export type TrafficDirection__Output = typeof TrafficDirection[keyof typeof TrafficDirection]
