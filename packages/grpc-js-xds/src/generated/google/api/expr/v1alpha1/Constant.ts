// Original file: deps/googleapis/google/api/expr/v1alpha1/syntax.proto

import type { NullValue as _google_protobuf_NullValue, NullValue__Output as _google_protobuf_NullValue__Output } from '../../../../google/protobuf/NullValue';
import type { Duration as _google_protobuf_Duration, Duration__Output as _google_protobuf_Duration__Output } from '../../../../google/protobuf/Duration';
import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from '../../../../google/protobuf/Timestamp';
import type { Long } from '@grpc/proto-loader';

/**
 * Represents a primitive literal.
 * 
 * Named 'Constant' here for backwards compatibility.
 * 
 * This is similar as the primitives supported in the well-known type
 * `google.protobuf.Value`, but richer so it can represent CEL's full range of
 * primitives.
 * 
 * Lists and structs are not included as constants as these aggregate types may
 * contain [Expr][google.api.expr.v1alpha1.Expr] elements which require evaluation and are thus not constant.
 * 
 * Examples of literals include: `"hello"`, `b'bytes'`, `1u`, `4.2`, `-2`,
 * `true`, `null`.
 */
export interface Constant {
  /**
   * null value.
   */
  'null_value'?: (_google_protobuf_NullValue);
  /**
   * boolean value.
   */
  'bool_value'?: (boolean);
  /**
   * int64 value.
   */
  'int64_value'?: (number | string | Long);
  /**
   * uint64 value.
   */
  'uint64_value'?: (number | string | Long);
  /**
   * double value.
   */
  'double_value'?: (number | string);
  /**
   * string value.
   */
  'string_value'?: (string);
  /**
   * bytes value.
   */
  'bytes_value'?: (Buffer | Uint8Array | string);
  /**
   * protobuf.Duration value.
   * 
   * Deprecated: duration is no longer considered a builtin cel type.
   * @deprecated
   */
  'duration_value'?: (_google_protobuf_Duration | null);
  /**
   * protobuf.Timestamp value.
   * 
   * Deprecated: timestamp is no longer considered a builtin cel type.
   * @deprecated
   */
  'timestamp_value'?: (_google_protobuf_Timestamp | null);
  /**
   * Required. The valid constant kinds.
   */
  'constant_kind'?: "null_value"|"bool_value"|"int64_value"|"uint64_value"|"double_value"|"string_value"|"bytes_value"|"duration_value"|"timestamp_value";
}

/**
 * Represents a primitive literal.
 * 
 * Named 'Constant' here for backwards compatibility.
 * 
 * This is similar as the primitives supported in the well-known type
 * `google.protobuf.Value`, but richer so it can represent CEL's full range of
 * primitives.
 * 
 * Lists and structs are not included as constants as these aggregate types may
 * contain [Expr][google.api.expr.v1alpha1.Expr] elements which require evaluation and are thus not constant.
 * 
 * Examples of literals include: `"hello"`, `b'bytes'`, `1u`, `4.2`, `-2`,
 * `true`, `null`.
 */
export interface Constant__Output {
  /**
   * null value.
   */
  'null_value'?: (_google_protobuf_NullValue__Output);
  /**
   * boolean value.
   */
  'bool_value'?: (boolean);
  /**
   * int64 value.
   */
  'int64_value'?: (string);
  /**
   * uint64 value.
   */
  'uint64_value'?: (string);
  /**
   * double value.
   */
  'double_value'?: (number);
  /**
   * string value.
   */
  'string_value'?: (string);
  /**
   * bytes value.
   */
  'bytes_value'?: (Buffer);
  /**
   * protobuf.Duration value.
   * 
   * Deprecated: duration is no longer considered a builtin cel type.
   * @deprecated
   */
  'duration_value'?: (_google_protobuf_Duration__Output | null);
  /**
   * protobuf.Timestamp value.
   * 
   * Deprecated: timestamp is no longer considered a builtin cel type.
   * @deprecated
   */
  'timestamp_value'?: (_google_protobuf_Timestamp__Output | null);
  /**
   * Required. The valid constant kinds.
   */
  'constant_kind'?: "null_value"|"bool_value"|"int64_value"|"uint64_value"|"double_value"|"string_value"|"bytes_value"|"duration_value"|"timestamp_value";
}
