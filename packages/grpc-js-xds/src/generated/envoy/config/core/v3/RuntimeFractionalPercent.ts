// Original file: deps/envoy-api/envoy/config/core/v3/base.proto

import type { FractionalPercent as _envoy_type_v3_FractionalPercent, FractionalPercent__Output as _envoy_type_v3_FractionalPercent__Output } from '../../../../envoy/type/v3/FractionalPercent';

/**
 * Runtime derived FractionalPercent with defaults for when the numerator or denominator is not
 * specified via a runtime key.
 * 
 * .. note::
 * 
 * Parsing of the runtime key's data is implemented such that it may be represented as a
 * :ref:`FractionalPercent <envoy_v3_api_msg_type.v3.FractionalPercent>` proto represented as JSON/YAML
 * and may also be represented as an integer with the assumption that the value is an integral
 * percentage out of 100. For instance, a runtime key lookup returning the value "42" would parse
 * as a ``FractionalPercent`` whose numerator is 42 and denominator is HUNDRED.
 */
export interface RuntimeFractionalPercent {
  /**
   * Default value if the runtime value's for the numerator/denominator keys are not available.
   */
  'default_value'?: (_envoy_type_v3_FractionalPercent | null);
  /**
   * Runtime key for a YAML representation of a FractionalPercent.
   */
  'runtime_key'?: (string);
}

/**
 * Runtime derived FractionalPercent with defaults for when the numerator or denominator is not
 * specified via a runtime key.
 * 
 * .. note::
 * 
 * Parsing of the runtime key's data is implemented such that it may be represented as a
 * :ref:`FractionalPercent <envoy_v3_api_msg_type.v3.FractionalPercent>` proto represented as JSON/YAML
 * and may also be represented as an integer with the assumption that the value is an integral
 * percentage out of 100. For instance, a runtime key lookup returning the value "42" would parse
 * as a ``FractionalPercent`` whose numerator is 42 and denominator is HUNDRED.
 */
export interface RuntimeFractionalPercent__Output {
  /**
   * Default value if the runtime value's for the numerator/denominator keys are not available.
   */
  'default_value': (_envoy_type_v3_FractionalPercent__Output | null);
  /**
   * Runtime key for a YAML representation of a FractionalPercent.
   */
  'runtime_key': (string);
}
