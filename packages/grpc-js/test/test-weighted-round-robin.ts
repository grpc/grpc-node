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

import * as assert from 'assert';
import * as path from 'path';

import * as grpc from '../src';
import { loadProtoFile } from './common';
import { EchoServiceClient } from './generated/EchoService';
import { ProtoGrpcType } from './generated/echo_service'
import { WeightedRoundRobinLoadBalancingConfig } from '../src/load-balancer-weighted-round-robin';

const protoFile = path.join(__dirname, 'fixtures', 'echo_service.proto');
const EchoService = (loadProtoFile(protoFile) as unknown as ProtoGrpcType).EchoService;

function makeNCalls(client: EchoServiceClient, count: number): Promise<{[serverId: string]: number}> {
  return new Promise((resolve, reject) => {
    const result: {[serverId: string]: number} = {};
    function makeOneCall(callsLeft: number) {
      if (callsLeft <= 0) {
        resolve(result);
      } else {
        const deadline = new Date();
        deadline.setMilliseconds(deadline.getMilliseconds() + 100);
        const call= client.echo({}, {deadline}, (error, value) => {
          if (error) {
            reject(error);
            return;
          }
          makeOneCall(callsLeft - 1);
        });
        call.on('metadata', metadata => {
          const serverEntry = metadata.get('server');
          if (serverEntry.length > 0) {
            const serverId = serverEntry[0] as string;
            if (!(serverId in result)) {
              result[serverId] = 0;
            }
            result[serverId] += 1;
          }
        });
      }
    }
    makeOneCall(count);
  });
}

function createServiceConfig(wrrConfig: object): grpc.ServiceConfig {
  return {
    methodConfig: [],
    loadBalancingConfig: [
      {'weighted_round_robin': wrrConfig}
    ]
  };
}

function createClient(ports: number[], serviceConfig: grpc.ServiceConfig) {
  return new EchoService(`ipv4:${ports.map(port => `127.0.0.1:${port}`).join(',')}`, grpc.credentials.createInsecure(), {'grpc.service_config': JSON.stringify(serviceConfig)});
}

function asyncTimeout(delay: number): Promise<void> {
  return new Promise(resolve => {
    setTimeout(resolve, delay);
  });
}

