// Original file: deps/envoy-api/envoy/data/accesslog/v3/accesslog.proto

import type { Address as _envoy_config_core_v3_Address, Address__Output as _envoy_config_core_v3_Address__Output } from '../../../../envoy/config/core/v3/Address';
import type { TLSProperties as _envoy_data_accesslog_v3_TLSProperties, TLSProperties__Output as _envoy_data_accesslog_v3_TLSProperties__Output } from '../../../../envoy/data/accesslog/v3/TLSProperties';
import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from '../../../../google/protobuf/Timestamp';
import type { Duration as _google_protobuf_Duration, Duration__Output as _google_protobuf_Duration__Output } from '../../../../google/protobuf/Duration';
import type { ResponseFlags as _envoy_data_accesslog_v3_ResponseFlags, ResponseFlags__Output as _envoy_data_accesslog_v3_ResponseFlags__Output } from '../../../../envoy/data/accesslog/v3/ResponseFlags';
import type { Metadata as _envoy_config_core_v3_Metadata, Metadata__Output as _envoy_config_core_v3_Metadata__Output } from '../../../../envoy/config/core/v3/Metadata';
import type { Any as _google_protobuf_Any, Any__Output as _google_protobuf_Any__Output } from '../../../../google/protobuf/Any';
import type { AccessLogType as _envoy_data_accesslog_v3_AccessLogType } from '../../../../envoy/data/accesslog/v3/AccessLogType';
import type { Long } from '@grpc/proto-loader';

/**
 * Defines fields that are shared by all Envoy access logs.
 * [#next-free-field: 34]
 */
