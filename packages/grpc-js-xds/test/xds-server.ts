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

import { ServerDuplexStream, Server, UntypedServiceImplementation, ServerCredentials, loadPackageDefinition } from "@grpc/grpc-js";
import { AnyExtension, loadSync } from "@grpc/proto-loader";
import { EventEmitter } from "stream";
import { Cluster } from "../src/generated/envoy/config/cluster/v3/Cluster";
import { ClusterLoadAssignment } from "../src/generated/envoy/config/endpoint/v3/ClusterLoadAssignment";
import { Listener } from "../src/generated/envoy/config/listener/v3/Listener";
import { RouteConfiguration } from "../src/generated/envoy/config/route/v3/RouteConfiguration";
import { AggregatedDiscoveryServiceHandlers } from "../src/generated/envoy/service/discovery/v3/AggregatedDiscoveryService";
import { DiscoveryRequest__Output } from "../src/generated/envoy/service/discovery/v3/DiscoveryRequest";
import { DiscoveryResponse } from "../src/generated/envoy/service/discovery/v3/DiscoveryResponse";
import { Any } from "../src/generated/google/protobuf/Any";
import { LDS_TYPE_URL, RDS_TYPE_URL, CDS_TYPE_URL, EDS_TYPE_URL, LdsTypeUrl, RdsTypeUrl, CdsTypeUrl, EdsTypeUrl, AdsTypeUrl } from "../src/resources"
import * as adsTypes from '../src/generated/ads';
import * as lrsTypes from '../src/generated/lrs';
import { LoadStatsRequest__Output } from "../src/generated/envoy/service/load_stats/v3/LoadStatsRequest";
import { LoadStatsResponse } from "../src/generated/envoy/service/load_stats/v3/LoadStatsResponse";

const loadedProtos = loadPackageDefinition(loadSync(
  [
    'envoy/service/discovery/v3/ads.proto',
    'envoy/service/load_stats/v3/lrs.proto',
    'envoy/config/listener/v3/listener.proto', 
    'envoy/config/route/v3/route.proto',
    'envoy/config/cluster/v3/cluster.proto',
    'envoy/config/endpoint/v3/endpoint.proto',
    'envoy/extensions/filters/network/http_connection_manager/v3/http_connection_manager.proto',
    'envoy/extensions/clusters/aggregate/v3/cluster.proto'
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
  })) as unknown as adsTypes.ProtoGrpcType & lrsTypes.ProtoGrpcType;

type AdsInputType<T extends AdsTypeUrl> = T extends EdsTypeUrl
  ? ClusterLoadAssignment
  : T extends CdsTypeUrl
  ? Cluster
  : T extends RdsTypeUrl
  ? RouteConfiguration
  : Listener;

const ADS_TYPE_URLS = new Set([LDS_TYPE_URL, RDS_TYPE_URL, CDS_TYPE_URL, EDS_TYPE_URL]);

interface ResponseState {
  state: 'ACKED' | 'NACKED';
  errorMessage?: string;
}

interface ResponseListener {
  (typeUrl: AdsTypeUrl, responseState: ResponseState): void;
}

type ResourceAny<T extends AdsTypeUrl> = AdsInputType<T> & {'@type': T};

interface ResourceState<T extends AdsTypeUrl> {
  resource?: ResourceAny<T>;
  resourceTypeVersion: number;
  subscriptions: Set<string>;
}

interface ResourceTypeState<T extends AdsTypeUrl> {
  resourceTypeVersion: number;
  /**
   * Key type is type URL
   */
  resourceNameMap: Map<string, ResourceState<T>>;
}

interface ResourceMap {
  [EDS_TYPE_URL]: ResourceTypeState<EdsTypeUrl>;
  [CDS_TYPE_URL]: ResourceTypeState<CdsTypeUrl>;
  [RDS_TYPE_URL]: ResourceTypeState<RdsTypeUrl>;
  [LDS_TYPE_URL]: ResourceTypeState<LdsTypeUrl>;
}

function isAdsTypeUrl(value: string): value is AdsTypeUrl {
  return ADS_TYPE_URLS.has(value);
}

