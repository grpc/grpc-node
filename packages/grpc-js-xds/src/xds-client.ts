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

import { Channel, ChannelCredentials, ClientDuplexStream, Metadata, StatusObject, connectivityState, experimental, loadPackageDefinition, logVerbosity, status } from "@grpc/grpc-js";
import { XdsDecodeContext, XdsDecodeResult, XdsResourceType } from "./xds-resource-type/xds-resource-type";
import { XdsResourceName, parseXdsResourceName, xdsResourceNameToString } from "./resources";
import { Node } from "./generated/envoy/config/core/v3/Node";
import { BootstrapInfo, XdsServerConfig, loadBootstrapInfo, serverConfigEqual } from "./xds-bootstrap";
import BackoffTimeout = experimental.BackoffTimeout;
import { DiscoveryRequest } from "./generated/envoy/service/discovery/v3/DiscoveryRequest";
import { DiscoveryResponse__Output } from "./generated/envoy/service/discovery/v3/DiscoveryResponse";
import * as adsTypes from './generated/ads';
import * as lrsTypes from './generated/lrs';
import * as protoLoader from '@grpc/proto-loader';
import { AggregatedDiscoveryServiceClient } from "./generated/envoy/service/discovery/v3/AggregatedDiscoveryService";
import { LoadReportingServiceClient } from "./generated/envoy/service/load_stats/v3/LoadReportingService";
import { createGoogleDefaultCredentials } from "./google-default-credentials";
import { Any__Output } from "./generated/google/protobuf/Any";
import { LoadStatsRequest } from "./generated/envoy/service/load_stats/v3/LoadStatsRequest";
import { LoadStatsResponse__Output } from "./generated/envoy/service/load_stats/v3/LoadStatsResponse";
import { Locality, Locality__Output } from "./generated/envoy/config/core/v3/Locality";
import { Duration } from "./generated/google/protobuf/Duration";
import { registerXdsClientWithCsds } from "./csds";

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
    this.internalWatcher.onResourceChanged(resource as unknown as UpdateType);
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

  markAdsStreamStarted() {
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

interface AdsParseResult {
  type?: XdsResourceType;
  typeUrl?: string;
  version?: string;
  nonce?: string;
  errors: string[];
  /**
   * authority -> set of keys
   */
  resourcesSeen: Map<string, Set<string>>;
  haveValidResources: boolean;
}

/**
 * Responsible for parsing a single ADS response, one resource at a time
 */
class AdsResponseParser {
  private result: AdsParseResult = {
    errors: [],
    resourcesSeen: new Map(),
    haveValidResources: false
  };
  private updateTime = new Date();

  constructor(private adsCallState: AdsCallState) {}

  processAdsResponseFields(message: DiscoveryResponse__Output) {
    const type = this.adsCallState.client.xdsClient.getResourceType(message.type_url);
    if (!type) {
      throw new Error(`Unexpected type URL ${message.type_url}`);
    }
    this.result.type = type;
    this.result.typeUrl = message.type_url;
    this.result.nonce = message.nonce;
    this.result.version = message.version_info;
  }

  parseResource(index: number, resource: Any__Output) {
    const errorPrefix = `resource index ${index}:`;
    if (resource.type_url !== this.result.typeUrl) {
      this.result.errors.push(`${errorPrefix} incorrect resource type "${resource.type_url}" (should be "${this.result.typeUrl}")`);
      return;
    }
    if (!this.result.type) {
      return;
    }
    const decodeContext: XdsDecodeContext = {
      server: this.adsCallState.client.xdsServerConfig
    };
    let decodeResult: XdsDecodeResult;
    try {
      decodeResult = this.result.type.decode(decodeContext, resource);
    } catch (e) {
      this.result.errors.push(`${errorPrefix} ${(e as Error).message}`);
      return;
    }
    let parsedName: XdsResourceName;
    try {
      parsedName = parseXdsResourceName(decodeResult.name, this.result.type!.getTypeUrl());
    } catch (e) {
      this.result.errors.push(`${errorPrefix} ${(e as Error).message}`);
      return;
    }
    this.adsCallState.typeStates.get(this.result.type!)?.subscribedResources.get(parsedName.authority)?.get(parsedName.key)?.markSeen();
    if (this.result.type.allResourcesRequiredInSotW()) {
      if (!this.result.resourcesSeen.has(parsedName.authority)) {
        this.result.resourcesSeen.set(parsedName.authority, new Set());
      }
      this.result.resourcesSeen.get(parsedName.authority)!.add(parsedName.key);
    }
    const resourceState = this.adsCallState.client.xdsClient.authorityStateMap.get(parsedName.authority)?.resourceMap.get(this.result.type)?.get(parsedName.key);
    if (!resourceState) {
      // No subscription for this resource
      return;
    }
    if (resourceState.deletionIgnored) {
      experimental.log(logVerbosity.INFO, `Received resource with previously ignored deletion: ${decodeResult.name}`);
      resourceState.deletionIgnored = false;
    }
    if (decodeResult.error) {
      this.result.errors.push(`${errorPrefix} ${decodeResult.error}`);
      process.nextTick(() => {
        for (const watcher of resourceState.watchers) {
          watcher.onError({code: status.UNAVAILABLE, details: decodeResult.error!, metadata: new Metadata()});
        }
      });
      resourceState.meta.clientStatus = 'NACKED';
      resourceState.meta.failedVersion = this.result.version!;
      resourceState.meta.failedDetails = decodeResult.error;
      resourceState.meta.failedUpdateTime = this.updateTime;
      return;
    }
    if (!decodeResult.value) {
      return;
    }
    this.adsCallState.client.trace('Parsed resource of type ' + this.result.type.getTypeUrl() + ': ' + JSON.stringify(decodeResult.value, (key, value) => (value && value.type === 'Buffer' && Array.isArray(value.data)) ? (value.data as Number[]).map(n => n.toString(16)).join('') : value, 2));
    this.result.haveValidResources = true;
    if (this.result.type.resourcesEqual(resourceState.cachedResource, decodeResult.value)) {
      return;
    }
    resourceState.cachedResource = decodeResult.value;
    resourceState.meta = {
      clientStatus: 'ACKED',
      rawResource: resource,
      updateTime: this.updateTime,
      version: this.result.version!
    };
    process.nextTick(() => {
      for (const watcher of resourceState.watchers) {
        watcher.onGenericResourceChanged(decodeResult.value!);
      }
    });
  }

  getResult() {
    return this.result;
  }
}

type AdsCall = ClientDuplexStream<DiscoveryRequest, DiscoveryResponse__Output>;

interface ResourceTypeState {
  nonce?: string;
  error?: string;
  /**
   * authority -> key -> timer
   */
  subscribedResources: Map<string, Map<string, ResourceTimer>>;
}

class AdsCallState {
  public typeStates: Map<XdsResourceType, ResourceTypeState> = new Map();
  private receivedAnyResponse = false;
  private sentInitialMessage = false;
  constructor(public client: XdsSingleServerClient, private call: AdsCall, private node: Node) {
    // Populate subscription map with existing subscriptions
    for (const [authority, authorityState] of client.xdsClient.authorityStateMap) {
      if (authorityState.client !== client) {
        continue;
      }
      for (const [type, typeMap] of authorityState.resourceMap) {
        for (const key of typeMap.keys()) {
          this.subscribe(type, {authority, key}, true);
        }
      }
    }
    for (const type of this.typeStates.keys()) {
      this.updateNames(type);
    }
    call.on('data', (message: DiscoveryResponse__Output) => {
      this.handleResponseMessage(message);
    })
    call.on('status', (status: StatusObject) => {
      this.handleStreamStatus(status);
    });
    call.on('error', () => {});
  }

  private trace(text: string) {
    this.client.trace(text);
  }

  private handleResponseMessage(message: DiscoveryResponse__Output) {
    const parser = new AdsResponseParser(this);
    let handledAdsResponseFields: boolean;
    try {
      parser.processAdsResponseFields(message);
      handledAdsResponseFields = true;
    } catch (e) {
      this.trace('ADS response field parsing failed for type ' + message.type_url);
      handledAdsResponseFields = false;
    }
    if (handledAdsResponseFields) {
      for (const [index, resource] of message.resources.entries()) {
        parser.parseResource(index, resource);
      }
      const result = parser.getResult();
      const typeState = this.typeStates.get(result.type!);
      if (!typeState) {
        this.trace('Type state not found for type ' + result.type!.getTypeUrl());
        return;
      }
      typeState.nonce = result.nonce;
      if (result.errors.length > 0) {
        typeState.error = `xDS response validation errors: [${result.errors.join('; ')}]`;
      } else {
        delete typeState.error;
      }
      // Delete resources not seen in update if needed
      if (result.type!.allResourcesRequiredInSotW()) {
        for (const [authority, authorityState] of this.client.xdsClient.authorityStateMap) {
          if (authorityState.client !== this.client) {
            continue;
          }
          const typeMap = authorityState.resourceMap.get(result.type!);
          if (!typeMap) {
            continue;
          }
          for (const [key, resourceState] of typeMap) {
            if (!result.resourcesSeen.get(authority)?.has(key)) {
              /* Do nothing for resources that have no cached value. Those are
               * handled by the resource timer. */
              if (!resourceState.cachedResource) {
                continue;
              }
              if (this.client.ignoreResourceDeletion) {
                experimental.log(logVerbosity.ERROR, 'Ignoring nonexistent resource ' + xdsResourceNameToString({authority, key}, result.type!.getTypeUrl()));
                resourceState.deletionIgnored = true;
              } else {
                resourceState.meta.clientStatus = 'DOES_NOT_EXIST';
                process.nextTick(() => {
                  for (const watcher of resourceState.watchers) {
                    watcher.onResourceDoesNotExist();
                  }
                });
              }
            }
          }
        }
      }
      if (result.haveValidResources || result.errors.length === 0) {
        this.client.resourceTypeVersionMap.set(result.type!, result.version!);
      }
      this.updateNames(result.type!);
    }
  }

  private* allWatchers() {
    for (const [type, typeState] of this.typeStates) {
      for (const [authority, authorityMap] of typeState.subscribedResources) {
        for (const key of authorityMap.keys()) {
          yield* this.client.xdsClient.authorityStateMap.get(authority)?.resourceMap.get(type)?.get(key)?.watchers ?? [];
        }
      }
    }
  }

  private handleStreamStatus(streamStatus: StatusObject) {
    this.trace(
      'ADS stream ended. code=' + streamStatus.code + ' details= ' + streamStatus.details
    );
    if (streamStatus.code !== status.OK && !this.receivedAnyResponse) {
      for (const watcher of this.allWatchers()) {
        watcher.onError(streamStatus);
      }
    }
    this.client.handleAdsStreamEnd();
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

  subscribe(type: XdsResourceType, name: XdsResourceName, delaySend: boolean = false) {
    let typeState = this.typeStates.get(type);
    if (!typeState) {
      typeState = {
        nonce: '',
        subscribedResources: new Map()
      };
      this.typeStates.set(type, typeState);
    }
    let authorityMap = typeState.subscribedResources.get(name.authority);
    if (!authorityMap) {
      authorityMap = new Map();
      typeState.subscribedResources.set(name.authority, authorityMap);
    }
    if (!authorityMap.has(name.key)) {
      const timer = new ResourceTimer(this, type, name);
      authorityMap.set(name.key, timer);
      if (!delaySend) {
        this.updateNames(type);
      }
    }
  }

  unsubscribe(type: XdsResourceType, name: XdsResourceName) {
    const typeState = this.typeStates.get(type);
    if (!typeState) {
      return;
    }
    const authorityMap = typeState.subscribedResources.get(name.authority);
    if (!authorityMap) {
      return;
    }
    authorityMap.delete(name.key);
    if (authorityMap.size === 0) {
      typeState.subscribedResources.delete(name.authority);
    }
    if (typeState.subscribedResources.size === 0) {
      this.typeStates.delete(type);
    }
    this.updateNames(type);
  }

  resourceNamesForRequest(type: XdsResourceType): string[] {
    const typeState = this.typeStates.get(type);
    if (!typeState) {
      return [];
    }
    const result: string[] = [];
    for (const [authority, authorityMap] of typeState.subscribedResources) {
      for (const [key, timer] of authorityMap) {
        result.push(xdsResourceNameToString({authority, key}, type.getTypeUrl()));
      }
    }
    return result;
  }

  updateNames(type: XdsResourceType) {
    const typeState = this.typeStates.get(type);
    if (!typeState) {
      return;
    }
    const request: DiscoveryRequest = {
      node: this.sentInitialMessage ? null : this.node,
      type_url: type.getFullTypeUrl(),
      response_nonce: typeState.nonce,
      resource_names: this.resourceNamesForRequest(type),
      version_info: this.client.resourceTypeVersionMap.get(type),
      error_detail: typeState.error ? { code: status.UNAVAILABLE, message: typeState.error} : null
    };
    this.trace('Sending discovery request: ' + JSON.stringify(request, undefined, 2));
    this.call.write(request);
    this.sentInitialMessage = true;
  }

  end() {
    this.call.end();
  }

  /**
   * Should be called when the channel state is READY after starting the
   * stream.
   */
  markStreamStarted() {
    for (const [type, typeState] of this.typeStates) {
      for (const [authority, authorityMap] of typeState.subscribedResources) {
        for (const resourceTimer of authorityMap.values()) {
          resourceTimer.markAdsStreamStarted();
        }
      }
    }
  }
}

type LrsCall = ClientDuplexStream<LoadStatsRequest, LoadStatsResponse__Output>;

function localityEqual(
  loc1: Locality__Output,
  loc2: Locality__Output
): boolean {
  return (
    loc1.region === loc2.region &&
    loc1.zone === loc2.zone &&
    loc1.sub_zone === loc2.sub_zone
  );
}

export interface XdsClusterDropStats {
  addUncategorizedCallDropped(): void;
  addCallDropped(category: string): void;
}

export interface XdsClusterLocalityStats {
  addCallStarted(): void;
  addCallFinished(fail: boolean): void;
}

interface DroppedRequests {
  category: string;
  dropped_count: number;
}

interface UpstreamLocalityStats {
  locality: Locality;
  total_issued_requests: number;
  total_successful_requests: number;
  total_error_requests: number;
  total_requests_in_progress: number;
}

/**
 * An interface representing the ClusterStats message type, restricted to the
 * fields used in this module to ensure compatibility with both v2 and v3 APIs.
 */
interface ClusterStats {
  cluster_name: string;
  cluster_service_name: string;
  dropped_requests: DroppedRequests[];
  total_dropped_requests: number;
  upstream_locality_stats: UpstreamLocalityStats[];
  load_report_interval: Duration
}

interface ClusterLocalityStats {
  locality: Locality__Output;
  callsStarted: number;
  callsSucceeded: number;
  callsFailed: number;
  callsInProgress: number;
  refcount: number;
}

interface ClusterLoadReport {
  callsDropped: Map<string, number>;
  uncategorizedCallsDropped: number;
  localityStats: Set<ClusterLocalityStats>;
  intervalStart: [number, number];
}

interface StatsMapEntry {
  clusterName: string;
  edsServiceName: string;
  refCount: number;
  stats: ClusterLoadReport;
}

class ClusterLoadReportMap {
  private statsMap: Set<StatsMapEntry> = new Set();

  get(
    clusterName: string,
    edsServiceName: string
  ): ClusterLoadReport | undefined {
    for (const statsObj of this.statsMap) {
      if (
        statsObj.clusterName === clusterName &&
        statsObj.edsServiceName === edsServiceName
      ) {
        return statsObj.stats;
      }
    }
    return undefined;
  }

  /**
   * Get the indicated map entry if it exists, or create a new one if it does
   * not. Increments the refcount of that entry, so a call to this method
   * should correspond to a later call to unref
   * @param clusterName
   * @param edsServiceName
   * @returns
   */
  getOrCreate(clusterName: string, edsServiceName: string): ClusterLoadReport {
    for (const statsObj of this.statsMap) {
      if (
        statsObj.clusterName === clusterName &&
        statsObj.edsServiceName === edsServiceName
      ) {
        statsObj.refCount += 1;
        return statsObj.stats;
      }
    }
    const newStats: ClusterLoadReport = {
      callsDropped: new Map<string, number>(),
      uncategorizedCallsDropped: 0,
      localityStats: new Set(),
      intervalStart: process.hrtime(),
    };
    this.statsMap.add({
      clusterName,
      edsServiceName,
      refCount: 1,
      stats: newStats,
    });
    return newStats;
  }

  *entries(): IterableIterator<
    [{ clusterName: string; edsServiceName: string }, ClusterLoadReport]
  > {
    for (const statsEntry of this.statsMap) {
      yield [
        {
          clusterName: statsEntry.clusterName,
          edsServiceName: statsEntry.edsServiceName,
        },
        statsEntry.stats,
      ];
    }
  }

  unref(clusterName: string, edsServiceName: string) {
    for (const statsObj of this.statsMap) {
      if (
        statsObj.clusterName === clusterName &&
        statsObj.edsServiceName === edsServiceName
      ) {
        statsObj.refCount -=1;
        if (statsObj.refCount === 0) {
          this.statsMap.delete(statsObj);
        }
        return;
      }
    }
  }

  get size() {
    return this.statsMap.size;
  }
}

class LrsCallState {
  private statsTimer: NodeJS.Timer | null = null;
  private sentInitialMessage = false;
  constructor(private client: XdsSingleServerClient, private call: LrsCall, private node: Node) {
    call.on('data', (message: LoadStatsResponse__Output) => {
      this.handleResponseMessage(message);
    })
    call.on('status', (status: StatusObject) => {
      this.handleStreamStatus(status);
    });
    call.on('error', () => {});
    this.sendStats();
  }

  private handleStreamStatus(status: StatusObject) {
    this.client.trace(
      'LRS stream ended. code=' + status.code + ' details= ' + status.details
    );
    this.client.handleLrsStreamEnd();
  }

  private handleResponseMessage(message: LoadStatsResponse__Output) {
    this.client.trace('Received LRS response');
    this.client.onLrsStreamReceivedMessage();
    if (
      !this.statsTimer ||
      message.load_reporting_interval?.seconds !==
        this.client.latestLrsSettings?.load_reporting_interval?.seconds ||
      message.load_reporting_interval?.nanos !==
        this.client.latestLrsSettings?.load_reporting_interval?.nanos
    ) {
      /* Only reset the timer if the interval has changed or was not set
       * before. */
      if (this.statsTimer) {
        clearInterval(this.statsTimer);
      }
      /* Convert a google.protobuf.Duration to a number of milliseconds for
       * use with setInterval. */
      const loadReportingIntervalMs =
        Number.parseInt(message.load_reporting_interval!.seconds) * 1000 +
        message.load_reporting_interval!.nanos / 1_000_000;
      this.client.trace('Received LRS response with load reporting interval ' + loadReportingIntervalMs + ' ms');
      this.statsTimer = setInterval(() => {
        this.sendStats();
      }, loadReportingIntervalMs);
    }
    this.client.latestLrsSettings = message;
  }

  private sendLrsMessage(clusterStats: ClusterStats[]) {
    const request: LoadStatsRequest = {
      node: this.sentInitialMessage ? null : this.node,
      cluster_stats: clusterStats
    };
    this.client.trace('Sending LRS message ' + JSON.stringify(request, undefined, 2));
    this.call.write(request);
    this.sentInitialMessage = true;
  }

  private get latestLrsSettings() {
    return this.client.latestLrsSettings;
  }

  private sendStats() {
    if (!this.latestLrsSettings) {
      this.sendLrsMessage([]);
      return;
    }
    const clusterStats: ClusterStats[] = [];
    for (const [
      { clusterName, edsServiceName },
      stats,
    ] of this.client.clusterStatsMap.entries()) {
      if (
        this.latestLrsSettings.send_all_clusters ||
        this.latestLrsSettings.clusters.indexOf(clusterName) > 0
      ) {
        const upstreamLocalityStats: UpstreamLocalityStats[] = [];
        for (const localityStats of stats.localityStats) {
          // Skip localities with 0 requests
          if (
            localityStats.callsStarted > 0 ||
            localityStats.callsSucceeded > 0 ||
            localityStats.callsFailed > 0
          ) {
            upstreamLocalityStats.push({
              locality: localityStats.locality,
              total_issued_requests: localityStats.callsStarted,
              total_successful_requests: localityStats.callsSucceeded,
              total_error_requests: localityStats.callsFailed,
              total_requests_in_progress: localityStats.callsInProgress,
            });
            localityStats.callsStarted = 0;
            localityStats.callsSucceeded = 0;
            localityStats.callsFailed = 0;
          }
        }
        const droppedRequests: DroppedRequests[] = [];
        let totalDroppedRequests = 0;
        for (const [category, count] of stats.callsDropped.entries()) {
          if (count > 0) {
            droppedRequests.push({
              category,
              dropped_count: count,
            });
            totalDroppedRequests += count;
          }
        }
        totalDroppedRequests += stats.uncategorizedCallsDropped;
        // Clear out dropped call stats after sending them
        stats.callsDropped.clear();
        stats.uncategorizedCallsDropped = 0;
        const interval = process.hrtime(stats.intervalStart);
        stats.intervalStart = process.hrtime();
        // Skip clusters with 0 requests
        if (upstreamLocalityStats.length > 0 || totalDroppedRequests > 0) {
          clusterStats.push({
            cluster_name: clusterName,
            cluster_service_name: edsServiceName,
            dropped_requests: droppedRequests,
            total_dropped_requests: totalDroppedRequests,
            upstream_locality_stats: upstreamLocalityStats,
            load_report_interval: {
              seconds: interval[0],
              nanos: interval[1],
            },
          });
        }
      }
    }
    this.sendLrsMessage(clusterStats);

  }
}

class XdsSingleServerClient {
  public ignoreResourceDeletion: boolean;

  private adsBackoff: BackoffTimeout;
  private lrsBackoff: BackoffTimeout;

  private adsClient: AggregatedDiscoveryServiceClient;
  private adsCallState: AdsCallState | null = null;

  private lrsClient: LoadReportingServiceClient;
  private lrsCallState: LrsCallState | null = null;
  public clusterStatsMap = new ClusterLoadReportMap();
  public latestLrsSettings: LoadStatsResponse__Output | null = null;

  /**
   * The number of authorities that are using this client. Streams should only
   * be started if refcount > 0
   */
  private refcount = 0;

  /**
   * Map of type to latest accepted version string for that type
   */
  public resourceTypeVersionMap: Map<XdsResourceType, string> = new Map();
  constructor(public xdsClient: XdsClient, bootstrapNode: Node, public xdsServerConfig: XdsServerConfig) {
    this.adsBackoff = new BackoffTimeout(() => {
      this.maybeStartAdsStream();
    });
    this.adsBackoff.unref();
    this.lrsBackoff = new BackoffTimeout(() => {
      this.maybeStartLrsStream();
    });
    this.lrsBackoff.unref();
    this.ignoreResourceDeletion = xdsServerConfig.server_features.includes('ignore_resource_deletion');
    const channelArgs = {
      // 5 minutes
      'grpc.keepalive_time_ms': 5 * 60 * 1000
    }
    const credentialsConfigs = xdsServerConfig.channel_creds;
    let channelCreds: ChannelCredentials | null = null;
    for (const config of credentialsConfigs) {
      if (config.type === 'google_default') {
        channelCreds = createGoogleDefaultCredentials();
        break;
      } else if (config.type === 'insecure') {
        channelCreds = ChannelCredentials.createInsecure();
        break;
      }
    }
    const serverUri = this.xdsServerConfig.server_uri
    this.trace('Starting xDS client connected to server URI ' + this.xdsServerConfig.server_uri);
    /* Bootstrap validation rules guarantee that a matching channel credentials
     * config exists in the list. */
    const channel = new Channel(serverUri, channelCreds!, channelArgs);
    const protoDefinitions = loadAdsProtos();
    this.adsClient = new protoDefinitions.envoy.service.discovery.v3.AggregatedDiscoveryService(
      serverUri,
      channelCreds!,
      {channelOverride: channel}
    );
    channel.watchConnectivityState(channel.getConnectivityState(false), Infinity, () => {
      this.handleAdsConnectivityStateUpdate();
    });
    this.lrsClient = new protoDefinitions.envoy.service.load_stats.v3.LoadReportingService(
      serverUri,
      channelCreds!,
      {channelOverride: channel}
    );
  }

  private handleAdsConnectivityStateUpdate() {
    const state = this.adsClient.getChannel().getConnectivityState(false);
    if (state === connectivityState.READY) {
      this.adsCallState?.markStreamStarted();
    }
    if (state === connectivityState.TRANSIENT_FAILURE) {
      for (const authorityState of this.xdsClient.authorityStateMap.values()) {
        if (authorityState.client !== this) {
          continue;
        }
        for (const typeMap of authorityState.resourceMap.values()) {
          for (const resourceState of typeMap.values()) {
            for (const watcher of resourceState.watchers) {
              watcher.onError({
                code: status.UNAVAILABLE,
                details: 'No connection established to xDS server',
                metadata: new Metadata()
              });
            }
          }
        }
      }
    }
    this.adsClient.getChannel().watchConnectivityState(state, Infinity, () => {
      this.handleAdsConnectivityStateUpdate();
    });
  }

  onAdsStreamReceivedMessage() {
    this.adsBackoff.stop();
    this.adsBackoff.reset();
  }

  handleAdsStreamEnd() {
    this.adsCallState = null;
    /* The backoff timer would start the stream when it finishes. If it is not
     * running, restart the stream immediately. */
    if (!this.adsBackoff.isRunning()) {
      this.maybeStartAdsStream();
    }
  }

  private maybeStartAdsStream() {
    if (this.adsCallState || this.refcount < 1) {
      return;
    }
    this.trace('Starting ADS stream');
    const metadata = new Metadata({waitForReady: true});
    const call = this.adsClient.StreamAggregatedResources(metadata);
    this.adsCallState = new AdsCallState(this, call, this.xdsClient.adsNode!);
    this.adsBackoff.runOnce();
  }

  onLrsStreamReceivedMessage() {
    this.lrsBackoff.stop();
    this.lrsBackoff.reset();
  }

  handleLrsStreamEnd() {
    this.lrsCallState = null;
    /* The backoff timer would start the stream when it finishes. If it is not
     * running, restart the stream immediately. */
    if (!this.lrsBackoff.isRunning()) {
      this.maybeStartLrsStream();
    }
  }

  private maybeStartLrsStream() {
    if (this.lrsCallState || this.refcount < 1 || this.clusterStatsMap.size < 1) {
      return;
    }
    this.trace('Starting LRS stream');
    const metadata = new Metadata({waitForReady: true});
    const call = this.lrsClient.StreamLoadStats(metadata);
    this.lrsCallState = new LrsCallState(this, call, this.xdsClient.lrsNode!);
    this.lrsBackoff.runOnce();
  }

  trace(text: string) {
    trace(this.xdsServerConfig.server_uri + ' ' + text);
  }

  subscribe(type: XdsResourceType, name: XdsResourceName) {
    this.trace('subscribe(type=' + type.getTypeUrl() + ', name=' + xdsResourceNameToString(name, type.getTypeUrl()) + ')');
    this.trace(JSON.stringify(name));
    this.maybeStartAdsStream();
    this.adsCallState?.subscribe(type, name);
  }

  unsubscribe(type: XdsResourceType, name: XdsResourceName) {
    this.trace('unsubscribe(type=' + type.getTypeUrl() + ', name=' + xdsResourceNameToString(name, type.getTypeUrl()) + ')');
    this.adsCallState?.unsubscribe(type, name);
    if (this.adsCallState && !this.adsCallState.hasSubscribedResources()) {
      this.adsCallState.end();
      this.adsCallState = null;
    }
  }

  ref() {
    this.refcount += 1;
  }

  unref() {
    this.refcount -= 1;
  }

  addClusterDropStats(
    clusterName: string,
    edsServiceName: string
  ): XdsClusterDropStats {
    this.trace('addClusterDropStats(clusterName=' + clusterName + ', edsServiceName=' + edsServiceName + ')');
    const clusterStats = this.clusterStatsMap.getOrCreate(
      clusterName,
      edsServiceName
    );
    this.maybeStartLrsStream();
    return {
      addUncategorizedCallDropped: () => {
        clusterStats.uncategorizedCallsDropped += 1;
      },
      addCallDropped: (category) => {
        const prevCount = clusterStats.callsDropped.get(category) ?? 0;
        clusterStats.callsDropped.set(category, prevCount + 1);
      },
    };
  }

  removeClusterDropStats(clusterName: string, edsServiceName: string) {
    this.trace('removeClusterDropStats(clusterName=' + clusterName + ', edsServiceName=' + edsServiceName + ')');
    this.clusterStatsMap.unref(clusterName, edsServiceName);
  }

  addClusterLocalityStats(
    clusterName: string,
    edsServiceName: string,
    locality: Locality__Output
  ): XdsClusterLocalityStats {
    this.trace('addClusterLocalityStats(clusterName=' + clusterName + ', edsServiceName=' + edsServiceName + ', locality=' + JSON.stringify(locality) + ')');
    const clusterStats = this.clusterStatsMap.getOrCreate(
      clusterName,
      edsServiceName
    );
    this.maybeStartLrsStream();
    let localityStats: ClusterLocalityStats | null = null;
    for (const statsObj of clusterStats.localityStats) {
      if (localityEqual(locality, statsObj.locality)) {
        localityStats = statsObj;
        break;
      }
    }
    if (localityStats === null) {
      localityStats = {
        locality: locality,
        callsInProgress: 0,
        callsStarted: 0,
        callsSucceeded: 0,
        callsFailed: 0,
        refcount: 0,
      };
      clusterStats.localityStats.add(localityStats);
    }
    /* Help the compiler understand that this object is always non-null in the
     * closure */
    const finalLocalityStats: ClusterLocalityStats = localityStats;
    return {
      addCallStarted: () => {
        finalLocalityStats.callsStarted += 1;
        finalLocalityStats.callsInProgress += 1;
      },
      addCallFinished: (fail) => {
        if (fail) {
          finalLocalityStats.callsFailed += 1;
        } else {
          finalLocalityStats.callsSucceeded += 1;
        }
        finalLocalityStats.callsInProgress -= 1;
      },
    };
  }

  removeClusterLocalityStats(
    clusterName: string,
    edsServiceName: string,
    locality: Locality__Output
  ) {
    this.trace('removeClusterLocalityStats(clusterName=' + clusterName + ', edsServiceName=' + edsServiceName + ', locality=' + JSON.stringify(locality) + ')');
    const clusterStats = this.clusterStatsMap.get(clusterName, edsServiceName);
    if (!clusterStats) {
      return;
    }
    for (const statsObj of clusterStats.localityStats) {
      if (localityEqual(locality, statsObj.locality)) {
        statsObj.refcount -= 1;
        if (statsObj.refcount === 0) {
          clusterStats.localityStats.delete(statsObj);
        }
        break;
      }
    }
    this.clusterStatsMap.unref(clusterName, edsServiceName);
  }
}

interface ClientMapEntry {
  serverConfig: XdsServerConfig;
  client: XdsSingleServerClient;
}

type ClientResourceStatus = 'REQUESTED' | 'DOES_NOT_EXIST' | 'ACKED' | 'NACKED';

interface ResourceMetadata {
  clientStatus: ClientResourceStatus;
  rawResource?: Any__Output;
  updateTime?: Date;
  version?: string;
  failedVersion?: string;
  failedDetails?: string;
  failedUpdateTime?: Date;
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

const userAgentName = 'gRPC Node Pure JS';

export class XdsClient {
  /**
   * authority -> authority state
   */
  public authorityStateMap: Map<string, AuthorityState> = new Map();
  private clients: ClientMapEntry[] = [];
  private typeRegistry: Map<string, XdsResourceType> = new Map();
  private bootstrapInfo: BootstrapInfo | null = null;

  constructor(bootstrapInfoOverride?: BootstrapInfo) {
    if (bootstrapInfoOverride) {
      this.bootstrapInfo = bootstrapInfoOverride;
    }
    registerXdsClientWithCsds(this);
  }

  private getBootstrapInfo() {
    if (!this.bootstrapInfo) {
      this.bootstrapInfo = loadBootstrapInfo();
    }
    return this.bootstrapInfo;
  }

  get adsNode(): Node | undefined {
    if (!this.bootstrapInfo) {
      return undefined;
    }
    return {
      ...this.bootstrapInfo.node,
      user_agent_name: userAgentName,
      user_agent_version: clientVersion,
      client_features: ['envoy.lb.does_not_support_overprovisioning'],
    }
  }

  get lrsNode(): Node | undefined {
    if (!this.bootstrapInfo) {
      return undefined;
    }
    return {
      ...this.bootstrapInfo.node,
      user_agent_name: userAgentName,
      user_agent_version: clientVersion,
      client_features: ['envoy.lrs.supports_send_all_clusters'],
    };
  }

  private getOrCreateClient(authority: string): XdsSingleServerClient {
    const bootstrapInfo = this.getBootstrapInfo();
    let serverConfig: XdsServerConfig;
    if (authority === 'old:') {
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

  private getClient(server: XdsServerConfig) {
    for (const entry of this.clients) {
      if (serverConfigEqual(server, entry.serverConfig)) {
        return entry.client;
      }
    }
    return undefined;
  }

  getResourceType(typeUrl: string) {
    return this.typeRegistry.get(typeUrl);
  }

  watchResource(type: XdsResourceType, name: string, watcher: ResourceWatcherInterface) {
    trace('watchResource(type=' + type.getTypeUrl() + ', name=' + name + ')');
    if (this.typeRegistry.has(type.getTypeUrl())) {
      if (this.typeRegistry.get(type.getTypeUrl()) !== type) {
        throw new Error(`Resource type does not match previously used type with the same type URL: ${type.getTypeUrl()}`);
      }
    } else {
      this.typeRegistry.set(type.getTypeUrl(), type);
      this.typeRegistry.set(type.getFullTypeUrl(), type);
    }
    const resourceName = parseXdsResourceName(name, type.getTypeUrl());
    let authorityState = this.authorityStateMap.get(resourceName.authority);
    if (!authorityState) {
      authorityState = {
        client: this.getOrCreateClient(resourceName.authority),
        resourceMap: new Map()
      };
      authorityState.client.ref();
      this.authorityStateMap.set(resourceName.authority, authorityState);
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
          clientStatus: 'REQUESTED'
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
    trace('cancelResourceWatch(type=' + type.getTypeUrl() + ', name=' + name + ')');
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

  addClusterDropStats(lrsServer: XdsServerConfig, clusterName: string, edsServiceName: string): XdsClusterDropStats {
    const client = this.getClient(lrsServer);
    if (!client) {
      return {
        addUncategorizedCallDropped: () => {},
        addCallDropped: (category) => {},
      };
    }
    return client.addClusterDropStats(clusterName, edsServiceName);
  }

  removeClusterDropStats(lrsServer: XdsServerConfig, clusterName: string, edsServiceName: string) {
    this.getClient(lrsServer)?.removeClusterDropStats(clusterName, edsServiceName);
  }

  addClusterLocalityStats(lrsServer: XdsServerConfig, clusterName: string, edsServiceName: string, locality: Locality__Output): XdsClusterLocalityStats {
    const client = this.getClient(lrsServer);
    if (!client) {
      return {
        addCallStarted: () => {},
        addCallFinished: (fail) => {},
      };
    }
    return client.addClusterLocalityStats(clusterName, edsServiceName, locality);
  }

  removeClusterLocalityStats(lrsServer: XdsServerConfig, clusterName: string, edsServiceName: string, locality: Locality__Output) {
    this.getClient(lrsServer)?.removeClusterLocalityStats(clusterName, edsServiceName, locality);
  }
}

let singletonXdsClient: XdsClient | null = null;

export function getSingletonXdsClient(): XdsClient {
  if (singletonXdsClient === null) {
    singletonXdsClient = new XdsClient();
  }
  return singletonXdsClient;
}