export interface AccessLogCommon {
  /**
   * [#not-implemented-hide:]
   * This field indicates the rate at which this log entry was sampled.
   * Valid range is (0.0, 1.0].
   */
  'sample_rate'?: (number | string);
  /**
   * This field is the remote/origin address on which the request from the user was received.
   * Note: This may not be the physical peer. E.g, if the remote address is inferred from for
   * example the x-forwarder-for header, proxy protocol, etc.
   */
  'downstream_remote_address'?: (_envoy_config_core_v3_Address | null);
  /**
   * This field is the local/destination address on which the request from the user was received.
   */
  'downstream_local_address'?: (_envoy_config_core_v3_Address | null);
  /**
   * If the connection is secure,S this field will contain TLS properties.
   */
  'tls_properties'?: (_envoy_data_accesslog_v3_TLSProperties | null);
  /**
   * The time that Envoy started servicing this request. This is effectively the time that the first
   * downstream byte is received.
   */
  'start_time'?: (_google_protobuf_Timestamp | null);
  /**
   * Interval between the first downstream byte received and the last
   * downstream byte received (i.e. time it takes to receive a request).
   */
  'time_to_last_rx_byte'?: (_google_protobuf_Duration | null);
  /**
   * Interval between the first downstream byte received and the first upstream byte sent. There may
   * by considerable delta between ``time_to_last_rx_byte`` and this value due to filters.
   * Additionally, the same caveats apply as documented in ``time_to_last_downstream_tx_byte`` about
   * not accounting for kernel socket buffer time, etc.
   */
  'time_to_first_upstream_tx_byte'?: (_google_protobuf_Duration | null);
  /**
   * Interval between the first downstream byte received and the last upstream byte sent. There may
   * by considerable delta between ``time_to_last_rx_byte`` and this value due to filters.
   * Additionally, the same caveats apply as documented in ``time_to_last_downstream_tx_byte`` about
   * not accounting for kernel socket buffer time, etc.
   */
  'time_to_last_upstream_tx_byte'?: (_google_protobuf_Duration | null);
  /**
   * Interval between the first downstream byte received and the first upstream
   * byte received (i.e. time it takes to start receiving a response).
   */
  'time_to_first_upstream_rx_byte'?: (_google_protobuf_Duration | null);
  /**
   * Interval between the first downstream byte received and the last upstream
   * byte received (i.e. time it takes to receive a complete response).
   */
  'time_to_last_upstream_rx_byte'?: (_google_protobuf_Duration | null);
  /**
   * Interval between the first downstream byte received and the first downstream byte sent.
   * There may be a considerable delta between the ``time_to_first_upstream_rx_byte`` and this field
   * due to filters. Additionally, the same caveats apply as documented in
   * ``time_to_last_downstream_tx_byte`` about not accounting for kernel socket buffer time, etc.
   */
  'time_to_first_downstream_tx_byte'?: (_google_protobuf_Duration | null);
  /**
   * Interval between the first downstream byte received and the last downstream byte sent.
   * Depending on protocol, buffering, windowing, filters, etc. there may be a considerable delta
   * between ``time_to_last_upstream_rx_byte`` and this field. Note also that this is an approximate
   * time. In the current implementation it does not include kernel socket buffer time. In the
   * current implementation it also does not include send window buffering inside the HTTP/2 codec.
   * In the future it is likely that work will be done to make this duration more accurate.
   */
  'time_to_last_downstream_tx_byte'?: (_google_protobuf_Duration | null);
  /**
   * The upstream remote/destination address that handles this exchange. This does not include
   * retries.
   */
  'upstream_remote_address'?: (_envoy_config_core_v3_Address | null);
  /**
   * The upstream local/origin address that handles this exchange. This does not include retries.
   */
  'upstream_local_address'?: (_envoy_config_core_v3_Address | null);
  /**
   * The upstream cluster that ``upstream_remote_address`` belongs to.
   */
  'upstream_cluster'?: (string);
  /**
   * Flags indicating occurrences during request/response processing.
   */
  'response_flags'?: (_envoy_data_accesslog_v3_ResponseFlags | null);
  /**
   * All metadata encountered during request processing, including endpoint
   * selection.
   * 
   * This can be used to associate IDs attached to the various configurations
   * used to process this request with the access log entry. For example, a
   * route created from a higher level forwarding rule with some ID can place
   * that ID in this field and cross reference later. It can also be used to
   * determine if a canary endpoint was used or not.
   */
  'metadata'?: (_envoy_config_core_v3_Metadata | null);
  /**
   * If upstream connection failed due to transport socket (e.g. TLS handshake), provides the
   * failure reason from the transport socket. The format of this field depends on the configured
   * upstream transport socket. Common TLS failures are in
   * :ref:`TLS trouble shooting <arch_overview_ssl_trouble_shooting>`.
   */
  'upstream_transport_failure_reason'?: (string);
  /**
   * The name of the route
   */
  'route_name'?: (string);
  /**
   * This field is the downstream direct remote address on which the request from the user was
   * received. Note: This is always the physical peer, even if the remote address is inferred from
   * for example the x-forwarder-for header, proxy protocol, etc.
   */
  'downstream_direct_remote_address'?: (_envoy_config_core_v3_Address | null);
  /**
   * Map of filter state in stream info that have been configured to be logged. If the filter
   * state serialized to any message other than ``google.protobuf.Any`` it will be packed into
   * ``google.protobuf.Any``.
   */
  'filter_state_objects'?: ({[key: string]: _google_protobuf_Any});
  /**
   * A list of custom tags, which annotate logs with additional information.
   * To configure this value, users should configure
   * :ref:`custom_tags <envoy_v3_api_field_extensions.access_loggers.grpc.v3.CommonGrpcAccessLogConfig.custom_tags>`.
   */
  'custom_tags'?: ({[key: string]: string});
  /**
   * For HTTP: Total duration in milliseconds of the request from the start time to the last byte out.
   * For TCP: Total duration in milliseconds of the downstream connection.
   * This is the total duration of the request (i.e., when the request's ActiveStream is destroyed)
   * and may be longer than ``time_to_last_downstream_tx_byte``.
   */
  'duration'?: (_google_protobuf_Duration | null);
  /**
   * For HTTP: Number of times the request is attempted upstream. Note that the field is omitted when the request was never attempted upstream.
   * For TCP: Number of times the connection request is attempted upstream. Note that the field is omitted when the connect request was never attempted upstream.
   */
  'upstream_request_attempt_count'?: (number);
  /**
   * Connection termination details may provide additional information about why the connection was terminated by Envoy for L4 reasons.
   */
  'connection_termination_details'?: (string);
  /**
   * Optional unique id of stream (TCP connection, long-live HTTP2 stream, HTTP request) for logging and tracing.
   * This could be any format string that could be used to identify one stream.
   */
  'stream_id'?: (string);
  /**
   * If this log entry is final log entry that flushed after the stream completed or
   * intermediate log entry that flushed periodically during the stream.
   * There may be multiple intermediate log entries and only one final log entry for each
   * long-live stream (TCP connection, long-live HTTP2 stream).
   * And if it is necessary, unique ID or identifier can be added to the log entry
   * :ref:`stream_id <envoy_v3_api_field_data.accesslog.v3.AccessLogCommon.stream_id>` to
   * correlate all these intermediate log entries and final log entry.
   * 
   * .. attention::
   * 
   * This field is deprecated in favor of ``access_log_type`` for better indication of the
   * type of the access log record.
   */
  'intermediate_log_entry'?: (boolean);
  /**
   * If downstream connection in listener failed due to transport socket (e.g. TLS handshake), provides the
   * failure reason from the transport socket. The format of this field depends on the configured downstream
   * transport socket. Common TLS failures are in :ref:`TLS trouble shooting <arch_overview_ssl_trouble_shooting>`.
   */
  'downstream_transport_failure_reason'?: (string);
  /**
   * For HTTP: Total number of bytes sent to the downstream by the http stream.
   * For TCP: Total number of bytes sent to the downstream by the tcp proxy.
   */
  'downstream_wire_bytes_sent'?: (number | string | Long);
  /**
   * For HTTP: Total number of bytes received from the downstream by the http stream. Envoy over counts sizes of received HTTP/1.1 pipelined requests by adding up bytes of requests in the pipeline to the one currently being processed.
   * For TCP: Total number of bytes received from the downstream by the tcp proxy.
   */
  'downstream_wire_bytes_received'?: (number | string | Long);
  /**
   * For HTTP: Total number of bytes sent to the upstream by the http stream. This value accumulates during upstream retries.
   * For TCP: Total number of bytes sent to the upstream by the tcp proxy.
   */
  'upstream_wire_bytes_sent'?: (number | string | Long);
  /**
   * For HTTP: Total number of bytes received from the upstream by the http stream.
   * For TCP: Total number of bytes sent to the upstream by the tcp proxy.
   */
  'upstream_wire_bytes_received'?: (number | string | Long);
  /**
   * The type of the access log, which indicates when the log was recorded.
   * See :ref:`ACCESS_LOG_TYPE <config_access_log_format_access_log_type>` for the available values.
   * In case the access log was recorded by a flow which does not correspond to one of the supported
   * values, then the default value will be ``NotSet``.
   * For more information about how access log behaves and when it is being recorded,
   * please refer to :ref:`access logging <arch_overview_access_logs>`.
   */
  'access_log_type'?: (_envoy_data_accesslog_v3_AccessLogType | keyof typeof _envoy_data_accesslog_v3_AccessLogType);
}