export class XdsServer {
  private resourceMap: ResourceMap = {
    [EDS_TYPE_URL]: {
      resourceTypeVersion: 0,
      resourceNameMap: new Map()
    },
    [CDS_TYPE_URL]: {
      resourceTypeVersion: 0,
      resourceNameMap: new Map()
    },
    [RDS_TYPE_URL]: {
      resourceTypeVersion: 0,
      resourceNameMap: new Map()
    },
    [LDS_TYPE_URL]: {
      resourceTypeVersion: 0,
      resourceNameMap: new Map()
    },
  };
  private responseListeners = new Set<ResponseListener>();
  private resourceTypesToIgnore = new Set<AdsTypeUrl>();
  private clients = new Map<string, ServerDuplexStream<DiscoveryRequest__Output, DiscoveryResponse>>();
  private server: Server | null = null;
  private port: number | null = null;

  addResponseListener(listener: ResponseListener) {
    this.responseListeners.add(listener);
  }

  removeResponseListener(listener: ResponseListener) {
    this.responseListeners.delete(listener);
  }

  setResource<T extends AdsTypeUrl>(resource: ResourceAny<T>, name: string) {
    const resourceTypeState = this.resourceMap[resource["@type"]] as ResourceTypeState<T>;
    resourceTypeState.resourceTypeVersion += 1;
    let resourceState: ResourceState<T> | undefined = resourceTypeState.resourceNameMap.get(name);
    if (!resourceState) {
      resourceState = {
        resourceTypeVersion: 0,
        subscriptions: new Set()
      };
      resourceTypeState.resourceNameMap.set(name, resourceState);
    }
    resourceState.resourceTypeVersion = resourceTypeState.resourceTypeVersion;
    resourceState.resource = resource;
    this.sendResourceUpdates(resource['@type'], resourceState.subscriptions, new Set([name]));
  }

  setLdsResource(resource: Listener) {
    this.setResource({...resource, '@type': LDS_TYPE_URL}, resource.name!);
  }

  setRdsResource(resource: RouteConfiguration) {
    this.setResource({...resource, '@type': RDS_TYPE_URL}, resource.name!);
  }

  setCdsResource(resource: Cluster) {
    this.setResource({...resource, '@type': CDS_TYPE_URL}, resource.name!);
  }

  setEdsResource(resource: ClusterLoadAssignment) {
    this.setResource({...resource, '@type': EDS_TYPE_URL}, resource.cluster_name!);
  }

  unsetResource<T extends AdsTypeUrl>(typeUrl: T, name: string) {
    const resourceTypeState = this.resourceMap[typeUrl] as ResourceTypeState<T>;
    resourceTypeState.resourceTypeVersion += 1;
    let resourceState: ResourceState<T> | undefined = resourceTypeState.resourceNameMap.get(name);
    if (resourceState) {
      resourceState.resourceTypeVersion = resourceTypeState.resourceTypeVersion;
      delete resourceState.resource;
      this.sendResourceUpdates(typeUrl, resourceState.subscriptions, new Set([name]));
    }
  }

  ignoreResourceType(typeUrl: AdsTypeUrl) {
    this.resourceTypesToIgnore.add(typeUrl);
  }

  private sendResourceUpdates<T extends AdsTypeUrl>(typeUrl: T, clients: Set<string>, includeResources: Set<string>) {
    const resourceTypeState = this.resourceMap[typeUrl] as ResourceTypeState<T>;
    const clientResources = new Map<string, Any[]>();
    for (const [resourceName, resourceState] of resourceTypeState.resourceNameMap) {
      /* For RDS and EDS, only send updates for the listed updated resources.
       * Otherwise include all resources. */
      if ((typeUrl === RDS_TYPE_URL || typeUrl === EDS_TYPE_URL) && !includeResources.has(resourceName)) {
        continue;
      }
      if (!resourceState.resource) {
        continue;
      }
      for (const clientName of clients) {
        if (!resourceState.subscriptions.has(clientName)) {
          continue;
        }
        let resourcesList = clientResources.get(clientName);
        if (!resourcesList) {
          resourcesList = [];
          clientResources.set(clientName, resourcesList);
        }
        resourcesList.push(resourceState.resource);
      }
    }
    for (const [clientName, resourceList] of clientResources) {
      this.clients.get(clientName)?.write({
        resources: resourceList,
        version_info: resourceTypeState.resourceTypeVersion.toString(),
        nonce: resourceTypeState.resourceTypeVersion.toString(),
        type_url: typeUrl
      });
    }
  }

  private updateResponseListeners(typeUrl: AdsTypeUrl, responseState: ResponseState) {
    for (const listener of this.responseListeners) {
      listener(typeUrl, responseState);
    }
  }

