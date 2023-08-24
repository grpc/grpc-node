// Original file: deps/envoy-api/envoy/data/accesslog/v3/accesslog.proto


// Original file: deps/envoy-api/envoy/data/accesslog/v3/accesslog.proto

/**
 * Reasons why the request was unauthorized
 */
export enum _envoy_data_accesslog_v3_ResponseFlags_Unauthorized_Reason {
  REASON_UNSPECIFIED = 0,
  /**
   * The request was denied by the external authorization service.
   */
  EXTERNAL_SERVICE = 1,
}

export interface _envoy_data_accesslog_v3_ResponseFlags_Unauthorized {
  'reason'?: (_envoy_data_accesslog_v3_ResponseFlags_Unauthorized_Reason | keyof typeof _envoy_data_accesslog_v3_ResponseFlags_Unauthorized_Reason);
}

export interface _envoy_data_accesslog_v3_ResponseFlags_Unauthorized__Output {
  'reason': (keyof typeof _envoy_data_accesslog_v3_ResponseFlags_Unauthorized_Reason);
}

/**
 * Flags indicating occurrences during request/response processing.
 * [#next-free-field: 28]
 */
export interface ResponseFlags {
  /**
   * Indicates local server healthcheck failed.
   */
  'failed_local_healthcheck'?: (boolean);
  /**
   * Indicates there was no healthy upstream.
   */
  'no_healthy_upstream'?: (boolean);
  /**
   * Indicates an there was an upstream request timeout.
   */
  'upstream_request_timeout'?: (boolean);
  /**
   * Indicates local codec level reset was sent on the stream.
   */
  'local_reset'?: (boolean);
  /**
   * Indicates remote codec level reset was received on the stream.
   */
  'upstream_remote_reset'?: (boolean);
  /**
   * Indicates there was a local reset by a connection pool due to an initial connection failure.
   */
  'upstream_connection_failure'?: (boolean);
  /**
   * Indicates the stream was reset due to an upstream connection termination.
   */
  'upstream_connection_termination'?: (boolean);
  /**
   * Indicates the stream was reset because of a resource overflow.
   */
  'upstream_overflow'?: (boolean);
  /**
   * Indicates no route was found for the request.
   */
  'no_route_found'?: (boolean);
  /**
   * Indicates that the request was delayed before proxying.
   */
  'delay_injected'?: (boolean);
  /**
   * Indicates that the request was aborted with an injected error code.
   */
  'fault_injected'?: (boolean);
  /**
   * Indicates that the request was rate-limited locally.
   */
  'rate_limited'?: (boolean);
  /**
   * Indicates if the request was deemed unauthorized and the reason for it.
   */
  'unauthorized_details'?: (_envoy_data_accesslog_v3_ResponseFlags_Unauthorized | null);
  /**
   * Indicates that the request was rejected because there was an error in rate limit service.
   */
  'rate_limit_service_error'?: (boolean);
  /**
   * Indicates the stream was reset due to a downstream connection termination.
   */
  'downstream_connection_termination'?: (boolean);
  /**
   * Indicates that the upstream retry limit was exceeded, resulting in a downstream error.
   */
  'upstream_retry_limit_exceeded'?: (boolean);
  /**
   * Indicates that the stream idle timeout was hit, resulting in a downstream 408.
   */
  'stream_idle_timeout'?: (boolean);
  /**
   * Indicates that the request was rejected because an envoy request header failed strict
   * validation.
   */
  'invalid_envoy_request_headers'?: (boolean);
  /**
   * Indicates there was an HTTP protocol error on the downstream request.
   */
  'downstream_protocol_error'?: (boolean);
  /**
   * Indicates there was a max stream duration reached on the upstream request.
   */
  'upstream_max_stream_duration_reached'?: (boolean);
  /**
   * Indicates the response was served from a cache filter.
   */
  'response_from_cache_filter'?: (boolean);
  /**
   * Indicates that a filter configuration is not available.
   */
  'no_filter_config_found'?: (boolean);
  /**
   * Indicates that request or connection exceeded the downstream connection duration.
   */
  'duration_timeout'?: (boolean);
  /**
   * Indicates there was an HTTP protocol error in the upstream response.
   */
  'upstream_protocol_error'?: (boolean);
  /**
   * Indicates no cluster was found for the request.
   */
  'no_cluster_found'?: (boolean);
  /**
   * Indicates overload manager terminated the request.
   */
  'overload_manager'?: (boolean);
  /**
   * Indicates a DNS resolution failed.
   */
  'dns_resolution_failure'?: (boolean);
}

