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

const TRACER_NAME = 'xds_client';

function trace(text: string): void {
  logging.trace(LogVerbosity.DEBUG, TRACER_NAME, text);
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

interface XdsStreamState<ResponseType> {
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

class EdsState implements XdsStreamState<ClusterLoadAssignment__Output> {
  public versionInfo = '';
  public nonce = '';

  private watchers: Map<
    string,
    Watcher<ClusterLoadAssignment__Output>[]
  > = new Map<string, Watcher<ClusterLoadAssignment__Output>[]>();

  private latestResponses: ClusterLoadAssignment__Output[] = [];

  constructor(private updateResourceNames: () => void) {}

  /**
   * Add the watcher to the watcher list. Returns true if the list of resource
   * names has changed, and false otherwise.
   * @param edsServiceName
   * @param watcher
   */
  addWatcher(
    edsServiceName: string,
    watcher: Watcher<ClusterLoadAssignment__Output>
  ): void {
    let watchersEntry = this.watchers.get(edsServiceName);
    let addedServiceName = false;
    if (watchersEntry === undefined) {
      addedServiceName = true;
      watchersEntry = [];
      this.watchers.set(edsServiceName, watchersEntry);
    }
    watchersEntry.push(watcher);

    /* If we have already received an update for the requested edsServiceName,
     * immediately pass that update along to the watcher */
    for (const message of this.latestResponses) {
      if (message.cluster_name === edsServiceName) {
        /* These updates normally occur asynchronously, so we ensure that
         * the same happens here */
        process.nextTick(() => {
          watcher.onValidUpdate(message);
        });
      }
    }
    if (addedServiceName) {
      this.updateResourceNames();
    }
  }

  removeWatcher(
    edsServiceName: string,
    watcher: Watcher<ClusterLoadAssignment__Output>
  ): void {
    const watchersEntry = this.watchers.get(edsServiceName);
    let removedServiceName = false;
    if (watchersEntry !== undefined) {
      const entryIndex = watchersEntry.indexOf(watcher);
      if (entryIndex >= 0) {
        watchersEntry.splice(entryIndex, 1);
      }
      if (watchersEntry.length === 0) {
        removedServiceName = true;
        this.watchers.delete(edsServiceName);
      }
    }
    if (removedServiceName) {
      this.updateResourceNames();
    }
  }

  getResourceNames(): string[] {
    return Array.from(this.watchers.keys());
  }

  /**
   * Validate the ClusterLoadAssignment object by these rules:
   * https://github.com/grpc/proposal/blob/master/A27-xds-global-load-balancing.md#clusterloadassignment-proto
   * @param message
   */
  private validateResponse(message: ClusterLoadAssignment__Output) {
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

  /**
   * Given a list of edsServiceNames (which may actually be the cluster name),
   * for each watcher watching a name not on the list, call that watcher's
   * onResourceDoesNotExist method.
   * @param allClusterNames
   */
  handleMissingNames(allEdsServiceNames: Set<string>) {
    for (const [edsServiceName, watcherList] of this.watchers.entries()) {
      if (!allEdsServiceNames.has(edsServiceName)) {
        for (const watcher of watcherList) {
          watcher.onResourceDoesNotExist();
        }
      }
    }
  }

  handleResponses(responses: ClusterLoadAssignment__Output[]) {
    for (const message of responses) {
      if (!this.validateResponse(message)) {
        return 'ClusterLoadAssignment validation failed';
      }
    }
    this.latestResponses = responses;
    const allClusterNames: Set<string> = new Set<string>();
    for (const message of responses) {
      allClusterNames.add(message.cluster_name);
      const watchers = this.watchers.get(message.cluster_name) ?? [];
      for (const watcher of watchers) {
        watcher.onValidUpdate(message);
      }
    }
    this.handleMissingNames(allClusterNames);
    return null;
  }

  reportStreamError(status: StatusObject): void {
    for (const watcherList of this.watchers.values()) {
      for (const watcher of watcherList) {
        watcher.onTransientError(status);
      }
    }
  }
}

class CdsState implements XdsStreamState<Cluster__Output> {
  versionInfo = '';
  nonce = '';

  private watchers: Map<string, Watcher<Cluster__Output>[]> = new Map<
    string,
    Watcher<Cluster__Output>[]
  >();

  private latestResponses: Cluster__Output[] = [];

  constructor(
    private edsState: EdsState,
    private updateResourceNames: () => void
  ) {}

  /**
   * Add the watcher to the watcher list. Returns true if the list of resource
   * names has changed, and false otherwise.
   * @param clusterName
   * @param watcher
   */
  addWatcher(clusterName: string, watcher: Watcher<Cluster__Output>): void {
    let watchersEntry = this.watchers.get(clusterName);
    let addedServiceName = false;
    if (watchersEntry === undefined) {
      addedServiceName = true;
      watchersEntry = [];
      this.watchers.set(clusterName, watchersEntry);
    }
    watchersEntry.push(watcher);

    /* If we have already received an update for the requested edsServiceName,
     * immediately pass that update along to the watcher */
    for (const message of this.latestResponses) {
      if (message.name === clusterName) {
        /* These updates normally occur asynchronously, so we ensure that
         * the same happens here */
        process.nextTick(() => {
          watcher.onValidUpdate(message);
        });
      }
    }
    if (addedServiceName) {
      this.updateResourceNames();
    }
  }

  removeWatcher(clusterName: string, watcher: Watcher<Cluster__Output>): void {
    const watchersEntry = this.watchers.get(clusterName);
    let removedServiceName = false;
    if (watchersEntry !== undefined) {
      const entryIndex = watchersEntry.indexOf(watcher);
      if (entryIndex >= 0) {
        watchersEntry.splice(entryIndex, 1);
      }
      if (watchersEntry.length === 0) {
        removedServiceName = true;
        this.watchers.delete(clusterName);
      }
    }
    if (removedServiceName) {
      this.updateResourceNames();
    }
  }

  getResourceNames(): string[] {
    return Array.from(this.watchers.keys());
  }

  private validateResponse(message: Cluster__Output): boolean {
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

  /**
   * Given a list of edsServiceNames (which may actually be the cluster name),
   * for each watcher watching a name not on the list, call that watcher's
   * onResourceDoesNotExist method.
   * @param allClusterNames
   */
  private handleMissingNames(allClusterNames: Set<string>) {
    for (const [edsServiceName, watcherList] of this.watchers.entries()) {
      if (!allClusterNames.has(edsServiceName)) {
        for (const watcher of watcherList) {
          watcher.onResourceDoesNotExist();
        }
      }
    }
  }

  handleResponses(responses: Cluster__Output[]): string | null {
    for (const message of responses) {
      if (!this.validateResponse(message)) {
        return 'Cluster validation failed';
      }
    }
    this.latestResponses = responses;
    const allEdsServiceNames: Set<string> = new Set<string>();
    const allClusterNames: Set<string> = new Set<string>();
    for (const message of responses) {
      allClusterNames.add(message.name);
      const edsServiceName = message.eds_cluster_config?.service_name ?? '';
      allEdsServiceNames.add(
        edsServiceName === '' ? message.name : edsServiceName
      );
      const watchers = this.watchers.get(message.name) ?? [];
      for (const watcher of watchers) {
        watcher.onValidUpdate(message);
      }
    }
    this.handleMissingNames(allClusterNames);
    this.edsState.handleMissingNames(allEdsServiceNames);
    return null;
  }

  reportStreamError(status: StatusObject): void {
    for (const watcherList of this.watchers.values()) {
      for (const watcher of watcherList) {
        watcher.onTransientError(status);
      }
    }
  }
}

class RdsState implements XdsStreamState<RouteConfiguration__Output> {
  versionInfo = '';
  nonce = '';

  private routeConfigName: string | null = null;

  constructor(
    private watcher: Watcher<ServiceConfig>,
    private updateResouceNames: () => void
  ) {}

  getResourceNames(): string[] {
    return this.routeConfigName ? [this.routeConfigName] : [];
  }

  handleSingleMessage(message: RouteConfiguration__Output) {
    for (const virtualHost of message.virtual_hosts) {
      if (virtualHost.domains.indexOf(this.routeConfigName!) >= 0) {
        const route = virtualHost.routes[virtualHost.routes.length - 1];
        if (route.match?.prefix === '' && route.route?.cluster) {
          this.watcher.onValidUpdate({
            methodConfig: [],
            loadBalancingConfig: [
              {
                name: 'cds',
                cds: {
                  cluster: route.route.cluster,
                },
              },
            ],
          });
          break;
        }
      }
    }
    /* If none of the routes match the one we are looking for, bubble up an
     * error. */
    this.watcher.onResourceDoesNotExist();
  }

  handleResponses(responses: RouteConfiguration__Output[]): string | null {
    if (this.routeConfigName !== null) {
      for (const message of responses) {
        if (message.name === this.routeConfigName) {
          this.handleSingleMessage(message);
          return null;
        }
      }
    }
    return null;
  }

  setRouteConfigName(name: string | null) {
    const oldName = this.routeConfigName;
    this.routeConfigName = name;
    if (name !== oldName) {
      this.updateResouceNames();
    }
  }

  reportStreamError(status: StatusObject): void {
    this.watcher.onTransientError(status);
  }
}

class LdsState implements XdsStreamState<Listener__Output> {
  versionInfo = '';
  nonce = '';

  constructor(private targetName: string, private rdsState: RdsState) {}

  getResourceNames(): string[] {
    return [this.targetName];
  }

  private validateResponse(message: Listener__Output): boolean {
    if (
      !(
        message.api_listener?.api_listener &&
        protoLoader.isAnyExtension(message.api_listener.api_listener) &&
        message.api_listener?.api_listener['@type'] ===
          HTTP_CONNECTION_MANGER_TYPE_URL
      )
    ) {
      return false;
    }
    const httpConnectionManager = message.api_listener
      ?.api_listener as protoLoader.AnyExtension &
      HttpConnectionManager__Output;
    switch (httpConnectionManager.route_specifier) {
      case 'rds':
        return !!httpConnectionManager.rds?.config_source?.ads;
      case 'route_config':
        return true;
    }
    return false;
  }

  handleResponses(responses: Listener__Output[]): string | null {
    for (const message of responses) {
      if (message.name === this.targetName) {
        if (this.validateResponse(message)) {
          // The validation step ensures that this is correct
          const httpConnectionManager = message.api_listener!
            .api_listener as protoLoader.AnyExtension &
            HttpConnectionManager__Output;
          switch (httpConnectionManager.route_specifier) {
            case 'rds':
              this.rdsState.setRouteConfigName(
                httpConnectionManager.rds!.route_config_name
              );
              break;
            case 'route_config':
              this.rdsState.setRouteConfigName(null);
              this.rdsState.handleSingleMessage(
                httpConnectionManager.route_config!
              );
              break;
            default:
            // The validation rules should prevent this
          }
        } else {
          return 'Listener validation failed';
        }
      }
    }
    throw new Error('Method not implemented.');
  }

  reportStreamError(status: StatusObject): void {
    // Nothing to do here
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
        `Invalid resource type ${
          protoLoader.isAnyExtension(resource)
            ? resource['@type']
            : resource.type_url
        }`
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

  constructor(
    targetName: string,
    serviceConfigWatcher: Watcher<ServiceConfig>,
    channelOptions: ChannelOptions
  ) {
    const edsState = new EdsState(() => {
      this.updateNames(EDS_TYPE_URL);
    });
    const cdsState = new CdsState(edsState, () => {
      this.updateNames(CDS_TYPE_URL);
    });
    const rdsState = new RdsState(serviceConfigWatcher, () => {
      this.updateNames(RDS_TYPE_URL);
    });
    const ldsState = new LdsState(targetName, rdsState);
    this.adsState = {
      [EDS_TYPE_URL]: edsState,
      [CDS_TYPE_URL]: cdsState,
      [RDS_TYPE_URL]: rdsState,
      [LDS_TYPE_URL]: ldsState,
    };

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
      /* errorString can only be null in one of the first 4 cases, which
       * implies that message.type_url is one of the 4 known type URLs, which
       * means that this type assertion is valid. */
      const typeUrl = message.type_url as AdsTypeUrl;
      this.adsState[typeUrl].nonce = message.nonce;
      this.adsState[typeUrl].versionInfo = message.version_info;
      this.ack(typeUrl);
    } else {
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
      /* Connection backoff is handled by the client object, so we can
       * immediately start a new request to indicate that it should try to
       * reconnect */
      this.maybeStartAdsStream();
    });

    const allTypeUrls: AdsTypeUrl[] = [
      EDS_TYPE_URL,
      CDS_TYPE_URL,
      RDS_TYPE_URL,
      LDS_TYPE_URL,
    ];
    for (const typeUrl of allTypeUrls) {
      const state = this.adsState[typeUrl];
      state.nonce = '';
      state.versionInfo = '';
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
    trace('Watcher removed for endpoint ' + clusterName);
    this.adsState[CDS_TYPE_URL].removeWatcher(clusterName, watcher);
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

  shutdown(): void {
    this.adsCall?.cancel();
    this.adsClient?.close();
    this.lrsCall?.cancel();
    this.lrsClient?.close();
    this.hasShutdown = true;
  }
}
