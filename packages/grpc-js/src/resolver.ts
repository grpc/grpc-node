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

import { ServiceError } from "./call";
import { ServiceConfig } from "./service-config";

export interface ResolverListener {
  onSuccessfulResolution(addressList: string[], serviceConfig: ServiceConfig | null, serviceConfigError: ServiceError | null): void;
  onError(error: ServiceError): void;
}

export interface Resolver {
  updateResolution(): void;
}

export interface ResolverConstructor {
  new(target: string, listener: ResolverListener): Resolver;
}

const registeredResolvers: {[prefix: string]: ResolverConstructor} = {};
let defaultResolver: ResolverConstructor | null = null;

export function registerResolver(prefix: string, resolverClass: ResolverConstructor) {
  registeredResolvers[prefix] = resolverClass;
}

export function registerDefaultResolver(resolverClass: ResolverConstructor) {
  defaultResolver = resolverClass;
}

export function createResolver(target: string, listener: ResolverListener): Resolver {
  for (const prefix of Object.keys(registeredResolvers)) {
    if (target.startsWith(prefix)) {
      return new registeredResolvers[prefix](target, listener);
    }
  }
  if (defaultResolver !== null) {
    return new defaultResolver(target, listener);
  }
  throw new Error('No resolver could be created for the provided target');
}