/**
 * Defines fields that are shared by all Envoy access logs.
 * [#next-free-field: 34]
 */
export interface AccessLogCommon__Output {
  /**
   * [#not-implemented-hide:]
   * This field indicates the rate at which this log entry was sampled.
   * Valid range is (0.0, 1.0].
   */
  'sample_rate': (number);
  /**
   * This field is the remote/origin address on which the request from the user was received.
   * Note: This may not be the physical peer. E.g, if the remote address is inferred from for
   * example the x-forwarder-for header, proxy protocol, etc.
   */
  'downstream_remote_address': (_envoy_config_core_v3_Address__Output | null);
  /**
   * This field is the local/destination address on which the request from the user was received.
   */
  'downstream_local_address': (_envoy_config_core_v3_Address__Output | null);
  /**
   * If the connection is secure,S this field will contain TLS properties.
   */
  'tls_properties': (_envoy_data_accesslog_v3_TLSProperties__Output | null);
  /**
   * The time that Envoy started servicing this request. This is effectively the time that the first
   * downstream byte is received.
   */
  'start_time': (_google_protobuf_Timestamp__Output | null);
  /**
   * Interval between the first downstream byte received and the last
   * downstream byte received (i.e. time it takes to receive a request).
   */
  'time_to_last_rx_byte': (_google_protobuf_Duration__Output | null);
  /**
   * Interval between the first downstream byte received and the first upstream byte sent. There may
   * by considerable delta between ``time_to_last_rx_byte`` and this value due to filters.
   * Additionally, the same caveats apply as documented in ``time_to_last_downstream_tx_byte`` about
   * not accounting for kernel socket buffer time, etc.
   */
  'time_to_first_upstream_tx_byte': (_google_protobuf_Duration__Output | null);
  /**
   * Interval between the first downstream byte received and the last upstream byte sent. There may
   * by considerable delta between ``time_to_last_rx_byte`` and this value due to filters.
   * Additionally, the same caveats apply as documented in ``time_to_last_downstream_tx_byte`` about
   * not accounting for kernel socket buffer time, etc.
   */
  'time_to_last_upstream_tx_byte': (_google_protobuf_Duration__Output | null);
  /**
   * Interval between the first downstream byte received and the first upstream
   * byte received (i.e. time it takes to start receiving a response).
   */
  'time_to_first_upstream_rx_byte': (_google_protobuf_Duration__Output | null);
  /**
   * Interval between the first downstream byte received and the last upstream
   * byte received (i.e. time it takes to receive a complete response).
   */
  'time_to_last_upstream_rx_byte': (_google_protobuf_Duration__Output | null);
  /**
   * Interval between the first downstream byte received and the first downstream byte sent.
   * There may be a considerable delta between the ``time_to_first_upstream_rx_byte`` and this field
   * due to filters. Additionally, the same caveats apply as documented in
   * ``time_to_last_downstream_tx_byte`` about not accounting for kernel socket buffer time, etc.
   */
  'time_to_first_downstream_tx_byte': (_google_protobuf_Duration__Output | null);
  /**
   * Interval between the first downstream byte received and the last downstream byte sent.
   * Depending on protocol, buffering, windowing, filters, etc. there may be a considerable delta
   * between ``time_to_last_upstream_rx_byte`` and this field. Note also that this is an approximate
   * time. In the current implementation it does not include kernel socket buffer time. In the
   * current implementation it also does not include send window buffering inside the HTTP/2 codec.
   * In the future it is likely that work will be done to make this duration more accurate.
   */
  'time_to_last_downstream_tx_byte': (_google_protobuf_Duration__Output | null);
  /**
   * The upstream remote/destination address that handles this exchange. This does not include
   * retries.
   */
  'upstream_remote_address': (_envoy_config_core_v3_Address__Output | null);
  /**
   * The upstream local/origin address that handles this exchange. This does not include retries.
   */
  'upstream_local_address': (_envoy_config_core_v3_Address__Output | null);
  /**
   * The upstream cluster that ``upstream_remote_address`` belongs to.
   */
  'upstream_cluster': (string);
  /**
   * Flags indicating occurrences during request/response processing.
   */
  'response_flags': (_envoy_data_accesslog_v3_ResponseFlags__Output | null);
  /**
   * All metadata encountered during request processing, including endpoint
   * selection.
   * 
   * This can be used to associate IDs attached to the various configurations
   * used to process this request with the access log entry. For example, a
   * route created from a higher level forwarding rule with some ID can place
   * that ID in this field and cross reference later. It can also be used to
   * determine if a canary endpoint was used or not.
   */
  'metadata': (_envoy_config_core_v3_Metadata__Output | null);
  /**
   * If upstream connection failed due to transport socket (e.g. TLS handshake), provides the
   * failure reason from the transport socket. The format of this field depends on the configured
   * upstream transport socket. Common TLS failures are in
   * :ref:`TLS trouble shooting <arch_overview_ssl_trouble_shooting>`.
   */
  'upstream_transport_failure_reason': (string);
  /**
   * The name of the route
   */
  'route_name': (string);
  /**
   * This field is the downstream direct remote address on which the request from the user was
   * received. Note: This is always the physical peer, even if the remote address is inferred from
   * for example the x-forwarder-for header, proxy protocol, etc.
   */
  'downstream_direct_remote_address': (_envoy_config_core_v3_Address__Output | null);
  /**
   * Map of filter state in stream info that have been configured to be logged. If the filter
   * state serialized to any message other than ``google.protobuf.Any`` it will be packed into
   * ``google.protobuf.Any``.
   */
  'filter_state_objects': ({[key: string]: _google_protobuf_Any__Output});
  /**
   * A list of custom tags, which annotate logs with additional information.
   * To configure this value, users should configure
   * :ref:`custom_tags <envoy_v3_api_field_extensions.access_loggers.grpc.v3.CommonGrpcAccessLogConfig.custom_tags>`.
   */
  'custom_tags': ({[key: string]: string});
  /**
   * For HTTP: Total duration in milliseconds of the request from the start time to the last byte out.
   * For TCP: Total duration in milliseconds of the downstream connection.
   * This is the total duration of the request (i.e., when the request's ActiveStream is destroyed)
   * and may be longer than ``time_to_last_downstream_tx_byte``.
   */
  'duration': (_google_protobuf_Duration__Output | null);
  /**
   * For HTTP: Number of times the request is attempted upstream. Note that the field is omitted when the request was never attempted upstream.
   * For TCP: Number of times the connection request is attempted upstream. Note that the field is omitted when the connect request was never attempted upstream.
   */
  'upstream_request_attempt_count': (number);
  /**
   * Connection termination details may provide additional information about why the connection was terminated by Envoy for L4 reasons.
   */
  'connection_termination_details': (string);
  /**
   * Optional unique id of stream (TCP connection, long-live HTTP2 stream, HTTP request) for logging and tracing.
   * This could be any format string that could be used to identify one stream.
   */
  'stream_id': (string);
  /**
   * If this log entry is final log entry that flushed after the stream completed or
   * intermediate log entry that flushed periodically during the stream.
   * There may be multiple intermediate log entries and only one final log entry for each
   * long-live stream (TCP connection, long-live HTTP2 stream).
   * And if it is necessary, unique ID or identifier can be added to the log entry
   * :ref:`stream_id <envoy_v3_api_field_data.accesslog.v3.AccessLogCommon.stream_id>` to
   * correlate all these intermediate log entries and final log entry.
   * 
   * .. attention::
   * 
   * This field is deprecated in favor of ``access_log_type`` for better indication of the
   * type of the access log record.
   */
  'intermediate_log_entry': (boolean);
  /**
   * If downstream connection in listener failed due to transport socket (e.g. TLS handshake), provides the
   * failure reason from the transport socket. The format of this field depends on the configured downstream
   * transport socket. Common TLS failures are in :ref:`TLS trouble shooting <arch_overview_ssl_trouble_shooting>`.
   */
  'downstream_transport_failure_reason': (string);
  /**
   * For HTTP: Total number of bytes sent to the downstream by the http stream.
   * For TCP: Total number of bytes sent to the downstream by the tcp proxy.
   */
  'downstream_wire_bytes_sent': (string);
  /**
   * For HTTP: Total number of bytes received from the downstream by the http stream. Envoy over counts sizes of received HTTP/1.1 pipelined requests by adding up bytes of requests in the pipeline to the one currently being processed.
   * For TCP: Total number of bytes received from the downstream by the tcp proxy.
   */
  'downstream_wire_bytes_received': (string);
  /**
   * For HTTP: Total number of bytes sent to the upstream by the http stream. This value accumulates during upstream retries.
   * For TCP: Total number of bytes sent to the upstream by the tcp proxy.
   */
  'upstream_wire_bytes_sent': (string);
  /**
   * For HTTP: Total number of bytes received from the upstream by the http stream.
   * For TCP: Total number of bytes sent to the upstream by the tcp proxy.
   */
  'upstream_wire_bytes_received': (string);
  /**
   * The type of the access log, which indicates when the log was recorded.
   * See :ref:`ACCESS_LOG_TYPE <config_access_log_format_access_log_type>` for the available values.
   * In case the access log was recorded by a flow which does not correspond to one of the supported
   * values, then the default value will be ``NotSet``.
   * For more information about how access log behaves and when it is being recorded,
   * please refer to :ref:`access logging <arch_overview_access_logs>`.
   */
  'access_log_type': (keyof typeof _envoy_data_accesslog_v3_AccessLogType);
}
