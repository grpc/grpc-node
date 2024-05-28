// Original file: proto/grpc/testing/messages.proto

/**
 * The type of payload that should be returned.
 */
export const PayloadType = {
  /**
   * Compressable text format.
   */
  COMPRESSABLE: 'COMPRESSABLE',
} as const;

/**
 * The type of payload that should be returned.
 */
export type PayloadType =
  /**
   * Compressable text format.
   */
  | 'COMPRESSABLE'
  | 0

/**
 * The type of payload that should be returned.
 */
export type PayloadType__Output = typeof PayloadType[keyof typeof PayloadType]
