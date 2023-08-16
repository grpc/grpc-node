// Original file: deps/envoy-api/envoy/data/accesslog/v3/accesslog.proto

import type { Long } from '@grpc/proto-loader';

/**
 * Defines fields for a connection
 */
export interface ConnectionProperties {
  /**
   * Number of bytes received from downstream.
   */
  'received_bytes'?: (number | string | Long);
  /**
   * Number of bytes sent to downstream.
   */
  'sent_bytes'?: (number | string | Long);
}

/**
 * Defines fields for a connection
 */
export interface ConnectionProperties__Output {
  /**
   * Number of bytes received from downstream.
   */
  'received_bytes': (string);
  /**
   * Number of bytes sent to downstream.
   */
  'sent_bytes': (string);
}
