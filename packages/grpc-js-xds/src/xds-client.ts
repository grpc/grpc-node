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
import { loadPackageDefinition, StatusObject, status, logVerbosity, Metadata, experimental, ChannelOptions, ClientDuplexStream, ServiceError, ChannelCredentials } from '@grpc/grpc-js';
import * as adsTypes from './generated/ads';
import * as lrsTypes from './generated/lrs';
import { loadBootstrapInfo } from './xds-bootstrap';
import { isIPv4, isIPv6 } from 'net';
import { Node } from './generated/envoy/api/v2/core/Node';
import { AggregatedDiscoveryServiceClient } from './generated/envoy/service/discovery/v2/AggregatedDiscoveryService';
import { DiscoveryRequest } from './generated/envoy/api/v2/DiscoveryRequest';
import { DiscoveryResponse__Output } from './generated/envoy/api/v2/DiscoveryResponse';
import {
  ClusterLoadAssignment__Output,
  ClusterLoadAssignment,
} from './generated/envoy/api/v2/ClusterLoadAssignment';
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
import { Listener__Output } from './generated/envoy/api/v2/Listener';
import { HttpConnectionManager__Output } from './generated/envoy/config/filter/network/http_connection_manager/v2/HttpConnectionManager';
import { RouteConfiguration__Output } from './generated/envoy/api/v2/RouteConfiguration';
import { Any__Output } from './generated/google/protobuf/Any';
import BackoffTimeout = experimental.BackoffTimeout;
import ServiceConfig = experimental.ServiceConfig;
import { createGoogleDefaultCredentials } from './google-default-credentials';
import { CdsLoadBalancingConfig } from './load-balancer-cds';
import { EdsState } from './xds-stream-state/eds-state';
import { CdsState } from './xds-stream-state/cds-state';
import { RdsState } from './xds-stream-state/rds-state';
import { LdsState } from './xds-stream-state/lds-state';
import { Watcher } from './xds-stream-state/xds-stream-state';

const TRACER_NAME = 'xds_client';

function trace(text: string): void {
  experimental.trace(logVerbosity.DEBUG, TRACER_NAME, text);
}

const clientVersion = require('../../package.json').version;

const EDS_TYPE_URL = 'type.googleapis.com/envoy.api.v2.ClusterLoadAssignment';
const CDS_TYPE_URL = 'type.googleapis.com/envoy.api.v2.Cluster';
const LDS_TYPE_URL = 'type.googleapis.com/envoy.api.v2.Listener';
const RDS_TYPE_URL = 'type.googleapis.com/envoy.api.v2.RouteConfiguration';

type EdsTypeUrl = 'type.googleapis.com/envoy.api.v2.ClusterLoadAssignment';
type CdsTypeUrl = 'type.googleapis.com/envoy.api.v2.Cluster';
type LdsTypeUrl = 'type.googleapis.com/envoy.api.v2.Listener';
type RdsTypeUrl = 'type.googleapis.com/envoy.api.v2.RouteConfiguration';

type AdsTypeUrl = EdsTypeUrl | CdsTypeUrl | RdsTypeUrl | LdsTypeUrl;

const HTTP_CONNECTION_MANGER_TYPE_URL =
  'type.googleapis.com/envoy.config.filter.network.http_connection_manager.v2.HttpConnectionManager';

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
        'envoy/service/load_stats/v2/lrs.proto',
        'envoy/api/v2/listener.proto',
        'envoy/api/v2/route.proto',
        'envoy/api/v2/cluster.proto',
        'envoy/api/v2/endpoint.proto',
        'envoy/config/filter/network/http_connection_manager/v2/http_connection_manager.proto',
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

interface AdsState {
  [EDS_TYPE_URL]: EdsState;
  [CDS_TYPE_URL]: CdsState;
  [RDS_TYPE_URL]: RdsState;
  [LDS_TYPE_URL]: LdsState;
}

/**
 * Map type URLs to their corresponding message types
 */
type OutputType<T extends AdsTypeUrl> = T extends EdsTypeUrl
  ? ClusterLoadAssignment__Output
  : T extends CdsTypeUrl
  ? Cluster__Output
  : T extends RdsTypeUrl
  ? RouteConfiguration__Output
  : Listener__Output;

