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

import { experimental, logVerbosity, Metadata, status, StatusObject } from "@grpc/grpc-js";
import { Any__Output } from "../generated/google/protobuf/Any";

const TRACER_NAME = 'xds_client';

export interface Watcher<UpdateType> {
  /* Including the isV2 flag here is a bit of a kludge. It would probably be
   * better for XdsStreamState#handleResponses to transform the protobuf
   * message type into a library-specific configuration object type, to
   * remove a lot of duplicate logic, including logic for handling that
   * flag. */
  onValidUpdate(update: UpdateType): void;
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
  reportAdsStreamStart(): void;

  addWatcher(name: string, watcher: Watcher<ResponseType>): void;
  removeWatcher(resourceName: string, watcher: Watcher<ResponseType>): void;
}

interface SubscriptionEntry<ResponseType> {
  watchers: Watcher<ResponseType>[];
  cachedResponse: ResponseType | null;
  resourceTimer: NodeJS.Timer;
  deletionIgnored: boolean;
}

const RESOURCE_TIMEOUT_MS = 15_000;

export abstract class BaseXdsStreamState<ResponseType> implements XdsStreamState<ResponseType> {
  versionInfo = '';
  nonce = '';

  private subscriptions: Map<string, SubscriptionEntry<ResponseType>> = new Map<string, SubscriptionEntry<ResponseType>>();
  private isAdsStreamRunning = false;
  private ignoreResourceDeletion = false;

  constructor(private updateResourceNames: () => void) {}

  protected trace(text: string) {
    experimental.trace(logVerbosity.DEBUG, TRACER_NAME, this.getProtocolName() + ' | ' + text);
  }

  private startResourceTimer(subscriptionEntry: SubscriptionEntry<ResponseType>) {
    clearTimeout(subscriptionEntry.resourceTimer);
    subscriptionEntry.resourceTimer = setTimeout(() => {
      for (const watcher of subscriptionEntry.watchers) {
        watcher.onResourceDoesNotExist();
      }
    }, RESOURCE_TIMEOUT_MS);
  }

  addWatcher(name: string, watcher: Watcher<ResponseType>): void {
    this.trace('Adding watcher for name ' + name);
    let subscriptionEntry = this.subscriptions.get(name);
    let addedName = false;
    if (subscriptionEntry === undefined) {
      addedName = true;
      subscriptionEntry = {
        watchers: [],
        cachedResponse: null,
        resourceTimer: setTimeout(() => {}, 0),
        deletionIgnored: false
      };
      if (this.isAdsStreamRunning) {
        this.startResourceTimer(subscriptionEntry);
      }
      this.subscriptions.set(name, subscriptionEntry);
    }
    subscriptionEntry.watchers.push(watcher);
    if (subscriptionEntry.cachedResponse !== null) {
      const cachedResponse = subscriptionEntry.cachedResponse;
      /* These updates normally occur asynchronously, so we ensure that
       * the same happens here */
      process.nextTick(() => {
        this.trace('Reporting existing update for new watcher for name ' + name);
        watcher.onValidUpdate(cachedResponse);
      });
    }
    if (addedName) {
      this.updateResourceNames();
    }
  }
  removeWatcher(resourceName: string, watcher: Watcher<ResponseType>): void {
    this.trace('Removing watcher for name ' + resourceName);
    const subscriptionEntry = this.subscriptions.get(resourceName);
    if (subscriptionEntry !== undefined) {
      const entryIndex = subscriptionEntry.watchers.indexOf(watcher);
      if (entryIndex >= 0) {
        subscriptionEntry.watchers.splice(entryIndex, 1);
      }
      if (subscriptionEntry.watchers.length === 0) {
        clearTimeout(subscriptionEntry.resourceTimer);
        if (subscriptionEntry.deletionIgnored) {
          experimental.log(logVerbosity.INFO, 'Unsubscribing from resource with previously ignored deletion: ' + resourceName);
        }
        this.subscriptions.delete(resourceName);
        this.updateResourceNames();
      }
    }
  }

