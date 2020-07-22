// Original file: deps/envoy-api/envoy/type/range.proto

import { Long } from '@grpc/proto-loader';

/**
 * Specifies the int64 start and end of the range using half-open interval semantics [start,
 * end).
 */
export interface Int64Range {
  /**
   * start of the range (inclusive)
   */
  'start'?: (number | string | Long);
  /**
   * end of the range (exclusive)
   */
  'end'?: (number | string | Long);
}

/**
 * Specifies the int64 start and end of the range using half-open interval semantics [start,
 * end).
 */
export interface Int64Range__Output {
  /**
   * start of the range (inclusive)
   */
  'start': (string);
  /**
   * end of the range (exclusive)
   */
  'end': (string);
}
