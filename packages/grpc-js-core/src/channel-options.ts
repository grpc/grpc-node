/**
 * An interface that contains options used when initializing a Channel instance.
 */
export interface ChannelOptions {
  'grpc.ssl_target_name_override': string;
  'grpc.primary_user_agent': string;
  'grpc.secondary_user_agent': string;
  'grpc.default_authority': string;
  'grpc.keepalive_time_ms': number;
  'grpc.keepalive_timeout_ms': number;
  [key: string]: string|number;
}

/**
 * This is for checking provided options at runtime. This is an object for
 * easier membership checking.
 */
export const recognizedOptions = {
  'grpc.ssl_target_name_override': true,
  'grpc.primary_user_agent': true,
  'grpc.secondary_user_agent': true,
  'grpc.default_authority': true,
  'grpc.keepalive_time_ms': true,
  'grpc.keepalive_timeout_ms': true
};
