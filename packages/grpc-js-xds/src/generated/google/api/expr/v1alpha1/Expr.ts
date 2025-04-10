// Original file: deps/googleapis/google/api/expr/v1alpha1/syntax.proto

import type { Constant as _google_api_expr_v1alpha1_Constant, Constant__Output as _google_api_expr_v1alpha1_Constant__Output } from '../../../../google/api/expr/v1alpha1/Constant';
import type { Expr as _google_api_expr_v1alpha1_Expr, Expr__Output as _google_api_expr_v1alpha1_Expr__Output } from '../../../../google/api/expr/v1alpha1/Expr';
import type { Long } from '@grpc/proto-loader';

/**
 * A call expression, including calls to predefined functions and operators.
 * 
 * For example, `value == 10`, `size(map_value)`.
 */
export interface _google_api_expr_v1alpha1_Expr_Call {
  /**
   * The target of an method call-style expression. For example, `x` in
   * `x.f()`.
   */
  'target'?: (_google_api_expr_v1alpha1_Expr | null);
  /**
   * Required. The name of the function or method being called.
   */
  'function'?: (string);
  /**
   * The arguments.
   */
  'args'?: (_google_api_expr_v1alpha1_Expr)[];
}

/**
 * A call expression, including calls to predefined functions and operators.
 * 
 * For example, `value == 10`, `size(map_value)`.
 */
export interface _google_api_expr_v1alpha1_Expr_Call__Output {
  /**
   * The target of an method call-style expression. For example, `x` in
   * `x.f()`.
   */
  'target': (_google_api_expr_v1alpha1_Expr__Output | null);
  /**
   * Required. The name of the function or method being called.
   */
  'function': (string);
  /**
   * The arguments.
   */
  'args': (_google_api_expr_v1alpha1_Expr__Output)[];
}

/**
 * A comprehension expression applied to a list or map.
 * 
 * Comprehensions are not part of the core syntax, but enabled with macros.
 * A macro matches a specific call signature within a parsed AST and replaces
 * the call with an alternate AST block. Macro expansion happens at parse
 * time.
 * 
 * The following macros are supported within CEL:
 * 
 * Aggregate type macros may be applied to all elements in a list or all keys
 * in a map:
 * 
 * *  `all`, `exists`, `exists_one` -  test a predicate expression against
 * the inputs and return `true` if the predicate is satisfied for all,
 * any, or only one value `list.all(x, x < 10)`.
 * *  `filter` - test a predicate expression against the inputs and return
 * the subset of elements which satisfy the predicate:
 * `payments.filter(p, p > 1000)`.
 * *  `map` - apply an expression to all elements in the input and return the
 * output aggregate type: `[1, 2, 3].map(i, i * i)`.
 * 
 * The `has(m.x)` macro tests whether the property `x` is present in struct
 * `m`. The semantics of this macro depend on the type of `m`. For proto2
 * messages `has(m.x)` is defined as 'defined, but not set`. For proto3, the
 * macro tests whether the property is set to its default. For map and struct
 * types, the macro tests whether the property `x` is defined on `m`.
 */
export interface _google_api_expr_v1alpha1_Expr_Comprehension {
  /**
   * The name of the iteration variable.
   */
  'iter_var'?: (string);
  /**
   * The range over which var iterates.
   */
  'iter_range'?: (_google_api_expr_v1alpha1_Expr | null);
  /**
   * The name of the variable used for accumulation of the result.
   */
  'accu_var'?: (string);
  /**
   * The initial value of the accumulator.
   */
  'accu_init'?: (_google_api_expr_v1alpha1_Expr | null);
  /**
   * An expression which can contain iter_var and accu_var.
   * 
   * Returns false when the result has been computed and may be used as
   * a hint to short-circuit the remainder of the comprehension.
   */
  'loop_condition'?: (_google_api_expr_v1alpha1_Expr | null);
  /**
   * An expression which can contain iter_var and accu_var.
   * 
   * Computes the next value of accu_var.
   */
  'loop_step'?: (_google_api_expr_v1alpha1_Expr | null);
  /**
   * An expression which can contain accu_var.
   * 
   * Computes the result.
   */
  'result'?: (_google_api_expr_v1alpha1_Expr | null);
}

