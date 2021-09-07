// Original file: deps/envoy-api/envoy/config/trace/v3/http_tracer.proto

import type { Any as _google_protobuf_Any, Any__Output as _google_protobuf_Any__Output } from '../../../../google/protobuf/Any';

/**
 * Configuration for an HTTP tracer provider used by Envoy.
 * 
 * The configuration is defined by the
 * :ref:`HttpConnectionManager.Tracing <envoy_api_msg_extensions.filters.network.http_connection_manager.v3.HttpConnectionManager.Tracing>`
 * :ref:`provider <envoy_api_field_extensions.filters.network.http_connection_manager.v3.HttpConnectionManager.Tracing.provider>`
 * field.
 */
export interface _envoy_config_trace_v3_Tracing_Http {
  /**
   * The name of the HTTP trace driver to instantiate. The name must match a
   * supported HTTP trace driver. Built-in trace drivers:
   * 
   * - *envoy.tracers.lightstep*
   * - *envoy.tracers.zipkin*
   * - *envoy.tracers.dynamic_ot*
   * - *envoy.tracers.datadog*
   * - *envoy.tracers.opencensus*
   * - *envoy.tracers.xray*
   */
  'name'?: (string);
  'typed_config'?: (_google_protobuf_Any | null);
  /**
   * Trace driver specific configuration which depends on the driver being instantiated.
   * See the trace drivers for examples:
   * 
   * - :ref:`LightstepConfig <envoy_api_msg_config.trace.v3.LightstepConfig>`
   * - :ref:`ZipkinConfig <envoy_api_msg_config.trace.v3.ZipkinConfig>`
   * - :ref:`DynamicOtConfig <envoy_api_msg_config.trace.v3.DynamicOtConfig>`
   * - :ref:`DatadogConfig <envoy_api_msg_config.trace.v3.DatadogConfig>`
   * - :ref:`OpenCensusConfig <envoy_api_msg_config.trace.v3.OpenCensusConfig>`
   * - :ref:`AWS X-Ray <envoy_api_msg_config.trace.v3.XRayConfig>`
   */
  'config_type'?: "typed_config";
}

/**
 * Configuration for an HTTP tracer provider used by Envoy.
 * 
 * The configuration is defined by the
 * :ref:`HttpConnectionManager.Tracing <envoy_api_msg_extensions.filters.network.http_connection_manager.v3.HttpConnectionManager.Tracing>`
 * :ref:`provider <envoy_api_field_extensions.filters.network.http_connection_manager.v3.HttpConnectionManager.Tracing.provider>`
 * field.
 */
export interface _envoy_config_trace_v3_Tracing_Http__Output {
  /**
   * The name of the HTTP trace driver to instantiate. The name must match a
   * supported HTTP trace driver. Built-in trace drivers:
   * 
   * - *envoy.tracers.lightstep*
   * - *envoy.tracers.zipkin*
   * - *envoy.tracers.dynamic_ot*
   * - *envoy.tracers.datadog*
   * - *envoy.tracers.opencensus*
   * - *envoy.tracers.xray*
   */
  'name': (string);
  'typed_config'?: (_google_protobuf_Any__Output | null);
  /**
   * Trace driver specific configuration which depends on the driver being instantiated.
   * See the trace drivers for examples:
   * 
   * - :ref:`LightstepConfig <envoy_api_msg_config.trace.v3.LightstepConfig>`
   * - :ref:`ZipkinConfig <envoy_api_msg_config.trace.v3.ZipkinConfig>`
   * - :ref:`DynamicOtConfig <envoy_api_msg_config.trace.v3.DynamicOtConfig>`
   * - :ref:`DatadogConfig <envoy_api_msg_config.trace.v3.DatadogConfig>`
   * - :ref:`OpenCensusConfig <envoy_api_msg_config.trace.v3.OpenCensusConfig>`
   * - :ref:`AWS X-Ray <envoy_api_msg_config.trace.v3.XRayConfig>`
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
 * :ref:`Tracing.Http <envoy_api_msg_config.trace.v3.Tracing.Http>`.
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
 * :ref:`Tracing.Http <envoy_api_msg_config.trace.v3.Tracing.Http>`.
 */
export interface Tracing__Output {
  /**
   * Provides configuration for the HTTP tracer.
   */
  'http': (_envoy_config_trace_v3_Tracing_Http__Output | null);
}
