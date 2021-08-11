/*
 * Copyright 2021 gRPC authors.
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

import { experimental, logVerbosity } from "@grpc/grpc-js";
import trace = experimental.trace;

export const EXPERIMENTAL_FAULT_INJECTION = process.env.GRPC_XDS_EXPERIMENTAL_FAULT_INJECTION;

trace(logVerbosity.DEBUG, 'environment', 'EXPERIMENTAL_FAULT_INJECTION = ' + EXPERIMENTAL_FAULT_INJECTION);