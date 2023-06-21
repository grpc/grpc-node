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

import { ClientConfig, _envoy_service_status_v3_ClientConfig_GenericXdsConfig as GenericXdsConfig } from "./generated/envoy/service/status/v3/ClientConfig";
import { ClientStatusDiscoveryServiceHandlers } from "./generated/envoy/service/status/v3/ClientStatusDiscoveryService";
import { ClientStatusRequest__Output } from "./generated/envoy/service/status/v3/ClientStatusRequest";
import { ClientStatusResponse } from "./generated/envoy/service/status/v3/ClientStatusResponse";
import { Timestamp } from "./generated/google/protobuf/Timestamp";
import { xdsResourceNameToString } from "./resources";
import { sendUnaryData, ServerDuplexStream, ServerUnaryCall, status, experimental, loadPackageDefinition, logVerbosity } from '@grpc/grpc-js';
import { loadSync } from "@grpc/proto-loader";
import { ProtoGrpcType as CsdsProtoGrpcType } from "./generated/csds";

import registerAdminService = experimental.registerAdminService;
import { XdsClient } from "./xds-client";

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

const registeredClients: XdsClient[] = [];

export function registerXdsClientWithCsds(client: XdsClient) {
  registeredClients.push(client);
}

function getCurrentConfigList(): ClientConfig[] {
  const result: ClientConfig[] = [];
  for (const client of registeredClients) {
    if (!client.adsNode) {
      continue;
    }
    const genericConfigList: GenericXdsConfig[] = [];
    for (const [authority, authorityState] of client.authorityStateMap) {
      for (const [type, typeMap] of authorityState.resourceMap) {
        for (const [key, resourceState] of typeMap) {
          const typeUrl = type.getTypeUrl();
          const meta = resourceState.meta;
          genericConfigList.push({
            name: xdsResourceNameToString({authority, key}, typeUrl),
            type_url: typeUrl,
            client_status: meta.clientStatus,
            version_info: meta.version,
            xds_config: meta.clientStatus === 'ACKED' ? meta.rawResource : undefined,
            last_updated: meta.updateTime ? dateToProtoTimestamp(meta.updateTime) : undefined,
            error_state: meta.clientStatus === 'NACKED' ? {
              details: meta.failedDetails,
              failed_configuration: meta.rawResource,
              last_update_attempt: meta.failedUpdateTime ? dateToProtoTimestamp(meta.failedUpdateTime) : undefined,
              version_info: meta.failedVersion
            } : undefined
          });
        }
      }
    }
    result.push({
      node: client.adsNode,
      generic_xds_configs: genericConfigList
    });
  }
  return result;
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
      config: getCurrentConfigList()
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
        config: getCurrentConfigList()
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
