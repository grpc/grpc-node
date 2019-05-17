/*
 * Copyright 2019 gRPC authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

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
  [key: string]: string | number;
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
  'grpc.keepalive_timeout_ms': true,
};
