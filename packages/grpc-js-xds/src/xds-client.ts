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
// This is a non-public, unstable API, but it's very convenient
import { loadProtosWithOptionsSync } from '@grpc/proto-loader/build/src/util';
import { loadPackageDefinition, StatusObject, status, logVerbosity, Metadata, experimental, ChannelOptions, ClientDuplexStream, ServiceError, ChannelCredentials, Channel } from '@grpc/grpc-js';
import * as adsTypes from './generated/ads';
import * as lrsTypes from './generated/lrs';
import { loadBootstrapInfo } from './xds-bootstrap';
import { Node as NodeV2 } from './generated/envoy/api/v2/core/Node';
import { Node as NodeV3 } from './generated/envoy/config/core/v3/Node';
import { AggregatedDiscoveryServiceClient as AggregatedDiscoveryServiceClientV2 } from './generated/envoy/service/discovery/v2/AggregatedDiscoveryService';
import { AggregatedDiscoveryServiceClient as AggregatedDiscoveryServiceClientV3 } from './generated/envoy/service/discovery/v3/AggregatedDiscoveryService';
import { DiscoveryRequest as DiscoveryRequestV2 } from './generated/envoy/api/v2/DiscoveryRequest';
import { DiscoveryRequest as DiscoveryRequestV3 } from './generated/envoy/service/discovery/v3/DiscoveryRequest';
import { DiscoveryResponse__Output } from './generated/envoy/service/discovery/v3/DiscoveryResponse';
import { LoadReportingServiceClient as LoadReportingServiceClientV2 } from './generated/envoy/service/load_stats/v2/LoadReportingService';
import { LoadReportingServiceClient as LoadReportingServiceClientV3 } from './generated/envoy/service/load_stats/v3/LoadReportingService';
import { LoadStatsRequest as LoadStatsRequestV2 } from './generated/envoy/service/load_stats/v2/LoadStatsRequest';
import { LoadStatsRequest as LoadStatsRequestV3 } from './generated/envoy/service/load_stats/v3/LoadStatsRequest';
import { LoadStatsResponse__Output } from './generated/envoy/service/load_stats/v3/LoadStatsResponse';
import { Locality, Locality__Output } from './generated/envoy/config/core/v3/Locality';
import { Listener__Output } from './generated/envoy/config/listener/v3/Listener';
import { Any__Output } from './generated/google/protobuf/Any';
import BackoffTimeout = experimental.BackoffTimeout;
import ServiceConfig = experimental.ServiceConfig;
import { createGoogleDefaultCredentials } from './google-default-credentials';
import { CdsLoadBalancingConfig } from './load-balancer-cds';
import { EdsState } from './xds-stream-state/eds-state';
import { CdsState } from './xds-stream-state/cds-state';
import { RdsState } from './xds-stream-state/rds-state';
import { LdsState } from './xds-stream-state/lds-state';
import { HandleResponseResult, ResourcePair, Watcher } from './xds-stream-state/xds-stream-state';
import { ClusterLoadAssignment__Output } from './generated/envoy/config/endpoint/v3/ClusterLoadAssignment';
import { Cluster__Output } from './generated/envoy/config/cluster/v3/Cluster';
import { RouteConfiguration__Output } from './generated/envoy/config/route/v3/RouteConfiguration';
import { Duration } from './generated/google/protobuf/Duration';
import { AdsOutputType, AdsTypeUrl, CDS_TYPE_URL_V2, CDS_TYPE_URL_V3, decodeSingleResource, EDS_TYPE_URL_V2, EDS_TYPE_URL_V3, LDS_TYPE_URL_V2, LDS_TYPE_URL_V3, RDS_TYPE_URL_V2, RDS_TYPE_URL_V3 } from './resources';
import { setCsdsClientNode, updateCsdsRequestedNameList, updateCsdsResourceResponse } from './csds';

const TRACER_NAME = 'xds_client';

function trace(text: string): void {
  experimental.trace(logVerbosity.DEBUG, TRACER_NAME, text);
}

const clientVersion = require('../../package.json').version;

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
        'envoy/service/discovery/v3/ads.proto',
        'envoy/service/load_stats/v3/lrs.proto',
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
          __dirname + '/../../deps/xds/',
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
}

