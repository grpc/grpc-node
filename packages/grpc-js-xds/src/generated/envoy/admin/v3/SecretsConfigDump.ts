// Original file: deps/envoy-api/envoy/admin/v3/config_dump.proto

import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from '../../../google/protobuf/Timestamp';
import type { Any as _google_protobuf_Any, Any__Output as _google_protobuf_Any__Output } from '../../../google/protobuf/Any';
import type { UpdateFailureState as _envoy_admin_v3_UpdateFailureState, UpdateFailureState__Output as _envoy_admin_v3_UpdateFailureState__Output } from '../../../envoy/admin/v3/UpdateFailureState';
import type { ClientResourceStatus as _envoy_admin_v3_ClientResourceStatus } from '../../../envoy/admin/v3/ClientResourceStatus';

/**
 * DynamicSecret contains secret information fetched via SDS.
 * [#next-free-field: 7]
 */
export interface _envoy_admin_v3_SecretsConfigDump_DynamicSecret {
  /**
   * The name assigned to the secret.
   */
  'name'?: (string);
  /**
   * This is the per-resource version information.
   */
  'version_info'?: (string);
  /**
   * The timestamp when the secret was last updated.
   */
  'last_updated'?: (_google_protobuf_Timestamp | null);
  /**
   * The actual secret information.
   * Security sensitive information is redacted (replaced with "[redacted]") for
   * private keys and passwords in TLS certificates.
   */
  'secret'?: (_google_protobuf_Any | null);
  /**
   * Set if the last update failed, cleared after the next successful update.
   * The *error_state* field contains the rejected version of this particular
   * resource along with the reason and timestamp. For successfully updated or
   * acknowledged resource, this field should be empty.
   * [#not-implemented-hide:]
   */
  'error_state'?: (_envoy_admin_v3_UpdateFailureState | null);
  /**
   * The client status of this resource.
   * [#not-implemented-hide:]
   */
  'client_status'?: (_envoy_admin_v3_ClientResourceStatus | keyof typeof _envoy_admin_v3_ClientResourceStatus);
}

/**
 * DynamicSecret contains secret information fetched via SDS.
 * [#next-free-field: 7]
 */
export interface _envoy_admin_v3_SecretsConfigDump_DynamicSecret__Output {
  /**
   * The name assigned to the secret.
   */
  'name': (string);
  /**
   * This is the per-resource version information.
   */
  'version_info': (string);
  /**
   * The timestamp when the secret was last updated.
   */
  'last_updated': (_google_protobuf_Timestamp__Output | null);
  /**
   * The actual secret information.
   * Security sensitive information is redacted (replaced with "[redacted]") for
   * private keys and passwords in TLS certificates.
   */
  'secret': (_google_protobuf_Any__Output | null);
  /**
   * Set if the last update failed, cleared after the next successful update.
   * The *error_state* field contains the rejected version of this particular
   * resource along with the reason and timestamp. For successfully updated or
   * acknowledged resource, this field should be empty.
   * [#not-implemented-hide:]
   */
  'error_state': (_envoy_admin_v3_UpdateFailureState__Output | null);
  /**
   * The client status of this resource.
   * [#not-implemented-hide:]
   */
  'client_status': (keyof typeof _envoy_admin_v3_ClientResourceStatus);
}

/**
 * StaticSecret specifies statically loaded secret in bootstrap.
 */
export interface _envoy_admin_v3_SecretsConfigDump_StaticSecret {
  /**
   * The name assigned to the secret.
   */
  'name'?: (string);
  /**
   * The timestamp when the secret was last updated.
   */
  'last_updated'?: (_google_protobuf_Timestamp | null);
  /**
   * The actual secret information.
   * Security sensitive information is redacted (replaced with "[redacted]") for
   * private keys and passwords in TLS certificates.
   */
  'secret'?: (_google_protobuf_Any | null);
}

/**
 * StaticSecret specifies statically loaded secret in bootstrap.
 */
export interface _envoy_admin_v3_SecretsConfigDump_StaticSecret__Output {
  /**
   * The name assigned to the secret.
   */
  'name': (string);
  /**
   * The timestamp when the secret was last updated.
   */
  'last_updated': (_google_protobuf_Timestamp__Output | null);
  /**
   * The actual secret information.
   * Security sensitive information is redacted (replaced with "[redacted]") for
   * private keys and passwords in TLS certificates.
   */
  'secret': (_google_protobuf_Any__Output | null);
}

/**
 * Envoys SDS implementation fills this message with all secrets fetched dynamically via SDS.
 */
export interface SecretsConfigDump {
  /**
   * The statically loaded secrets.
   */
  'static_secrets'?: (_envoy_admin_v3_SecretsConfigDump_StaticSecret)[];
  /**
   * The dynamically loaded active secrets. These are secrets that are available to service
   * clusters or listeners.
   */
  'dynamic_active_secrets'?: (_envoy_admin_v3_SecretsConfigDump_DynamicSecret)[];
  /**
   * The dynamically loaded warming secrets. These are secrets that are currently undergoing
   * warming in preparation to service clusters or listeners.
   */
  'dynamic_warming_secrets'?: (_envoy_admin_v3_SecretsConfigDump_DynamicSecret)[];
}

/**
 * Envoys SDS implementation fills this message with all secrets fetched dynamically via SDS.
 */
export interface SecretsConfigDump__Output {
  /**
   * The statically loaded secrets.
   */
  'static_secrets': (_envoy_admin_v3_SecretsConfigDump_StaticSecret__Output)[];
  /**
   * The dynamically loaded active secrets. These are secrets that are available to service
   * clusters or listeners.
   */
  'dynamic_active_secrets': (_envoy_admin_v3_SecretsConfigDump_DynamicSecret__Output)[];
  /**
   * The dynamically loaded warming secrets. These are secrets that are currently undergoing
   * warming in preparation to service clusters or listeners.
   */
  'dynamic_warming_secrets': (_envoy_admin_v3_SecretsConfigDump_DynamicSecret__Output)[];
}
