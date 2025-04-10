// Original file: deps/googleapis/google/api/expr/v1alpha1/checked.proto

import type { Empty as _google_protobuf_Empty, Empty__Output as _google_protobuf_Empty__Output } from '../../../../google/protobuf/Empty';
import type { NullValue as _google_protobuf_NullValue, NullValue__Output as _google_protobuf_NullValue__Output } from '../../../../google/protobuf/NullValue';
import type { Type as _google_api_expr_v1alpha1_Type, Type__Output as _google_api_expr_v1alpha1_Type__Output } from '../../../../google/api/expr/v1alpha1/Type';

/**
 * Application defined abstract type.
 */
export interface _google_api_expr_v1alpha1_Type_AbstractType {
  /**
   * The fully qualified name of this abstract type.
   */
  'name'?: (string);
  /**
   * Parameter types for this abstract type.
   */
  'parameter_types'?: (_google_api_expr_v1alpha1_Type)[];
}

/**
 * Application defined abstract type.
 */
export interface _google_api_expr_v1alpha1_Type_AbstractType__Output {
  /**
   * The fully qualified name of this abstract type.
   */
  'name': (string);
  /**
   * Parameter types for this abstract type.
   */
  'parameter_types': (_google_api_expr_v1alpha1_Type__Output)[];
}

/**
 * Function type with result and arg types.
 */
export interface _google_api_expr_v1alpha1_Type_FunctionType {
  /**
   * Result type of the function.
   */
  'result_type'?: (_google_api_expr_v1alpha1_Type | null);
  /**
   * Argument types of the function.
   */
  'arg_types'?: (_google_api_expr_v1alpha1_Type)[];
}

/**
 * Function type with result and arg types.
 */
export interface _google_api_expr_v1alpha1_Type_FunctionType__Output {
  /**
   * Result type of the function.
   */
  'result_type': (_google_api_expr_v1alpha1_Type__Output | null);
  /**
   * Argument types of the function.
   */
  'arg_types': (_google_api_expr_v1alpha1_Type__Output)[];
}

/**
 * List type with typed elements, e.g. `list<example.proto.MyMessage>`.
 */
export interface _google_api_expr_v1alpha1_Type_ListType {
  /**
   * The element type.
   */
  'elem_type'?: (_google_api_expr_v1alpha1_Type | null);
}

/**
 * List type with typed elements, e.g. `list<example.proto.MyMessage>`.
 */
export interface _google_api_expr_v1alpha1_Type_ListType__Output {
  /**
   * The element type.
   */
  'elem_type': (_google_api_expr_v1alpha1_Type__Output | null);
}

/**
 * Map type with parameterized key and value types, e.g. `map<string, int>`.
 */
export interface _google_api_expr_v1alpha1_Type_MapType {
  /**
   * The type of the key.
   */
  'key_type'?: (_google_api_expr_v1alpha1_Type | null);
  /**
   * The type of the value.
   */
  'value_type'?: (_google_api_expr_v1alpha1_Type | null);
}

/**
 * Map type with parameterized key and value types, e.g. `map<string, int>`.
 */
export interface _google_api_expr_v1alpha1_Type_MapType__Output {
  /**
   * The type of the key.
   */
  'key_type': (_google_api_expr_v1alpha1_Type__Output | null);
  /**
   * The type of the value.
   */
  'value_type': (_google_api_expr_v1alpha1_Type__Output | null);
}

// Original file: deps/googleapis/google/api/expr/v1alpha1/checked.proto

/**
 * CEL primitive types.
 */
export const _google_api_expr_v1alpha1_Type_PrimitiveType = {
  /**
   * Unspecified type.
   */
  PRIMITIVE_TYPE_UNSPECIFIED: 'PRIMITIVE_TYPE_UNSPECIFIED',
  /**
   * Boolean type.
   */
  BOOL: 'BOOL',
  /**
   * Int64 type.
   * 
   * Proto-based integer values are widened to int64.
   */
  INT64: 'INT64',
  /**
   * Uint64 type.
   * 
   * Proto-based unsigned integer values are widened to uint64.
   */
  UINT64: 'UINT64',
  /**
   * Double type.
   * 
   * Proto-based float values are widened to double values.
   */
  DOUBLE: 'DOUBLE',
  /**
   * String type.
   */
  STRING: 'STRING',
  /**
   * Bytes type.
   */
  BYTES: 'BYTES',
} as const;

