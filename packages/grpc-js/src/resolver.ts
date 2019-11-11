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

import { ServiceError } from './call';
import { ServiceConfig } from './service-config';
import * as resolver_dns from './resolver-dns';
import * as resolver_uds from './resolver-uds';
import { StatusObject } from './call-stream';

/**
 * A listener object passed to the resolver's constructor that provides name
 * resolution updates back to the resolver's owner.
 */
export interface ResolverListener {
  /**
   * Called whenever the resolver has new name resolution results to report
   * @param addressList The new list of backend addresses
   * @param serviceConfig The new service configuration corresponding to the
   *     `addressList`. Will be `null` if no service configuration was
   *     retrieved or if the service configuration was invalid
   * @param serviceConfigError If non-`null`, indicates that the retrieved
   *     service configuration was invalid
   */
  onSuccessfulResolution(
    addressList: string[],
    serviceConfig: ServiceConfig | null,
    serviceConfigError: StatusObject | null
  ): void;
  /**
   * Called whenever a name resolution attempt fails.
   * @param error Describes how resolution failed
   */
  onError(error: StatusObject): void;
}

/**
 * A resolver class that handles one or more of the name syntax schemes defined
 * in the [gRPC Name Resolution document](https://github.com/grpc/grpc/blob/master/doc/naming.md)
 */
export interface Resolver {
  /**
   * Indicates that the caller wants new name resolution data. Calling this
   * function may eventually result in calling one of the `ResolverListener`
   * functions, but that is not guaranteed. Those functions will never be
   * called synchronously with the constructor or updateResolution.
   */
  updateResolution(): void;
}

export interface ResolverConstructor {
  new (target: string, listener: ResolverListener): Resolver;
  /**
   * Get the default authority for a target. This loosely corresponds to that
   * target's hostname. Throws an error if this resolver class cannot parse the
   * `target`.
   * @param target
   */
  getDefaultAuthority(target: string): string;
}

const registeredResolvers: { [prefix: string]: ResolverConstructor } = {};
let defaultResolver: ResolverConstructor | null = null;

/**
 * Register a resolver class to handle target names prefixed with the `prefix`
 * string. This prefix should correspond to a URI scheme name listed in the
 * [gRPC Name Resolution document](https://github.com/grpc/grpc/blob/master/doc/naming.md)
 * @param prefix
 * @param resolverClass
 */
export function registerResolver(
  prefix: string,
  resolverClass: ResolverConstructor
) {
  registeredResolvers[prefix] = resolverClass;
}

/**
 * Register a default resolver to handle target names that do not start with
 * any registered prefix.
 * @param resolverClass
 */
export function registerDefaultResolver(resolverClass: ResolverConstructor) {
  defaultResolver = resolverClass;
}

/**
 * Create a name resolver for the specified target, if possible. Throws an
 * error if no such name resolver can be created.
 * @param target
 * @param listener
 */
export function createResolver(
  target: string,
  listener: ResolverListener
): Resolver {
  for (const prefix of Object.keys(registeredResolvers)) {
    if (target.startsWith(prefix)) {
      return new registeredResolvers[prefix](target, listener);
    }
  }
  if (defaultResolver !== null) {
    return new defaultResolver(target, listener);
  }
  throw new Error(`No resolver could be created for target ${target}`);
}

/**
 * Get the default authority for the specified target, if possible. Throws an
 * error if no registered name resolver can parse that target string.
 * @param target
 */
export function getDefaultAuthority(target: string): string {
  for (const prefix of Object.keys(registeredResolvers)) {
    if (target.startsWith(prefix)) {
      return registeredResolvers[prefix].getDefaultAuthority(target);
    }
  }
  if (defaultResolver !== null) {
    return defaultResolver.getDefaultAuthority(target);
  }
  throw new Error(`Invalid target ${target}`);
}

export function registerAll() {
  resolver_dns.setup();
  resolver_uds.setup();
}
