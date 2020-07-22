// Original file: deps/envoy-api/envoy/api/v2/core/protocol.proto


export interface UpstreamHttpProtocolOptions {
  /**
   * Set transport socket `SNI <https://en.wikipedia.org/wiki/Server_Name_Indication>`_ for new
   * upstream connections based on the downstream HTTP host/authority header, as seen by the
   * :ref:`router filter <config_http_filters_router>`.
   */
  'auto_sni'?: (boolean);
  /**
   * Automatic validate upstream presented certificate for new upstream connections based on the
   * downstream HTTP host/authority header, as seen by the
   * :ref:`router filter <config_http_filters_router>`.
   * This field is intended to set with `auto_sni` field.
   */
  'auto_san_validation'?: (boolean);
}

export interface UpstreamHttpProtocolOptions__Output {
  /**
   * Set transport socket `SNI <https://en.wikipedia.org/wiki/Server_Name_Indication>`_ for new
   * upstream connections based on the downstream HTTP host/authority header, as seen by the
   * :ref:`router filter <config_http_filters_router>`.
   */
  'auto_sni': (boolean);
  /**
   * Automatic validate upstream presented certificate for new upstream connections based on the
   * downstream HTTP host/authority header, as seen by the
   * :ref:`router filter <config_http_filters_router>`.
   * This field is intended to set with `auto_sni` field.
   */
  'auto_san_validation': (boolean);
}