  getResourceNames(): string[] {
    return Array.from(this.subscriptions.keys());
  }
  handleResponses(responses: ResourcePair<ResponseType>[]): HandleResponseResult {
    let result: HandleResponseResult = {
      accepted: [],
      rejected: [],
      missing: []
    }
    const allResourceNames = new Set<string>();
    for (const {resource, raw} of responses) {
      const resourceName = this.getResourceName(resource);
      allResourceNames.add(resourceName);
      const subscriptionEntry = this.subscriptions.get(resourceName);
      if (this.validateResponse(resource)) {
        result.accepted.push({
          name: resourceName,
          raw: raw});
        if (subscriptionEntry) {
          for (const watcher of subscriptionEntry.watchers) {
            /* Use process.nextTick to prevent errors from the watcher from
             * bubbling up through here. */
            process.nextTick(() => {
              watcher.onValidUpdate(resource);
            });
          }
          clearTimeout(subscriptionEntry.resourceTimer);
          subscriptionEntry.cachedResponse = resource;
          if (subscriptionEntry.deletionIgnored) {
            experimental.log(logVerbosity.INFO, `Received resource with previously ignored deletion: ${resourceName}`);
            subscriptionEntry.deletionIgnored = false;
          }
        }
      } else {
        this.trace('Validation failed for message ' + JSON.stringify(resource));
        result.rejected.push({
          name: resourceName, 
          raw: raw,
          error: `Validation failed for resource ${resourceName}`
        });
        if (subscriptionEntry) {
          for (const watcher of subscriptionEntry.watchers) {
            /* Use process.nextTick to prevent errors from the watcher from
             * bubbling up through here. */
            process.nextTick(() => {
              watcher.onTransientError({
                code: status.UNAVAILABLE,
                details: `Validation failed for resource ${resourceName}`,
                metadata: new Metadata()
              });
            });
          }
          clearTimeout(subscriptionEntry.resourceTimer);
        }
      }
    }
    result.missing = this.handleMissingNames(allResourceNames);
    this.trace('Received response with resource names [' + Array.from(allResourceNames) + ']');
    return result;
  }
  reportStreamError(status: StatusObject): void {
    for (const subscriptionEntry of this.subscriptions.values()) {
      for (const watcher of subscriptionEntry.watchers) {
        watcher.onTransientError(status);
      }
      clearTimeout(subscriptionEntry.resourceTimer);
    }
    this.isAdsStreamRunning = false;
    this.nonce = '';
  }

  reportAdsStreamStart() {
    if (this.isAdsStreamRunning) {
      return;
    }
    this.isAdsStreamRunning = true;
    for (const subscriptionEntry of this.subscriptions.values()) {
      if (subscriptionEntry.cachedResponse === null) {
        this.startResourceTimer(subscriptionEntry);
      }
    }
  }

  private handleMissingNames(allResponseNames: Set<String>): string[] {
    if (this.isStateOfTheWorld()) {
      const missingNames: string[] = [];
      for (const [resourceName, subscriptionEntry] of this.subscriptions.entries()) {
        if (!allResponseNames.has(resourceName) && subscriptionEntry.cachedResponse !== null) {
          if (this.ignoreResourceDeletion) {
            if (!subscriptionEntry.deletionIgnored) {
              experimental.log(logVerbosity.ERROR, 'Ignoring nonexistent resource ' + resourceName);
              subscriptionEntry.deletionIgnored = true;
            }
          } else {
            this.trace('Reporting resource does not exist named ' + resourceName);
            missingNames.push(resourceName);
            for (const watcher of subscriptionEntry.watchers) {
              /* Use process.nextTick to prevent errors from the watcher from
               * bubbling up through here. */
              process.nextTick(() => {
                watcher.onResourceDoesNotExist();
              });
            }
            subscriptionEntry.cachedResponse = null;
          }
        }
      }
      return missingNames;
    } else {
      return [];
    }
  }

  enableIgnoreResourceDeletion() {
    this.ignoreResourceDeletion = true;
  }

  /**
   * Apply the validation rules for this resource type to this resource
   * instance.
   * This function is public so that the LDS validateResponse can call into
   * the RDS validateResponse.
   * @param resource The resource object sent by the xDS server
   */
  public abstract validateResponse(resource: ResponseType): boolean;
  /**
   * Get the name of a resource object. The name is some field of the object, so
   * getting it depends on the specific type.
   * @param resource 
   */
  protected abstract getResourceName(resource: ResponseType): string;
  protected abstract getProtocolName(): string;
  /**
   * Indicates whether responses are "state of the world", i.e. that they
   * contain all resources and that omitted previously-seen resources should
   * be treated as removed.
   */
  protected abstract isStateOfTheWorld(): boolean;
}