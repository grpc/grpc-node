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

/* Switches to enable or disable experimental features. If the default is
 * 'true', the feature is enabled by default, if the default is 'false' the
 * feature is disabled by default. */
export const EXPERIMENTAL_FAULT_INJECTION = (process.env.GRPC_XDS_EXPERIMENTAL_FAULT_INJECTION ?? 'true') === 'true';
export const EXPERIMENTAL_OUTLIER_DETECTION = (process.env.GRPC_EXPERIMENTAL_ENABLE_OUTLIER_DETECTION ?? 'true') === 'true';
export const EXPERIMENTAL_RETRY = (process.env.GRPC_XDS_EXPERIMENTAL_ENABLE_RETRY ?? 'true') === 'true';
export const EXPERIMENTAL_FEDERATION = (process.env.GRPC_EXPERIMENTAL_XDS_FEDERATION ?? 'false') === 'true';
export const EXPERIMENTAL_CUSTOM_LB_CONFIG = (process.env.GRPC_EXPERIMENTAL_XDS_CUSTOM_LB_CONFIG ?? 'true') === 'true';
export const EXPERIMENTAL_RING_HASH = (process.env.GRPC_XDS_EXPERIMENTAL_ENABLE_RING_HASH ?? 'true') === 'true';
export const EXPERIMENTAL_PICK_FIRST = (process.env.GRPC_EXPERIMENTAL_PICKFIRST_LB_CONFIG ?? 'false') === 'true';
