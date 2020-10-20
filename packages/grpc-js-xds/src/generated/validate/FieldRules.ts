// Original file: deps/protoc-gen-validate/validate/validate.proto

import { FloatRules as _validate_FloatRules, FloatRules__Output as _validate_FloatRules__Output } from '../validate/FloatRules';
import { DoubleRules as _validate_DoubleRules, DoubleRules__Output as _validate_DoubleRules__Output } from '../validate/DoubleRules';
import { Int32Rules as _validate_Int32Rules, Int32Rules__Output as _validate_Int32Rules__Output } from '../validate/Int32Rules';
import { Int64Rules as _validate_Int64Rules, Int64Rules__Output as _validate_Int64Rules__Output } from '../validate/Int64Rules';
import { UInt32Rules as _validate_UInt32Rules, UInt32Rules__Output as _validate_UInt32Rules__Output } from '../validate/UInt32Rules';
import { UInt64Rules as _validate_UInt64Rules, UInt64Rules__Output as _validate_UInt64Rules__Output } from '../validate/UInt64Rules';
import { SInt32Rules as _validate_SInt32Rules, SInt32Rules__Output as _validate_SInt32Rules__Output } from '../validate/SInt32Rules';
import { SInt64Rules as _validate_SInt64Rules, SInt64Rules__Output as _validate_SInt64Rules__Output } from '../validate/SInt64Rules';
import { Fixed32Rules as _validate_Fixed32Rules, Fixed32Rules__Output as _validate_Fixed32Rules__Output } from '../validate/Fixed32Rules';
import { Fixed64Rules as _validate_Fixed64Rules, Fixed64Rules__Output as _validate_Fixed64Rules__Output } from '../validate/Fixed64Rules';
import { SFixed32Rules as _validate_SFixed32Rules, SFixed32Rules__Output as _validate_SFixed32Rules__Output } from '../validate/SFixed32Rules';
import { SFixed64Rules as _validate_SFixed64Rules, SFixed64Rules__Output as _validate_SFixed64Rules__Output } from '../validate/SFixed64Rules';
import { BoolRules as _validate_BoolRules, BoolRules__Output as _validate_BoolRules__Output } from '../validate/BoolRules';
import { StringRules as _validate_StringRules, StringRules__Output as _validate_StringRules__Output } from '../validate/StringRules';
import { BytesRules as _validate_BytesRules, BytesRules__Output as _validate_BytesRules__Output } from '../validate/BytesRules';
import { EnumRules as _validate_EnumRules, EnumRules__Output as _validate_EnumRules__Output } from '../validate/EnumRules';
import { MessageRules as _validate_MessageRules, MessageRules__Output as _validate_MessageRules__Output } from '../validate/MessageRules';
import { RepeatedRules as _validate_RepeatedRules, RepeatedRules__Output as _validate_RepeatedRules__Output } from '../validate/RepeatedRules';
import { MapRules as _validate_MapRules, MapRules__Output as _validate_MapRules__Output } from '../validate/MapRules';
import { AnyRules as _validate_AnyRules, AnyRules__Output as _validate_AnyRules__Output } from '../validate/AnyRules';
import { DurationRules as _validate_DurationRules, DurationRules__Output as _validate_DurationRules__Output } from '../validate/DurationRules';
import { TimestampRules as _validate_TimestampRules, TimestampRules__Output as _validate_TimestampRules__Output } from '../validate/TimestampRules';
import { Long } from '@grpc/proto-loader';

/**
 * FieldRules encapsulates the rules for each type of field. Depending on the
 * field, the correct set should be used to ensure proper validations.
 */
export interface FieldRules {
  /**
   * Scalar Field Types
   */
  'float'?: (_validate_FloatRules);
  'double'?: (_validate_DoubleRules);
  'int32'?: (_validate_Int32Rules);
  'int64'?: (_validate_Int64Rules);
  'uint32'?: (_validate_UInt32Rules);
  'uint64'?: (_validate_UInt64Rules);
  'sint32'?: (_validate_SInt32Rules);
  'sint64'?: (_validate_SInt64Rules);
  'fixed32'?: (_validate_Fixed32Rules);
  'fixed64'?: (_validate_Fixed64Rules);
  'sfixed32'?: (_validate_SFixed32Rules);
  'sfixed64'?: (_validate_SFixed64Rules);
  'bool'?: (_validate_BoolRules);
  'string'?: (_validate_StringRules);
  'bytes'?: (_validate_BytesRules);
  /**
   * Complex Field Types
   */
  'enum'?: (_validate_EnumRules);
  'message'?: (_validate_MessageRules);
  'repeated'?: (_validate_RepeatedRules);
  'map'?: (_validate_MapRules);
  /**
   * Well-Known Field Types
   */
  'any'?: (_validate_AnyRules);
  'duration'?: (_validate_DurationRules);
  'timestamp'?: (_validate_TimestampRules);
  'type'?: "float"|"double"|"int32"|"int64"|"uint32"|"uint64"|"sint32"|"sint64"|"fixed32"|"fixed64"|"sfixed32"|"sfixed64"|"bool"|"string"|"bytes"|"enum"|"repeated"|"map"|"any"|"duration"|"timestamp";
}

/**
 * FieldRules encapsulates the rules for each type of field. Depending on the
 * field, the correct set should be used to ensure proper validations.
 */
export interface FieldRules__Output {
  /**
   * Scalar Field Types
   */
  'float'?: (_validate_FloatRules__Output);
  'double'?: (_validate_DoubleRules__Output);
  'int32'?: (_validate_Int32Rules__Output);
  'int64'?: (_validate_Int64Rules__Output);
  'uint32'?: (_validate_UInt32Rules__Output);
  'uint64'?: (_validate_UInt64Rules__Output);
  'sint32'?: (_validate_SInt32Rules__Output);
  'sint64'?: (_validate_SInt64Rules__Output);
  'fixed32'?: (_validate_Fixed32Rules__Output);
  'fixed64'?: (_validate_Fixed64Rules__Output);
  'sfixed32'?: (_validate_SFixed32Rules__Output);
  'sfixed64'?: (_validate_SFixed64Rules__Output);
  'bool'?: (_validate_BoolRules__Output);
  'string'?: (_validate_StringRules__Output);
  'bytes'?: (_validate_BytesRules__Output);
  /**
   * Complex Field Types
   */
  'enum'?: (_validate_EnumRules__Output);
  'message'?: (_validate_MessageRules__Output);
  'repeated'?: (_validate_RepeatedRules__Output);
  'map'?: (_validate_MapRules__Output);
  /**
   * Well-Known Field Types
   */
  'any'?: (_validate_AnyRules__Output);
  'duration'?: (_validate_DurationRules__Output);
  'timestamp'?: (_validate_TimestampRules__Output);
  'type': "float"|"double"|"int32"|"int64"|"uint32"|"uint64"|"sint32"|"sint64"|"fixed32"|"fixed64"|"sfixed32"|"sfixed64"|"bool"|"string"|"bytes"|"enum"|"repeated"|"map"|"any"|"duration"|"timestamp";
}
