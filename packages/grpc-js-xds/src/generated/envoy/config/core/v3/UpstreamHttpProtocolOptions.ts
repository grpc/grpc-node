// Original file: deps/envoy-api/envoy/config/core/v3/protocol.proto


export interface UpstreamHttpProtocolOptions {
  /**
   * Set transport socket `SNI <https://en.wikipedia.org/wiki/Server_Name_Indication>`_ for new
   * upstream connections based on the downstream HTTP host/authority header or any other arbitrary
   * header when :ref:`override_auto_sni_header <envoy_v3_api_field_config.core.v3.UpstreamHttpProtocolOptions.override_auto_sni_header>`
   * is set, as seen by the :ref:`router filter <config_http_filters_router>`.
   * Does nothing if a filter before the http router filter sets the corresponding metadata.
   */
  'auto_sni'?: (boolean);
  /**
   * Automatic validate upstream presented certificate for new upstream connections based on the
   * downstream HTTP host/authority header or any other arbitrary header when :ref:`override_auto_sni_header <envoy_v3_api_field_config.core.v3.UpstreamHttpProtocolOptions.override_auto_sni_header>`
   * is set, as seen by the :ref:`router filter <config_http_filters_router>`.
   * This field is intended to be set with ``auto_sni`` field.
   * Does nothing if a filter before the http router filter sets the corresponding metadata.
   */
  'auto_san_validation'?: (boolean);
  /**
   * An optional alternative to the host/authority header to be used for setting the SNI value.
   * It should be a valid downstream HTTP header, as seen by the
   * :ref:`router filter <config_http_filters_router>`.
   * If unset, host/authority header will be used for populating the SNI. If the specified header
   * is not found or the value is empty, host/authority header will be used instead.
   * This field is intended to be set with ``auto_sni`` and/or ``auto_san_validation`` fields.
   * If none of these fields are set then setting this would be a no-op.
   * Does nothing if a filter before the http router filter sets the corresponding metadata.
   */
  'override_auto_sni_header'?: (string);
}

export interface UpstreamHttpProtocolOptions__Output {
  /**
   * Set transport socket `SNI <https://en.wikipedia.org/wiki/Server_Name_Indication>`_ for new
   * upstream connections based on the downstream HTTP host/authority header or any other arbitrary
   * header when :ref:`override_auto_sni_header <envoy_v3_api_field_config.core.v3.UpstreamHttpProtocolOptions.override_auto_sni_header>`
   * is set, as seen by the :ref:`router filter <config_http_filters_router>`.
   * Does nothing if a filter before the http router filter sets the corresponding metadata.
   */
  'auto_sni': (boolean);
  /**
   * Automatic validate upstream presented certificate for new upstream connections based on the
   * downstream HTTP host/authority header or any other arbitrary header when :ref:`override_auto_sni_header <envoy_v3_api_field_config.core.v3.UpstreamHttpProtocolOptions.override_auto_sni_header>`
   * is set, as seen by the :ref:`router filter <config_http_filters_router>`.
   * This field is intended to be set with ``auto_sni`` field.
   * Does nothing if a filter before the http router filter sets the corresponding metadata.
   */
  'auto_san_validation': (boolean);
  /**
   * An optional alternative to the host/authority header to be used for setting the SNI value.
   * It should be a valid downstream HTTP header, as seen by the
   * :ref:`router filter <config_http_filters_router>`.
   * If unset, host/authority header will be used for populating the SNI. If the specified header
   * is not found or the value is empty, host/authority header will be used instead.
   * This field is intended to be set with ``auto_sni`` and/or ``auto_san_validation`` fields.
   * If none of these fields are set then setting this would be a no-op.
   * Does nothing if a filter before the http router filter sets the corresponding metadata.
   */
  'override_auto_sni_header': (string);
}