interface ClusterLoadReport {
  callsDropped: Map<string, number>;
  uncategorizedCallsDropped: number;
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
      uncategorizedCallsDropped: 0,
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

type AdsServiceKind = 'eds' | 'cds' | 'rds' | 'lds';

interface AdsState {
  eds: EdsState;
  cds: CdsState;
  rds: RdsState;
  lds: LdsState;
}

enum XdsApiVersion {
  V2,
  V3
}

function getResponseMessages<T extends AdsTypeUrl>(
  targetTypeUrl: T,
  allowedTypeUrls: string[],
  resources: Any__Output[]
): ResourcePair<AdsOutputType<T>>[] {
  const result: ResourcePair<AdsOutputType<T>>[] = [];
  for (const resource of resources) {
    if (allowedTypeUrls.includes(resource.type_url)) {
      result.push({
        resource: decodeSingleResource(targetTypeUrl, resource.value),
        raw: resource
      });
    } else {
      throw new Error(
        `ADS Error: Invalid resource type ${resource.type_url}, expected ${allowedTypeUrls}`
      );
    }
  }
  return result;
}

export class XdsClient {
  private apiVersion: XdsApiVersion = XdsApiVersion.V2;

  private adsNodeV2: NodeV2 | null = null;
  private adsNodeV3: NodeV3 | null = null;
  /* A client initiates connections lazily, so the client we don't use won't
   * use significant extra resources. */
  private adsClientV2: AggregatedDiscoveryServiceClientV2 | null = null;
  private adsClientV3: AggregatedDiscoveryServiceClientV3 | null = null;
  /* TypeScript typing is structural, so we can take advantage of the fact that
   * the output structures for the two call types are identical. */
  private adsCallV2: ClientDuplexStream<
    DiscoveryRequestV2,
    DiscoveryResponse__Output
  > | null = null;
  private adsCallV3: ClientDuplexStream<
    DiscoveryRequestV3,
    DiscoveryResponse__Output
  > | null = null;

  private lrsNodeV2: NodeV2 | null = null;
  private lrsNodeV3: NodeV3 | null = null;
  private lrsClientV2: LoadReportingServiceClientV2 | null = null;
  private lrsClientV3: LoadReportingServiceClientV3 | null = null;
  private lrsCallV2: ClientDuplexStream<
    LoadStatsRequestV2,
    LoadStatsResponse__Output
  > | null = null;
  private lrsCallV3: ClientDuplexStream<
    LoadStatsRequestV3,
    LoadStatsResponse__Output
  > | null = null;
  private latestLrsSettings: LoadStatsResponse__Output | null = null;
  private receivedLrsSettingsForCurrentStream = false;

  private clusterStatsMap: ClusterLoadReportMap = new ClusterLoadReportMap();
  private statsTimer: NodeJS.Timer;

  private hasShutdown = false;

  private adsState: AdsState;

  private adsBackoff: BackoffTimeout;
  private lrsBackoff: BackoffTimeout;

