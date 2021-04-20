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

export interface Watcher<UpdateType> {
  onValidUpdate(update: UpdateType): void;
  onTransientError(error: StatusObject): void;
  onResourceDoesNotExist(): void;
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
  handleResponses(responses: ResponseType[]): string | null;

  reportStreamError(status: StatusObject): void;
}