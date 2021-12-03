// Original file: deps/envoy-api/envoy/config/overload/v3/overload.proto

import type { Trigger as _envoy_config_overload_v3_Trigger, Trigger__Output as _envoy_config_overload_v3_Trigger__Output } from '../../../../envoy/config/overload/v3/Trigger';
import type { Any as _google_protobuf_Any, Any__Output as _google_protobuf_Any__Output } from '../../../../google/protobuf/Any';

export interface OverloadAction {
  /**
   * The name of the overload action. This is just a well-known string that listeners can
   * use for registering callbacks. Custom overload actions should be named using reverse
   * DNS to ensure uniqueness.
   */
  'name'?: (string);
  /**
   * A set of triggers for this action. The state of the action is the maximum
   * state of all triggers, which can be scaling between 0 and 1 or saturated. Listeners
   * are notified when the overload action changes state.
   */
  'triggers'?: (_envoy_config_overload_v3_Trigger)[];
  /**
   * Configuration for the action being instantiated.
   */
  'typed_config'?: (_google_protobuf_Any | null);
}

export interface OverloadAction__Output {
  /**
   * The name of the overload action. This is just a well-known string that listeners can
   * use for registering callbacks. Custom overload actions should be named using reverse
   * DNS to ensure uniqueness.
   */
  'name': (string);
  /**
   * A set of triggers for this action. The state of the action is the maximum
   * state of all triggers, which can be scaling between 0 and 1 or saturated. Listeners
   * are notified when the overload action changes state.
   */
  'triggers': (_envoy_config_overload_v3_Trigger__Output)[];
  /**
   * Configuration for the action being instantiated.
   */
  'typed_config': (_google_protobuf_Any__Output | null);
}
