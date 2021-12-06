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

import { Node } from "./generated/envoy/config/core/v3/Node";
import { ClientConfig, _envoy_service_status_v3_ClientConfig_GenericXdsConfig as GenericXdsConfig } from "./generated/envoy/service/status/v3/ClientConfig";
import { ClientStatusDiscoveryServiceHandlers } from "./generated/envoy/service/status/v3/ClientStatusDiscoveryService";
import { ClientStatusRequest__Output } from "./generated/envoy/service/status/v3/ClientStatusRequest";
import { ClientStatusResponse } from "./generated/envoy/service/status/v3/ClientStatusResponse";
import { Timestamp } from "./generated/google/protobuf/Timestamp";
import { AdsTypeUrl, CDS_TYPE_URL_V2, CDS_TYPE_URL_V3, EDS_TYPE_URL_V2, EDS_TYPE_URL_V3, LDS_TYPE_URL_V2, LDS_TYPE_URL_V3, RDS_TYPE_URL_V2, RDS_TYPE_URL_V3 } from "./resources";
import { HandleResponseResult } from "./xds-stream-state/xds-stream-state";
import { sendUnaryData, ServerDuplexStream, ServerUnaryCall, status, experimental, loadPackageDefinition, logVerbosity } from '@grpc/grpc-js';
import { loadSync } from "@grpc/proto-loader";
import { ProtoGrpcType as CsdsProtoGrpcType } from "./generated/csds";

import registerAdminService = experimental.registerAdminService;

const TRACER_NAME = 'csds';

function trace(text: string): void {
  experimental.trace(logVerbosity.DEBUG, TRACER_NAME, text);
}


function dateToProtoTimestamp(date?: Date | null): Timestamp | null {
  if (!date) {
    return null;
  }
  const millisSinceEpoch = date.getTime();
  return {
    seconds: (millisSinceEpoch / 1000) | 0,
    nanos: (millisSinceEpoch % 1000) * 1_000_000
  }
}

let clientNode: Node | null = null;

const configStatus = {
  [EDS_TYPE_URL_V2]: new Map<string, GenericXdsConfig>(),
  [EDS_TYPE_URL_V3]: new Map<string, GenericXdsConfig>(),
  [CDS_TYPE_URL_V2]: new Map<string, GenericXdsConfig>(),
  [CDS_TYPE_URL_V3]: new Map<string, GenericXdsConfig>(),
  [RDS_TYPE_URL_V2]: new Map<string, GenericXdsConfig>(),
  [RDS_TYPE_URL_V3]: new Map<string, GenericXdsConfig>(),
  [LDS_TYPE_URL_V2]: new Map<string, GenericXdsConfig>(),
  [LDS_TYPE_URL_V3]: new Map<string, GenericXdsConfig>()
};

/**
 * This function only accepts a v3 Node message, because we are only supporting
 * v3 CSDS and it only handles v3 Nodes. If the client is actually using v2 xDS
 * APIs, it should just provide the equivalent v3 Node message.
 * @param node The Node message for the client that is requesting resources
 */
export function setCsdsClientNode(node: Node) {
  clientNode = node;
}

/**
 * Update the config status maps from the list of names of requested resources
 * for a specific type URL. These lists are the source of truth for determining
 * what resources will be listed in the CSDS response. Any resource that is not
 * in this list will never actually be applied anywhere.
 * @param typeUrl The resource type URL
 * @param names The list of resource names that are being requested
 */
export function updateCsdsRequestedNameList(typeUrl: AdsTypeUrl, names: string[]) {
  trace('Update type URL ' + typeUrl + ' with names [' + names + ']');
  const currentTime = dateToProtoTimestamp(new Date());
  const configMap = configStatus[typeUrl];
  for (const name of names) {
    if (!configMap.has(name)) {
      configMap.set(name, {
        type_url: typeUrl,
        name: name,
        last_updated: currentTime,
        client_status: 'REQUESTED'
      });
    }
  }
  for (const name of configMap.keys()) {
    if (!names.includes(name)) {
      configMap.delete(name);
    }
  }
}

