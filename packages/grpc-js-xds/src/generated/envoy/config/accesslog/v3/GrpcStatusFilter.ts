// Original file: deps/envoy-api/envoy/config/accesslog/v3/accesslog.proto


// Original file: deps/envoy-api/envoy/config/accesslog/v3/accesslog.proto

export const _envoy_config_accesslog_v3_GrpcStatusFilter_Status = {
  OK: 'OK',
  CANCELED: 'CANCELED',
  UNKNOWN: 'UNKNOWN',
  INVALID_ARGUMENT: 'INVALID_ARGUMENT',
  DEADLINE_EXCEEDED: 'DEADLINE_EXCEEDED',
  NOT_FOUND: 'NOT_FOUND',
  ALREADY_EXISTS: 'ALREADY_EXISTS',
  PERMISSION_DENIED: 'PERMISSION_DENIED',
  RESOURCE_EXHAUSTED: 'RESOURCE_EXHAUSTED',
  FAILED_PRECONDITION: 'FAILED_PRECONDITION',
  ABORTED: 'ABORTED',
  OUT_OF_RANGE: 'OUT_OF_RANGE',
  UNIMPLEMENTED: 'UNIMPLEMENTED',
  INTERNAL: 'INTERNAL',
  UNAVAILABLE: 'UNAVAILABLE',
  DATA_LOSS: 'DATA_LOSS',
  UNAUTHENTICATED: 'UNAUTHENTICATED',
} as const;

export type _envoy_config_accesslog_v3_GrpcStatusFilter_Status =
  | 'OK'
  | 0
  | 'CANCELED'
  | 1
  | 'UNKNOWN'
  | 2
  | 'INVALID_ARGUMENT'
  | 3
  | 'DEADLINE_EXCEEDED'
  | 4
  | 'NOT_FOUND'
  | 5
  | 'ALREADY_EXISTS'
  | 6
  | 'PERMISSION_DENIED'
  | 7
  | 'RESOURCE_EXHAUSTED'
  | 8
  | 'FAILED_PRECONDITION'
  | 9
  | 'ABORTED'
  | 10
  | 'OUT_OF_RANGE'
  | 11
  | 'UNIMPLEMENTED'
  | 12
  | 'INTERNAL'
  | 13
  | 'UNAVAILABLE'
  | 14
  | 'DATA_LOSS'
  | 15
  | 'UNAUTHENTICATED'
  | 16

export type _envoy_config_accesslog_v3_GrpcStatusFilter_Status__Output = typeof _envoy_config_accesslog_v3_GrpcStatusFilter_Status[keyof typeof _envoy_config_accesslog_v3_GrpcStatusFilter_Status]

/**
 * Filters gRPC requests based on their response status. If a gRPC status is not
 * provided, the filter will infer the status from the HTTP status code.
 */
export interface GrpcStatusFilter {
  /**
   * Logs only responses that have any one of the gRPC statuses in this field.
   */
  'statuses'?: (_envoy_config_accesslog_v3_GrpcStatusFilter_Status)[];
  /**
   * If included and set to true, the filter will instead block all responses
   * with a gRPC status or inferred gRPC status enumerated in statuses, and
   * allow all other responses.
   */
  'exclude'?: (boolean);
}

/**
 * Filters gRPC requests based on their response status. If a gRPC status is not
 * provided, the filter will infer the status from the HTTP status code.
 */
export interface GrpcStatusFilter__Output {
  /**
   * Logs only responses that have any one of the gRPC statuses in this field.
   */
  'statuses': (_envoy_config_accesslog_v3_GrpcStatusFilter_Status__Output)[];
  /**
   * If included and set to true, the filter will instead block all responses
   * with a gRPC status or inferred gRPC status enumerated in statuses, and
   * allow all other responses.
   */
  'exclude': (boolean);
}
