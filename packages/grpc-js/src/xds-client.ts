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

import * as fs from 'fs';
import * as protoLoader from '@grpc/proto-loader';
import { loadPackageDefinition } from './make-client';
import * as adsTypes from './generated/ads';
import * as edsTypes from './generated/endpoint';
import { ChannelCredentials, createGoogleDefaultCredentials } from './channel-credentials';
import { loadBootstrapInfo } from './xds-bootstrap';
import { ClientDuplexStream, ServiceError } from './call';
import { StatusObject } from './call-stream';
import { isIPv4, isIPv6 } from 'net';
import { Status } from './constants';
import { Metadata } from './metadata';

const clientVersion = require('../../package.json').version;

const EDS_TYPE_URL = 'type.googleapis.com/envoy.api.v2.ClusterLoadAssignment';

let loadedProtos: Promise<adsTypes.ProtoGrpcType> | null = null;

function loadAdsProtos(): Promise<adsTypes.ProtoGrpcType> {
  if (loadedProtos !== null) {
    return loadedProtos;
  }
  loadedProtos = protoLoader.load([
    'envoy/service/discovery/v2/ads.proto',
    'envoy/api/v2/listener.proto',
    'envoy/api/v2/route.proto',
    'envoy/api/v2/cluster.proto',
    'envoy/api/v2/endpoint.proto'
  ], {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
    includeDirs: [
      'deps/envoy-api/',
      'deps/udpa/',
      'node_modules/protobufjs/',
      'deps/googleapis/',
      'deps/protoc-gen-validate/'
    ]
  }).then(packageDefinition => loadPackageDefinition(packageDefinition) as unknown as adsTypes.ProtoGrpcType);
  return loadedProtos;
}

export interface Watcher<UpdateType> {
  onValidUpdate(update: UpdateType): void;
  onTransientError(error: StatusObject): void;
  onResourceDoesNotExist(): void;
}

export class XdsClient {
  private node: adsTypes.messages.envoy.api.v2.core.Node | null = null;
  private client: adsTypes.ClientInterfaces.envoy.service.discovery.v2.AggregatedDiscoveryServiceClient | null = null;
  private adsCall: ClientDuplexStream<adsTypes.messages.envoy.api.v2.DiscoveryRequest, adsTypes.messages.envoy.api.v2.DiscoveryResponse__Output> | null = null;

  private endpointWatchers: Map<string, Watcher<edsTypes.messages.envoy.api.v2.ClusterLoadAssignment__Output>[]> = new Map<string, Watcher<edsTypes.messages.envoy.api.v2.ClusterLoadAssignment__Output>[]>();
  private lastEdsVersionInfo: string = '';
  private lastEdsNonce: string = '';

  constructor() {
    Promise.all([loadBootstrapInfo(), loadAdsProtos()]).then(([bootstrapInfo, protoDefinitions]) => {
      this.node = {
        ...bootstrapInfo.node,
        build_version: `gRPC Node Pure JS ${clientVersion}`,
        user_agent_name: 'gRPC Node Pure JS'
      }
      this.client = new protoDefinitions.envoy.service.discovery.v2.AggregatedDiscoveryService(bootstrapInfo.xdsServers[0].serverUri, createGoogleDefaultCredentials());
      this.maybeStartAdsStream();
    }, (error) => {
      // Bubble this error up to any listeners
      for (const watcherList of this.endpointWatchers.values()) {
        for (const watcher of watcherList) {
          watcher.onTransientError({
            code: Status.INTERNAL,
            details: `Failed to initialize xDS Client. ${error.message}`,
            metadata: new Metadata()
          })
        }
      }
    });
  }