/**
 * A comprehension expression applied to a list or map.
 * 
 * Comprehensions are not part of the core syntax, but enabled with macros.
 * A macro matches a specific call signature within a parsed AST and replaces
 * the call with an alternate AST block. Macro expansion happens at parse
 * time.
 * 
 * The following macros are supported within CEL:
 * 
 * Aggregate type macros may be applied to all elements in a list or all keys
 * in a map:
 * 
 * *  `all`, `exists`, `exists_one` -  test a predicate expression against
 * the inputs and return `true` if the predicate is satisfied for all,
 * any, or only one value `list.all(x, x < 10)`.
 * *  `filter` - test a predicate expression against the inputs and return
 * the subset of elements which satisfy the predicate:
 * `payments.filter(p, p > 1000)`.
 * *  `map` - apply an expression to all elements in the input and return the
 * output aggregate type: `[1, 2, 3].map(i, i * i)`.
 * 
 * The `has(m.x)` macro tests whether the property `x` is present in struct
 * `m`. The semantics of this macro depend on the type of `m`. For proto2
 * messages `has(m.x)` is defined as 'defined, but not set`. For proto3, the
 * macro tests whether the property is set to its default. For map and struct
 * types, the macro tests whether the property `x` is defined on `m`.
 */
export interface _google_api_expr_v1alpha1_Expr_Comprehension__Output {
  /**
   * The name of the iteration variable.
   */
  'iter_var': (string);
  /**
   * The range over which var iterates.
   */
  'iter_range': (_google_api_expr_v1alpha1_Expr__Output | null);
  /**
   * The name of the variable used for accumulation of the result.
   */
  'accu_var': (string);
  /**
   * The initial value of the accumulator.
   */
  'accu_init': (_google_api_expr_v1alpha1_Expr__Output | null);
  /**
   * An expression which can contain iter_var and accu_var.
   * 
   * Returns false when the result has been computed and may be used as
   * a hint to short-circuit the remainder of the comprehension.
   */
  'loop_condition': (_google_api_expr_v1alpha1_Expr__Output | null);
  /**
   * An expression which can contain iter_var and accu_var.
   * 
   * Computes the next value of accu_var.
   */
  'loop_step': (_google_api_expr_v1alpha1_Expr__Output | null);
  /**
   * An expression which can contain accu_var.
   * 
   * Computes the result.
   */
  'result': (_google_api_expr_v1alpha1_Expr__Output | null);
}

/**
 * A list creation expression.
 * 
 * Lists may either be homogenous, e.g. `[1, 2, 3]`, or heterogenous, e.g.
 * `dyn([1, 'hello', 2.0])`
 */
export interface _google_api_expr_v1alpha1_Expr_CreateList {
  /**
   * The elements part of the list.
   */
  'elements'?: (_google_api_expr_v1alpha1_Expr)[];
}

/**
 * A list creation expression.
 * 
 * Lists may either be homogenous, e.g. `[1, 2, 3]`, or heterogenous, e.g.
 * `dyn([1, 'hello', 2.0])`
 */
export interface _google_api_expr_v1alpha1_Expr_CreateList__Output {
  /**
   * The elements part of the list.
   */
  'elements': (_google_api_expr_v1alpha1_Expr__Output)[];
}

/**
 * A map or message creation expression.
 * 
 * Maps are constructed as `{'key_name': 'value'}`. Message construction is
 * similar, but prefixed with a type name and composed of field ids:
 * `types.MyType{field_id: 'value'}`.
 */
export interface _google_api_expr_v1alpha1_Expr_CreateStruct {
  /**
   * The type name of the message to be created, empty when creating map
   * literals.
   */
  'message_name'?: (string);
  /**
   * The entries in the creation expression.
   */
  'entries'?: (_google_api_expr_v1alpha1_Expr_CreateStruct_Entry)[];
}

/**
 * A map or message creation expression.
 * 
 * Maps are constructed as `{'key_name': 'value'}`. Message construction is
 * similar, but prefixed with a type name and composed of field ids:
 * `types.MyType{field_id: 'value'}`.
 */
export interface _google_api_expr_v1alpha1_Expr_CreateStruct__Output {
  /**
   * The type name of the message to be created, empty when creating map
   * literals.
   */
  'message_name': (string);
  /**
   * The entries in the creation expression.
   */
  'entries': (_google_api_expr_v1alpha1_Expr_CreateStruct_Entry__Output)[];
}

