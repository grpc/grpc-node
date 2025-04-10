// Original file: deps/googleapis/google/api/expr/v1alpha1/syntax.proto

import type { Expr as _google_api_expr_v1alpha1_Expr, Expr__Output as _google_api_expr_v1alpha1_Expr__Output } from '../../../../google/api/expr/v1alpha1/Expr';

/**
 * Source information collected at parse time.
 */
export interface SourceInfo {
  /**
   * The syntax version of the source, e.g. `cel1`.
   */
  'syntax_version'?: (string);
  /**
   * The location name. All position information attached to an expression is
   * relative to this location.
   * 
   * The location could be a file, UI element, or similar. For example,
   * `acme/app/AnvilPolicy.cel`.
   */
  'location'?: (string);
  /**
   * Monotonically increasing list of character offsets where newlines appear.
   * 
   * The line number of a given position is the index `i` where for a given
   * `id` the `line_offsets[i] < id_positions[id] < line_offsets[i+1]`. The
   * column may be derivd from `id_positions[id] - line_offsets[i]`.
   */
  'line_offsets'?: (number)[];
  /**
   * A map from the parse node id (e.g. `Expr.id`) to the character offset
   * within source.
   */
  'positions'?: ({[key: number]: number});
  /**
   * A map from the parse node id where a macro replacement was made to the
   * call `Expr` that resulted in a macro expansion.
   * 
   * For example, `has(value.field)` is a function call that is replaced by a
   * `test_only` field selection in the AST. Likewise, the call
   * `list.exists(e, e > 10)` translates to a comprehension expression. The key
   * in the map corresponds to the expression id of the expanded macro, and the
   * value is the call `Expr` that was replaced.
   */
  'macro_calls'?: ({[key: number]: _google_api_expr_v1alpha1_Expr});
}

/**
 * Source information collected at parse time.
 */
export interface SourceInfo__Output {
  /**
   * The syntax version of the source, e.g. `cel1`.
   */
  'syntax_version': (string);
  /**
   * The location name. All position information attached to an expression is
   * relative to this location.
   * 
   * The location could be a file, UI element, or similar. For example,
   * `acme/app/AnvilPolicy.cel`.
   */
  'location': (string);
  /**
   * Monotonically increasing list of character offsets where newlines appear.
   * 
   * The line number of a given position is the index `i` where for a given
   * `id` the `line_offsets[i] < id_positions[id] < line_offsets[i+1]`. The
   * column may be derivd from `id_positions[id] - line_offsets[i]`.
   */
  'line_offsets': (number)[];
  /**
   * A map from the parse node id (e.g. `Expr.id`) to the character offset
   * within source.
   */
  'positions': ({[key: number]: number});
  /**
   * A map from the parse node id where a macro replacement was made to the
   * call `Expr` that resulted in a macro expansion.
   * 
   * For example, `has(value.field)` is a function call that is replaced by a
   * `test_only` field selection in the AST. Likewise, the call
   * `list.exists(e, e > 10)` translates to a comprehension expression. The key
   * in the map corresponds to the expression id of the expanded macro, and the
   * value is the call `Expr` that was replaced.
   */
  'macro_calls': ({[key: number]: _google_api_expr_v1alpha1_Expr__Output});
}
