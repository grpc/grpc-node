/*
 * Copyright 2020 gRPC authors.
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

import * as protoLoader from '@grpc/proto-loader';
import { loadPackageDefinition } from './make-client';
import * as adsTypes from './generated/ads';
import * as lrsTypes from './generated/lrs';
import { createGoogleDefaultCredentials } from './channel-credentials';
import { loadBootstrapInfo } from './xds-bootstrap';
import { ClientDuplexStream, ServiceError } from './call';
import { StatusObject } from './call-stream';
import { isIPv4, isIPv6 } from 'net';
import { Status, LogVerbosity } from './constants';
import { Metadata } from './metadata';
import * as logging from './logging';
import { ServiceConfig } from './service-config';
import { ChannelOptions } from './channel-options';
import { Node } from './generated/envoy/api/v2/core/Node';
import { AggregatedDiscoveryServiceClient } from './generated/envoy/service/discovery/v2/AggregatedDiscoveryService';
import { DiscoveryRequest } from './generated/envoy/api/v2/DiscoveryRequest';
import { DiscoveryResponse__Output } from './generated/envoy/api/v2/DiscoveryResponse';
import { ClusterLoadAssignment__Output } from './generated/envoy/api/v2/ClusterLoadAssignment';
import { Cluster__Output } from './generated/envoy/api/v2/Cluster';
import { LoadReportingServiceClient } from './generated/envoy/service/load_stats/v2/LoadReportingService';
import { LoadStatsRequest } from './generated/envoy/service/load_stats/v2/LoadStatsRequest';
import { LoadStatsResponse__Output } from './generated/envoy/service/load_stats/v2/LoadStatsResponse';
import {
  Locality__Output,
  Locality,
} from './generated/envoy/api/v2/core/Locality';
import {
  ClusterStats,
  _envoy_api_v2_endpoint_ClusterStats_DroppedRequests,
} from './generated/envoy/api/v2/endpoint/ClusterStats';
import { UpstreamLocalityStats } from './generated/envoy/api/v2/endpoint/UpstreamLocalityStats';

const TRACER_NAME = 'xds_client';

function trace(text: string): void {
  logging.trace(LogVerbosity.DEBUG, TRACER_NAME, text);
}

const clientVersion = require('../../package.json').version;

const EDS_TYPE_URL = 'type.googleapis.com/envoy.api.v2.ClusterLoadAssignment';
const CDS_TYPE_URL = 'type.googleapis.com/envoy.api.v2.Cluster';

let loadedProtos: Promise<
  adsTypes.ProtoGrpcType & lrsTypes.ProtoGrpcType
> | null = null;

function loadAdsProtos(): Promise<
  adsTypes.ProtoGrpcType & lrsTypes.ProtoGrpcType
> {
  if (loadedProtos !== null) {
    return loadedProtos;
  }
  loadedProtos = protoLoader
    .load(
      [
        'envoy/service/discovery/v2/ads.proto',
        'envoy/api/v2/listener.proto',
        'envoy/api/v2/route.proto',
        'envoy/api/v2/cluster.proto',
        'envoy/api/v2/endpoint.proto',
      ],
      {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true,
        includeDirs: [
          // Paths are relative to src/build
          __dirname + '/../../deps/envoy-api/',
          __dirname + '/../../deps/udpa/',
          __dirname + '/../../deps/googleapis/',
          __dirname + '/../../deps/protoc-gen-validate/',
        ],
      }
    )
    .then(
      (packageDefinition) =>
        (loadPackageDefinition(
          packageDefinition
        ) as unknown) as adsTypes.ProtoGrpcType & lrsTypes.ProtoGrpcType
    );
  return loadedProtos;
}

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

export interface Watcher<UpdateType> {
  onValidUpdate(update: UpdateType): void;
  onTransientError(error: StatusObject): void;
  onResourceDoesNotExist(): void;
}

export interface XdsClusterDropStats {
  addCallDropped(category: string): void;
}

export interface XdsClusterLocalityStats {
  addCallStarted(): void;
  addCallFinished(fail: boolean): void;
}

interface ClusterLocalityStats {
  locality: Locality__Output;
  callsStarted: number;
  callsSucceeded: number;
  callsFailed: number;
  callsInProgress: number;
}

interface ClusterLoadReport {
  callsDropped: Map<string, number>;
  localityStats: ClusterLocalityStats[];
  intervalStart: [number, number];
}

class ClusterLoadReportMap {
  private statsMap: {
    clusterName: string;
    edsServiceName: string;
    stats: ClusterLoadReport;
  }[] = [];

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

  getOrCreate(clusterName: string, edsServiceName: string): ClusterLoadReport {
    for (const statsObj of this.statsMap) {
      if (
        statsObj.clusterName === clusterName &&
        statsObj.edsServiceName === edsServiceName
      ) {
        return statsObj.stats;
      }
    }
    const newStats: ClusterLoadReport = {
      callsDropped: new Map<string, number>(),
      localityStats: [],
      intervalStart: process.hrtime(),
    };
    this.statsMap.push({
      clusterName,
      edsServiceName,
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
}

export class XdsClient {
  private adsNode: Node | null = null;
  private adsClient: AggregatedDiscoveryServiceClient | null = null;
  private adsCall: ClientDuplexStream<
    DiscoveryRequest,
    DiscoveryResponse__Output
  > | null = null;

  private lrsNode: Node | null = null;
  private lrsClient: LoadReportingServiceClient | null = null;
  private lrsCall: ClientDuplexStream<
    LoadStatsRequest,
    LoadStatsResponse__Output
  > | null = null;
  private latestLrsSettings: LoadStatsResponse__Output | null = null;

  private clusterStatsMap: ClusterLoadReportMap = new ClusterLoadReportMap();
  private statsTimer: NodeJS.Timer;

  private hasShutdown = false;

  private endpointWatchers: Map<
    string,
    Watcher<ClusterLoadAssignment__Output>[]
  > = new Map<string, Watcher<ClusterLoadAssignment__Output>[]>();
  private lastEdsVersionInfo = '';
  private lastEdsNonce = '';
  private latestEdsResponses: ClusterLoadAssignment__Output[] = [];

  private clusterWatchers: Map<string, Watcher<Cluster__Output>[]> = new Map<
    string,
    Watcher<Cluster__Output>[]
  >();
  private lastCdsVersionInfo = '';
  private lastCdsNonce = '';
  private latestCdsResponses: Cluster__Output[] = [];

  constructor(
    private targetName: string,
    private serviceConfigWatcher: Watcher<ServiceConfig>,
    channelOptions: ChannelOptions
  ) {
    const channelArgs = { ...channelOptions };
    const channelArgsToRemove = [
      /* The SSL target name override corresponds to the target, and this
       * client has its own target */
      'grpc.ssl_target_name_override',
      /* The default authority also corresponds to the target */
      'grpc.default_authority',
      /* This client will have its own specific keepalive time setting */
      'grpc.keepalive_time_ms',
      /* The service config specifies the load balancing policy. This channel
       * needs its own separate load balancing policy setting. In particular,
       * recursively using an xDS load balancer for the xDS client would be
       * bad */
      'grpc.service_config',
    ];
    for (const arg of channelArgsToRemove) {
      delete channelArgs[arg];
    }
    channelArgs['grpc.keepalive_time_ms'] = 5000;
    Promise.all([loadBootstrapInfo(), loadAdsProtos()]).then(
      ([bootstrapInfo, protoDefinitions]) => {
        if (this.hasShutdown) {
          return;
        }
        const node: Node = {
          ...bootstrapInfo.node,
          build_version: `gRPC Node Pure JS ${clientVersion}`,
          user_agent_name: 'gRPC Node Pure JS',
        };
        this.adsNode = {
          ...node,
          client_features: ['envoy.lb.does_not_support_overprovisioning'],
        };
        this.lrsNode = {
          ...node,
          client_features: ['envoy.lrs.supports_send_all_clusters'],
        };
        this.adsClient = new protoDefinitions.envoy.service.discovery.v2.AggregatedDiscoveryService(
          bootstrapInfo.xdsServers[0].serverUri,
          createGoogleDefaultCredentials(),
          channelArgs
        );
        this.maybeStartAdsStream();

        this.lrsClient = new protoDefinitions.envoy.service.load_stats.v2.LoadReportingService(
          bootstrapInfo.xdsServers[0].serverUri,
          createGoogleDefaultCredentials(),
          channelArgs
        );
        this.maybeStartLrsStream();
      },
      (error) => {
        trace('Failed to initialize xDS Client. ' + error.message);
        // Bubble this error up to any listeners
        this.reportStreamError({
          code: Status.INTERNAL,
          details: `Failed to initialize xDS Client. ${error.message}`,
          metadata: new Metadata(),
        });
      }
    );
    this.statsTimer = setInterval(() => {}, 0);
    clearInterval(this.statsTimer);
  }

  /**
   * Start the ADS stream if the client exists and there is not already an
   * existing stream, and there
   */
  private maybeStartAdsStream() {
    if (this.adsClient === null) {
      return;
    }
    if (this.adsCall !== null) {
      return;
    }
    if (this.hasShutdown) {
      return;
    }
    this.adsCall = this.adsClient.StreamAggregatedResources();
    this.adsCall.on('data', (message: DiscoveryResponse__Output) => {
      switch (message.type_url) {
        case EDS_TYPE_URL: {
          const edsResponses: ClusterLoadAssignment__Output[] = [];
          for (const resource of message.resources) {
            if (
              protoLoader.isAnyExtension(resource) &&
              resource['@type'] === EDS_TYPE_URL
            ) {
              const resp = resource as protoLoader.AnyExtension &
                ClusterLoadAssignment__Output;
              if (!this.validateEdsResponse(resp)) {
                this.nackEds('ClusterLoadAssignment validation failed');
                return;
              }
              edsResponses.push(resp);
            } else {
              this.nackEds(
                `Invalid resource type ${
                  protoLoader.isAnyExtension(resource)
                    ? resource['@type']
                    : resource.type_url
                }`
              );
              return;
            }
          }
          for (const message of edsResponses) {
            this.handleEdsResponse(message);
          }
          this.lastEdsVersionInfo = message.version_info;
          this.lastEdsNonce = message.nonce;
          this.latestEdsResponses = edsResponses;
          this.ackEds();
          break;
        }
        case CDS_TYPE_URL: {
          const cdsResponses: Cluster__Output[] = [];
          for (const resource of message.resources) {
            if (
              protoLoader.isAnyExtension(resource) &&
              resource['@type'] === CDS_TYPE_URL
            ) {
              const resp = resource as protoLoader.AnyExtension &
                Cluster__Output;
              if (!this.validateCdsResponse(resp)) {
                this.nackCds('Cluster validation failed');
                return;
              }
            } else {
              this.nackEds(
                `Invalid resource type ${
                  protoLoader.isAnyExtension(resource)
                    ? resource['@type']
                    : resource.type_url
                }`
              );
              return;
            }
          }
          for (const message of cdsResponses) {
            this.handleCdsResponse(message);
          }
          this.lastCdsVersionInfo = message.version_info;
          this.lastCdsNonce = message.nonce;
          this.latestCdsResponses = cdsResponses;
          this.ackCds();
          break;
        }
        default:
          this.nackUnknown(
            message.type_url,
            message.version_info,
            message.nonce
          );
      }
    });
    this.adsCall.on('error', (error: ServiceError) => {
      trace(
        'ADS stream ended. code=' + error.code + ' details= ' + error.details
      );
      this.adsCall = null;
      this.reportStreamError(error);
      /* Connection backoff is handled by the client object, so we can
       * immediately start a new request to indicate that it should try to
       * reconnect */
      this.maybeStartAdsStream();
    });
    const endpointWatcherNames = Array.from(this.endpointWatchers.keys());
    if (endpointWatcherNames.length > 0) {
      this.adsCall.write({
        node: this.adsNode!,
        type_url: EDS_TYPE_URL,
        resource_names: endpointWatcherNames,
      });
    }
  }

  private nackUnknown(typeUrl: string, versionInfo: string, nonce: string) {
    if (!this.adsCall) {
      return;
    }
    this.adsCall.write({
      node: this.adsNode!,
      type_url: typeUrl,
      version_info: versionInfo,
      response_nonce: nonce,
      error_detail: {
        message: `Unknown type_url ${typeUrl}`,
      },
    });
  }

  /**
   * Acknowledge an EDS update. This should be called after the local nonce and
   * version info are updated so that it sends the post-update values.
   */
  private ackEds() {
    if (!this.adsCall) {
      return;
    }
    this.adsCall.write({
      node: this.adsNode!,
      type_url: EDS_TYPE_URL,
      resource_names: Array.from(this.endpointWatchers.keys()),
      response_nonce: this.lastEdsNonce,
      version_info: this.lastEdsVersionInfo,
    });
  }

  private ackCds() {
    if (!this.adsCall) {
      return;
    }
    this.adsCall.write({
      node: this.adsNode!,
      type_url: CDS_TYPE_URL,
      resource_names: Array.from(this.clusterWatchers.keys()),
      response_nonce: this.lastCdsNonce,
      version_info: this.lastCdsVersionInfo,
    });
  }

  /**
   * Reject an EDS update. This should be called without updating the local
   * nonce and version info.
   */
  private nackEds(message: string) {
    if (!this.adsCall) {
      return;
    }
    this.adsCall.write({
      node: this.adsNode!,
      type_url: EDS_TYPE_URL,
      resource_names: Array.from(this.endpointWatchers.keys()),
      response_nonce: this.lastEdsNonce,
      version_info: this.lastEdsVersionInfo,
      error_detail: {
        message,
      },
    });
  }

  private nackCds(message: string) {
    if (!this.adsCall) {
      return;
    }
    this.adsCall.write({
      node: this.adsNode!,
      type_url: CDS_TYPE_URL,
      resource_names: Array.from(this.clusterWatchers.keys()),
      response_nonce: this.lastCdsNonce,
      version_info: this.lastCdsVersionInfo,
      error_detail: {
        message,
      },
    });
  }

  /**
   * Validate the ClusterLoadAssignment object by these rules:
   * https://github.com/grpc/proposal/blob/master/A27-xds-global-load-balancing.md#clusterloadassignment-proto
   * @param message
   */
  private validateEdsResponse(message: ClusterLoadAssignment__Output): boolean {
    for (const endpoint of message.endpoints) {
      for (const lb of endpoint.lb_endpoints) {
        const socketAddress = lb.endpoint?.address?.socket_address;
        if (!socketAddress) {
          return false;
        }
        if (socketAddress.port_specifier !== 'port_value') {
          return false;
        }
        if (!(isIPv4(socketAddress.address) || isIPv6(socketAddress.address))) {
          return false;
        }
      }
    }
    return true;
  }

  private validateCdsResponse(message: Cluster__Output): boolean {
    if (message.type !== 'EDS') {
      return false;
    }
    if (!message.eds_cluster_config?.eds_config?.ads) {
      return false;
    }
    if (message.lb_policy !== 'ROUND_ROBIN') {
      return false;
    }
    if (message.lrs_server) {
      if (!message.lrs_server.self) {
        return false;
      }
    }
    return true;
  }

  private handleEdsResponse(message: ClusterLoadAssignment__Output) {
    const watchers = this.endpointWatchers.get(message.cluster_name) ?? [];
    for (const watcher of watchers) {
      watcher.onValidUpdate(message);
    }
  }

  private handleCdsResponse(message: Cluster__Output) {
    const watchers = this.clusterWatchers.get(message.name) ?? [];
    for (const watcher of watchers) {
      watcher.onValidUpdate(message);
    }
  }

  private updateEdsNames() {
    if (this.adsCall) {
      this.adsCall.write({
        node: this.adsNode!,
        type_url: EDS_TYPE_URL,
        resource_names: Array.from(this.endpointWatchers.keys()),
        response_nonce: this.lastEdsNonce,
        version_info: this.lastEdsVersionInfo,
      });
    }
  }

  private updateCdsNames() {
    if (this.adsCall) {
      this.adsCall.write({
        node: this.adsNode!,
        type_url: CDS_TYPE_URL,
        resource_names: Array.from(this.clusterWatchers.keys()),
        response_nonce: this.lastCdsNonce,
        version_info: this.lastCdsVersionInfo,
      });
    }
  }

  private reportStreamError(status: StatusObject) {
    for (const watcherList of [
      ...this.endpointWatchers.values(),
      ...this.clusterWatchers.values(),
    ]) {
      for (const watcher of watcherList) {
        watcher.onTransientError(status);
      }
    }
    // Also do the same for other types of watchers when those are implemented
  }

  private maybeStartLrsStream() {
    if (!this.lrsClient) {
      return;
    }
    if (this.lrsCall) {
      return;
    }
    if (this.hasShutdown) {
      return;
    }

    this.lrsCall = this.lrsClient.streamLoadStats();
    this.lrsCall.on('data', (message: LoadStatsResponse__Output) => {
      if (
        message.load_reporting_interval?.seconds !==
          this.latestLrsSettings?.load_reporting_interval?.seconds ||
        message.load_reporting_interval?.nanos !==
          this.latestLrsSettings?.load_reporting_interval?.nanos
      ) {
        /* Only reset the timer if the interval has changed or was not set
         * before. */
        clearInterval(this.statsTimer);
        /* Convert a google.protobuf.Duration to a number of milliseconds for
         * use with setInterval. */
        const loadReportingIntervalMs =
          Number.parseInt(message.load_reporting_interval!.seconds) * 1000 +
          message.load_reporting_interval!.nanos / 1_000_000;
        setInterval(() => {
          this.sendStats();
        }, loadReportingIntervalMs);
      }
      this.latestLrsSettings = message;
    });
    this.lrsCall.on('error', (error: ServiceError) => {
      trace(
        'LRS stream ended. code=' + error.code + ' details= ' + error.details
      );
      this.lrsCall = null;
      clearInterval(this.statsTimer);
      /* Connection backoff is handled by the client object, so we can
       * immediately start a new request to indicate that it should try to
       * reconnect */
      this.maybeStartAdsStream();
    });
    this.lrsCall.write({
      node: this.lrsNode!,
    });
  }

  private sendStats() {
    if (!this.lrsCall) {
      return;
    }
    const clusterStats: ClusterStats[] = [];
    for (const [
      { clusterName, edsServiceName },
      stats,
    ] of this.clusterStatsMap.entries()) {
      if (
        this.latestLrsSettings!.send_all_clusters ||
        this.latestLrsSettings!.clusters.indexOf(clusterName) > 0
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
        const droppedRequests: _envoy_api_v2_endpoint_ClusterStats_DroppedRequests[] = [];
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
        // Clear out dropped call stats after sending them
        stats.callsDropped.clear();
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
    this.lrsCall.write({
      node: this.lrsNode!,
      cluster_stats: clusterStats,
    });
  }

  addEndpointWatcher(
    edsServiceName: string,
    watcher: Watcher<ClusterLoadAssignment__Output>
  ) {
    trace('Watcher added for endpoint ' + edsServiceName);
    let watchersEntry = this.endpointWatchers.get(edsServiceName);
    let addedServiceName = false;
    if (watchersEntry === undefined) {
      addedServiceName = true;
      watchersEntry = [];
      this.endpointWatchers.set(edsServiceName, watchersEntry);
    }
    watchersEntry.push(watcher);
    if (addedServiceName) {
      this.updateEdsNames();
    }

    /* If we have already received an update for the requested edsServiceName,
     * immediately pass that update along to the watcher */
    for (const message of this.latestEdsResponses) {
      if (message.cluster_name === edsServiceName) {
        /* These updates normally occur asynchronously, so we ensure that
         * the same happens here */
        process.nextTick(() => {
          watcher.onValidUpdate(message);
        });
      }
    }
  }

  removeEndpointWatcher(
    edsServiceName: string,
    watcher: Watcher<ClusterLoadAssignment__Output>
  ) {
    trace('Watcher removed for endpoint ' + edsServiceName);
    const watchersEntry = this.endpointWatchers.get(edsServiceName);
    let removedServiceName = false;
    if (watchersEntry !== undefined) {
      const entryIndex = watchersEntry.indexOf(watcher);
      if (entryIndex >= 0) {
        watchersEntry.splice(entryIndex, 1);
      }
      if (watchersEntry.length === 0) {
        removedServiceName = true;
        this.endpointWatchers.delete(edsServiceName);
      }
    }
    if (removedServiceName) {
      this.updateEdsNames();
    }
  }

  addClusterWatcher(clusterName: string, watcher: Watcher<Cluster__Output>) {
    trace('Watcher added for cluster ' + clusterName);
    let watchersEntry = this.clusterWatchers.get(clusterName);
    let addedServiceName = false;
    if (watchersEntry === undefined) {
      addedServiceName = true;
      watchersEntry = [];
      this.clusterWatchers.set(clusterName, watchersEntry);
    }
    watchersEntry.push(watcher);
    if (addedServiceName) {
      this.updateCdsNames();
    }

    /* If we have already received an update for the requested clusterName,
     * immediately pass that update along to the watcher */
    for (const message of this.latestCdsResponses) {
      if (message.name === clusterName) {
        /* These updates normally occur asynchronously, so we ensure that
         * the same happens here */
        process.nextTick(() => {
          watcher.onValidUpdate(message);
        });
      }
    }
  }

  removeClusterWatcher(clusterName: string, watcher: Watcher<Cluster__Output>) {
    trace('Watcher removed for endpoint ' + clusterName);
    const watchersEntry = this.clusterWatchers.get(clusterName);
    let removedServiceName = false;
    if (watchersEntry !== undefined) {
      const entryIndex = watchersEntry.indexOf(watcher);
      if (entryIndex >= 0) {
        watchersEntry.splice(entryIndex, 1);
      }
      if (watchersEntry.length === 0) {
        removedServiceName = true;
        this.endpointWatchers.delete(clusterName);
      }
    }
    if (removedServiceName) {
      this.updateCdsNames();
    }
  }

  /**
   *
   * @param lrsServer The target name of the server to send stats to. An empty
   *     string indicates that the default LRS client should be used. Currently
   *     only the empty string is supported here.
   * @param clusterName
   * @param edsServiceName
   */
  addClusterDropStats(
    lrsServer: string,
    clusterName: string,
    edsServiceName: string
  ): XdsClusterDropStats {
    if (lrsServer !== '') {
      return {
        addCallDropped: (category) => {},
      };
    }
    const clusterStats = this.clusterStatsMap.getOrCreate(
      clusterName,
      edsServiceName
    );
    return {
      addCallDropped: (category) => {
        const prevCount = clusterStats.callsDropped.get(category) ?? 0;
        clusterStats.callsDropped.set(category, prevCount + 1);
      },
    };
  }

  addClusterLocalityStats(
    lrsServer: string,
    clusterName: string,
    edsServiceName: string,
    locality: Locality__Output
  ): XdsClusterLocalityStats {
    if (lrsServer !== '') {
      return {
        addCallStarted: () => {},
        addCallFinished: (fail) => {},
      };
    }
    const clusterStats = this.clusterStatsMap.getOrCreate(
      clusterName,
      edsServiceName
    );
    let localityStats: ClusterLocalityStats | null = null;
    for (const statsObj of clusterStats.localityStats) {
      if (localityEqual(locality, statsObj.locality)) {
        localityStats = statsObj;
        break;
      }
    }
    if (localityStats === null) {
      localityStats = {
        locality,
        callsInProgress: 0,
        callsStarted: 0,
        callsSucceeded: 0,
        callsFailed: 0,
      };
      clusterStats.localityStats.push(localityStats);
    }
    /* Help the compiler understand that this object is always non-null in the
     * closure */
    const finalLocalityStats: ClusterLocalityStats = localityStats;
    return {
      addCallStarted: () => {
        finalLocalityStats.callsSucceeded += 1;
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

  shutdown(): void {
    this.adsCall?.cancel();
    this.adsClient?.close();
    this.lrsCall?.cancel();
    this.lrsClient?.close();
    this.hasShutdown = true;
  }
}