/**
 * Represents an entry.
 */
export interface _google_api_expr_v1alpha1_Expr_CreateStruct_Entry {
  /**
   * Required. An id assigned to this node by the parser which is unique
   * in a given expression tree. This is used to associate type
   * information and other attributes to the node.
   */
  'id'?: (number | string | Long);
  /**
   * The field key for a message creator statement.
   */
  'field_key'?: (string);
  /**
   * The key expression for a map creation statement.
   */
  'map_key'?: (_google_api_expr_v1alpha1_Expr | null);
  /**
   * Required. The value assigned to the key.
   */
  'value'?: (_google_api_expr_v1alpha1_Expr | null);
  /**
   * The `Entry` key kinds.
   */
  'key_kind'?: "field_key"|"map_key";
}

/**
 * Represents an entry.
 */
export interface _google_api_expr_v1alpha1_Expr_CreateStruct_Entry__Output {
  /**
   * Required. An id assigned to this node by the parser which is unique
   * in a given expression tree. This is used to associate type
   * information and other attributes to the node.
   */
  'id': (string);
  /**
   * The field key for a message creator statement.
   */
  'field_key'?: (string);
  /**
   * The key expression for a map creation statement.
   */
  'map_key'?: (_google_api_expr_v1alpha1_Expr__Output | null);
  /**
   * Required. The value assigned to the key.
   */
  'value': (_google_api_expr_v1alpha1_Expr__Output | null);
  /**
   * The `Entry` key kinds.
   */
  'key_kind'?: "field_key"|"map_key";
}

/**
 * An identifier expression. e.g. `request`.
 */
export interface _google_api_expr_v1alpha1_Expr_Ident {
  /**
   * Required. Holds a single, unqualified identifier, possibly preceded by a
   * '.'.
   * 
   * Qualified names are represented by the [Expr.Select][google.api.expr.v1alpha1.Expr.Select] expression.
   */
  'name'?: (string);
}

/**
 * An identifier expression. e.g. `request`.
 */
export interface _google_api_expr_v1alpha1_Expr_Ident__Output {
  /**
   * Required. Holds a single, unqualified identifier, possibly preceded by a
   * '.'.
   * 
   * Qualified names are represented by the [Expr.Select][google.api.expr.v1alpha1.Expr.Select] expression.
   */
  'name': (string);
}

/**
 * A field selection expression. e.g. `request.auth`.
 */
export interface _google_api_expr_v1alpha1_Expr_Select {
  /**
   * Required. The target of the selection expression.
   * 
   * For example, in the select expression `request.auth`, the `request`
   * portion of the expression is the `operand`.
   */
  'operand'?: (_google_api_expr_v1alpha1_Expr | null);
  /**
   * Required. The name of the field to select.
   * 
   * For example, in the select expression `request.auth`, the `auth` portion
   * of the expression would be the `field`.
   */
  'field'?: (string);
  /**
   * Whether the select is to be interpreted as a field presence test.
   * 
   * This results from the macro `has(request.auth)`.
   */
  'test_only'?: (boolean);
}

/**
 * A field selection expression. e.g. `request.auth`.
 */
export interface _google_api_expr_v1alpha1_Expr_Select__Output {
  /**
   * Required. The target of the selection expression.
   * 
   * For example, in the select expression `request.auth`, the `request`
   * portion of the expression is the `operand`.
   */
  'operand': (_google_api_expr_v1alpha1_Expr__Output | null);
  /**
   * Required. The name of the field to select.
   * 
   * For example, in the select expression `request.auth`, the `auth` portion
   * of the expression would be the `field`.
   */
  'field': (string);
  /**
   * Whether the select is to be interpreted as a field presence test.
   * 
   * This results from the macro `has(request.auth)`.
   */
  'test_only': (boolean);
}

