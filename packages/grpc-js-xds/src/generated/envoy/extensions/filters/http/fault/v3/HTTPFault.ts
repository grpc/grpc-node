// Original file: deps/envoy-api/envoy/extensions/filters/http/fault/v3/fault.proto

import type { FaultDelay as _envoy_extensions_filters_common_fault_v3_FaultDelay, FaultDelay__Output as _envoy_extensions_filters_common_fault_v3_FaultDelay__Output } from '../../../../../../envoy/extensions/filters/common/fault/v3/FaultDelay';
import type { FaultAbort as _envoy_extensions_filters_http_fault_v3_FaultAbort, FaultAbort__Output as _envoy_extensions_filters_http_fault_v3_FaultAbort__Output } from '../../../../../../envoy/extensions/filters/http/fault/v3/FaultAbort';
import type { HeaderMatcher as _envoy_config_route_v3_HeaderMatcher, HeaderMatcher__Output as _envoy_config_route_v3_HeaderMatcher__Output } from '../../../../../../envoy/config/route/v3/HeaderMatcher';
import type { UInt32Value as _google_protobuf_UInt32Value, UInt32Value__Output as _google_protobuf_UInt32Value__Output } from '../../../../../../google/protobuf/UInt32Value';
import type { FaultRateLimit as _envoy_extensions_filters_common_fault_v3_FaultRateLimit, FaultRateLimit__Output as _envoy_extensions_filters_common_fault_v3_FaultRateLimit__Output } from '../../../../../../envoy/extensions/filters/common/fault/v3/FaultRateLimit';
import type { Struct as _google_protobuf_Struct, Struct__Output as _google_protobuf_Struct__Output } from '../../../../../../google/protobuf/Struct';

/**
 * [#next-free-field: 17]
 */