/**
 * Flags indicating occurrences during request/response processing.
 * [#next-free-field: 28]
 */
export interface ResponseFlags__Output {
  /**
   * Indicates local server healthcheck failed.
   */
  'failed_local_healthcheck': (boolean);
  /**
   * Indicates there was no healthy upstream.
   */
  'no_healthy_upstream': (boolean);
  /**
   * Indicates an there was an upstream request timeout.
   */
  'upstream_request_timeout': (boolean);
  /**
   * Indicates local codec level reset was sent on the stream.
   */
  'local_reset': (boolean);
  /**
   * Indicates remote codec level reset was received on the stream.
   */
  'upstream_remote_reset': (boolean);
  /**
   * Indicates there was a local reset by a connection pool due to an initial connection failure.
   */
  'upstream_connection_failure': (boolean);
  /**
   * Indicates the stream was reset due to an upstream connection termination.
   */
  'upstream_connection_termination': (boolean);
  /**
   * Indicates the stream was reset because of a resource overflow.
   */
  'upstream_overflow': (boolean);
  /**
   * Indicates no route was found for the request.
   */
  'no_route_found': (boolean);
  /**
   * Indicates that the request was delayed before proxying.
   */
  'delay_injected': (boolean);
  /**
   * Indicates that the request was aborted with an injected error code.
   */
  'fault_injected': (boolean);
  /**
   * Indicates that the request was rate-limited locally.
   */
  'rate_limited': (boolean);
  /**
   * Indicates if the request was deemed unauthorized and the reason for it.
   */
  'unauthorized_details': (_envoy_data_accesslog_v3_ResponseFlags_Unauthorized__Output | null);
  /**
   * Indicates that the request was rejected because there was an error in rate limit service.
   */
  'rate_limit_service_error': (boolean);
  /**
   * Indicates the stream was reset due to a downstream connection termination.
   */
  'downstream_connection_termination': (boolean);
  /**
   * Indicates that the upstream retry limit was exceeded, resulting in a downstream error.
   */
  'upstream_retry_limit_exceeded': (boolean);
  /**
   * Indicates that the stream idle timeout was hit, resulting in a downstream 408.
   */
  'stream_idle_timeout': (boolean);
  /**
   * Indicates that the request was rejected because an envoy request header failed strict
   * validation.
   */
  'invalid_envoy_request_headers': (boolean);
  /**
   * Indicates there was an HTTP protocol error on the downstream request.
   */
  'downstream_protocol_error': (boolean);
  /**
   * Indicates there was a max stream duration reached on the upstream request.
   */
  'upstream_max_stream_duration_reached': (boolean);
  /**
   * Indicates the response was served from a cache filter.
   */
  'response_from_cache_filter': (boolean);
  /**
   * Indicates that a filter configuration is not available.
   */
  'no_filter_config_found': (boolean);
  /**
   * Indicates that request or connection exceeded the downstream connection duration.
   */
  'duration_timeout': (boolean);
  /**
   * Indicates there was an HTTP protocol error in the upstream response.
   */
  'upstream_protocol_error': (boolean);
  /**
   * Indicates no cluster was found for the request.
   */
  'no_cluster_found': (boolean);
  /**
   * Indicates overload manager terminated the request.
   */
  'overload_manager': (boolean);
  /**
   * Indicates a DNS resolution failed.
   */
  'dns_resolution_failure': (boolean);
}
