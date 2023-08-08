/*
 * Copyright 2023 gRPC authors.
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
 */

import { experimental } from '@grpc/grpc-js';
import { Duration__Output } from './generated/google/protobuf/Duration';
import Duration = experimental.Duration;

/**
 * Convert a Duration protobuf message object to a Duration object as used in
 * the ServiceConfig definition. The difference is that the protobuf message
 * defines seconds as a long, which is represented as a string in JavaScript,
 * and the one used in the service config defines it as a number.
 * @param duration
 */
export function protoDurationToDuration(duration: Duration__Output): Duration {
  return {
    seconds: Number.parseInt(duration.seconds),
    nanos: duration.nanos
  };
}