  /**
   * Start the ADS stream if the client exists and there is not already an
   * existing stream. 
   */
  private maybeStartAdsStream() {
    if (this.client === null) {
      return;
    }
    if (this.adsCall !== null) {
      return;
    }
    this.adsCall = this.client.StreamAggregatedResources();
    this.adsCall.on('data', (message: adsTypes.messages.envoy.api.v2.DiscoveryResponse__Output) => {
      switch (message.type_url) {
        case EDS_TYPE_URL:
          const edsResponses: edsTypes.messages.envoy.api.v2.ClusterLoadAssignment__Output[] = [];
          for (const resource of message.resources) {
            if (protoLoader.isAnyExtension(resource) && resource['@type'] === EDS_TYPE_URL) {
              const resp = resource as protoLoader.AnyExtension & edsTypes.messages.envoy.api.v2.ClusterLoadAssignment__Output;
              if (!this.validateEdsResponse(resp)) {
                this.nackEds('ClusterLoadAssignment validation failed');
                return;
              }
              edsResponses.push(resp);
            } else {
              this.nackEds(`Invalid resource type ${protoLoader.isAnyExtension(resource) ? resource['@type'] : resource.type_url}`);
              return;
            }
          }
          for (const message of edsResponses) {
            this.handleEdsResponse(message);
          }
          this.lastEdsVersionInfo = message.version_info;
          this.lastEdsNonce = message.nonce;
          this.ackEds();
          break;
        default:
          this.nackUnknown(message.type_url, message.version_info, message.nonce);
      }
    });
    this.adsCall.on('error', (error: ServiceError) => {
      this.adsCall = null;
      this.reportStreamError(error);
      this.maybeStartAdsStream();
    });
    const endpointWatcherNames = Array.from(this.endpointWatchers.keys());
    if (endpointWatcherNames.length > 0) {
      this.adsCall.write({
        node: this.node,
        type_url: EDS_TYPE_URL,
        resource_names: endpointWatcherNames
      });
    }
  }

  private nackUnknown(typeUrl: string, versionInfo: string, nonce: string) {
    if (!this.adsCall) {
      return;
    }
    this.adsCall.write({
      node: this.node,
      type_url: typeUrl,
      version_info: versionInfo,
      response_nonce: nonce,
      error_detail: {
        message: `Unknown type_url ${typeUrl}`
      }
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
      node: this.node,
      type_url: EDS_TYPE_URL,
      resource_names: Array.from(this.endpointWatchers.keys()),
      response_nonce: this.lastEdsNonce,
      version_info: this.lastEdsVersionInfo
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
      node: this.node,
      type_url: EDS_TYPE_URL,
      resource_names: Array.from(this.endpointWatchers.keys()),
      response_nonce: this.lastEdsNonce,
      version_info: this.lastEdsVersionInfo,
      error_detail: {
        message
      }
    });
  }

  private validateEdsResponse(message: edsTypes.messages.envoy.api.v2.ClusterLoadAssignment__Output): boolean {
    for (const endpoint of message.endpoints) {
      for (const lb of endpoint.lb_endpoints) {
        if (!lb.endpoint) {
          return false;
        }
        if (!lb.endpoint.address) {
          return false;
        }
        if (!lb.endpoint.address.socket_address) {
          return false;
        }
        const socketAddress = lb.endpoint.address.socket_address;
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

  private handleEdsResponse(message: edsTypes.messages.envoy.api.v2.ClusterLoadAssignment__Output) {
    const watchers = this.endpointWatchers.get(message.cluster_name) ?? [];
    for (const watcher of watchers) {
      watcher.onValidUpdate(message);
    }
  }

  private updateEdsNames() {
    if (this.adsCall) {
      this.adsCall.write({
        node: this.node,
        type_url: EDS_TYPE_URL,
        resource_names: Array.from(this.endpointWatchers.keys()),
        response_nonce: this.lastEdsNonce,
        version_info: this.lastEdsVersionInfo
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

  addEndpointWatcher(edsServiceName: string, watcher: Watcher<edsTypes.messages.envoy.api.v2.ClusterLoadAssignment__Output>) {
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
  }

  removeEndpointWatcher(edsServiceName: string, watcher: Watcher<edsTypes.messages.envoy.api.v2.ClusterLoadAssignment__Output>) {
    const watchersEntry = this.endpointWatchers.get(edsServiceName);
    if (watchersEntry !== undefined) {
      const entryIndex = watchersEntry.indexOf(watcher);
      if (entryIndex >= 0) {
        watchersEntry.splice(entryIndex, 1);
      }
    }
  }
}