export interface HTTPFault {
  /**
   * If specified, the filter will inject delays based on the values in the
   * object.
   */
  'delay'?: (_envoy_extensions_filters_common_fault_v3_FaultDelay | null);
  /**
   * If specified, the filter will abort requests based on the values in
   * the object. At least ``abort`` or ``delay`` must be specified.
   */
  'abort'?: (_envoy_extensions_filters_http_fault_v3_FaultAbort | null);
  /**
   * Specifies the name of the (destination) upstream cluster that the
   * filter should match on. Fault injection will be restricted to requests
   * bound to the specific upstream cluster.
   */
  'upstream_cluster'?: (string);
  /**
   * Specifies a set of headers that the filter should match on. The fault
   * injection filter can be applied selectively to requests that match a set of
   * headers specified in the fault filter config. The chances of actual fault
   * injection further depend on the value of the :ref:`percentage
   * <envoy_v3_api_field_extensions.filters.http.fault.v3.FaultAbort.percentage>` field.
   * The filter will check the request's headers against all the specified
   * headers in the filter config. A match will happen if all the headers in the
   * config are present in the request with the same values (or based on
   * presence if the ``value`` field is not in the config).
   */
  'headers'?: (_envoy_config_route_v3_HeaderMatcher)[];
  /**
   * Faults are injected for the specified list of downstream hosts. If this
   * setting is not set, faults are injected for all downstream nodes.
   * Downstream node name is taken from :ref:`the HTTP
   * x-envoy-downstream-service-node
   * <config_http_conn_man_headers_downstream-service-node>` header and compared
   * against downstream_nodes list.
   */
  'downstream_nodes'?: (string)[];
  /**
   * The maximum number of faults that can be active at a single time via the configured fault
   * filter. Note that because this setting can be overridden at the route level, it's possible
   * for the number of active faults to be greater than this value (if injected via a different
   * route). If not specified, defaults to unlimited. This setting can be overridden via
   * ``runtime <config_http_filters_fault_injection_runtime>`` and any faults that are not injected
   * due to overflow will be indicated via the ``faults_overflow
   * <config_http_filters_fault_injection_stats>`` stat.
   * 
   * .. attention::
   * Like other :ref:`circuit breakers <arch_overview_circuit_break>` in Envoy, this is a fuzzy
   * limit. It's possible for the number of active faults to rise slightly above the configured
   * amount due to the implementation details.
   */
  'max_active_faults'?: (_google_protobuf_UInt32Value | null);
  /**
   * The response rate limit to be applied to the response body of the stream. When configured,
   * the percentage can be overridden by the :ref:`fault.http.rate_limit.response_percent
   * <config_http_filters_fault_injection_runtime>` runtime key.
   * 
   * .. attention::
   * This is a per-stream limit versus a connection level limit. This means that concurrent streams
   * will each get an independent limit.
   */
  'response_rate_limit'?: (_envoy_extensions_filters_common_fault_v3_FaultRateLimit | null);
  /**
   * The runtime key to override the :ref:`default <config_http_filters_fault_injection_runtime>`
   * runtime. The default is: fault.http.delay.fixed_delay_percent
   */
  'delay_percent_runtime'?: (string);
  /**
   * The runtime key to override the :ref:`default <config_http_filters_fault_injection_runtime>`
   * runtime. The default is: fault.http.abort.abort_percent
   */
  'abort_percent_runtime'?: (string);
  /**
   * The runtime key to override the :ref:`default <config_http_filters_fault_injection_runtime>`
   * runtime. The default is: fault.http.delay.fixed_duration_ms
   */
  'delay_duration_runtime'?: (string);
  /**
   * The runtime key to override the :ref:`default <config_http_filters_fault_injection_runtime>`
   * runtime. The default is: fault.http.abort.http_status
   */
  'abort_http_status_runtime'?: (string);
  /**
   * The runtime key to override the :ref:`default <config_http_filters_fault_injection_runtime>`
   * runtime. The default is: fault.http.max_active_faults
   */
  'max_active_faults_runtime'?: (string);
  /**
   * The runtime key to override the :ref:`default <config_http_filters_fault_injection_runtime>`
   * runtime. The default is: fault.http.rate_limit.response_percent
   */
  'response_rate_limit_percent_runtime'?: (string);
  /**
   * The runtime key to override the :ref:`default <config_http_filters_fault_injection_runtime>`
   * runtime. The default is: fault.http.abort.grpc_status
   */
  'abort_grpc_status_runtime'?: (string);
  /**
   * To control whether stats storage is allocated dynamically for each downstream server.
   * If set to true, "x-envoy-downstream-service-cluster" field of header will be ignored by this filter.
   * If set to false, dynamic stats storage will be allocated for the downstream cluster name.
   * Default value is false.
   */
  'disable_downstream_cluster_stats'?: (boolean);
  /**
   * When an abort or delay fault is executed, the metadata struct provided here will be added to the
   * request's dynamic metadata under the namespace corresponding to the name of the fault filter.
   * This data can be logged as part of Access Logs using the :ref:`command operator
   * <config_access_log_command_operators>` %DYNAMIC_METADATA(NAMESPACE)%, where NAMESPACE is the name of
   * the fault filter.
   */
  'filter_metadata'?: (_google_protobuf_Struct | null);
}

/**
 * [#next-free-field: 17]
 */
