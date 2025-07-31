/*
 * Copyright 2025 gRPC authors.
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

import { OrcaLoadReport } from "./generated/xds/data/orca/v3/OrcaLoadReport";

import type { loadSync } from '@grpc/proto-loader';
import { ProtoGrpcType as OrcaProtoGrpcType } from "./generated/orca";
import { loadPackageDefinition } from "./make-client";
import { OpenRcaServiceClient, OpenRcaServiceHandlers } from "./generated/xds/service/orca/v3/OpenRcaService";
import { durationMessageToDuration, durationToMs } from "./duration";
import { Server } from "./server";
import { ChannelCredentials } from "./channel-credentials";
import { Channel } from "./channel";

const loadedOrcaProto: OrcaProtoGrpcType | null = null;
function loadOrcaProto(): OrcaProtoGrpcType {
  if (loadedOrcaProto) {
    return loadedOrcaProto;
  }
  /* The purpose of this complexity is to avoid loading @grpc/proto-loader at
   * runtime for users who will not use/enable ORCA. */
  const loaderLoadSync = require('@grpc/proto-loader')
    .loadSync as typeof loadSync;
  const loadedProto = loaderLoadSync('xds/service/orca/v3/orca.proto', {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
    includeDirs: [
      `${__dirname}/../../proto/xds`,
      `${__dirname}/../../proto/protoc-gen-validate`
    ],
  });
  return loadPackageDefinition(loadedProto) as unknown as OrcaProtoGrpcType;
}

/**
 * ORCA metrics recorder for a single request
 */
export class PerRequestMetricRecorder {
  private message: OrcaLoadReport = {};

  /**
   * Records a request cost metric measurement for the call.
   * @param name
   * @param value
   */
  recordRequestCostMetric(name: string, value: number) {
    if (!this.message.request_cost) {
      this.message.request_cost = {};
    }
    this.message.request_cost[name] = value;
  }

  /**
   * Records a request cost metric measurement for the call.
   * @param name
   * @param value
   */
  recordUtilizationMetric(name: string, value: number) {
    if (!this.message.utilization) {
      this.message.utilization = {};
    }
    this.message.utilization[name] = value;
  }

  /**
   * Records an opaque named metric measurement for the call.
   * @param name
   * @param value
   */
  recordNamedMetric(name: string, value: number) {
    if (!this.message.named_metrics) {
      this.message.named_metrics = {};
    }
    this.message.named_metrics[name] = value;
  }

  /**
   * Records the CPU utilization metric measurement for the call.
   * @param value
   */
  recordCPUUtilizationMetric(value: number) {
    this.message.cpu_utilization = value;
  }

  /**
   * Records the memory utilization metric measurement for the call.
   * @param value
   */
  recordMemoryUtilizationMetric(value: number) {
    this.message.mem_utilization = value;
  }

  /**
   * Records the memory utilization metric measurement for the call.
   * @param value
   */
  recordApplicationUtilizationMetric(value: number) {
    this.message.application_utilization = value;
  }

  /**
   * Records the queries per second measurement.
   * @param value
   */
  recordQpsMetric(value: number) {
    this.message.rps_fractional = value;
  }

  /**
   * Records the errors per second measurement.
   * @param value
   */
  recordEpsMetric(value: number) {
    this.message.eps = value;
  }

  serialize(): Buffer {
    const orcaProto = loadOrcaProto();
    return orcaProto.xds.data.orca.v3.OrcaLoadReport.serialize(this.message);
  }
}

const DEFAULT_REPORT_INTERVAL_MS = 30_000;

export class ServerMetricRecorder {
  private message: OrcaLoadReport = {};

  private serviceImplementation: OpenRcaServiceHandlers = {
    StreamCoreMetrics: call => {
      const reportInterval = call.request.report_interval ?
        durationToMs(durationMessageToDuration(call.request.report_interval)) :
        DEFAULT_REPORT_INTERVAL_MS;
      const reportTimer = setInterval(() => {
        call.write(this.message);
      }, reportInterval);
      call.on('cancelled', () => {
        clearInterval(reportTimer);
      })
    }
  }

  putUtilizationMetric(name: string, value: number) {
    if (!this.message.utilization) {
      this.message.utilization = {};
    }
    this.message.utilization[name] = value;
  }

  setAllUtilizationMetrics(metrics: {[name: string]: number}) {
    this.message.utilization = {...metrics};
  }

  deleteUtilizationMetric(name: string) {
    delete this.message.utilization?.[name];
  }

  setCpuUtilizationMetric(value: number) {
    this.message.cpu_utilization = value;
  }

  deleteCpuUtilizationMetric() {
    delete this.message.cpu_utilization;
  }

  setApplicationUtilizationMetric(value: number) {
    this.message.application_utilization = value;
  }

  deleteApplicationUtilizationMetric() {
    delete this.message.application_utilization;
  }

  setQpsMetric(value: number) {
    this.message.rps_fractional = value;
  }

  deleteQpsMetric() {
    delete this.message.rps_fractional;
  }

  setEpsMetric(value: number) {
    this.message.eps = value;
  }

  deleteEpsMetric() {
    delete this.message.eps;
  }

  addToServer(server: Server) {
    const serviceDefinition = loadOrcaProto().xds.service.orca.v3.OpenRcaService.service;
    server.addService(serviceDefinition, this.serviceImplementation);
  }
}

export function createOrcaClient(channel: Channel): OpenRcaServiceClient {
  const ClientClass = loadOrcaProto().xds.service.orca.v3.OpenRcaService;
  return new ClientClass('unused', ChannelCredentials.createInsecure(), {channelOverride: channel});
}
