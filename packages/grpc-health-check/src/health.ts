/*
 *
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

import * as path from 'path';
import { loadSync, ServiceDefinition } from '@grpc/proto-loader';
import { HealthCheckRequest__Output } from './generated/grpc/health/v1/HealthCheckRequest';
import { HealthCheckResponse } from './generated/grpc/health/v1/HealthCheckResponse';
import { sendUnaryData, Server, ServerUnaryCall, ServerWritableStream } from './server-type';
import { HealthListRequest } from './generated/grpc/health/v1/HealthListRequest';
import { HealthListResponse } from './generated/grpc/health/v1/HealthListResponse';

const loadedProto = loadSync('health/v1/health.proto', {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
  includeDirs: [`${__dirname}/../../proto`],
});

export const service = loadedProto['grpc.health.v1.Health'] as ServiceDefinition;

const GRPC_STATUS_NOT_FOUND = 5;
const GRPC_STATUS_RESOURCE_EXHAUSTED = 8;
const RESOURCE_EXHAUSTION_LIMIT = 100;

export type ServingStatus = 'UNKNOWN' | 'SERVING' | 'NOT_SERVING';

export interface ServingStatusMap {
  [serviceName: string]: ServingStatus;
}

interface StatusWatcher {
  (status: ServingStatus): void;
}

export class HealthImplementation {
  private statusMap: Map<string, ServingStatus> = new Map();
  private watchers: Map<string, Set<StatusWatcher>> = new Map();
  constructor(initialStatusMap?: ServingStatusMap) {
    if (initialStatusMap) {
      for (const [serviceName, status] of Object.entries(initialStatusMap)) {
        this.statusMap.set(serviceName, status);
      }
    }
  }

  setStatus(service: string, status: ServingStatus) {
    this.statusMap.set(service, status);
    for (const watcher of this.watchers.get(service) ?? []) {
      watcher(status);
    }
  }

  private addWatcher(service: string, watcher: StatusWatcher) {
    const existingWatcherSet = this.watchers.get(service);
    if (existingWatcherSet) {
      existingWatcherSet.add(watcher);
    } else {
      const newWatcherSet = new Set<StatusWatcher>();
      newWatcherSet.add(watcher);
      this.watchers.set(service, newWatcherSet);
    }
  }

  private removeWatcher(service: string, watcher: StatusWatcher) {
    this.watchers.get(service)?.delete(watcher);
  }

  addToServer(server: Server) {
    server.addService(service, {
      check: (call: ServerUnaryCall<HealthCheckRequest__Output, HealthCheckResponse>, callback: sendUnaryData<HealthCheckResponse>) => {
        const serviceName = call.request.service;
        const status = this.statusMap.get(serviceName);
        if (status) {
          callback(null, {status: status});
        } else {
          callback({code: GRPC_STATUS_NOT_FOUND, details: `Health status unknown for service ${serviceName}`});
        }
      },
      watch: (call: ServerWritableStream<HealthCheckRequest__Output, HealthCheckResponse>) => {
        const serviceName = call.request.service;
        const statusWatcher = (status: ServingStatus) => {
          call.write({status: status});
        };
        this.addWatcher(serviceName, statusWatcher);
        call.on('cancelled', () => {
          this.removeWatcher(serviceName, statusWatcher);
        });
        const currentStatus = this.statusMap.get(serviceName);
        if (currentStatus) {
          call.write({status: currentStatus});
        } else {
          call.write({status: 'SERVICE_UNKNOWN'});
        }
      },
      list: (_call: ServerUnaryCall<HealthListRequest, HealthListResponse>, callback: sendUnaryData<HealthListResponse>) => {
        const statuses: { [key: string]: HealthCheckResponse } = {};
        let serviceCount = 0;

        for (const [serviceName, status] of this.statusMap.entries()) {
          if (serviceCount >= RESOURCE_EXHAUSTION_LIMIT) {
            const error = {
              code: GRPC_STATUS_RESOURCE_EXHAUSTED,
              details: 'Too many services to list.',
            };
            callback(error, null);
            return;
          }
          statuses[serviceName] = { status };
          serviceCount++;
        }
        callback(null, { statuses });
      },
    });
  }
}

export const protoPath = path.resolve(__dirname, '../../proto/health/v1/health.proto');
