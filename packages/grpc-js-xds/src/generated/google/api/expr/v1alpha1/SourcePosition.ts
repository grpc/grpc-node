// Original file: deps/googleapis/google/api/expr/v1alpha1/syntax.proto


/**
 * A specific position in source.
 */
export interface SourcePosition {
  /**
   * The soucre location name (e.g. file name).
   */
  'location'?: (string);
  /**
   * The character offset.
   */
  'offset'?: (number);
  /**
   * The 1-based index of the starting line in the source text
   * where the issue occurs, or 0 if unknown.
   */
  'line'?: (number);
  /**
   * The 0-based index of the starting position within the line of source text
   * where the issue occurs.  Only meaningful if line is nonzero.
   */
  'column'?: (number);
}

/**
 * A specific position in source.
 */
export interface SourcePosition__Output {
  /**
   * The soucre location name (e.g. file name).
   */
  'location': (string);
  /**
   * The character offset.
   */
  'offset': (number);
  /**
   * The 1-based index of the starting line in the source text
   * where the issue occurs, or 0 if unknown.
   */
  'line': (number);
  /**
   * The 0-based index of the starting position within the line of source text
   * where the issue occurs.  Only meaningful if line is nonzero.
   */
  'column': (number);
}