/**
 * Update the config status maps from the result of parsing a single ADS
 * response. All resources that validated are considered "ACKED", and all
 * resources that failed validation are considered "NACKED".
 * @param typeUrl The type URL of resources in this response
 * @param versionInfo The version info field from this response
 * @param updates The lists of resources that passed and failed validation
 */
export function updateCsdsResourceResponse(typeUrl: AdsTypeUrl, versionInfo: string, updates: HandleResponseResult) {
  const currentTime = dateToProtoTimestamp(new Date());
  const configMap = configStatus[typeUrl];
  for (const {name, raw} of updates.accepted) {
    const mapEntry = configMap.get(name);
    if (mapEntry) {
      trace('Updated ' + typeUrl + ' resource ' + name + ' to state ACKED');
      mapEntry.client_status = 'ACKED';
      mapEntry.version_info = versionInfo;
      mapEntry.xds_config = raw;
      mapEntry.error_state = null;
      mapEntry.last_updated = currentTime;
    }
  }
  for (const {name, error, raw} of updates.rejected) {
    const mapEntry = configMap.get(name);
    if (mapEntry) {
      trace('Updated ' + typeUrl + ' resource ' + name + ' to state NACKED');
      mapEntry.client_status = 'NACKED';
      mapEntry.error_state = {
        failed_configuration: raw,
        last_update_attempt: currentTime,
        details: error,
        version_info: versionInfo
      };
    }
  }
  for (const name of updates.missing) {
    const mapEntry = configMap.get(name);
    if (mapEntry) {
      trace('Updated ' + typeUrl + ' resource ' + name + ' to state DOES_NOT_EXIST');
      mapEntry.client_status = 'DOES_NOT_EXIST';
      mapEntry.version_info = versionInfo;
      mapEntry.xds_config = null;
      mapEntry.error_state = null;
      mapEntry.last_updated = currentTime;
    }
  }
}

function getCurrentConfig(): ClientConfig {
  const genericConfigList: GenericXdsConfig[] = [];
  for (const configMap of Object.values(configStatus)) {
    for (const configValue of configMap.values()) {
      genericConfigList.push(configValue);
    }
  }
  const config = {
    node: clientNode,
    generic_xds_configs: genericConfigList
  };
  trace('Sending curent config ' + JSON.stringify(config, undefined, 2));
  return config;
}

const csdsImplementation: ClientStatusDiscoveryServiceHandlers = {
  FetchClientStatus(call: ServerUnaryCall<ClientStatusRequest__Output, ClientStatusResponse>, callback: sendUnaryData<ClientStatusResponse>) {
    const request = call.request;
    if (request.node_matchers.length > 0) {
      callback({
        code: status.INVALID_ARGUMENT,
        details: 'Node matchers not supported'
      });
      return;
    }
    callback(null, {
      config: [getCurrentConfig()]
    });
  },
  StreamClientStatus(call: ServerDuplexStream<ClientStatusRequest__Output, ClientStatusResponse>) {
    call.on('data', (request: ClientStatusRequest__Output) => {
      if (request.node_matchers.length > 0) {
        call.emit('error', {
          code: status.INVALID_ARGUMENT,
          details: 'Node matchers not supported'
        });
        return;
      }
      call.write({
        config: [getCurrentConfig()]
      });
    });
    call.on('end', () => {
      call.end();
    });
  }
}

const loadedProto = loadSync('envoy/service/status/v3/csds.proto', {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
  includeDirs: [
    // Paths are relative to src/build
    __dirname + '/../../deps/envoy-api/',
    __dirname + '/../../deps/xds/',
    __dirname + '/../../deps/protoc-gen-validate/',
    __dirname + '/../../deps/googleapis/'
  ],
});

const csdsGrpcObject = loadPackageDefinition(loadedProto) as unknown as CsdsProtoGrpcType;
const csdsServiceDefinition = csdsGrpcObject.envoy.service.status.v3.ClientStatusDiscoveryService.service;

export function setup() {
  registerAdminService(() => csdsServiceDefinition, () => csdsImplementation);
}