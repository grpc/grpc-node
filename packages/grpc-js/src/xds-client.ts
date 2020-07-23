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

const TRACER_NAME = 'xds_client';

function trace(text: string): void {
  logging.trace(LogVerbosity.DEBUG, TRACER_NAME, text);
}

const clientVersion = require('../../package.json').version;

const EDS_TYPE_URL = 'type.googleapis.com/envoy.api.v2.ClusterLoadAssignment';

let loadedProtos: Promise<adsTypes.ProtoGrpcType> | null = null;

function loadAdsProtos(): Promise<adsTypes.ProtoGrpcType> {
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
        ) as unknown) as adsTypes.ProtoGrpcType
    );
  return loadedProtos;
}

export interface Watcher<UpdateType> {
  onValidUpdate(update: UpdateType): void;
  onTransientError(error: StatusObject): void;
  onResourceDoesNotExist(): void;
}

export class XdsClient {
  private node: Node | null = null;
  private client: AggregatedDiscoveryServiceClient | null = null;
  private adsCall: ClientDuplexStream<
    DiscoveryRequest,
    DiscoveryResponse__Output
  > | null = null;

  private hasShutdown = false;

  private endpointWatchers: Map<
    string,
    Watcher<ClusterLoadAssignment__Output>[]
  > = new Map<string, Watcher<ClusterLoadAssignment__Output>[]>();
  private lastEdsVersionInfo = '';
  private lastEdsNonce = '';
  private latestEdsResponses: ClusterLoadAssignment__Output[] = [];

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
        this.node = {
          ...bootstrapInfo.node,
          build_version: `gRPC Node Pure JS ${clientVersion}`,
          user_agent_name: 'gRPC Node Pure JS',
        };
        this.client = new protoDefinitions.envoy.service.discovery.v2.AggregatedDiscoveryService(
          bootstrapInfo.xdsServers[0].serverUri,
          createGoogleDefaultCredentials(),
          channelArgs
        );
        this.maybeStartAdsStream();
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
  }

  /**
   * Start the ADS stream if the client exists and there is not already an
   * existing stream, and there
   */
  private maybeStartAdsStream() {
    if (this.client === null) {
      return;
    }
    if (this.adsCall !== null) {
      return;
    }
    if (this.hasShutdown) {
      return;
    }
    this.adsCall = this.client.StreamAggregatedResources();
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
        node: this.node!,
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
      node: this.node!,
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
      node: this.node!,
      type_url: EDS_TYPE_URL,
      resource_names: Array.from(this.endpointWatchers.keys()),
      response_nonce: this.lastEdsNonce,
      version_info: this.lastEdsVersionInfo,
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
      node: this.node!,
      type_url: EDS_TYPE_URL,
      resource_names: Array.from(this.endpointWatchers.keys()),
      response_nonce: this.lastEdsNonce,
      version_info: this.lastEdsVersionInfo,
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

  private handleEdsResponse(message: ClusterLoadAssignment__Output) {
    const watchers = this.endpointWatchers.get(message.cluster_name) ?? [];
    for (const watcher of watchers) {
      watcher.onValidUpdate(message);
    }
  }

  private updateEdsNames() {
    if (this.adsCall) {
      this.adsCall.write({
        node: this.node!,
        type_url: EDS_TYPE_URL,
        resource_names: Array.from(this.endpointWatchers.keys()),
        response_nonce: this.lastEdsNonce,
        version_info: this.lastEdsVersionInfo,
      });
    }
  }

  private reportStreamError(status: StatusObject) {
    for (const watcherList of this.endpointWatchers.values()) {
      for (const watcher of watcherList) {
        watcher.onTransientError(status);
      }
    }
    // Also do the same for other types of watchers when those are implemented
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

  shutdown(): void {
    this.adsCall?.cancel();
    this.client?.close();
    this.hasShutdown = true;
  }
}