  private maybeSubscribe<T extends AdsTypeUrl>(typeUrl: T, client: string, resourceName: string): boolean {
    const resourceTypeState = this.resourceMap[typeUrl] as ResourceTypeState<T>;
    let resourceState = resourceTypeState.resourceNameMap.get(resourceName);
    if (!resourceState) {
      resourceState = {
        resourceTypeVersion: 0,
        subscriptions: new Set()
      };
      resourceTypeState.resourceNameMap.set(resourceName, resourceState);
    }
    const newlySubscribed = !resourceState.subscriptions.has(client);
    resourceState.subscriptions.add(client);
    return newlySubscribed;
  }

  private handleUnsubscriptions(typeUrl: AdsTypeUrl, client: string, requestedResourceNames?: Set<string>) {
    const resourceTypeState = this.resourceMap[typeUrl];
    for (const [resourceName, resourceState] of resourceTypeState.resourceNameMap) {
      if (!requestedResourceNames || !requestedResourceNames.has(resourceName)) {
        resourceState.subscriptions.delete(client);
        if (!resourceState.resource && resourceState.subscriptions.size === 0) {
          resourceTypeState.resourceNameMap.delete(resourceName)
        }
      }
    }
  }

  private handleRequest(clientName: string, request: DiscoveryRequest__Output) {
    if (!isAdsTypeUrl(request.type_url)) {
      console.error(`Received ADS request with unsupported type_url ${request.type_url}`);
      return;
    }
    const clientResourceVersion = request.version_info === '' ? 0 : Number.parseInt(request.version_info);
    if (request.error_detail) {
      this.updateResponseListeners(request.type_url, {state: 'NACKED', errorMessage: request.error_detail.message});
    } else {
      this.updateResponseListeners(request.type_url, {state: 'ACKED'});
    }
    const requestedResourceNames = new Set(request.resource_names);
    const resourceTypeState = this.resourceMap[request.type_url];
    const updatedResources = new Set<string>();
    for (const resourceName of requestedResourceNames) {
      if (this.maybeSubscribe(request.type_url, clientName, resourceName) || resourceTypeState.resourceNameMap.get(resourceName)!.resourceTypeVersion > clientResourceVersion) {
        updatedResources.add(resourceName);
      }
    }
    this.handleUnsubscriptions(request.type_url, clientName, requestedResourceNames);
    if (updatedResources.size > 0) {
      this.sendResourceUpdates(request.type_url, new Set([clientName]), updatedResources);
    }
  }

  StreamAggregatedResources(call: ServerDuplexStream<DiscoveryRequest__Output, DiscoveryResponse>) {
    const clientName = call.getPeer();
    this.clients.set(clientName, call);
    call.on('data', (request: DiscoveryRequest__Output) => {
      this.handleRequest(clientName, request);
    });
    call.on('end', () => {
      this.clients.delete(clientName);
      for (const typeUrl of ADS_TYPE_URLS) {
        this.handleUnsubscriptions(typeUrl as AdsTypeUrl, clientName);
      }
      call.end();
    });
  }

  StreamLoadStats(call: ServerDuplexStream<LoadStatsRequest__Output, LoadStatsResponse>) {
    const statsResponse = {load_reporting_interval: {seconds: 30}};
    call.write(statsResponse);
    call.on('data', (request: LoadStatsRequest__Output) => {
      call.write(statsResponse);
    });
    call.on('end', () => {
      call.end();
    });
  }

  startServer(callback: (error: Error | null, port: number) => void) {
    if (this.server) {
      return;
    }
    const server = new Server();
    server.addService(loadedProtos.envoy.service.discovery.v3.AggregatedDiscoveryService.service, this as unknown as UntypedServiceImplementation);
    server.addService(loadedProtos.envoy.service.load_stats.v3.LoadReportingService.service, this as unknown as UntypedServiceImplementation);
    server.bindAsync('localhost:0', ServerCredentials.createInsecure(), (error, port) => {
      if (!error) {
        this.server = server;
        this.port = port;
        server.start();
      }
      callback(error, port);
    });
  }
  
  shutdownServer() {
    this.server?.forceShutdown();
  }

  getBootstrapServerConfig() {
    if (this.port === null) {
      throw new Error('Bootstrap info unavailable; server not started');
    }
    return {
      server_uri: `localhost:${this.port}`,
      channel_creds: [{type: 'insecure'}]
    };
  }

  getBootstrapInfoString(): string {
    if (this.port === null) {
      throw new Error('Bootstrap info unavailable; server not started');
    }
    const bootstrapInfo = {
      xds_servers: [this.getBootstrapServerConfig()],
      node: {
        id: 'test',
        locality: {}
      }
    }
    return JSON.stringify(bootstrapInfo);
  }
}
