// Original file: deps/gapic-showcase/schema/google/showcase/v1beta1/echo.proto

import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from '../../../google/protobuf/Timestamp';

/**
 * The metadata for Wait operation.
 */
export interface WaitMetadata {
  /**
   * The time that this operation will complete.
   */
  'end_time'?: (_google_protobuf_Timestamp | null);
}

/**
 * The metadata for Wait operation.
 */
export interface WaitMetadata__Output {
  /**
   * The time that this operation will complete.
   */
  'end_time': (_google_protobuf_Timestamp__Output | null);
}
