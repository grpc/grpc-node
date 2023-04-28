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
 *
 */

import { ClientDuplexStream, StatusObject, experimental, loadPackageDefinition, logVerbosity } from "@grpc/grpc-js";
import { XdsResourceType } from "./xds-resource-type/xds-resource-type";
import { XdsResourceName, parseXdsResourceName, xdsResourceNameToString } from "./resources";
import { Node } from "./generated/envoy/config/core/v3/Node";
import { BootstrapInfo, XdsServerConfig, loadBootstrapInfo, serverConfigEqual } from "./xds-bootstrap";
import BackoffTimeout = experimental.BackoffTimeout;
import { DiscoveryRequest } from "./generated/envoy/service/discovery/v3/DiscoveryRequest";
import { DiscoveryResponse__Output } from "./generated/envoy/service/discovery/v3/DiscoveryResponse";
import * as adsTypes from './generated/ads';
import * as lrsTypes from './generated/lrs';
import * as protoLoader from '@grpc/proto-loader';
import { EXPERIMENTAL_FEDERATION } from "./environment";

const TRACER_NAME = 'xds_client';

function trace(text: string): void {
  experimental.trace(logVerbosity.DEBUG, TRACER_NAME, text);
}

let loadedProtos: adsTypes.ProtoGrpcType & lrsTypes.ProtoGrpcType | null = null;

function loadAdsProtos(): adsTypes.ProtoGrpcType & lrsTypes.ProtoGrpcType {
  if (loadedProtos !== null) {
    return loadedProtos;
  }
  return (loadPackageDefinition(protoLoader
    .loadSync(
      [
        'envoy/service/discovery/v3/ads.proto',
        'envoy/service/load_stats/v3/lrs.proto',
      ],
      {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true,
        json: true,
        includeDirs: [
          // Paths are relative to src/build
          __dirname + '/../../deps/envoy-api/',
          __dirname + '/../../deps/xds/',
          __dirname + '/../../deps/googleapis/',
          __dirname + '/../../deps/protoc-gen-validate/',
        ],
      }
    )) as unknown) as adsTypes.ProtoGrpcType & lrsTypes.ProtoGrpcType;
}

const clientVersion = require('../../package.json').version;

export interface ResourceWatcherInterface {
  onGenericResourceChanged(resource: object): void;
  onError(status: StatusObject): void;
  onResourceDoesNotExist(): void;
}

export interface BasicWatcher<UpdateType> {
  onResourceChanged(resource: UpdateType): void;
  onError(status: StatusObject): void;
  onResourceDoesNotExist(): void;
}

export class Watcher<UpdateType> implements ResourceWatcherInterface {
  constructor(private internalWatcher: BasicWatcher<UpdateType>) {}
  onGenericResourceChanged(resource: object): void {
    this.internalWatcher.onResourceChanged(resource as UpdateType);
  }
  onError(status: StatusObject) {
    this.internalWatcher.onError(status);
  }
  onResourceDoesNotExist() {
    this.internalWatcher.onResourceDoesNotExist();
  }
}

const RESOURCE_TIMEOUT_MS = 15_000;

class ResourceTimer {
  private timer: NodeJS.Timer | null = null;
  private resourceSeen = false;
  constructor(private callState: AdsCallState, private type: XdsResourceType, private name: XdsResourceName) {}

  maybeCancelTimer() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  markSeen() {
    this.resourceSeen = true;
    this.maybeCancelTimer();
  }

  markSubscriptionSendStarted() {
    this.maybeStartTimer();
  }

  private maybeStartTimer() {
    if (this.resourceSeen) {
      return;
    }
    if (this.timer) {
      return;
    }
    const authorityState = this.callState.client.xdsClient.authorityStateMap.get(this.name.authority);
    if (!authorityState) {
      return;
    }
    const resourceState = authorityState.resourceMap.get(this.type)?.get(this.name.key);
    if (resourceState?.cachedResource) {
      return;
    }
    this.timer = setTimeout(() => {
      this.onTimer();
    }, RESOURCE_TIMEOUT_MS);
  }

  private onTimer() {
    const authorityState = this.callState.client.xdsClient.authorityStateMap.get(this.name.authority);
    const resourceState = authorityState?.resourceMap.get(this.type)?.get(this.name.key);
    if (!resourceState) {
      return;
    }
    resourceState.meta.clientStatus = 'DOES_NOT_EXIST';
    for (const watcher of resourceState.watchers) {
      watcher.onResourceDoesNotExist();
    }
  }
}

type AdsCall = ClientDuplexStream<DiscoveryRequest, DiscoveryResponse__Output>;