/**
 * An abstract representation of a common expression.
 * 
 * Expressions are abstractly represented as a collection of identifiers,
 * select statements, function calls, literals, and comprehensions. All
 * operators with the exception of the '.' operator are modelled as function
 * calls. This makes it easy to represent new operators into the existing AST.
 * 
 * All references within expressions must resolve to a [Decl][google.api.expr.v1alpha1.Decl] provided at
 * type-check for an expression to be valid. A reference may either be a bare
 * identifier `name` or a qualified identifier `google.api.name`. References
 * may either refer to a value or a function declaration.
 * 
 * For example, the expression `google.api.name.startsWith('expr')` references
 * the declaration `google.api.name` within a [Expr.Select][google.api.expr.v1alpha1.Expr.Select] expression, and
 * the function declaration `startsWith`.
 */
export interface Expr {
  /**
   * Required. An id assigned to this node by the parser which is unique in a
   * given expression tree. This is used to associate type information and other
   * attributes to a node in the parse tree.
   */
  'id'?: (number | string | Long);
  /**
   * A literal expression.
   */
  'const_expr'?: (_google_api_expr_v1alpha1_Constant | null);
  /**
   * An identifier expression.
   */
  'ident_expr'?: (_google_api_expr_v1alpha1_Expr_Ident | null);
  /**
   * A field selection expression, e.g. `request.auth`.
   */
  'select_expr'?: (_google_api_expr_v1alpha1_Expr_Select | null);
  /**
   * A call expression, including calls to predefined functions and operators.
   */
  'call_expr'?: (_google_api_expr_v1alpha1_Expr_Call | null);
  /**
   * A list creation expression.
   */
  'list_expr'?: (_google_api_expr_v1alpha1_Expr_CreateList | null);
  /**
   * A map or message creation expression.
   */
  'struct_expr'?: (_google_api_expr_v1alpha1_Expr_CreateStruct | null);
  /**
   * A comprehension expression.
   */
  'comprehension_expr'?: (_google_api_expr_v1alpha1_Expr_Comprehension | null);
  /**
   * Required. Variants of expressions.
   */
  'expr_kind'?: "const_expr"|"ident_expr"|"select_expr"|"call_expr"|"list_expr"|"struct_expr"|"comprehension_expr";
}

/**
 * An abstract representation of a common expression.
 * 
 * Expressions are abstractly represented as a collection of identifiers,
 * select statements, function calls, literals, and comprehensions. All
 * operators with the exception of the '.' operator are modelled as function
 * calls. This makes it easy to represent new operators into the existing AST.
 * 
 * All references within expressions must resolve to a [Decl][google.api.expr.v1alpha1.Decl] provided at
 * type-check for an expression to be valid. A reference may either be a bare
 * identifier `name` or a qualified identifier `google.api.name`. References
 * may either refer to a value or a function declaration.
 * 
 * For example, the expression `google.api.name.startsWith('expr')` references
 * the declaration `google.api.name` within a [Expr.Select][google.api.expr.v1alpha1.Expr.Select] expression, and
 * the function declaration `startsWith`.
 */
export interface Expr__Output {
  /**
   * Required. An id assigned to this node by the parser which is unique in a
   * given expression tree. This is used to associate type information and other
   * attributes to a node in the parse tree.
   */
  'id': (string);
  /**
   * A literal expression.
   */
  'const_expr'?: (_google_api_expr_v1alpha1_Constant__Output | null);
  /**
   * An identifier expression.
   */
  'ident_expr'?: (_google_api_expr_v1alpha1_Expr_Ident__Output | null);
  /**
   * A field selection expression, e.g. `request.auth`.
   */
  'select_expr'?: (_google_api_expr_v1alpha1_Expr_Select__Output | null);
  /**
   * A call expression, including calls to predefined functions and operators.
   */
  'call_expr'?: (_google_api_expr_v1alpha1_Expr_Call__Output | null);
  /**
   * A list creation expression.
   */
  'list_expr'?: (_google_api_expr_v1alpha1_Expr_CreateList__Output | null);
  /**
   * A map or message creation expression.
   */
  'struct_expr'?: (_google_api_expr_v1alpha1_Expr_CreateStruct__Output | null);
  /**
   * A comprehension expression.
   */
  'comprehension_expr'?: (_google_api_expr_v1alpha1_Expr_Comprehension__Output | null);
  /**
   * Required. Variants of expressions.
   */
  'expr_kind'?: "const_expr"|"ident_expr"|"select_expr"|"call_expr"|"list_expr"|"struct_expr"|"comprehension_expr";
}
