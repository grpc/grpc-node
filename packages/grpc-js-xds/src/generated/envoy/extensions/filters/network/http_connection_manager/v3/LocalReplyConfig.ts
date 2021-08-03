// Original file: deps/envoy-api/envoy/extensions/filters/network/http_connection_manager/v3/http_connection_manager.proto

import type { ResponseMapper as _envoy_extensions_filters_network_http_connection_manager_v3_ResponseMapper, ResponseMapper__Output as _envoy_extensions_filters_network_http_connection_manager_v3_ResponseMapper__Output } from '../../../../../../envoy/extensions/filters/network/http_connection_manager/v3/ResponseMapper';
import type { SubstitutionFormatString as _envoy_config_core_v3_SubstitutionFormatString, SubstitutionFormatString__Output as _envoy_config_core_v3_SubstitutionFormatString__Output } from '../../../../../../envoy/config/core/v3/SubstitutionFormatString';

/**
 * The configuration to customize local reply returned by Envoy.
 */
export interface LocalReplyConfig {
  /**
   * Configuration of list of mappers which allows to filter and change local response.
   * The mappers will be checked by the specified order until one is matched.
   */
  'mappers'?: (_envoy_extensions_filters_network_http_connection_manager_v3_ResponseMapper)[];
  /**
   * The configuration to form response body from the :ref:`command operators <config_access_log_command_operators>`
   * and to specify response content type as one of: plain/text or application/json.
   * 
   * Example one: "plain/text" ``body_format``.
   * 
   * .. validated-code-block:: yaml
   * :type-name: envoy.config.core.v3.SubstitutionFormatString
   * 
   * text_format: "%LOCAL_REPLY_BODY%:%RESPONSE_CODE%:path=%REQ(:path)%\n"
   * 
   * The following response body in "plain/text" format will be generated for a request with
   * local reply body of "upstream connection error", response_code=503 and path=/foo.
   * 
   * .. code-block:: text
   * 
   * upstream connect error:503:path=/foo
   * 
   * Example two: "application/json" ``body_format``.
   * 
   * .. validated-code-block:: yaml
   * :type-name: envoy.config.core.v3.SubstitutionFormatString
   * 
   * json_format:
   * status: "%RESPONSE_CODE%"
   * message: "%LOCAL_REPLY_BODY%"
   * path: "%REQ(:path)%"
   * 
   * The following response body in "application/json" format would be generated for a request with
   * local reply body of "upstream connection error", response_code=503 and path=/foo.
   * 
   * .. code-block:: json
   * 
   * {
   * "status": 503,
   * "message": "upstream connection error",
   * "path": "/foo"
   * }
   */
  'body_format'?: (_envoy_config_core_v3_SubstitutionFormatString | null);
}

/**
 * The configuration to customize local reply returned by Envoy.
 */
export interface LocalReplyConfig__Output {
  /**
   * Configuration of list of mappers which allows to filter and change local response.
   * The mappers will be checked by the specified order until one is matched.
   */
  'mappers': (_envoy_extensions_filters_network_http_connection_manager_v3_ResponseMapper__Output)[];
  /**
   * The configuration to form response body from the :ref:`command operators <config_access_log_command_operators>`
   * and to specify response content type as one of: plain/text or application/json.
   * 
   * Example one: "plain/text" ``body_format``.
   * 
   * .. validated-code-block:: yaml
   * :type-name: envoy.config.core.v3.SubstitutionFormatString
   * 
   * text_format: "%LOCAL_REPLY_BODY%:%RESPONSE_CODE%:path=%REQ(:path)%\n"
   * 
   * The following response body in "plain/text" format will be generated for a request with
   * local reply body of "upstream connection error", response_code=503 and path=/foo.
   * 
   * .. code-block:: text
   * 
   * upstream connect error:503:path=/foo
   * 
   * Example two: "application/json" ``body_format``.
   * 
   * .. validated-code-block:: yaml
   * :type-name: envoy.config.core.v3.SubstitutionFormatString
   * 
   * json_format:
   * status: "%RESPONSE_CODE%"
   * message: "%LOCAL_REPLY_BODY%"
   * path: "%REQ(:path)%"
   * 
   * The following response body in "application/json" format would be generated for a request with
   * local reply body of "upstream connection error", response_code=503 and path=/foo.
   * 
   * .. code-block:: json
   * 
   * {
   * "status": 503,
   * "message": "upstream connection error",
   * "path": "/foo"
   * }
   */
  'body_format': (_envoy_config_core_v3_SubstitutionFormatString__Output | null);
}
