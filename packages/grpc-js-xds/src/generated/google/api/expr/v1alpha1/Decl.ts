// Original file: deps/googleapis/google/api/expr/v1alpha1/checked.proto

import type { Type as _google_api_expr_v1alpha1_Type, Type__Output as _google_api_expr_v1alpha1_Type__Output } from '../../../../google/api/expr/v1alpha1/Type';
import type { Constant as _google_api_expr_v1alpha1_Constant, Constant__Output as _google_api_expr_v1alpha1_Constant__Output } from '../../../../google/api/expr/v1alpha1/Constant';

/**
 * Function declaration specifies one or more overloads which indicate the
 * function's parameter types and return type, and may optionally specify a
 * function definition in terms of CEL expressions.
 * 
 * Functions have no observable side-effects (there may be side-effects like
 * logging which are not observable from CEL).
 */
export interface _google_api_expr_v1alpha1_Decl_FunctionDecl {
  /**
   * Required. List of function overloads, must contain at least one overload.
   */
  'overloads'?: (_google_api_expr_v1alpha1_Decl_FunctionDecl_Overload)[];
}

/**
 * Function declaration specifies one or more overloads which indicate the
 * function's parameter types and return type, and may optionally specify a
 * function definition in terms of CEL expressions.
 * 
 * Functions have no observable side-effects (there may be side-effects like
 * logging which are not observable from CEL).
 */
export interface _google_api_expr_v1alpha1_Decl_FunctionDecl__Output {
  /**
   * Required. List of function overloads, must contain at least one overload.
   */
  'overloads': (_google_api_expr_v1alpha1_Decl_FunctionDecl_Overload__Output)[];
}

/**
 * Identifier declaration which specifies its type and optional `Expr` value.
 * 
 * An identifier without a value is a declaration that must be provided at
 * evaluation time. An identifier with a value should resolve to a constant,
 * but may be used in conjunction with other identifiers bound at evaluation
 * time.
 */
export interface _google_api_expr_v1alpha1_Decl_IdentDecl {
  /**
   * Required. The type of the identifier.
   */
  'type'?: (_google_api_expr_v1alpha1_Type | null);
  /**
   * The constant value of the identifier. If not specified, the identifier
   * must be supplied at evaluation time.
   */
  'value'?: (_google_api_expr_v1alpha1_Constant | null);
  /**
   * Documentation string for the identifier.
   */
  'doc'?: (string);
}

/**
 * Identifier declaration which specifies its type and optional `Expr` value.
 * 
 * An identifier without a value is a declaration that must be provided at
 * evaluation time. An identifier with a value should resolve to a constant,
 * but may be used in conjunction with other identifiers bound at evaluation
 * time.
 */
export interface _google_api_expr_v1alpha1_Decl_IdentDecl__Output {
  /**
   * Required. The type of the identifier.
   */
  'type': (_google_api_expr_v1alpha1_Type__Output | null);
  /**
   * The constant value of the identifier. If not specified, the identifier
   * must be supplied at evaluation time.
   */
  'value': (_google_api_expr_v1alpha1_Constant__Output | null);
  /**
   * Documentation string for the identifier.
   */
  'doc': (string);
}

/**
 * An overload indicates a function's parameter types and return type, and
 * may optionally include a function body described in terms of [Expr][google.api.expr.v1alpha1.Expr]
 * values.
 * 
 * Functions overloads are declared in either a function or method
 * call-style. For methods, the `params[0]` is the expected type of the
 * target receiver.
 * 
 * Overloads must have non-overlapping argument types after erasure of all
 * parameterized type variables (similar as type erasure in Java).
 */
export interface _google_api_expr_v1alpha1_Decl_FunctionDecl_Overload {
  /**
   * Required. Globally unique overload name of the function which reflects
   * the function name and argument types.
   * 
   * This will be used by a [Reference][google.api.expr.v1alpha1.Reference] to indicate the `overload_id` that
   * was resolved for the function `name`.
   */
  'overload_id'?: (string);
  /**
   * List of function parameter [Type][google.api.expr.v1alpha1.Type] values.
   * 
   * Param types are disjoint after generic type parameters have been
   * replaced with the type `DYN`. Since the `DYN` type is compatible with
   * any other type, this means that if `A` is a type parameter, the
   * function types `int<A>` and `int<int>` are not disjoint. Likewise,
   * `map<string, string>` is not disjoint from `map<K, V>`.
   * 
   * When the `result_type` of a function is a generic type param, the
   * type param name also appears as the `type` of on at least one params.
   */
  'params'?: (_google_api_expr_v1alpha1_Type)[];
  /**
   * The type param names associated with the function declaration.
   * 
   * For example, `function ex<K,V>(K key, map<K, V> map) : V` would yield
   * the type params of `K, V`.
   */
  'type_params'?: (string)[];
  /**
   * Required. The result type of the function. For example, the operator
   * `string.isEmpty()` would have `result_type` of `kind: BOOL`.
   */
  'result_type'?: (_google_api_expr_v1alpha1_Type | null);
  /**
   * Whether the function is to be used in a method call-style `x.f(...)`
   * of a function call-style `f(x, ...)`.
   * 
   * For methods, the first parameter declaration, `params[0]` is the
   * expected type of the target receiver.
   */
  'is_instance_function'?: (boolean);
  /**
   * Documentation string for the overload.
   */
  'doc'?: (string);
}