interface ResourceTypeState {
  nonce?: string;
  /**
   * authority -> key -> timer
   */
  subscribedResources: Map<string, Map<string, ResourceTimer>>;
}

class AdsCallState {
  private typeStates: Map<XdsResourceType, ResourceTypeState> = new Map();
  constructor(public client: XdsSingleServerClient, private call: AdsCall, private node: Node) {
    // Populate subscription map with existing subscriptions
    for (const [authority, authorityState] of client.xdsClient.authorityStateMap) {
      if (authorityState.client !== client) {
        continue;
      }
      for (const [type, typeMap] of authorityState.resourceMap) {
        let typeState = this.typeStates.get(type);
        if (!typeState) {
          typeState = {
            nonce: '',
            subscribedResources: new Map()
          };
        }
        const authorityMap: Map<string, ResourceTimer> = new Map();
        for (const key of typeMap.keys()) {
          const timer = new ResourceTimer(this, type, {authority, key});
          authorityMap.set(key, timer);
        }
        typeState.subscribedResources.set(authority, authorityMap);
      }
    }
  }

  hasSubscribedResources(): boolean {
    for (const typeState of this.typeStates.values()) {
      for (const authorityMap of typeState.subscribedResources.values()) {
        if (authorityMap.size > 0) {
          return true;
        }
      }
    }
    return false;
  }

  subscribe(type: XdsResourceType, name: XdsResourceName) {
    let typeState = this.typeStates.get(type);
    if (!typeState) {
      typeState = {
        nonce: '',
        subscribedResources: new Map()
      };
    }
    let authorityMap = typeState.subscribedResources.get(name.authority);
    if (!authorityMap) {
      authorityMap = new Map();
      typeState.subscribedResources.set(name.authority, authorityMap);
    }
    if (!authorityMap.has(name.key)) {
      const timer = new ResourceTimer(this, type, name);
      authorityMap.set(name.key, timer);
    }
  }

  unsubscribe(type: XdsResourceType, name: XdsResourceName) {
    this.typeStates.get(type)?.subscribedResources.get(name.authority)?.delete(name.key);
  }

  resourceNamesForRequest(type: XdsResourceType): string[] {
    const typeState = this.typeStates.get(type);
    if (!typeState) {
      return [];
    }
    const result: string[] = [];
    for (const [authority, authorityMap] of typeState.subscribedResources) {
      for (const [key, timer] of authorityMap) {
        timer.markSubscriptionSendStarted();
        result.push(xdsResourceNameToString({authority, key}, type.getTypeUrl()));
      }
    }
    return result;
  }

  updateNames(type: XdsResourceType) {
    this.call.write({
      node: this.node,
      type_url: type.getTypeUrl(),
      response_nonce: this.typeStates.get(type)?.nonce,
      resource_names: this.resourceNamesForRequest(type)
    });
  }
}

class XdsSingleServerClient {
  private adsNode: Node;
  private lrsNode: Node;
  private ignoreResourceDeletion: boolean;

  private adsBackoff: BackoffTimeout;
  private lrsBackoff: BackoffTimeout;

  private adsCallState: AdsCallState | null = null;

  /**
   * The number of authorities that are using this client. Streams should only
   * be started if refcount > 0
   */
  private refcount = 0;

  /**
   * Map of type to latest accepted version string for that type
   */
  public resourceTypeVersionMap: Map<XdsResourceType, string> = new Map();
  constructor(public xdsClient: XdsClient, bootstrapNode: Node, private xdsServerConfig: XdsServerConfig) {
    this.adsBackoff = new BackoffTimeout(() => {
      this.maybeStartAdsStream();
    });
    this.adsBackoff.unref();
    this.lrsBackoff = new BackoffTimeout(() => {
      this.maybeStartLrsStream();
    });
    this.lrsBackoff.unref();
    this.ignoreResourceDeletion = xdsServerConfig.serverFeatures.includes('ignore_resource_deletion');
    const userAgentName = 'gRPC Node Pure JS';
    this.adsNode = {
      ...bootstrapNode,
      user_agent_name: userAgentName,
      user_agent_version: clientVersion,
      client_features: ['envoy.lb.does_not_support_overprovisioning'],
    };
    this.lrsNode = {
      ...bootstrapNode,
      user_agent_name: userAgentName,
      user_agent_version: clientVersion,
      client_features: ['envoy.lrs.supports_send_all_clusters'],
    };
  }

  private trace(text: string) {
    trace(this.xdsServerConfig.serverUri + ' ' + text);
  }

  subscribe(type: XdsResourceType, name: XdsResourceName) {
    this.adsCallState?.subscribe(type, name);
  }

  unsubscribe(type: XdsResourceType, name: XdsResourceName) {
    this.adsCallState?.unsubscribe(type, name);
  }

