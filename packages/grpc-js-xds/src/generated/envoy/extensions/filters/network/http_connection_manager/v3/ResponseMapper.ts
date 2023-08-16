// Original file: deps/envoy-api/envoy/extensions/filters/network/http_connection_manager/v3/http_connection_manager.proto

import type { AccessLogFilter as _envoy_config_accesslog_v3_AccessLogFilter, AccessLogFilter__Output as _envoy_config_accesslog_v3_AccessLogFilter__Output } from '../../../../../../envoy/config/accesslog/v3/AccessLogFilter';
import type { UInt32Value as _google_protobuf_UInt32Value, UInt32Value__Output as _google_protobuf_UInt32Value__Output } from '../../../../../../google/protobuf/UInt32Value';
import type { DataSource as _envoy_config_core_v3_DataSource, DataSource__Output as _envoy_config_core_v3_DataSource__Output } from '../../../../../../envoy/config/core/v3/DataSource';
import type { SubstitutionFormatString as _envoy_config_core_v3_SubstitutionFormatString, SubstitutionFormatString__Output as _envoy_config_core_v3_SubstitutionFormatString__Output } from '../../../../../../envoy/config/core/v3/SubstitutionFormatString';
import type { HeaderValueOption as _envoy_config_core_v3_HeaderValueOption, HeaderValueOption__Output as _envoy_config_core_v3_HeaderValueOption__Output } from '../../../../../../envoy/config/core/v3/HeaderValueOption';

/**
 * The configuration to filter and change local response.
 * [#next-free-field: 6]
 */
export interface ResponseMapper {
  /**
   * Filter to determine if this mapper should apply.
   */
  'filter'?: (_envoy_config_accesslog_v3_AccessLogFilter | null);
  /**
   * The new response status code if specified.
   */
  'status_code'?: (_google_protobuf_UInt32Value | null);
  /**
   * The new local reply body text if specified. It will be used in the ``%LOCAL_REPLY_BODY%``
   * command operator in the ``body_format``.
   */
  'body'?: (_envoy_config_core_v3_DataSource | null);
  /**
   * A per mapper ``body_format`` to override the :ref:`body_format <envoy_v3_api_field_extensions.filters.network.http_connection_manager.v3.LocalReplyConfig.body_format>`.
   * It will be used when this mapper is matched.
   */
  'body_format_override'?: (_envoy_config_core_v3_SubstitutionFormatString | null);
  /**
   * HTTP headers to add to a local reply. This allows the response mapper to append, to add
   * or to override headers of any local reply before it is sent to a downstream client.
   */
  'headers_to_add'?: (_envoy_config_core_v3_HeaderValueOption)[];
}

/**
 * The configuration to filter and change local response.
 * [#next-free-field: 6]
 */
export interface ResponseMapper__Output {
  /**
   * Filter to determine if this mapper should apply.
   */
  'filter': (_envoy_config_accesslog_v3_AccessLogFilter__Output | null);
  /**
   * The new response status code if specified.
   */
  'status_code': (_google_protobuf_UInt32Value__Output | null);
  /**
   * The new local reply body text if specified. It will be used in the ``%LOCAL_REPLY_BODY%``
   * command operator in the ``body_format``.
   */
  'body': (_envoy_config_core_v3_DataSource__Output | null);
  /**
   * A per mapper ``body_format`` to override the :ref:`body_format <envoy_v3_api_field_extensions.filters.network.http_connection_manager.v3.LocalReplyConfig.body_format>`.
   * It will be used when this mapper is matched.
   */
  'body_format_override': (_envoy_config_core_v3_SubstitutionFormatString__Output | null);
  /**
   * HTTP headers to add to a local reply. This allows the response mapper to append, to add
   * or to override headers of any local reply before it is sent to a downstream client.
   */
  'headers_to_add': (_envoy_config_core_v3_HeaderValueOption__Output)[];
}
