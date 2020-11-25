// Original file: deps/envoy-api/envoy/type/range.proto


/**
 * Specifies the int32 start and end of the range using half-open interval semantics [start,
 * end).
 */
export interface Int32Range {
  /**
   * start of the range (inclusive)
   */
  'start'?: (number);
  /**
   * end of the range (exclusive)
   */
  'end'?: (number);
}

/**
 * Specifies the int32 start and end of the range using half-open interval semantics [start,
 * end).
 */
export interface Int32Range__Output {
  /**
   * start of the range (inclusive)
   */
  'start': (number);
  /**
   * end of the range (exclusive)
   */
  'end': (number);
}
