// Original file: deps/envoy-api/envoy/admin/v3/config_dump_shared.proto

import type { Any as _google_protobuf_Any, Any__Output as _google_protobuf_Any__Output } from '../../../google/protobuf/Any';
import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from '../../../google/protobuf/Timestamp';

export interface UpdateFailureState {
  /**
   * What the component configuration would have been if the update had succeeded.
   * This field may not be populated by xDS clients due to storage overhead.
   */
  'failed_configuration'?: (_google_protobuf_Any | null);
  /**
   * Time of the latest failed update attempt.
   */
  'last_update_attempt'?: (_google_protobuf_Timestamp | null);
  /**
   * Details about the last failed update attempt.
   */
  'details'?: (string);
  /**
   * This is the version of the rejected resource.
   * [#not-implemented-hide:]
   */
  'version_info'?: (string);
}

export interface UpdateFailureState__Output {
  /**
   * What the component configuration would have been if the update had succeeded.
   * This field may not be populated by xDS clients due to storage overhead.
   */
  'failed_configuration': (_google_protobuf_Any__Output | null);
  /**
   * Time of the latest failed update attempt.
   */
  'last_update_attempt': (_google_protobuf_Timestamp__Output | null);
  /**
   * Details about the last failed update attempt.
   */
  'details': (string);
  /**
   * This is the version of the rejected resource.
   * [#not-implemented-hide:]
   */
  'version_info': (string);
}
