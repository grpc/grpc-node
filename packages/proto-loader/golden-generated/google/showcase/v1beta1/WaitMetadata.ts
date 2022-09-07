// Original file: deps/gapic-showcase/schema/google/showcase/v1beta1/echo.proto

import type { ITimestamp as I_google_protobuf_Timestamp, OTimestamp as O_google_protobuf_Timestamp } from '../../../google/protobuf/Timestamp';

/**
 * The metadata for Wait operation.
 */
export interface IWaitMetadata {
  /**
   * The time that this operation will complete.
   */
  'end_time'?: (I_google_protobuf_Timestamp | null);
}

/**
 * The metadata for Wait operation.
 */
export interface OWaitMetadata {
  /**
   * The time that this operation will complete.
   */
  'end_time': (O_google_protobuf_Timestamp | null);
}
