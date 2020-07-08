// Original file: deps/envoy-api/envoy/config/filter/accesslog/v2/accesslog.proto


// Original file: deps/envoy-api/envoy/config/filter/accesslog/v2/accesslog.proto

export enum _envoy_config_filter_accesslog_v2_GrpcStatusFilter_Status {
  OK = 0,
  CANCELED = 1,
  UNKNOWN = 2,
  INVALID_ARGUMENT = 3,
  DEADLINE_EXCEEDED = 4,
  NOT_FOUND = 5,
  ALREADY_EXISTS = 6,
  PERMISSION_DENIED = 7,
  RESOURCE_EXHAUSTED = 8,
  FAILED_PRECONDITION = 9,
  ABORTED = 10,
  OUT_OF_RANGE = 11,
  UNIMPLEMENTED = 12,
  INTERNAL = 13,
  UNAVAILABLE = 14,
  DATA_LOSS = 15,
  UNAUTHENTICATED = 16,
}

export interface GrpcStatusFilter {
  'statuses'?: (_envoy_config_filter_accesslog_v2_GrpcStatusFilter_Status | keyof typeof _envoy_config_filter_accesslog_v2_GrpcStatusFilter_Status)[];
  'exclude'?: (boolean);
}

export interface GrpcStatusFilter__Output {
  'statuses': (keyof typeof _envoy_config_filter_accesslog_v2_GrpcStatusFilter_Status)[];
  'exclude': (boolean);
}
