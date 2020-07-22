// Original file: deps/envoy-api/envoy/type/range.proto


/**
 * Specifies the double start and end of the range using half-open interval semantics [start,
 * end).
 */
export interface DoubleRange {
  /**
   * start of the range (inclusive)
   */
  'start'?: (number | string);
  /**
   * end of the range (exclusive)
   */
  'end'?: (number | string);
}

/**
 * Specifies the double start and end of the range using half-open interval semantics [start,
 * end).
 */
export interface DoubleRange__Output {
  /**
   * start of the range (inclusive)
   */
  'start': (number | string);
  /**
   * end of the range (exclusive)
   */
  'end': (number | string);
}