function getResponseMessages<T extends AdsTypeUrl>(
  typeUrl: T,
  resources: Any__Output[]
): OutputType<T>[] {
  const result: OutputType<T>[] = [];
  for (const resource of resources) {
    if (protoLoader.isAnyExtension(resource) && resource['@type'] === typeUrl) {
      result.push(resource as protoLoader.AnyExtension & OutputType<T>);
    } else {
      throw new Error(
        `ADS Error: Invalid resource type ${
          protoLoader.isAnyExtension(resource)
            ? resource['@type']
            : resource.type_url
        }, expected ${typeUrl}`
      );
    }
  }
  return result;
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

  private adsState: AdsState;

  private adsBackoff: BackoffTimeout;
  private lrsBackoff: BackoffTimeout;

  constructor() {
    const edsState = new EdsState(() => {
      this.updateNames(EDS_TYPE_URL);
    });
    const cdsState = new CdsState(edsState, () => {
      this.updateNames(CDS_TYPE_URL);
    });
    const rdsState = new RdsState(() => {
      this.updateNames(RDS_TYPE_URL);
    });
    const ldsState = new LdsState(rdsState, () => {
      this.updateNames(LDS_TYPE_URL);
    });
    this.adsState = {
      [EDS_TYPE_URL]: edsState,
      [CDS_TYPE_URL]: cdsState,
      [RDS_TYPE_URL]: rdsState,
      [LDS_TYPE_URL]: ldsState,
    };

    const channelArgs = {
      // 5 minutes
      'grpc.keepalive_time_ms': 5 * 60 * 1000
    }

    this.adsBackoff = new BackoffTimeout(() => {
      this.maybeStartAdsStream();
    });
    this.lrsBackoff = new BackoffTimeout(() => {
      this.maybeStartLrsStream();
    })

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
        const credentialsConfigs = bootstrapInfo.xdsServers[0].channelCreds;
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
        if (channelCreds === null) {
          trace('Failed to initialize xDS Client. No valid credentials types found.');
          // Bubble this error up to any listeners
          this.reportStreamError({
            code: status.INTERNAL,
            details: 'Failed to initialize xDS Client. No valid credentials types found.',
            metadata: new Metadata(),
          });
          return;
        }
        trace('Starting xDS client connected to server URI ' + bootstrapInfo.xdsServers[0].serverUri);
        this.adsClient = new protoDefinitions.envoy.service.discovery.v2.AggregatedDiscoveryService(
          bootstrapInfo.xdsServers[0].serverUri,
          channelCreds,
          channelArgs
        );
        this.maybeStartAdsStream();

        this.lrsClient = new protoDefinitions.envoy.service.load_stats.v2.LoadReportingService(
          bootstrapInfo.xdsServers[0].serverUri,
          channelCreds,
          {channelOverride: this.adsClient.getChannel()}
        );
        this.maybeStartLrsStream();
      },
      (error) => {
        trace('Failed to initialize xDS Client. ' + error.message);
        // Bubble this error up to any listeners
        this.reportStreamError({
          code: status.INTERNAL,
          details: `Failed to initialize xDS Client. ${error.message}`,
          metadata: new Metadata(),
        });
      }
    );
    this.statsTimer = setInterval(() => {}, 0);
    clearInterval(this.statsTimer);
  }

  private handleAdsResponse(message: DiscoveryResponse__Output) {
    let errorString: string | null;
    /* The cases in this switch statement look redundant but separating them
     * out like this is necessary for the typechecker to validate the types
     * as narrowly as we need it to. */
    switch (message.type_url) {
      case EDS_TYPE_URL:
        errorString = this.adsState[message.type_url].handleResponses(
          getResponseMessages(message.type_url, message.resources)
        );
        break;
      case CDS_TYPE_URL:
        errorString = this.adsState[message.type_url].handleResponses(
          getResponseMessages(message.type_url, message.resources)
        );
        break;
      case RDS_TYPE_URL:
        errorString = this.adsState[message.type_url].handleResponses(
          getResponseMessages(message.type_url, message.resources)
        );
        break;
      case LDS_TYPE_URL:
        errorString = this.adsState[message.type_url].handleResponses(
          getResponseMessages(message.type_url, message.resources)
        );
        break;
      default:
        errorString = `Unknown type_url ${message.type_url}`;
    }
    if (errorString === null) {
      trace('Acking message with type URL ' + message.type_url);
      /* errorString can only be null in one of the first 4 cases, which
       * implies that message.type_url is one of the 4 known type URLs, which
       * means that this type assertion is valid. */
      const typeUrl = message.type_url as AdsTypeUrl;
      this.adsState[typeUrl].nonce = message.nonce;
      this.adsState[typeUrl].versionInfo = message.version_info;
      this.ack(typeUrl);
    } else {
      trace('Nacking message with type URL ' + message.type_url + ': "' + errorString + '"');
      this.nack(message.type_url, errorString);
    }
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
    if (this.adsState[EDS_TYPE_URL].getResourceNames().length === 0 &&
    this.adsState[CDS_TYPE_URL].getResourceNames().length === 0 &&
    this.adsState[RDS_TYPE_URL].getResourceNames().length === 0 &&
    this.adsState[LDS_TYPE_URL].getResourceNames().length === 0) {
      return;
    }
    trace('Starting ADS stream');
    // Backoff relative to when we start the request
    this.adsBackoff.runOnce();
    this.adsCall = this.adsClient.StreamAggregatedResources();
    this.adsCall.on('data', (message: DiscoveryResponse__Output) => {
      this.handleAdsResponse(message);
    });
    this.adsCall.on('error', (error: ServiceError) => {
      trace(
        'ADS stream ended. code=' + error.code + ' details= ' + error.details
      );
      this.adsCall = null;
      this.reportStreamError(error);
      /* If the backoff timer is no longer running, we do not need to wait any
       * more to start the new call. */
      if (!this.adsBackoff.isRunning()) {
        this.maybeStartAdsStream();
      }
    });

    const allTypeUrls: AdsTypeUrl[] = [
      EDS_TYPE_URL,
      CDS_TYPE_URL,
      RDS_TYPE_URL,
      LDS_TYPE_URL,
    ];
    for (const typeUrl of allTypeUrls) {
      const state = this.adsState[typeUrl];
      if (state.getResourceNames().length > 0) {
        this.updateNames(typeUrl);
      }
    }
  }

  /**
   * Acknowledge an update. This should be called after the local nonce and
   * version info are updated so that it sends the post-update values.
   */
  ack(typeUrl: AdsTypeUrl) {
    /* An ack is the best indication of a successful interaction between the
     * client and the server, so we can reset the backoff timer here. */
    this.adsBackoff.stop();
    this.adsBackoff.reset();

    this.updateNames(typeUrl);
  }

  /**
   * Reject an update. This should be called without updating the local
   * nonce and version info.
   */
  private nack(typeUrl: string, message: string) {
    let resourceNames: string[];
    let nonce: string;
    let versionInfo: string;
    switch (typeUrl) {
      case EDS_TYPE_URL:
      case CDS_TYPE_URL:
      case RDS_TYPE_URL:
      case LDS_TYPE_URL:
        resourceNames = this.adsState[typeUrl].getResourceNames();
        nonce = this.adsState[typeUrl].nonce;
        versionInfo = this.adsState[typeUrl].versionInfo;
        break;
      default:
        resourceNames = [];
        nonce = '';
        versionInfo = '';
    }
    this.adsCall?.write({
      node: this.adsNode!,
      type_url: typeUrl,
      resource_names: resourceNames,
      response_nonce: nonce,
      version_info: versionInfo,
      error_detail: {
        message: message,
      },
    });
  }

  private updateNames(typeUrl: AdsTypeUrl) {
    if (this.adsState[EDS_TYPE_URL].getResourceNames().length === 0 &&
    this.adsState[CDS_TYPE_URL].getResourceNames().length === 0 &&
    this.adsState[RDS_TYPE_URL].getResourceNames().length === 0 &&
    this.adsState[LDS_TYPE_URL].getResourceNames().length === 0) {
      this.adsCall?.end();
      this.lrsCall?.end();
      return;
    }
    this.maybeStartAdsStream();
    this.maybeStartLrsStream();
    trace('Sending update for type URL ' + typeUrl + ' with names ' + this.adsState[typeUrl].getResourceNames());
    this.adsCall?.write({
      node: this.adsNode!,
      type_url: typeUrl,
      resource_names: this.adsState[typeUrl].getResourceNames(),
      response_nonce: this.adsState[typeUrl].nonce,
      version_info: this.adsState[typeUrl].versionInfo,
    });
  }

  private reportStreamError(status: StatusObject) {
    this.adsState[EDS_TYPE_URL].reportStreamError(status);
    this.adsState[CDS_TYPE_URL].reportStreamError(status);
    this.adsState[RDS_TYPE_URL].reportStreamError(status);
    this.adsState[LDS_TYPE_URL].reportStreamError(status);
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
    if (this.adsState[EDS_TYPE_URL].getResourceNames().length === 0 &&
    this.adsState[CDS_TYPE_URL].getResourceNames().length === 0 &&
    this.adsState[RDS_TYPE_URL].getResourceNames().length === 0 &&
    this.adsState[LDS_TYPE_URL].getResourceNames().length === 0) {
      return;
    }
  
    trace('Starting LRS stream');

    this.lrsBackoff.runOnce();
    this.lrsCall = this.lrsClient.streamLoadStats();
    this.lrsCall.on('data', (message: LoadStatsResponse__Output) => {
      /* Once we get any response from the server, we assume that the stream is
       * in a good state, so we can reset the backoff timer. */
      this.lrsBackoff.stop();
      this.lrsBackoff.reset();
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
        trace('Received LRS request with load reporting interval ' + loadReportingIntervalMs + ' ms');
        this.statsTimer = setInterval(() => {
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
      this.latestLrsSettings = null;
      clearInterval(this.statsTimer);
      /* If the backoff timer is no longer running, we do not need to wait any
       * more to start the new call. */
      if (!this.lrsBackoff.isRunning()) {
        this.maybeStartLrsStream();
      }
    });
    /* Send buffered stats information when starting LRS stream. If there is no
     * buffered stats information, it will still send the node field. */
    this.sendStats();
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
    trace('Sending LRS stats ' + JSON.stringify(clusterStats, undefined, 2));
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
    this.adsState[EDS_TYPE_URL].addWatcher(edsServiceName, watcher);
  }

  removeEndpointWatcher(
    edsServiceName: string,
    watcher: Watcher<ClusterLoadAssignment__Output>
  ) {
    trace('Watcher removed for endpoint ' + edsServiceName);
    this.adsState[EDS_TYPE_URL].removeWatcher(edsServiceName, watcher);
  }

  addClusterWatcher(clusterName: string, watcher: Watcher<Cluster__Output>) {
    trace('Watcher added for cluster ' + clusterName);
    this.adsState[CDS_TYPE_URL].addWatcher(clusterName, watcher);
  }

  removeClusterWatcher(clusterName: string, watcher: Watcher<Cluster__Output>) {
    trace('Watcher removed for cluster ' + clusterName);
    this.adsState[CDS_TYPE_URL].removeWatcher(clusterName, watcher);
  }

  addRouteWatcher(routeConfigName: string, watcher: Watcher<RouteConfiguration__Output>) {
    trace('Watcher added for route ' + routeConfigName);
    this.adsState[RDS_TYPE_URL].addWatcher(routeConfigName, watcher);
  }

  removeRouteWatcher(routeConfigName: string, watcher: Watcher<RouteConfiguration__Output>) {
    trace('Watcher removed for route ' + routeConfigName);
    this.adsState[RDS_TYPE_URL].removeWatcher(routeConfigName, watcher);
  }

  addListenerWatcher(targetName: string, watcher: Watcher<Listener__Output>) {
    trace('Watcher added for listener ' + targetName);
    this.adsState[LDS_TYPE_URL].addWatcher(targetName, watcher);
  }

  removeListenerWatcher(targetName: string, watcher: Watcher<Listener__Output>) {
    trace('Watcher removed for listener ' + targetName);
    this.adsState[LDS_TYPE_URL].removeWatcher(targetName, watcher);
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
    trace('addClusterDropStats(lrsServer=' + lrsServer + ', clusterName=' + clusterName + ', edsServiceName=' + edsServiceName + ')');
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
    trace('addClusterLocalityStats(lrsServer=' + lrsServer + ', clusterName=' + clusterName + ', edsServiceName=' + edsServiceName + ', locality=' + JSON.stringify(locality) + ')');
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
        locality: locality,
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

  private shutdown(): void {
    this.adsCall?.cancel();
    this.adsClient?.close();
    this.lrsCall?.cancel();
    this.lrsClient?.close();
    this.hasShutdown = true;
  }
}

let singletonXdsClient: XdsClient | null = null;

export function getSingletonXdsClient(): XdsClient {
  if (singletonXdsClient === null) {
    singletonXdsClient = new XdsClient();
  }
  return singletonXdsClient;
}