/**
 * CEL primitive types.
 */
export type _google_api_expr_v1alpha1_Type_PrimitiveType =
  /**
   * Unspecified type.
   */
  | 'PRIMITIVE_TYPE_UNSPECIFIED'
  | 0
  /**
   * Boolean type.
   */
  | 'BOOL'
  | 1
  /**
   * Int64 type.
   * 
   * Proto-based integer values are widened to int64.
   */
  | 'INT64'
  | 2
  /**
   * Uint64 type.
   * 
   * Proto-based unsigned integer values are widened to uint64.
   */
  | 'UINT64'
  | 3
  /**
   * Double type.
   * 
   * Proto-based float values are widened to double values.
   */
  | 'DOUBLE'
  | 4
  /**
   * String type.
   */
  | 'STRING'
  | 5
  /**
   * Bytes type.
   */
  | 'BYTES'
  | 6

/**
 * CEL primitive types.
 */
export type _google_api_expr_v1alpha1_Type_PrimitiveType__Output = typeof _google_api_expr_v1alpha1_Type_PrimitiveType[keyof typeof _google_api_expr_v1alpha1_Type_PrimitiveType]

// Original file: deps/googleapis/google/api/expr/v1alpha1/checked.proto

/**
 * Well-known protobuf types treated with first-class support in CEL.
 */
export const _google_api_expr_v1alpha1_Type_WellKnownType = {
  /**
   * Unspecified type.
   */
  WELL_KNOWN_TYPE_UNSPECIFIED: 'WELL_KNOWN_TYPE_UNSPECIFIED',
  /**
   * Well-known protobuf.Any type.
   * 
   * Any types are a polymorphic message type. During type-checking they are
   * treated like `DYN` types, but at runtime they are resolved to a specific
   * message type specified at evaluation time.
   */
  ANY: 'ANY',
  /**
   * Well-known protobuf.Timestamp type, internally referenced as `timestamp`.
   */
  TIMESTAMP: 'TIMESTAMP',
  /**
   * Well-known protobuf.Duration type, internally referenced as `duration`.
   */
  DURATION: 'DURATION',
} as const;

/**
 * Well-known protobuf types treated with first-class support in CEL.
 */
export type _google_api_expr_v1alpha1_Type_WellKnownType =
  /**
   * Unspecified type.
   */
  | 'WELL_KNOWN_TYPE_UNSPECIFIED'
  | 0
  /**
   * Well-known protobuf.Any type.
   * 
   * Any types are a polymorphic message type. During type-checking they are
   * treated like `DYN` types, but at runtime they are resolved to a specific
   * message type specified at evaluation time.
   */
  | 'ANY'
  | 1
  /**
   * Well-known protobuf.Timestamp type, internally referenced as `timestamp`.
   */
  | 'TIMESTAMP'
  | 2
  /**
   * Well-known protobuf.Duration type, internally referenced as `duration`.
   */
  | 'DURATION'
  | 3

/**
 * Well-known protobuf types treated with first-class support in CEL.
 */
export type _google_api_expr_v1alpha1_Type_WellKnownType__Output = typeof _google_api_expr_v1alpha1_Type_WellKnownType[keyof typeof _google_api_expr_v1alpha1_Type_WellKnownType]

/**
 * Represents a CEL type.
 */
