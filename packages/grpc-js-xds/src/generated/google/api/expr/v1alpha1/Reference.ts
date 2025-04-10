// Original file: deps/googleapis/google/api/expr/v1alpha1/checked.proto

import type { Constant as _google_api_expr_v1alpha1_Constant, Constant__Output as _google_api_expr_v1alpha1_Constant__Output } from '../../../../google/api/expr/v1alpha1/Constant';

/**
 * Describes a resolved reference to a declaration.
 */
export interface Reference {
  /**
   * The fully qualified name of the declaration.
   */
  'name'?: (string);
  /**
   * For references to functions, this is a list of `Overload.overload_id`
   * values which match according to typing rules.
   * 
   * If the list has more than one element, overload resolution among the
   * presented candidates must happen at runtime because of dynamic types. The
   * type checker attempts to narrow down this list as much as possible.
   * 
   * Empty if this is not a reference to a [Decl.FunctionDecl][google.api.expr.v1alpha1.Decl.FunctionDecl].
   */
  'overload_id'?: (string)[];
  /**
   * For references to constants, this may contain the value of the
   * constant if known at compile time.
   */
  'value'?: (_google_api_expr_v1alpha1_Constant | null);
}

/**
 * Describes a resolved reference to a declaration.
 */
export interface Reference__Output {
  /**
   * The fully qualified name of the declaration.
   */
  'name': (string);
  /**
   * For references to functions, this is a list of `Overload.overload_id`
   * values which match according to typing rules.
   * 
   * If the list has more than one element, overload resolution among the
   * presented candidates must happen at runtime because of dynamic types. The
   * type checker attempts to narrow down this list as much as possible.
   * 
   * Empty if this is not a reference to a [Decl.FunctionDecl][google.api.expr.v1alpha1.Decl.FunctionDecl].
   */
  'overload_id': (string)[];
  /**
   * For references to constants, this may contain the value of the
   * constant if known at compile time.
   */
  'value': (_google_api_expr_v1alpha1_Constant__Output | null);
}
