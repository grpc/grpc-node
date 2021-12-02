// Original file: deps/envoy-api/envoy/config/trace/v3/http_tracer.proto

import type { Any as _google_protobuf_Any, Any__Output as _google_protobuf_Any__Output } from '../../../../google/protobuf/Any';

/**
 * Configuration for an HTTP tracer provider used by Envoy.
 * 
 * The configuration is defined by the
 * :ref:`HttpConnectionManager.Tracing <envoy_v3_api_msg_extensions.filters.network.http_connection_manager.v3.HttpConnectionManager.Tracing>`
 * :ref:`provider <envoy_v3_api_field_extensions.filters.network.http_connection_manager.v3.HttpConnectionManager.Tracing.provider>`
 * field.
 */
export interface _envoy_config_trace_v3_Tracing_Http {
  /**
   * The name of the HTTP trace driver to instantiate. The name must match a
   * supported HTTP trace driver.
   * See the :ref:`extensions listed in typed_config below <extension_category_envoy.tracers>` for the default list of the HTTP trace driver.
   */
  'name'?: (string);
  'typed_config'?: (_google_protobuf_Any | null);
  /**
   * Trace driver specific configuration which must be set according to the driver being instantiated.
   * [#extension-category: envoy.tracers]
   */
  'config_type'?: "typed_config";
}

/**
 * Configuration for an HTTP tracer provider used by Envoy.
 * 
 * The configuration is defined by the
 * :ref:`HttpConnectionManager.Tracing <envoy_v3_api_msg_extensions.filters.network.http_connection_manager.v3.HttpConnectionManager.Tracing>`
 * :ref:`provider <envoy_v3_api_field_extensions.filters.network.http_connection_manager.v3.HttpConnectionManager.Tracing.provider>`
 * field.
 */
export interface _envoy_config_trace_v3_Tracing_Http__Output {
  /**
   * The name of the HTTP trace driver to instantiate. The name must match a
   * supported HTTP trace driver.
   * See the :ref:`extensions listed in typed_config below <extension_category_envoy.tracers>` for the default list of the HTTP trace driver.
   */
  'name': (string);
  'typed_config'?: (_google_protobuf_Any__Output | null);
  /**
   * Trace driver specific configuration which must be set according to the driver being instantiated.
   * [#extension-category: envoy.tracers]
   */
  'config_type': "typed_config";
}

/**
 * The tracing configuration specifies settings for an HTTP tracer provider used by Envoy.
 * 
 * Envoy may support other tracers in the future, but right now the HTTP tracer is the only one
 * supported.
 * 
 * .. attention::
 * 
 * Use of this message type has been deprecated in favor of direct use of
 * :ref:`Tracing.Http <envoy_v3_api_msg_config.trace.v3.Tracing.Http>`.
 */
export interface Tracing {
  /**
   * Provides configuration for the HTTP tracer.
   */
  'http'?: (_envoy_config_trace_v3_Tracing_Http | null);
}

/**
 * The tracing configuration specifies settings for an HTTP tracer provider used by Envoy.
 * 
 * Envoy may support other tracers in the future, but right now the HTTP tracer is the only one
 * supported.
 * 
 * .. attention::
 * 
 * Use of this message type has been deprecated in favor of direct use of
 * :ref:`Tracing.Http <envoy_v3_api_msg_config.trace.v3.Tracing.Http>`.
 */
export interface Tracing__Output {
  /**
   * Provides configuration for the HTTP tracer.
   */
  'http': (_envoy_config_trace_v3_Tracing_Http__Output | null);
}