export interface Type {
  /**
   * Dynamic type.
   */
  'dyn'?: (_google_protobuf_Empty | null);
  /**
   * Null value.
   */
  'null'?: (_google_protobuf_NullValue);
  /**
   * Primitive types: `true`, `1u`, `-2.0`, `'string'`, `b'bytes'`.
   */
  'primitive'?: (_google_api_expr_v1alpha1_Type_PrimitiveType);
  /**
   * Wrapper of a primitive type, e.g. `google.protobuf.Int64Value`.
   */
  'wrapper'?: (_google_api_expr_v1alpha1_Type_PrimitiveType);
  /**
   * Well-known protobuf type such as `google.protobuf.Timestamp`.
   */
  'well_known'?: (_google_api_expr_v1alpha1_Type_WellKnownType);
  /**
   * Parameterized list with elements of `list_type`, e.g. `list<timestamp>`.
   */
  'list_type'?: (_google_api_expr_v1alpha1_Type_ListType | null);
  /**
   * Parameterized map with typed keys and values.
   */
  'map_type'?: (_google_api_expr_v1alpha1_Type_MapType | null);
  /**
   * Function type.
   */
  'function'?: (_google_api_expr_v1alpha1_Type_FunctionType | null);
  /**
   * Protocol buffer message type.
   * 
   * The `message_type` string specifies the qualified message type name. For
   * example, `google.plus.Profile`.
   */
  'message_type'?: (string);
  /**
   * Type param type.
   * 
   * The `type_param` string specifies the type parameter name, e.g. `list<E>`
   * would be a `list_type` whose element type was a `type_param` type
   * named `E`.
   */
  'type_param'?: (string);
  /**
   * Type type.
   * 
   * The `type` value specifies the target type. e.g. int is type with a
   * target type of `Primitive.INT`.
   */
  'type'?: (_google_api_expr_v1alpha1_Type | null);
  /**
   * Error type.
   * 
   * During type-checking if an expression is an error, its type is propagated
   * as the `ERROR` type. This permits the type-checker to discover other
   * errors present in the expression.
   */
  'error'?: (_google_protobuf_Empty | null);
  /**
   * Abstract, application defined type.
   */
  'abstract_type'?: (_google_api_expr_v1alpha1_Type_AbstractType | null);
  /**
   * The kind of type.
   */
  'type_kind'?: "dyn"|"null"|"primitive"|"wrapper"|"well_known"|"list_type"|"map_type"|"function"|"message_type"|"type_param"|"type"|"error"|"abstract_type";
}

/**
 * Represents a CEL type.
 */
export interface Type__Output {
  /**
   * Dynamic type.
   */
  'dyn'?: (_google_protobuf_Empty__Output | null);
  /**
   * Null value.
   */
  'null'?: (_google_protobuf_NullValue__Output);
  /**
   * Primitive types: `true`, `1u`, `-2.0`, `'string'`, `b'bytes'`.
   */
  'primitive'?: (_google_api_expr_v1alpha1_Type_PrimitiveType__Output);
  /**
   * Wrapper of a primitive type, e.g. `google.protobuf.Int64Value`.
   */
  'wrapper'?: (_google_api_expr_v1alpha1_Type_PrimitiveType__Output);
  /**
   * Well-known protobuf type such as `google.protobuf.Timestamp`.
   */
  'well_known'?: (_google_api_expr_v1alpha1_Type_WellKnownType__Output);
  /**
   * Parameterized list with elements of `list_type`, e.g. `list<timestamp>`.
   */
  'list_type'?: (_google_api_expr_v1alpha1_Type_ListType__Output | null);
  /**
   * Parameterized map with typed keys and values.
   */
  'map_type'?: (_google_api_expr_v1alpha1_Type_MapType__Output | null);
  /**
   * Function type.
   */
  'function'?: (_google_api_expr_v1alpha1_Type_FunctionType__Output | null);
  /**
   * Protocol buffer message type.
   * 
   * The `message_type` string specifies the qualified message type name. For
   * example, `google.plus.Profile`.
   */
  'message_type'?: (string);
  /**
   * Type param type.
   * 
   * The `type_param` string specifies the type parameter name, e.g. `list<E>`
   * would be a `list_type` whose element type was a `type_param` type
   * named `E`.
   */
  'type_param'?: (string);
  /**
   * Type type.
   * 
   * The `type` value specifies the target type. e.g. int is type with a
   * target type of `Primitive.INT`.
   */
  'type'?: (_google_api_expr_v1alpha1_Type__Output | null);
  /**
   * Error type.
   * 
   * During type-checking if an expression is an error, its type is propagated
   * as the `ERROR` type. This permits the type-checker to discover other
   * errors present in the expression.
   */
  'error'?: (_google_protobuf_Empty__Output | null);
  /**
   * Abstract, application defined type.
   */
  'abstract_type'?: (_google_api_expr_v1alpha1_Type_AbstractType__Output | null);
  /**
   * The kind of type.
   */
  'type_kind'?: "dyn"|"null"|"primitive"|"wrapper"|"well_known"|"list_type"|"map_type"|"function"|"message_type"|"type_param"|"type"|"error"|"abstract_type";
}
