// Original file: deps/envoy-api/envoy/config/core/v3/substitution_format_string.proto

import type { Struct as _google_protobuf_Struct, Struct__Output as _google_protobuf_Struct__Output } from '../../../../google/protobuf/Struct';
import type { DataSource as _envoy_config_core_v3_DataSource, DataSource__Output as _envoy_config_core_v3_DataSource__Output } from '../../../../envoy/config/core/v3/DataSource';
import type { TypedExtensionConfig as _envoy_config_core_v3_TypedExtensionConfig, TypedExtensionConfig__Output as _envoy_config_core_v3_TypedExtensionConfig__Output } from '../../../../envoy/config/core/v3/TypedExtensionConfig';

/**
 * Configuration to use multiple :ref:`command operators <config_access_log_command_operators>`
 * to generate a new string in either plain text or JSON format.
 * [#next-free-field: 7]
 */
export interface SubstitutionFormatString {
  /**
   * Specify a format with command operators to form a text string.
   * Its details is described in :ref:`format string<config_access_log_format_strings>`.
   * 
   * For example, setting ``text_format`` like below,
   * 
   * .. validated-code-block:: yaml
   * :type-name: envoy.config.core.v3.SubstitutionFormatString
   * 
   * text_format: "%LOCAL_REPLY_BODY%:%RESPONSE_CODE%:path=%REQ(:path)%\n"
   * 
   * generates plain text similar to:
   * 
   * .. code-block:: text
   * 
   * upstream connect error:503:path=/foo
   * 
   * Deprecated in favor of :ref:`text_format_source <envoy_v3_api_field_config.core.v3.SubstitutionFormatString.text_format_source>`. To migrate text format strings, use the :ref:`inline_string <envoy_v3_api_field_config.core.v3.DataSource.inline_string>` field.
   */
  'text_format'?: (string);
  /**
   * Specify a format with command operators to form a JSON string.
   * Its details is described in :ref:`format dictionary<config_access_log_format_dictionaries>`.
   * Values are rendered as strings, numbers, or boolean values as appropriate.
   * Nested JSON objects may be produced by some command operators (e.g. FILTER_STATE or DYNAMIC_METADATA).
   * See the documentation for a specific command operator for details.
   * 
   * .. validated-code-block:: yaml
   * :type-name: envoy.config.core.v3.SubstitutionFormatString
   * 
   * json_format:
   * status: "%RESPONSE_CODE%"
   * message: "%LOCAL_REPLY_BODY%"
   * 
   * The following JSON object would be created:
   * 
   * .. code-block:: json
   * 
   * {
   * "status": 500,
   * "message": "My error message"
   * }
   */
  'json_format'?: (_google_protobuf_Struct | null);
  /**
   * If set to true, when command operators are evaluated to null,
   * 
   * * for ``text_format``, the output of the empty operator is changed from ``-`` to an
   * empty string, so that empty values are omitted entirely.
   * * for ``json_format`` the keys with null values are omitted in the output structure.
   */
  'omit_empty_values'?: (boolean);
  /**
   * Specify a ``content_type`` field.
   * If this field is not set then ``text/plain`` is used for ``text_format`` and
   * ``application/json`` is used for ``json_format``.
   * 
   * .. validated-code-block:: yaml
   * :type-name: envoy.config.core.v3.SubstitutionFormatString
   * 
   * content_type: "text/html; charset=UTF-8"
   */
  'content_type'?: (string);
  /**
   * Specify a format with command operators to form a text string.
   * Its details is described in :ref:`format string<config_access_log_format_strings>`.
   * 
   * For example, setting ``text_format`` like below,
   * 
   * .. validated-code-block:: yaml
   * :type-name: envoy.config.core.v3.SubstitutionFormatString
   * 
   * text_format_source:
   * inline_string: "%LOCAL_REPLY_BODY%:%RESPONSE_CODE%:path=%REQ(:path)%\n"
   * 
   * generates plain text similar to:
   * 
   * .. code-block:: text
   * 
   * upstream connect error:503:path=/foo
   */
  'text_format_source'?: (_envoy_config_core_v3_DataSource | null);
  /**
   * Specifies a collection of Formatter plugins that can be called from the access log configuration.
   * See the formatters extensions documentation for details.
   * [#extension-category: envoy.formatter]
   */
  'formatters'?: (_envoy_config_core_v3_TypedExtensionConfig)[];
  'format'?: "text_format"|"json_format"|"text_format_source";
}

