// Original file: deps/googleapis/google/api/expr/v1alpha1/checked.proto

import type { Reference as _google_api_expr_v1alpha1_Reference, Reference__Output as _google_api_expr_v1alpha1_Reference__Output } from '../../../../google/api/expr/v1alpha1/Reference';
import type { Type as _google_api_expr_v1alpha1_Type, Type__Output as _google_api_expr_v1alpha1_Type__Output } from '../../../../google/api/expr/v1alpha1/Type';
import type { Expr as _google_api_expr_v1alpha1_Expr, Expr__Output as _google_api_expr_v1alpha1_Expr__Output } from '../../../../google/api/expr/v1alpha1/Expr';
import type { SourceInfo as _google_api_expr_v1alpha1_SourceInfo, SourceInfo__Output as _google_api_expr_v1alpha1_SourceInfo__Output } from '../../../../google/api/expr/v1alpha1/SourceInfo';

/**
 * A CEL expression which has been successfully type checked.
 */
export interface CheckedExpr {
  /**
   * A map from expression ids to resolved references.
   * 
   * The following entries are in this table:
   * 
   * - An Ident or Select expression is represented here if it resolves to a
   * declaration. For instance, if `a.b.c` is represented by
   * `select(select(id(a), b), c)`, and `a.b` resolves to a declaration,
   * while `c` is a field selection, then the reference is attached to the
   * nested select expression (but not to the id or or the outer select).
   * In turn, if `a` resolves to a declaration and `b.c` are field selections,
   * the reference is attached to the ident expression.
   * - Every Call expression has an entry here, identifying the function being
   * called.
   * - Every CreateStruct expression for a message has an entry, identifying
   * the message.
   */
  'reference_map'?: ({[key: number]: _google_api_expr_v1alpha1_Reference});
  /**
   * A map from expression ids to types.
   * 
   * Every expression node which has a type different than DYN has a mapping
   * here. If an expression has type DYN, it is omitted from this map to save
   * space.
   */
  'type_map'?: ({[key: number]: _google_api_expr_v1alpha1_Type});
  /**
   * The checked expression. Semantically equivalent to the parsed `expr`, but
   * may have structural differences.
   */
  'expr'?: (_google_api_expr_v1alpha1_Expr | null);
  /**
   * The source info derived from input that generated the parsed `expr` and
   * any optimizations made during the type-checking pass.
   */
  'source_info'?: (_google_api_expr_v1alpha1_SourceInfo | null);
}

/**
 * A CEL expression which has been successfully type checked.
 */
export interface CheckedExpr__Output {
  /**
   * A map from expression ids to resolved references.
   * 
   * The following entries are in this table:
   * 
   * - An Ident or Select expression is represented here if it resolves to a
   * declaration. For instance, if `a.b.c` is represented by
   * `select(select(id(a), b), c)`, and `a.b` resolves to a declaration,
   * while `c` is a field selection, then the reference is attached to the
   * nested select expression (but not to the id or or the outer select).
   * In turn, if `a` resolves to a declaration and `b.c` are field selections,
   * the reference is attached to the ident expression.
   * - Every Call expression has an entry here, identifying the function being
   * called.
   * - Every CreateStruct expression for a message has an entry, identifying
   * the message.
   */
  'reference_map': ({[key: number]: _google_api_expr_v1alpha1_Reference__Output});
  /**
   * A map from expression ids to types.
   * 
   * Every expression node which has a type different than DYN has a mapping
   * here. If an expression has type DYN, it is omitted from this map to save
   * space.
   */
  'type_map': ({[key: number]: _google_api_expr_v1alpha1_Type__Output});
  /**
   * The checked expression. Semantically equivalent to the parsed `expr`, but
   * may have structural differences.
   */
  'expr': (_google_api_expr_v1alpha1_Expr__Output | null);
  /**
   * The source info derived from input that generated the parsed `expr` and
   * any optimizations made during the type-checking pass.
   */
  'source_info': (_google_api_expr_v1alpha1_SourceInfo__Output | null);
}
