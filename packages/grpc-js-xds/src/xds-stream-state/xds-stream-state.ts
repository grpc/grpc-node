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

import { StatusObject } from "@grpc/grpc-js";
import { Any__Output } from "../generated/google/protobuf/Any";

export interface Watcher<UpdateType> {
  /* Including the isV2 flag here is a bit of a kludge. It would probably be
   * better for XdsStreamState#handleResponses to transform the protobuf
   * message type into a library-specific configuration object type, to
   * remove a lot of duplicate logic, including logic for handling that
   * flag. */
  onValidUpdate(update: UpdateType, isV2: boolean): void;
  onTransientError(error: StatusObject): void;
  onResourceDoesNotExist(): void;
}

export interface ResourcePair<ResourceType> {
  resource: ResourceType;
  raw: Any__Output;
}

export interface AcceptedResourceEntry {
  name: string;
  raw: Any__Output;
}

export interface RejectedResourceEntry {
  name: string;
  raw: Any__Output;
  error: string;
}

export interface HandleResponseResult {
  accepted: AcceptedResourceEntry[];
  rejected: RejectedResourceEntry[];
  missing: string[];
}

export interface XdsStreamState<ResponseType> {
  versionInfo: string;
  nonce: string;
  getResourceNames(): string[];
  /**
   * Returns a string containing the error details if the message should be nacked,
   * or null if it should be acked.
   * @param responses
   */
  handleResponses(responses: ResourcePair<ResponseType>[], isV2: boolean): HandleResponseResult;

  reportStreamError(status: StatusObject): void;
}