/**
 * Configuration to use multiple :ref:`command operators <config_access_log_command_operators>`
 * to generate a new string in either plain text or JSON format.
 * [#next-free-field: 7]
 */
export interface SubstitutionFormatString__Output {
  /**
   * Specify a format with command operators to form a text string.
   * Its details is described in :ref:`format string<config_access_log_format_strings>`.
   * 
   * For example, setting ``text_format`` like below,
   * 
   * .. validated-code-block:: yaml
   * :type-name: envoy.config.core.v3.SubstitutionFormatString
   * 
   * text_format: "%LOCAL_REPLY_BODY%:%RESPONSE_CODE%:path=%REQ(:path)%\n"
   * 
   * generates plain text similar to:
   * 
   * .. code-block:: text
   * 
   * upstream connect error:503:path=/foo
   * 
   * Deprecated in favor of :ref:`text_format_source <envoy_v3_api_field_config.core.v3.SubstitutionFormatString.text_format_source>`. To migrate text format strings, use the :ref:`inline_string <envoy_v3_api_field_config.core.v3.DataSource.inline_string>` field.
   */
  'text_format'?: (string);
  /**
   * Specify a format with command operators to form a JSON string.
   * Its details is described in :ref:`format dictionary<config_access_log_format_dictionaries>`.
   * Values are rendered as strings, numbers, or boolean values as appropriate.
   * Nested JSON objects may be produced by some command operators (e.g. FILTER_STATE or DYNAMIC_METADATA).
   * See the documentation for a specific command operator for details.
   * 
   * .. validated-code-block:: yaml
   * :type-name: envoy.config.core.v3.SubstitutionFormatString
   * 
   * json_format:
   * status: "%RESPONSE_CODE%"
   * message: "%LOCAL_REPLY_BODY%"
   * 
   * The following JSON object would be created:
   * 
   * .. code-block:: json
   * 
   * {
   * "status": 500,
   * "message": "My error message"
   * }
   */
  'json_format'?: (_google_protobuf_Struct__Output | null);
  /**
   * If set to true, when command operators are evaluated to null,
   * 
   * * for ``text_format``, the output of the empty operator is changed from ``-`` to an
   * empty string, so that empty values are omitted entirely.
   * * for ``json_format`` the keys with null values are omitted in the output structure.
   */
  'omit_empty_values': (boolean);
  /**
   * Specify a ``content_type`` field.
   * If this field is not set then ``text/plain`` is used for ``text_format`` and
   * ``application/json`` is used for ``json_format``.
   * 
   * .. validated-code-block:: yaml
   * :type-name: envoy.config.core.v3.SubstitutionFormatString
   * 
   * content_type: "text/html; charset=UTF-8"
   */
  'content_type': (string);
  /**
   * Specify a format with command operators to form a text string.
   * Its details is described in :ref:`format string<config_access_log_format_strings>`.
   * 
   * For example, setting ``text_format`` like below,
   * 
   * .. validated-code-block:: yaml
   * :type-name: envoy.config.core.v3.SubstitutionFormatString
   * 
   * text_format_source:
   * inline_string: "%LOCAL_REPLY_BODY%:%RESPONSE_CODE%:path=%REQ(:path)%\n"
   * 
   * generates plain text similar to:
   * 
   * .. code-block:: text
   * 
   * upstream connect error:503:path=/foo
   */
  'text_format_source'?: (_envoy_config_core_v3_DataSource__Output | null);
  /**
   * Specifies a collection of Formatter plugins that can be called from the access log configuration.
   * See the formatters extensions documentation for details.
   * [#extension-category: envoy.formatter]
   */
  'formatters': (_envoy_config_core_v3_TypedExtensionConfig__Output)[];
  'format': "text_format"|"json_format"|"text_format_source";
}
