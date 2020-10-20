// Original file: deps/envoy-api/envoy/api/v2/endpoint/load_report.proto

import { Address as _envoy_api_v2_core_Address, Address__Output as _envoy_api_v2_core_Address__Output } from '../../../../envoy/api/v2/core/Address';
import { EndpointLoadMetricStats as _envoy_api_v2_endpoint_EndpointLoadMetricStats, EndpointLoadMetricStats__Output as _envoy_api_v2_endpoint_EndpointLoadMetricStats__Output } from '../../../../envoy/api/v2/endpoint/EndpointLoadMetricStats';
import { Struct as _google_protobuf_Struct, Struct__Output as _google_protobuf_Struct__Output } from '../../../../google/protobuf/Struct';
import { Long } from '@grpc/proto-loader';

/**
 * [#not-implemented-hide:] Not configuration. TBD how to doc proto APIs.
 * [#next-free-field: 8]
 */
export interface UpstreamEndpointStats {
  /**
   * Upstream host address.
   */
  'address'?: (_envoy_api_v2_core_Address);
  /**
   * The total number of requests successfully completed by the endpoints in the
   * locality. These include non-5xx responses for HTTP, where errors
   * originate at the client and the endpoint responded successfully. For gRPC,
   * the grpc-status values are those not covered by total_error_requests below.
   */
  'total_successful_requests'?: (number | string | Long);
  /**
   * The total number of unfinished requests for this endpoint.
   */
  'total_requests_in_progress'?: (number | string | Long);
  /**
   * The total number of requests that failed due to errors at the endpoint.
   * For HTTP these are responses with 5xx status codes and for gRPC the
   * grpc-status values:
   * 
   * - DeadlineExceeded
   * - Unimplemented
   * - Internal
   * - Unavailable
   * - Unknown
   * - DataLoss
   */
  'total_error_requests'?: (number | string | Long);
  /**
   * Stats for multi-dimensional load balancing.
   */
  'load_metric_stats'?: (_envoy_api_v2_endpoint_EndpointLoadMetricStats)[];
  /**
   * Opaque and implementation dependent metadata of the
   * endpoint. Envoy will pass this directly to the management server.
   */
  'metadata'?: (_google_protobuf_Struct);
  /**
   * The total number of requests that were issued to this endpoint
   * since the last report. A single TCP connection, HTTP or gRPC
   * request or stream is counted as one request.
   */
  'total_issued_requests'?: (number | string | Long);
}

/**
 * [#not-implemented-hide:] Not configuration. TBD how to doc proto APIs.
 * [#next-free-field: 8]
 */
export interface UpstreamEndpointStats__Output {
  /**
   * Upstream host address.
   */
  'address'?: (_envoy_api_v2_core_Address__Output);
  /**
   * The total number of requests successfully completed by the endpoints in the
   * locality. These include non-5xx responses for HTTP, where errors
   * originate at the client and the endpoint responded successfully. For gRPC,
   * the grpc-status values are those not covered by total_error_requests below.
   */
  'total_successful_requests': (string);
  /**
   * The total number of unfinished requests for this endpoint.
   */
  'total_requests_in_progress': (string);
  /**
   * The total number of requests that failed due to errors at the endpoint.
   * For HTTP these are responses with 5xx status codes and for gRPC the
   * grpc-status values:
   * 
   * - DeadlineExceeded
   * - Unimplemented
   * - Internal
   * - Unavailable
   * - Unknown
   * - DataLoss
   */
  'total_error_requests': (string);
  /**
   * Stats for multi-dimensional load balancing.
   */
  'load_metric_stats': (_envoy_api_v2_endpoint_EndpointLoadMetricStats__Output)[];
  /**
   * Opaque and implementation dependent metadata of the
   * endpoint. Envoy will pass this directly to the management server.
   */
  'metadata'?: (_google_protobuf_Struct__Output);
  /**
   * The total number of requests that were issued to this endpoint
   * since the last report. A single TCP connection, HTTP or gRPC
   * request or stream is counted as one request.
   */
  'total_issued_requests': (string);
}