  ref() {
    this.refcount += 1;
  }

  unref() {
    this.refcount -= 1;
  }
}

interface ClientMapEntry {
  serverConfig: XdsServerConfig;
  client: XdsSingleServerClient;
}

type ClientResourceStatus = 'REQUESTED' | 'DOES_NOT_EXIST' | 'ACKED' | 'NACKED';

interface ResourceMetadata {
  clientStatus: ClientResourceStatus;
  updateTime: Date | null;
  version: string | null;
  failedVersion: string | null;
  failedDetails: string | null;
  failedUpdateTime: string | null;
}

interface ResourceState {
  watchers: Set<ResourceWatcherInterface>;
  cachedResource: object | null;
  meta: ResourceMetadata;
  deletionIgnored: boolean;
}

interface AuthorityState {
  client: XdsSingleServerClient;
  /**
   * type -> key -> state
   */
  resourceMap: Map<XdsResourceType, Map<string, ResourceState>>;
}

export class XdsClient {
  /**
   * authority -> authority state
   */
  public authorityStateMap: Map<string, AuthorityState> = new Map();
  private clients: ClientMapEntry[] = [];

  constructor(private bootstrapInfoOverride?: BootstrapInfo) {}

  private getBootstrapInfo() {
    if (this.bootstrapInfoOverride) {
      return this.bootstrapInfoOverride;
    } else {
      return loadBootstrapInfo();
    }
  }

  private getOrCreateClient(authority: string): XdsSingleServerClient {
    const bootstrapInfo = this.getBootstrapInfo();
    let serverConfig: XdsServerConfig;
    if (authority === ':old') {
      serverConfig = bootstrapInfo.xdsServers[0];
    } else {
      if (authority in bootstrapInfo.authorities) {
        serverConfig = bootstrapInfo.authorities[authority].xdsServers?.[0] ?? bootstrapInfo.xdsServers[0];
      } else {
        throw new Error(`Authority ${authority} not found in bootstrap authorities list`);
      }
    }
    for (const entry of this.clients) {
      if (serverConfigEqual(serverConfig, entry.serverConfig)) {
        return entry.client;
      }
    }
    const client = new XdsSingleServerClient(this, bootstrapInfo.node, serverConfig);
    this.clients.push({client, serverConfig});
    return client;
  }

  watchResource(type: XdsResourceType, name: string, watcher: ResourceWatcherInterface) {
    const resourceName = parseXdsResourceName(name, type.getTypeUrl());
    let authorityState = this.authorityStateMap.get(resourceName.authority);
    if (!authorityState) {
      authorityState = {
        client: this.getOrCreateClient(resourceName.authority),
        resourceMap: new Map()
      };
      authorityState.client.ref();
    }
    let keyMap = authorityState.resourceMap.get(type);
    if (!keyMap) {
      keyMap = new Map();
      authorityState.resourceMap.set(type, keyMap);
    }
    let entry = keyMap.get(resourceName.key);
    let isNewSubscription = false;
    if (!entry) {
      isNewSubscription = true;
      entry = {
        watchers: new Set(),
        cachedResource: null,
        deletionIgnored: false,
        meta: {
          clientStatus: 'REQUESTED',
          updateTime: null,
          version: null,
          failedVersion: null,
          failedUpdateTime: null,
          failedDetails: null
        }
      };
      keyMap.set(resourceName.key, entry);
    }
    entry.watchers.add(watcher);
    if (entry.cachedResource) {
      process.nextTick(() => {
        if (entry?.cachedResource) {
          watcher.onGenericResourceChanged(entry.cachedResource);
        }
      });
    }
    if (isNewSubscription) {
      authorityState.client.subscribe(type, resourceName);
    }
  }

  cancelResourceWatch(type: XdsResourceType, name: string, watcher: ResourceWatcherInterface) {
    const resourceName = parseXdsResourceName(name, type.getTypeUrl());
    const authorityState = this.authorityStateMap.get(resourceName.authority);
    if (!authorityState) {
      return;
    }
    const entry = authorityState.resourceMap.get(type)?.get(resourceName.key);
    if (entry) {
      entry.watchers.delete(watcher);
      if (entry.watchers.size === 0) {
        authorityState.resourceMap.get(type)!.delete(resourceName.key);
        authorityState.client.unsubscribe(type, resourceName);
        if (authorityState.resourceMap.get(type)!.size === 0) {
          authorityState.resourceMap.delete(type);
          if (authorityState.resourceMap.size === 0) {
            authorityState.client.unref();
            this.authorityStateMap.delete(resourceName.authority);
          }
        }
      }
    }
  }
}