/**
 * An overload indicates a function's parameter types and return type, and
 * may optionally include a function body described in terms of [Expr][google.api.expr.v1alpha1.Expr]
 * values.
 * 
 * Functions overloads are declared in either a function or method
 * call-style. For methods, the `params[0]` is the expected type of the
 * target receiver.
 * 
 * Overloads must have non-overlapping argument types after erasure of all
 * parameterized type variables (similar as type erasure in Java).
 */
export interface _google_api_expr_v1alpha1_Decl_FunctionDecl_Overload__Output {
  /**
   * Required. Globally unique overload name of the function which reflects
   * the function name and argument types.
   * 
   * This will be used by a [Reference][google.api.expr.v1alpha1.Reference] to indicate the `overload_id` that
   * was resolved for the function `name`.
   */
  'overload_id': (string);
  /**
   * List of function parameter [Type][google.api.expr.v1alpha1.Type] values.
   * 
   * Param types are disjoint after generic type parameters have been
   * replaced with the type `DYN`. Since the `DYN` type is compatible with
   * any other type, this means that if `A` is a type parameter, the
   * function types `int<A>` and `int<int>` are not disjoint. Likewise,
   * `map<string, string>` is not disjoint from `map<K, V>`.
   * 
   * When the `result_type` of a function is a generic type param, the
   * type param name also appears as the `type` of on at least one params.
   */
  'params': (_google_api_expr_v1alpha1_Type__Output)[];
  /**
   * The type param names associated with the function declaration.
   * 
   * For example, `function ex<K,V>(K key, map<K, V> map) : V` would yield
   * the type params of `K, V`.
   */
  'type_params': (string)[];
  /**
   * Required. The result type of the function. For example, the operator
   * `string.isEmpty()` would have `result_type` of `kind: BOOL`.
   */
  'result_type': (_google_api_expr_v1alpha1_Type__Output | null);
  /**
   * Whether the function is to be used in a method call-style `x.f(...)`
   * of a function call-style `f(x, ...)`.
   * 
   * For methods, the first parameter declaration, `params[0]` is the
   * expected type of the target receiver.
   */
  'is_instance_function': (boolean);
  /**
   * Documentation string for the overload.
   */
  'doc': (string);
}

/**
 * Represents a declaration of a named value or function.
 * 
 * A declaration is part of the contract between the expression, the agent
 * evaluating that expression, and the caller requesting evaluation.
 */
export interface Decl {
  /**
   * The fully qualified name of the declaration.
   * 
   * Declarations are organized in containers and this represents the full path
   * to the declaration in its container, as in `google.api.expr.Decl`.
   * 
   * Declarations used as [FunctionDecl.Overload][google.api.expr.v1alpha1.Decl.FunctionDecl.Overload] parameters may or may not
   * have a name depending on whether the overload is function declaration or a
   * function definition containing a result [Expr][google.api.expr.v1alpha1.Expr].
   */
  'name'?: (string);
  /**
   * Identifier declaration.
   */
  'ident'?: (_google_api_expr_v1alpha1_Decl_IdentDecl | null);
  /**
   * Function declaration.
   */
  'function'?: (_google_api_expr_v1alpha1_Decl_FunctionDecl | null);
  /**
   * Required. The declaration kind.
   */
  'decl_kind'?: "ident"|"function";
}

/**
 * Represents a declaration of a named value or function.
 * 
 * A declaration is part of the contract between the expression, the agent
 * evaluating that expression, and the caller requesting evaluation.
 */
export interface Decl__Output {
  /**
   * The fully qualified name of the declaration.
   * 
   * Declarations are organized in containers and this represents the full path
   * to the declaration in its container, as in `google.api.expr.Decl`.
   * 
   * Declarations used as [FunctionDecl.Overload][google.api.expr.v1alpha1.Decl.FunctionDecl.Overload] parameters may or may not
   * have a name depending on whether the overload is function declaration or a
   * function definition containing a result [Expr][google.api.expr.v1alpha1.Expr].
   */
  'name': (string);
  /**
   * Identifier declaration.
   */
  'ident'?: (_google_api_expr_v1alpha1_Decl_IdentDecl__Output | null);
  /**
   * Function declaration.
   */
  'function'?: (_google_api_expr_v1alpha1_Decl_FunctionDecl__Output | null);
  /**
   * Required. The declaration kind.
   */
  'decl_kind'?: "ident"|"function";
}