export interface HTTPFault__Output {
  /**
   * If specified, the filter will inject delays based on the values in the
   * object.
   */
  'delay': (_envoy_extensions_filters_common_fault_v3_FaultDelay__Output | null);
  /**
   * If specified, the filter will abort requests based on the values in
   * the object. At least ``abort`` or ``delay`` must be specified.
   */
  'abort': (_envoy_extensions_filters_http_fault_v3_FaultAbort__Output | null);
  /**
   * Specifies the name of the (destination) upstream cluster that the
   * filter should match on. Fault injection will be restricted to requests
   * bound to the specific upstream cluster.
   */
  'upstream_cluster': (string);
  /**
   * Specifies a set of headers that the filter should match on. The fault
   * injection filter can be applied selectively to requests that match a set of
   * headers specified in the fault filter config. The chances of actual fault
   * injection further depend on the value of the :ref:`percentage
   * <envoy_v3_api_field_extensions.filters.http.fault.v3.FaultAbort.percentage>` field.
   * The filter will check the request's headers against all the specified
   * headers in the filter config. A match will happen if all the headers in the
   * config are present in the request with the same values (or based on
   * presence if the ``value`` field is not in the config).
   */
  'headers': (_envoy_config_route_v3_HeaderMatcher__Output)[];
  /**
   * Faults are injected for the specified list of downstream hosts. If this
   * setting is not set, faults are injected for all downstream nodes.
   * Downstream node name is taken from :ref:`the HTTP
   * x-envoy-downstream-service-node
   * <config_http_conn_man_headers_downstream-service-node>` header and compared
   * against downstream_nodes list.
   */
  'downstream_nodes': (string)[];
  /**
   * The maximum number of faults that can be active at a single time via the configured fault
   * filter. Note that because this setting can be overridden at the route level, it's possible
   * for the number of active faults to be greater than this value (if injected via a different
   * route). If not specified, defaults to unlimited. This setting can be overridden via
   * ``runtime <config_http_filters_fault_injection_runtime>`` and any faults that are not injected
   * due to overflow will be indicated via the ``faults_overflow
   * <config_http_filters_fault_injection_stats>`` stat.
   * 
   * .. attention::
   * Like other :ref:`circuit breakers <arch_overview_circuit_break>` in Envoy, this is a fuzzy
   * limit. It's possible for the number of active faults to rise slightly above the configured
   * amount due to the implementation details.
   */
  'max_active_faults': (_google_protobuf_UInt32Value__Output | null);
  /**
   * The response rate limit to be applied to the response body of the stream. When configured,
   * the percentage can be overridden by the :ref:`fault.http.rate_limit.response_percent
   * <config_http_filters_fault_injection_runtime>` runtime key.
   * 
   * .. attention::
   * This is a per-stream limit versus a connection level limit. This means that concurrent streams
   * will each get an independent limit.
   */
  'response_rate_limit': (_envoy_extensions_filters_common_fault_v3_FaultRateLimit__Output | null);
  /**
   * The runtime key to override the :ref:`default <config_http_filters_fault_injection_runtime>`
   * runtime. The default is: fault.http.delay.fixed_delay_percent
   */
  'delay_percent_runtime': (string);
  /**
   * The runtime key to override the :ref:`default <config_http_filters_fault_injection_runtime>`
   * runtime. The default is: fault.http.abort.abort_percent
   */
  'abort_percent_runtime': (string);
  /**
   * The runtime key to override the :ref:`default <config_http_filters_fault_injection_runtime>`
   * runtime. The default is: fault.http.delay.fixed_duration_ms
   */
  'delay_duration_runtime': (string);
  /**
   * The runtime key to override the :ref:`default <config_http_filters_fault_injection_runtime>`
   * runtime. The default is: fault.http.abort.http_status
   */
  'abort_http_status_runtime': (string);
  /**
   * The runtime key to override the :ref:`default <config_http_filters_fault_injection_runtime>`
   * runtime. The default is: fault.http.max_active_faults
   */
  'max_active_faults_runtime': (string);
  /**
   * The runtime key to override the :ref:`default <config_http_filters_fault_injection_runtime>`
   * runtime. The default is: fault.http.rate_limit.response_percent
   */
  'response_rate_limit_percent_runtime': (string);
  /**
   * The runtime key to override the :ref:`default <config_http_filters_fault_injection_runtime>`
   * runtime. The default is: fault.http.abort.grpc_status
   */
  'abort_grpc_status_runtime': (string);
  /**
   * To control whether stats storage is allocated dynamically for each downstream server.
   * If set to true, "x-envoy-downstream-service-cluster" field of header will be ignored by this filter.
   * If set to false, dynamic stats storage will be allocated for the downstream cluster name.
   * Default value is false.
   */
  'disable_downstream_cluster_stats': (boolean);
  /**
   * When an abort or delay fault is executed, the metadata struct provided here will be added to the
   * request's dynamic metadata under the namespace corresponding to the name of the fault filter.
   * This data can be logged as part of Access Logs using the :ref:`command operator
   * <config_access_log_command_operators>` %DYNAMIC_METADATA(NAMESPACE)%, where NAMESPACE is the name of
   * the fault filter.
   */
  'filter_metadata': (_google_protobuf_Struct__Output | null);
}