describe('Weighted round robin LB policy', () => {
  describe('Config parsing', () => {
    it('Should have default values with an empty object', () => {
      const config = WeightedRoundRobinLoadBalancingConfig.createFromJson({});
      assert.strictEqual(config.getEnableOobLoadReport(), false);
      assert.strictEqual(config.getBlackoutPeriodMs(), 10_000);
      assert.strictEqual(config.getErrorUtilizationPenalty(), 1);
      assert.strictEqual(config.getOobLoadReportingPeriodMs(), 10_000);
      assert.strictEqual(config.getWeightExpirationPeriodMs(), 180_000);
      assert.strictEqual(config.getWeightUpdatePeriodMs(), 1_000);
    });
    it('Should handle enable_oob_load_report', () => {
      const config = WeightedRoundRobinLoadBalancingConfig.createFromJson({
        enable_oob_load_report: true
      });
      assert.strictEqual(config.getEnableOobLoadReport(), true);
    });
    it('Should handle error_utilization_penalty', () => {
      const config = WeightedRoundRobinLoadBalancingConfig.createFromJson({
        error_utilization_penalty: 0.5
      });
      assert.strictEqual(config.getErrorUtilizationPenalty(), 0.5);
    });
    it('Should reject negative error_utilization_penalty', () => {
      const loadBalancingConfig = {
        error_utilization_penalty: -1
      };
      assert.throws(() => {
        WeightedRoundRobinLoadBalancingConfig.createFromJson(loadBalancingConfig);
      }, /error_utilization_penalty < 0/);
    });
    it('Should handle blackout_period as a string', () => {
      const config = WeightedRoundRobinLoadBalancingConfig.createFromJson({
        blackout_period: '1s'
      });
      assert.strictEqual(config.getBlackoutPeriodMs(), 1_000);
    });
    it('Should handle blackout_period as an object', () => {
      const config = WeightedRoundRobinLoadBalancingConfig.createFromJson({
        blackout_period: {
          seconds: 1,
          nanos: 0
        }
      });
      assert.strictEqual(config.getBlackoutPeriodMs(), 1_000);
    });
    it('Should handle oob_load_reporting_period as a string', () => {
      const config = WeightedRoundRobinLoadBalancingConfig.createFromJson({
        oob_load_reporting_period: '1s'
      });
      assert.strictEqual(config.getOobLoadReportingPeriodMs(), 1_000);
    });
    it('Should handle oob_load_reporting_period as an object', () => {
      const config = WeightedRoundRobinLoadBalancingConfig.createFromJson({
        oob_load_reporting_period: {
          seconds: 1,
          nanos: 0
        }
      });
      assert.strictEqual(config.getOobLoadReportingPeriodMs(), 1_000);
    });
    it('Should handle weight_expiration_period as a string', () => {
      const config = WeightedRoundRobinLoadBalancingConfig.createFromJson({
        weight_expiration_period: '1s'
      });
      assert.strictEqual(config.getWeightExpirationPeriodMs(), 1_000);
    });
    it('Should handle weight_expiration_period as an object', () => {
      const config = WeightedRoundRobinLoadBalancingConfig.createFromJson({
        weight_expiration_period: {
          seconds: 1,
          nanos: 0
        }
      });
      assert.strictEqual(config.getWeightExpirationPeriodMs(), 1_000);
    });
    it('Should handle weight_update_period as a string', () => {
      const config = WeightedRoundRobinLoadBalancingConfig.createFromJson({
        weight_update_period: '2s'
      });
      assert.strictEqual(config.getWeightUpdatePeriodMs(), 2_000);
    });
    it('Should handle weight_update_period as an object', () => {
      const config = WeightedRoundRobinLoadBalancingConfig.createFromJson({
        weight_update_period: {
          seconds: 2,
          nanos: 0
        }
      });
      assert.strictEqual(config.getWeightUpdatePeriodMs(), 2_000);
    });
    it('Should cap weight_update_period to a minimum of 0.1s', () => {
      const config = WeightedRoundRobinLoadBalancingConfig.createFromJson({
        weight_update_period: '0.01s'
      });
      assert.strictEqual(config.getWeightUpdatePeriodMs(), 100);
    });
  });
  describe('Per-call metrics', () => {
    const server1Metrics = {
      qps: 0,
      utilization: 0,
      eps: 0
    };
    const server2Metrics = {
      qps: 0,
      utilization: 0,
      eps: 0
    };
    const server1 = new grpc.Server({'grpc.server_call_metric_recording': 1});
    const server2 = new grpc.Server({'grpc.server_call_metric_recording': 1});
    const server1Impl = {
      echo: (
        call: grpc.ServerUnaryCall<any, any>,
        callback: grpc.sendUnaryData<any>
      ) => {
        const metricsRecorder = call.getMetricsRecorder();
        metricsRecorder.recordQpsMetric(server1Metrics.qps);
        metricsRecorder.recordApplicationUtilizationMetric(server1Metrics.utilization);
        metricsRecorder.recordEpsMetric(server1Metrics.eps);
        const metadata = new grpc.Metadata();
        metadata.set('server', '1');
        call.sendMetadata(metadata);
        callback(null, call.request);
      },
    };
    const server2Impl = {
      echo: (
        call: grpc.ServerUnaryCall<any, any>,
        callback: grpc.sendUnaryData<any>
      ) => {
        const metricsRecorder = call.getMetricsRecorder();
        metricsRecorder.recordQpsMetric(server2Metrics.qps);
        metricsRecorder.recordApplicationUtilizationMetric(server2Metrics.utilization);
        metricsRecorder.recordEpsMetric(server2Metrics.eps);
        const metadata = new grpc.Metadata();
        metadata.set('server', '2');
        call.sendMetadata(metadata);
        callback(null, call.request);
      },
    };
    let port1: number;
    let port2: number;
    let client: EchoServiceClient | null = null;
    before(done => {
      const creds = grpc.ServerCredentials.createInsecure();
      server1.addService(EchoService.service, server1Impl);
      server2.addService(EchoService.service, server2Impl);
      server1.bindAsync('localhost:0', creds, (error1, server1Port) => {
        if (error1) {
          done(error1);
          return;
        }
        port1 = server1Port;
        server2.bindAsync('localhost:0', creds, (error2, server2Port) => {
          if (error2) {
            done(error2);
            return;
          }
          port2 = server2Port;
          done();
        });
      });
    });
    beforeEach(() => {
      server1Metrics.qps = 0;
      server1Metrics.utilization = 0;
      server1Metrics.eps = 0;
      server2Metrics.qps = 0;
      server2Metrics.utilization = 0;
      server2Metrics.eps = 0;
    });
    afterEach(() => {
      client?.close();
      client = null;
    });
    after(() => {
      server1.forceShutdown();
      server2.forceShutdown();
    });
    it('Should evenly balance among endpoints with no weight', async () => {
      const serviceConfig = createServiceConfig({});
      client = createClient([port1, port2], serviceConfig);
      await makeNCalls(client, 10);
      const result = await makeNCalls(client, 30);
      assert(Math.abs(result['1'] - result['2']) < 3, `server1: ${result['1']}, server2: ${result[2]}`);
    });
    it('Should send more requests to endpoints with higher QPS', async () => {
      const serviceConfig = createServiceConfig({
        blackout_period: '0.01s',
        weight_update_period: '0.1s'
      });
      client = createClient([port1, port2], serviceConfig);
      server1Metrics.qps = 3;
      server1Metrics.utilization = 1;
      server2Metrics.qps = 1;
      server2Metrics.utilization = 1;
      await makeNCalls(client, 10);
      await asyncTimeout(200);
      const result = await makeNCalls(client, 40);
      assert(Math.abs(result['1'] - 30) < 3, `server1: ${result['1']}, server2: ${result['2']}`);
    });
    // Calls aren't fast enough for this to work consistently
    it.skip('Should wait for the blackout period to apply weights', async () => {
      const serviceConfig = createServiceConfig({
        blackout_period: '0.5s'
      });
      client = createClient([port1, port2], serviceConfig);
      server1Metrics.qps = 3;
      server1Metrics.utilization = 1;
      server2Metrics.qps = 1;
      server2Metrics.utilization = 1;
      await makeNCalls(client, 10);
      await asyncTimeout(100);
      const result1 = await makeNCalls(client, 20);
      assert(Math.abs(result1['1'] - result1['2']) < 3, `result1: server1: ${result1['1']}, server2: ${result1[2]}`);
      await asyncTimeout(400);
      const result2 = await makeNCalls(client, 40);
      assert(Math.abs(result2['1'] - 30) < 2, `result2: server1: ${result2['1']}, server2: ${result2['2']}`);
    })
    // Calls aren't fast enough for this to work consistently
    it.skip('Should wait for the weight update period to apply weights', async () => {
      const serviceConfig = createServiceConfig({
        blackout_period: '0.01s',
        weight_update_period: '1s'
      });
      client = createClient([port1, port2], serviceConfig);
      server1Metrics.qps = 3;
      server1Metrics.utilization = 1;
      server2Metrics.qps = 1;
      server2Metrics.utilization = 1;
      await makeNCalls(client, 10);
      await asyncTimeout(100);
      const result1 = await makeNCalls(client, 20);
      assert(Math.abs(result1['1'] - result1['2']) < 3, `result1: server1: ${result1['1']}, server2: ${result1[2]}`);
      await asyncTimeout(400);
      const result2 = await makeNCalls(client, 40);
      assert(Math.abs(result2['1'] - 30) < 2, `result2: server1: ${result2['1']}, server2: ${result2['2']}`);
    })
    it('Should send more requests to endpoints with lower EPS', async () => {
      const serviceConfig = createServiceConfig({
        blackout_period: '0.01s',
        weight_update_period: '0.1s',
        error_utilization_penalty: 1
      });
      client = createClient([port1, port2], serviceConfig);
      server1Metrics.qps = 2;
      server1Metrics.utilization = 1;
      server1Metrics.eps = 0;
      server2Metrics.qps = 2;
      server2Metrics.utilization = 1;
      server2Metrics.eps = 2;
      await makeNCalls(client, 10);
      await asyncTimeout(100);
      const result = await makeNCalls(client, 30);
      assert(Math.abs(result['1'] - 20) < 3, `server1: ${result['1']}, server2: ${result['2']}`);
    });
  });
  describe('Out of band metrics', () => {
    const server1MetricRecorder = new grpc.ServerMetricRecorder();
    const server2MetricRecorder = new grpc.ServerMetricRecorder();
    const server1 = new grpc.Server();
    const server2 = new grpc.Server();
    const server1Impl = {
      echo: (
        call: grpc.ServerUnaryCall<any, any>,
        callback: grpc.sendUnaryData<any>
      ) => {
        const metadata = new grpc.Metadata();
        metadata.set('server', '1');
        call.sendMetadata(metadata);
        callback(null, call.request);
      },
    };
    const server2Impl = {
      echo: (
        call: grpc.ServerUnaryCall<any, any>,
        callback: grpc.sendUnaryData<any>
      ) => {
        const metadata = new grpc.Metadata();
        metadata.set('server', '2');
        call.sendMetadata(metadata);
        callback(null, call.request);
      },
    };
    let port1: number;
    let port2: number;
    let client: EchoServiceClient | null = null;
    before(done => {
      const creds = grpc.ServerCredentials.createInsecure();
      server1.addService(EchoService.service, server1Impl);
      server2.addService(EchoService.service, server2Impl);
      server1MetricRecorder.addToServer(server1);
      server2MetricRecorder.addToServer(server2);
      server1.bindAsync('localhost:0', creds, (error1, server1Port) => {
        if (error1) {
          done(error1);
          return;
        }
        port1 = server1Port;
        server2.bindAsync('localhost:0', creds, (error2, server2Port) => {
          if (error2) {
            done(error2);
            return;
          }
          port2 = server2Port;
          done();
        });
      });
    });
    beforeEach(() => {
      server1MetricRecorder.deleteQpsMetric();
      server1MetricRecorder.deleteEpsMetric();
      server1MetricRecorder.deleteApplicationUtilizationMetric();
      server2MetricRecorder.deleteQpsMetric();
      server2MetricRecorder.deleteEpsMetric();
      server2MetricRecorder.deleteApplicationUtilizationMetric();
    });
    afterEach(() => {
      client?.close();
      client = null;
    });
    after(() => {
      server1.forceShutdown();
      server2.forceShutdown();
    });
    it('Should evenly balance among endpoints with no weight', async () => {
      const serviceConfig = createServiceConfig({
        enable_oob_load_report: true,
        oob_load_reporting_period: '0.01s',
        blackout_period: '0.01s'
      });
      client = createClient([port1, port2], serviceConfig);
      await makeNCalls(client, 10);
      const result = await makeNCalls(client, 30);
      assert(Math.abs(result['1'] - result['2']) < 3, `server1: ${result['1']}, server2: ${result[2]}`);
    });
    it('Should send more requests to endpoints with higher QPS', async () => {
      const serviceConfig = createServiceConfig({
        enable_oob_load_report: true,
        oob_load_reporting_period: '0.01s',
        blackout_period: '0.01s',
        weight_update_period: '0.1s'
      });
      client = createClient([port1, port2], serviceConfig);
      server1MetricRecorder.setQpsMetric(3);
      server1MetricRecorder.setApplicationUtilizationMetric(1);
      server2MetricRecorder.setQpsMetric(1);
      server2MetricRecorder.setApplicationUtilizationMetric(1);
      await makeNCalls(client, 10);
      await asyncTimeout(200);
      const result = await makeNCalls(client, 40);
      assert(Math.abs(result['1'] - 30) < 3, `server1: ${result['1']}, server2: ${result['2']}`);
    });
  });
});