  constructor() {
    const edsState = new EdsState(() => {
      this.updateNames('eds');
    });
    const cdsState = new CdsState(edsState, () => {
      this.updateNames('cds');
    });
    const rdsState = new RdsState(() => {
      this.updateNames('rds');
    });
    const ldsState = new LdsState(rdsState, () => {
      this.updateNames('lds');
    });
    this.adsState = {
      eds: edsState,
      cds: cdsState,
      rds: rdsState,
      lds: ldsState,
    };

    const channelArgs = {
      // 5 minutes
      'grpc.keepalive_time_ms': 5 * 60 * 1000
    }

    this.adsBackoff = new BackoffTimeout(() => {
      this.maybeStartAdsStream();
    });
    this.adsBackoff.unref();
    this.lrsBackoff = new BackoffTimeout(() => {
      this.maybeStartLrsStream();
    });
    this.lrsBackoff.unref();

    Promise.all([loadBootstrapInfo(), loadAdsProtos()]).then(
      ([bootstrapInfo, protoDefinitions]) => {
        if (this.hasShutdown) {
          return;
        }
        trace('Loaded bootstrap info: ' + JSON.stringify(bootstrapInfo, undefined, 2));
        if (bootstrapInfo.xdsServers.length < 1) {
          trace('Failed to initialize xDS Client. No servers provided in bootstrap info.');
          // Bubble this error up to any listeners
          this.reportStreamError({
            code: status.INTERNAL,
            details: 'Failed to initialize xDS Client. No servers provided in bootstrap info.',
            metadata: new Metadata(),
          });
          return;
        }
        if (bootstrapInfo.xdsServers[0].serverFeatures.indexOf('xds_v3') >= 0) {
          this.apiVersion = XdsApiVersion.V3;
        } else {
          this.apiVersion = XdsApiVersion.V2;
        }
        const nodeV2: NodeV2 = {
          ...bootstrapInfo.node,
          build_version: `gRPC Node Pure JS ${clientVersion}`,
          user_agent_name: 'gRPC Node Pure JS',
        };
        const nodeV3: NodeV3 = {
          ...bootstrapInfo.node,
          user_agent_name: 'gRPC Node Pure JS',
        };
        this.adsNodeV2 = {
          ...nodeV2,
          client_features: ['envoy.lb.does_not_support_overprovisioning'],
        };
        this.adsNodeV3 = {
          ...nodeV3,
          client_features: ['envoy.lb.does_not_support_overprovisioning'],
        };
        this.lrsNodeV2 = {
          ...nodeV2,
          client_features: ['envoy.lrs.supports_send_all_clusters'],
        };
        this.lrsNodeV3 = {
          ...nodeV3,
          client_features: ['envoy.lrs.supports_send_all_clusters'],
        };
        setCsdsClientNode(this.adsNodeV3);
        if (this.apiVersion === XdsApiVersion.V2) {
          trace('ADS Node: ' + JSON.stringify(this.adsNodeV2, undefined, 2));
          trace('LRS Node: ' + JSON.stringify(this.lrsNodeV2, undefined, 2));
        } else {
          trace('ADS Node: ' + JSON.stringify(this.adsNodeV3, undefined, 2));
          trace('LRS Node: ' + JSON.stringify(this.lrsNodeV3, undefined, 2));
        }
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
        const serverUri = bootstrapInfo.xdsServers[0].serverUri
        trace('Starting xDS client connected to server URI ' + bootstrapInfo.xdsServers[0].serverUri);
        const channel = new Channel(serverUri, channelCreds, channelArgs);
        this.adsClientV2 = new protoDefinitions.envoy.service.discovery.v2.AggregatedDiscoveryService(
          serverUri,
          channelCreds,
          {channelOverride: channel}
        );
        this.adsClientV3 = new protoDefinitions.envoy.service.discovery.v3.AggregatedDiscoveryService(
          serverUri,
          channelCreds,
          {channelOverride: channel}
        );
        this.maybeStartAdsStream();

        this.lrsClientV2 = new protoDefinitions.envoy.service.load_stats.v2.LoadReportingService(
          serverUri,
          channelCreds,
          {channelOverride: channel}
        );
        this.lrsClientV3 = new protoDefinitions.envoy.service.load_stats.v3.LoadReportingService(
          serverUri,
          channelCreds,
          {channelOverride: channel}
        );
        this.maybeStartLrsStream();
      }).catch((error) => {
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
    let handleResponseResult: {
      result: HandleResponseResult;
      serviceKind: AdsServiceKind;
    } | null = null;
    let isV2: boolean;
    switch (message.type_url) {
      case EDS_TYPE_URL_V2:
      case CDS_TYPE_URL_V2:
      case RDS_TYPE_URL_V2:
      case LDS_TYPE_URL_V2:
        isV2 = true;
        break;
      default:
        isV2 = false;
    }
    try {
      switch (message.type_url) {
        case EDS_TYPE_URL_V2:
        case EDS_TYPE_URL_V3:
          handleResponseResult = {
            result: this.adsState.eds.handleResponses(
              getResponseMessages(EDS_TYPE_URL_V3, [EDS_TYPE_URL_V2, EDS_TYPE_URL_V3], message.resources),
              isV2
            ),
            serviceKind: 'eds'
          };
          break;
        case CDS_TYPE_URL_V2:
        case CDS_TYPE_URL_V3: 
          handleResponseResult = {
            result: this.adsState.cds.handleResponses(
              getResponseMessages(CDS_TYPE_URL_V3, [CDS_TYPE_URL_V2, CDS_TYPE_URL_V3], message.resources),
              isV2
            ),
            serviceKind: 'cds'
          };
          break;
        case RDS_TYPE_URL_V2:
        case RDS_TYPE_URL_V3: 
          handleResponseResult = {
            result: this.adsState.rds.handleResponses(
              getResponseMessages(RDS_TYPE_URL_V3, [RDS_TYPE_URL_V2, RDS_TYPE_URL_V3], message.resources),
              isV2
            ),
            serviceKind: 'rds'
          };
          break;
        case LDS_TYPE_URL_V2:
        case LDS_TYPE_URL_V3:
          handleResponseResult = {
            result: this.adsState.lds.handleResponses(
              getResponseMessages(LDS_TYPE_URL_V3, [LDS_TYPE_URL_V2, LDS_TYPE_URL_V3], message.resources),
              isV2
            ),
            serviceKind: 'lds'
          }
          break;
      }
    } catch (e) {
      trace('Nacking message with protobuf parsing error: ' + e.message);
      this.nack(message.type_url, e.message);
      return;
    }
    if (handleResponseResult === null) {
      // Null handleResponseResult means that the type_url was unrecognized
      trace('Nacking message with unknown type URL ' + message.type_url);
      this.nack(message.type_url, `Unknown type_url ${message.type_url}`);
    } else {
      updateCsdsResourceResponse(message.type_url as AdsTypeUrl, message.version_info, handleResponseResult.result);
      if (handleResponseResult.result.rejected.length > 0) {
        // rejected.length > 0 means that at least one message validation failed
        const errorString = `${handleResponseResult.serviceKind.toUpperCase()} Error: ${handleResponseResult.result.rejected[0].error}`;
        trace('Nacking message with type URL ' + message.type_url + ': ' + errorString);
        this.nack(message.type_url, errorString);
      } else {
        // If we get here, all message validation succeeded
        trace('Acking message with type URL ' + message.type_url);
        const serviceKind = handleResponseResult.serviceKind;
        this.adsState[serviceKind].nonce = message.nonce;
        this.adsState[serviceKind].versionInfo = message.version_info;
        this.ack(serviceKind);
      }
    }
  }

  private handleAdsCallStatus(streamStatus: StatusObject) {
    trace(
      'ADS stream ended. code=' + streamStatus.code + ' details= ' + streamStatus.details
    );
    this.adsCallV2 = null;
    this.adsCallV3 = null;
    if (streamStatus.code !== status.OK) {
      this.reportStreamError(streamStatus);
    }
    /* If the backoff timer is no longer running, we do not need to wait any
     * more to start the new call. */
    if (!this.adsBackoff.isRunning()) {
      this.maybeStartAdsStream();
    }
  }

  private maybeStartAdsStreamV2(): boolean {
    if (this.apiVersion !== XdsApiVersion.V2) {
      return false;
    }
    if (this.adsClientV2 === null) {
      return false;
    }
    if (this.adsCallV2 !== null) {
      return false;
    }
    this.adsCallV2 = this.adsClientV2.StreamAggregatedResources();
    this.adsCallV2.on('data', (message: DiscoveryResponse__Output) => {
      this.handleAdsResponse(message);
    });
    this.adsCallV2.on('status', (status: StatusObject) => {
      this.handleAdsCallStatus(status);
    });
    this.adsCallV2.on('error', () => {});
    return true;
  }

  private maybeStartAdsStreamV3(): boolean {
    if (this.apiVersion !== XdsApiVersion.V3) {
      return false;
    }
    if (this.adsClientV3 === null) {
      return false;
    }
    if (this.adsCallV3 !== null) {
      return false;
    }
    this.adsCallV3 = this.adsClientV3.StreamAggregatedResources();
    this.adsCallV3.on('data', (message: DiscoveryResponse__Output) => {
      this.handleAdsResponse(message);
    });
    this.adsCallV3.on('status', (status: StatusObject) => {
      this.handleAdsCallStatus(status);
    });
    this.adsCallV3.on('error', () => {});
    return true;
  }

  /**
   * Start the ADS stream if the client exists and there is not already an
   * existing stream, and there are resources to request.
   */
  private maybeStartAdsStream() {
    if (this.hasShutdown) {
      return;
    }
    if (this.adsState.eds.getResourceNames().length === 0 &&
    this.adsState.cds.getResourceNames().length === 0 &&
    this.adsState.rds.getResourceNames().length === 0 &&
    this.adsState.lds.getResourceNames().length === 0) {
      return;
    }
    let streamStarted: boolean;
    if (this.apiVersion === XdsApiVersion.V2) {
      streamStarted = this.maybeStartAdsStreamV2();
    } else {
      streamStarted = this.maybeStartAdsStreamV3();
    }
    if (streamStarted) {
      trace('Started ADS stream');
      // Backoff relative to when we start the request
      this.adsBackoff.runOnce();

      const allServiceKinds: AdsServiceKind[] = ['eds', 'cds', 'rds', 'lds'];
      for (const service of allServiceKinds) {
        const state = this.adsState[service];
        if (state.getResourceNames().length > 0) {
          this.updateNames(service);
        }
      }
    }
  }

  private maybeSendAdsMessage(typeUrl: string, resourceNames: string[], responseNonce: string, versionInfo: string, errorMessage?: string) {
    if (this.apiVersion === XdsApiVersion.V2) {
      this.adsCallV2?.write({
        node: this.adsNodeV2!,
        type_url: typeUrl,
        resource_names: resourceNames,
        response_nonce: responseNonce,
        version_info: versionInfo,
        error_detail: errorMessage ? { message: errorMessage } : undefined
      });
    } else {
      this.adsCallV3?.write({
        node: this.adsNodeV3!,
        type_url: typeUrl,
        resource_names: resourceNames,
        response_nonce: responseNonce,
        version_info: versionInfo,
        error_detail: errorMessage ? { message: errorMessage } : undefined
      });
    }
  }

  private getTypeUrl(serviceKind: AdsServiceKind): AdsTypeUrl {
    if (this.apiVersion === XdsApiVersion.V2) {
      switch (serviceKind) {
        case 'eds':
          return EDS_TYPE_URL_V2;
        case 'cds':
          return CDS_TYPE_URL_V2;
        case 'rds':
          return RDS_TYPE_URL_V2;
        case 'lds':
          return LDS_TYPE_URL_V2;
      }
    } else {
      switch (serviceKind) {
        case 'eds':
          return EDS_TYPE_URL_V3;
        case 'cds':
          return CDS_TYPE_URL_V3;
        case 'rds':
          return RDS_TYPE_URL_V3;
        case 'lds':
          return LDS_TYPE_URL_V3;
      }
    }
  }

  /**
   * Acknowledge an update. This should be called after the local nonce and
   * version info are updated so that it sends the post-update values.
   */
  ack(serviceKind: AdsServiceKind) {
    /* An ack is the best indication of a successful interaction between the
     * client and the server, so we can reset the backoff timer here. */
    this.adsBackoff.stop();
    this.adsBackoff.reset();

    this.updateNames(serviceKind);
  }

  /**
   * Reject an update. This should be called without updating the local
   * nonce and version info.
   */
  private nack(typeUrl: string, message: string) {
    let resourceNames: string[];
    let nonce: string;
    let versionInfo: string;
    let serviceKind: AdsServiceKind | null;
    switch (typeUrl) {
      case EDS_TYPE_URL_V2:
      case EDS_TYPE_URL_V3:
        serviceKind = 'eds';
        break;
      case CDS_TYPE_URL_V2:
      case CDS_TYPE_URL_V3:
        serviceKind = 'cds';
        break;
      case RDS_TYPE_URL_V2:
      case RDS_TYPE_URL_V3:
        serviceKind = 'rds';
        break;
      case LDS_TYPE_URL_V2:
      case LDS_TYPE_URL_V3:
        serviceKind = 'lds';
        break;
      default:
        serviceKind = null;
        break;
    }
    if (serviceKind) {
      this.adsState[serviceKind].reportStreamError({
        code: status.UNAVAILABLE,
        details: message,
        metadata: new Metadata()
      });
      resourceNames = this.adsState[serviceKind].getResourceNames();
      nonce = this.adsState[serviceKind].nonce;
      versionInfo = this.adsState[serviceKind].versionInfo;
    } else {
      resourceNames = [];
      nonce = '';
      versionInfo = '';
    }
    this.maybeSendAdsMessage(typeUrl, resourceNames, nonce, versionInfo, message);
  }

  private updateNames(serviceKind: AdsServiceKind) {
    if (this.adsState.eds.getResourceNames().length === 0 &&
    this.adsState.cds.getResourceNames().length === 0 &&
    this.adsState.rds.getResourceNames().length === 0 &&
    this.adsState.lds.getResourceNames().length === 0) {
      this.adsCallV2?.end();
      this.adsCallV2 = null;
      this.adsCallV3?.end();
      this.adsCallV3 = null;
      this.lrsCallV2?.end();
      this.lrsCallV2 = null;
      this.lrsCallV3?.end();
      this.lrsCallV3 = null;
      return;
    }
    this.maybeStartAdsStream();
    this.maybeStartLrsStream();
    if (!this.adsCallV2 && !this.adsCallV3) {
      /* If the stream is not set up yet at this point, shortcut the rest
       * becuase nothing will actually be sent. This would mainly happen if
       * the bootstrap file has not been read yet. In that case, the output
       * of getTypeUrl is garbage and everything after that is invalid. */
      return;
    }
    trace('Sending update for ' + serviceKind + ' with names ' + this.adsState[serviceKind].getResourceNames());
    const typeUrl = this.getTypeUrl(serviceKind);
    updateCsdsRequestedNameList(typeUrl, this.adsState[serviceKind].getResourceNames());
    this.maybeSendAdsMessage(typeUrl, this.adsState[serviceKind].getResourceNames(), this.adsState[serviceKind].nonce, this.adsState[serviceKind].versionInfo);
  }

  private reportStreamError(status: StatusObject) {
    this.adsState.eds.reportStreamError(status);
    this.adsState.cds.reportStreamError(status);
    this.adsState.rds.reportStreamError(status);
    this.adsState.lds.reportStreamError(status);
  }

  private handleLrsResponse(message: LoadStatsResponse__Output) {
    trace('Received LRS response');
    /* Once we get any response from the server, we assume that the stream is
     * in a good state, so we can reset the backoff timer. */
    this.lrsBackoff.stop();
    this.lrsBackoff.reset();
    if (
      !this.receivedLrsSettingsForCurrentStream ||
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
      trace('Received LRS response with load reporting interval ' + loadReportingIntervalMs + ' ms');
      this.statsTimer = setInterval(() => {
        this.sendStats();
      }, loadReportingIntervalMs);
    }
    this.latestLrsSettings = message;
    this.receivedLrsSettingsForCurrentStream = true;
  }

  private handleLrsCallStatus(streamStatus: StatusObject) {
    trace(
      'LRS stream ended. code=' + streamStatus.code + ' details= ' + streamStatus.details
    );
    this.lrsCallV2 = null;
    this.lrsCallV3 = null;
    clearInterval(this.statsTimer);
    /* If the backoff timer is no longer running, we do not need to wait any
     * more to start the new call. */
    if (!this.lrsBackoff.isRunning()) {
      this.maybeStartLrsStream();
    }
  }

  private maybeStartLrsStreamV2(): boolean {
    if (!this.lrsClientV2) {
      return false;
    }
    if (this.lrsCallV2) {
      return false;
    }
    this.lrsCallV2 = this.lrsClientV2.streamLoadStats();
    this.receivedLrsSettingsForCurrentStream = false;
    this.lrsCallV2.on('data', (message: LoadStatsResponse__Output) => {
      this.handleLrsResponse(message);
    });
    this.lrsCallV2.on('status', (status: StatusObject) => {
      this.handleLrsCallStatus(status);
    });
    this.lrsCallV2.on('error', () => {});
    return true;
  }

  private maybeStartLrsStreamV3(): boolean {
    if (!this.lrsClientV3) {
      return false;
    }
    if (this.lrsCallV3) {
      return false;
    }
    this.lrsCallV3 = this.lrsClientV3.streamLoadStats();
    this.receivedLrsSettingsForCurrentStream = false;
    this.lrsCallV3.on('data', (message: LoadStatsResponse__Output) => {
      this.handleLrsResponse(message);
    });
    this.lrsCallV3.on('status', (status: StatusObject) => {
      this.handleLrsCallStatus(status);
    });
    this.lrsCallV3.on('error', () => {});
    return true;
  }

  private maybeStartLrsStream() {
    if (this.hasShutdown) {
      return;
    }
    if (this.adsState.eds.getResourceNames().length === 0 &&
        this.adsState.cds.getResourceNames().length === 0 &&
        this.adsState.rds.getResourceNames().length === 0 &&
        this.adsState.lds.getResourceNames().length === 0) {
      return;
    }

    let streamStarted: boolean;
    if (this.apiVersion === XdsApiVersion.V2) {
      streamStarted = this.maybeStartLrsStreamV2();
    } else {
      streamStarted = this.maybeStartLrsStreamV3();
    }

    if (streamStarted) {
      trace('Starting LRS stream');
      this.lrsBackoff.runOnce();
      /* Send buffered stats information when starting LRS stream. If there is no
       * buffered stats information, it will still send the node field. */
      this.sendStats();
    }
  }

  private maybeSendLrsMessage(clusterStats: ClusterStats[]) {
    if (this.apiVersion === XdsApiVersion.V2) {
      this.lrsCallV2?.write({
        node: this.lrsNodeV2!,
        cluster_stats: clusterStats
      });
    } else {
      this.lrsCallV3?.write({
        node: this.lrsNodeV3!,
        cluster_stats: clusterStats
      });
    }
  }

  private sendStats() {
    if (this.lrsCallV2 === null && this.lrsCallV3 === null) {
      return;
    }
    if (!this.latestLrsSettings) {
      this.maybeSendLrsMessage([]);
      return;
    }
    const clusterStats: ClusterStats[] = [];
    for (const [
      { clusterName, edsServiceName },
      stats,
    ] of this.clusterStatsMap.entries()) {
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
    trace('Sending LRS stats ' + JSON.stringify(clusterStats, undefined, 2));
    this.maybeSendLrsMessage(clusterStats);
  }

  addEndpointWatcher(
    edsServiceName: string,
    watcher: Watcher<ClusterLoadAssignment__Output>
  ) {
    trace('Watcher added for endpoint ' + edsServiceName);
    this.adsState.eds.addWatcher(edsServiceName, watcher);
  }

  removeEndpointWatcher(
    edsServiceName: string,
    watcher: Watcher<ClusterLoadAssignment__Output>
  ) {
    trace('Watcher removed for endpoint ' + edsServiceName);
    this.adsState.eds.removeWatcher(edsServiceName, watcher);
  }

  addClusterWatcher(clusterName: string, watcher: Watcher<Cluster__Output>) {
    trace('Watcher added for cluster ' + clusterName);
    this.adsState.cds.addWatcher(clusterName, watcher);
  }

  removeClusterWatcher(clusterName: string, watcher: Watcher<Cluster__Output>) {
    trace('Watcher removed for cluster ' + clusterName);
    this.adsState.cds.removeWatcher(clusterName, watcher);
  }

  addRouteWatcher(routeConfigName: string, watcher: Watcher<RouteConfiguration__Output>) {
    trace('Watcher added for route ' + routeConfigName);
    this.adsState.rds.addWatcher(routeConfigName, watcher);
  }

  removeRouteWatcher(routeConfigName: string, watcher: Watcher<RouteConfiguration__Output>) {
    trace('Watcher removed for route ' + routeConfigName);
    this.adsState.rds.removeWatcher(routeConfigName, watcher);
  }

  addListenerWatcher(targetName: string, watcher: Watcher<Listener__Output>) {
    trace('Watcher added for listener ' + targetName);
    this.adsState.lds.addWatcher(targetName, watcher);
  }

  removeListenerWatcher(targetName: string, watcher: Watcher<Listener__Output>) {
    trace('Watcher removed for listener ' + targetName);
    this.adsState.lds.removeWatcher(targetName, watcher);
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
        addUncategorizedCallDropped: () => {},
        addCallDropped: (category) => {},
      };
    }
    const clusterStats = this.clusterStatsMap.getOrCreate(
      clusterName,
      edsServiceName
    );
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
    this.adsCallV2?.cancel();
    this.adsCallV3?.cancel();
    this.adsClientV2?.close();
    this.adsClientV3?.close();
    this.lrsCallV2?.cancel();
    this.lrsCallV3?.cancel();
    this.lrsClientV2?.close();
    this.lrsClientV3?.close();
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