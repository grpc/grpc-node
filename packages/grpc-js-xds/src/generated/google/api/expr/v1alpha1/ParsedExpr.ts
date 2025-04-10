// Original file: deps/googleapis/google/api/expr/v1alpha1/syntax.proto

import type { Expr as _google_api_expr_v1alpha1_Expr, Expr__Output as _google_api_expr_v1alpha1_Expr__Output } from '../../../../google/api/expr/v1alpha1/Expr';
import type { SourceInfo as _google_api_expr_v1alpha1_SourceInfo, SourceInfo__Output as _google_api_expr_v1alpha1_SourceInfo__Output } from '../../../../google/api/expr/v1alpha1/SourceInfo';

/**
 * An expression together with source information as returned by the parser.
 */
export interface ParsedExpr {
  /**
   * The parsed expression.
   */
  'expr'?: (_google_api_expr_v1alpha1_Expr | null);
  /**
   * The source info derived from input that generated the parsed `expr`.
   */
  'source_info'?: (_google_api_expr_v1alpha1_SourceInfo | null);
}

/**
 * An expression together with source information as returned by the parser.
 */
export interface ParsedExpr__Output {
  /**
   * The parsed expression.
   */
  'expr': (_google_api_expr_v1alpha1_Expr__Output | null);
  /**
   * The source info derived from input that generated the parsed `expr`.
   */
  'source_info': (_google_api_expr_v1alpha1_SourceInfo__Output | null);
}
