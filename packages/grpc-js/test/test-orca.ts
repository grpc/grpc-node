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
import { ServiceClient } from '../src/make-client';
import { assert2, loadProtoFile } from './common';
import { ProtoGrpcType as OrcaProtoGrpcType } from "../src/generated/orca";
import { PerRequestMetricRecorder, ServerMetricRecorder } from '../src/orca';
import { loadSync } from '@grpc/proto-loader';
import { OpenRcaServiceClient } from '../src/generated/xds/service/orca/v3/OpenRcaService';
import { OrcaLoadReport__Output } from '../src/generated/xds/data/orca/v3/OrcaLoadReport';
import { msToDuration } from '../src/duration';

const GRPC_METRICS_HEADER = 'endpoint-load-metrics-bin';
const protoFile = path.join(__dirname, 'fixtures', 'echo_service.proto');

const EchoService = loadProtoFile(protoFile)
  .EchoService as grpc.ServiceClientConstructor;

const loadedProto = loadSync('xds/service/orca/v3/orca.proto', {
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
const orcaProto = grpc.loadPackageDefinition(loadedProto) as unknown as OrcaProtoGrpcType;

let setMetrics: (metricsRecorder: PerRequestMetricRecorder) => void = () => {};

const serviceImpl = {
  echo: (
    call: grpc.ServerUnaryCall<any, any>,
    callback: grpc.sendUnaryData<any>
  ) => {
    setMetrics?.(call.getMetricsRecorder());
    callback(null, call.request);
  },
};

describe('ORCA', () => {
  let server: grpc.Server;
  let client: ServiceClient;

  afterEach(() => {
    setMetrics = () => {}
  });

  describe('server-side per-call metrics', () => {
    describe('not enabled', () => {
      before(done => {
        server = new grpc.Server();
        server.addService(EchoService.service, serviceImpl);
        server.bindAsync(
          'localhost:0',
          grpc.ServerCredentials.createInsecure(),
          (error, port) => {
            if (error) {
              done(error);
              return;
            }
            client = new EchoService(
              `localhost:${port}`,
              grpc.credentials.createInsecure()
            );
            done();
          }
        );
      });

      after(done => {
        client.close();
        server.tryShutdown(done);
      });

      it('Should not include the metadata entry', done => {
        const call: grpc.ClientUnaryCall = client.echo(
          { value: 'test value', value2: 3 },
          assert2.mustCall((error: grpc.ServiceError, response: any) => {
            assert.ifError(error);
            assert.deepStrictEqual(response, { value: 'test value', value2: 3 });
          })
        );
        call.on('status', assert2.mustCall((status) => {
          assert.deepStrictEqual(status.metadata.get(GRPC_METRICS_HEADER), []);
        }));
        assert2.afterMustCallsSatisfied(done);
      });
    });
    describe('enabled', () => {
      before(done => {
        server = new grpc.Server({ 'grpc.server_call_metric_recording': 1 });
        server.addService(EchoService.service, serviceImpl);
        server.bindAsync(
          'localhost:0',
          grpc.ServerCredentials.createInsecure(),
          (error, port) => {
            if (error) {
              done(error);
              return;
            }
            client = new EchoService(
              `localhost:${port}`,
              grpc.credentials.createInsecure()
            );
            done();
          }
        );
      });

      after(done => {
        client.close();
        server.tryShutdown(done);
      });

      it('Should include the metadata entry', done => {
        const call: grpc.ClientUnaryCall = client.echo(
          { value: 'test value', value2: 3 },
          assert2.mustCall((error: grpc.ServiceError, response: any) => {
            assert.ifError(error);
            assert.deepStrictEqual(response, { value: 'test value', value2: 3 });
          })
        );
        call.on('status', assert2.mustCall((status) => {
          assert.strictEqual(status.metadata.get(GRPC_METRICS_HEADER).length, 1);
        }));
        assert2.afterMustCallsSatisfied(done);
      });

      it('Should send request cost metrics', done => {
        setMetrics = (metricsRecorder) => {
          metricsRecorder.recordRequestCostMetric('test', 1);
        }
        const call: grpc.ClientUnaryCall = client.echo(
          { value: 'test value', value2: 3 },
          assert2.mustCall((error: grpc.ServiceError, response: any) => {
            assert.ifError(error);
            assert.deepStrictEqual(response, { value: 'test value', value2: 3 });
          })
        );
        call.on('status', assert2.mustCall((status) => {
          assert.strictEqual(status.metadata.get(GRPC_METRICS_HEADER).length, 1);
          const loadReport = orcaProto.xds.data.orca.v3.OrcaLoadReport.deserialize(status.metadata.get(GRPC_METRICS_HEADER)[0]);
          assert.deepStrictEqual(loadReport.request_cost, {test: 1});
        }));
        assert2.afterMustCallsSatisfied(done);
      });

      it('Should send utilization metrics', done => {
        setMetrics = (metricsRecorder) => {
          metricsRecorder.recordUtilizationMetric('test', 1);
        }
        const call: grpc.ClientUnaryCall = client.echo(
          { value: 'test value', value2: 3 },
          assert2.mustCall((error: grpc.ServiceError, response: any) => {
            assert.ifError(error);
            assert.deepStrictEqual(response, { value: 'test value', value2: 3 });
          })
        );
        call.on('status', assert2.mustCall((status) => {
          assert.strictEqual(status.metadata.get(GRPC_METRICS_HEADER).length, 1);
          const loadReport = orcaProto.xds.data.orca.v3.OrcaLoadReport.deserialize(status.metadata.get(GRPC_METRICS_HEADER)[0]);
          assert.deepStrictEqual(loadReport.utilization, {test: 1});
        }));
        assert2.afterMustCallsSatisfied(done);
      });

      it('Should send named metrics', done => {
        setMetrics = (metricsRecorder) => {
          metricsRecorder.recordNamedMetric('test', 1);
        }
        const call: grpc.ClientUnaryCall = client.echo(
          { value: 'test value', value2: 3 },
          assert2.mustCall((error: grpc.ServiceError, response: any) => {
            assert.ifError(error);
            assert.deepStrictEqual(response, { value: 'test value', value2: 3 });
          })
        );
        call.on('status', assert2.mustCall((status) => {
          assert.strictEqual(status.metadata.get(GRPC_METRICS_HEADER).length, 1);
          const loadReport = orcaProto.xds.data.orca.v3.OrcaLoadReport.deserialize(status.metadata.get(GRPC_METRICS_HEADER)[0]);
          assert.deepStrictEqual(loadReport.named_metrics, {test: 1});
        }));
        assert2.afterMustCallsSatisfied(done);
      });

      it('Should send CPU utilization metrics', done => {
        setMetrics = (metricsRecorder) => {
          metricsRecorder.recordCPUUtilizationMetric(1);
        }
        const call: grpc.ClientUnaryCall = client.echo(
          { value: 'test value', value2: 3 },
          assert2.mustCall((error: grpc.ServiceError, response: any) => {
            assert.ifError(error);
            assert.deepStrictEqual(response, { value: 'test value', value2: 3 });
          })
        );
        call.on('status', assert2.mustCall((status) => {
          assert.strictEqual(status.metadata.get(GRPC_METRICS_HEADER).length, 1);
          const loadReport = orcaProto.xds.data.orca.v3.OrcaLoadReport.deserialize(status.metadata.get(GRPC_METRICS_HEADER)[0]);
          assert.deepStrictEqual(loadReport.cpu_utilization, 1);
        }));
        assert2.afterMustCallsSatisfied(done);
      });

      it('Should send CPU utilization metrics', done => {
        setMetrics = (metricsRecorder) => {
          metricsRecorder.recordMemoryUtilizationMetric(1);
        }
        const call: grpc.ClientUnaryCall = client.echo(
          { value: 'test value', value2: 3 },
          assert2.mustCall((error: grpc.ServiceError, response: any) => {
            assert.ifError(error);
            assert.deepStrictEqual(response, { value: 'test value', value2: 3 });
          })
        );
        call.on('status', assert2.mustCall((status) => {
          assert.strictEqual(status.metadata.get(GRPC_METRICS_HEADER).length, 1);
          const loadReport = orcaProto.xds.data.orca.v3.OrcaLoadReport.deserialize(status.metadata.get(GRPC_METRICS_HEADER)[0]);
          assert.deepStrictEqual(loadReport.mem_utilization, 1);
        }));
        assert2.afterMustCallsSatisfied(done);
      });

      it('Should send application utilization metrics', done => {
        setMetrics = (metricsRecorder) => {
          metricsRecorder.recordApplicationUtilizationMetric(1);
        }
        const call: grpc.ClientUnaryCall = client.echo(
          { value: 'test value', value2: 3 },
          assert2.mustCall((error: grpc.ServiceError, response: any) => {
            assert.ifError(error);
            assert.deepStrictEqual(response, { value: 'test value', value2: 3 });
          })
        );
        call.on('status', assert2.mustCall((status) => {
          assert.strictEqual(status.metadata.get(GRPC_METRICS_HEADER).length, 1);
          const loadReport = orcaProto.xds.data.orca.v3.OrcaLoadReport.deserialize(status.metadata.get(GRPC_METRICS_HEADER)[0]);
          assert.deepStrictEqual(loadReport.application_utilization, 1);
        }));
        assert2.afterMustCallsSatisfied(done);
      });

      it('Should send QPS metrics', done => {
        setMetrics = (metricsRecorder) => {
          metricsRecorder.recordQpsMetric(1);
        }
        const call: grpc.ClientUnaryCall = client.echo(
          { value: 'test value', value2: 3 },
          assert2.mustCall((error: grpc.ServiceError, response: any) => {
            assert.ifError(error);
            assert.deepStrictEqual(response, { value: 'test value', value2: 3 });
          })
        );
        call.on('status', assert2.mustCall((status) => {
          assert.strictEqual(status.metadata.get(GRPC_METRICS_HEADER).length, 1);
          const loadReport = orcaProto.xds.data.orca.v3.OrcaLoadReport.deserialize(status.metadata.get(GRPC_METRICS_HEADER)[0]);
          assert.deepStrictEqual(loadReport.rps_fractional, 1);
        }));
        assert2.afterMustCallsSatisfied(done);
      });

      it('Should send EPS metrics', done => {
        setMetrics = (metricsRecorder) => {
          metricsRecorder.recordEpsMetric(1);
        }
        const call: grpc.ClientUnaryCall = client.echo(
          { value: 'test value', value2: 3 },
          assert2.mustCall((error: grpc.ServiceError, response: any) => {
            assert.ifError(error);
            assert.deepStrictEqual(response, { value: 'test value', value2: 3 });
          })
        );
        call.on('status', assert2.mustCall((status) => {
          assert.strictEqual(status.metadata.get(GRPC_METRICS_HEADER).length, 1);
          const loadReport = orcaProto.xds.data.orca.v3.OrcaLoadReport.deserialize(status.metadata.get(GRPC_METRICS_HEADER)[0]);
          assert.deepStrictEqual(loadReport.eps, 1);
        }));
        assert2.afterMustCallsSatisfied(done);
      });
    });
  });
  describe('server-side out of band metrics', () => {
    let metricRecorder: ServerMetricRecorder;
    let server: grpc.Server;
    let client: OpenRcaServiceClient;
    let call: grpc.ClientReadableStream<OrcaLoadReport__Output> | null = null;
    beforeEach(done => {
      metricRecorder = new ServerMetricRecorder();
      server = new grpc.Server();
      metricRecorder.addToServer(server);
      server.bindAsync('localhost:0', grpc.ServerCredentials.createInsecure(), (error, port) => {
        if (error) {
          done(error);
          return;
        }
        client = new orcaProto.xds.service.orca.v3.OpenRcaService(`localhost:${port}`, grpc.credentials.createInsecure());
        done();
      });
    });
    afterEach(done => {
      call?.cancel();
      call = null;
      client.close();
      server.tryShutdown(done);
    });
    it('Should send utilization metrics', done => {
      metricRecorder.putUtilizationMetric('test', 123);
      call = client.streamCoreMetrics({report_interval: msToDuration(10)});
      call.on('error', () => {});
      call.on('data', (report: OrcaLoadReport__Output) => {
        assert.strictEqual(report.utilization.test, 123);
        done();
      });
    });
    it('Should set all utilization metrics', done => {
      metricRecorder.setAllUtilizationMetrics({test1: 123, test2: 456});
      call = client.streamCoreMetrics({report_interval: msToDuration(10)});
      call.on('error', () => {});
      call.on('data', (report: OrcaLoadReport__Output) => {
        assert.deepStrictEqual(report.utilization, {test1: 123, test2: 456});
        done();
      });
    });
    it('Should delete utilization metrics', done => {
      metricRecorder.putUtilizationMetric('test', 123);
      call = client.streamCoreMetrics({report_interval: msToDuration(10)});
      call.on('error', () => {});
      let seenMetric = false;
      call.on('data', (report: OrcaLoadReport__Output) => {
        if (!seenMetric) {
          assert.strictEqual(report.utilization.test, 123);
          metricRecorder.deleteUtilizationMetric('test');
          seenMetric = true;
        } else {
          assert.deepStrictEqual(report.utilization, {});
          done();
        }
      });
    });
    it('Should set CPU utilization', done => {
      metricRecorder.setCpuUtilizationMetric(123);
      call = client.streamCoreMetrics({report_interval: msToDuration(10)});
      call.on('error', () => {});
      call.on('data', (report: OrcaLoadReport__Output) => {
        assert.strictEqual(report.cpu_utilization, 123);
        done();
      });
    });
    it('Should delete CPU utilization', done => {
      metricRecorder.setCpuUtilizationMetric(123);
      call = client.streamCoreMetrics({report_interval: msToDuration(10)});
      call.on('error', () => {});
      let seenMetric = false;
      call.on('data', (report: OrcaLoadReport__Output) => {
        if (!seenMetric) {
          assert.strictEqual(report.cpu_utilization, 123);
          metricRecorder.deleteCpuUtilizationMetric();
          seenMetric = true;
        } else {
          assert.strictEqual(report.cpu_utilization, 0);
          done();
        }
      });
    });
    it('Should set application utilization', done => {
      metricRecorder.setApplicationUtilizationMetric(123);
      call = client.streamCoreMetrics({report_interval: msToDuration(10)});
      call.on('error', () => {});
      call.on('data', (report: OrcaLoadReport__Output) => {
        assert.strictEqual(report.application_utilization, 123);
        done();
      });
    });
    it('Should delete application utilization', done => {
      metricRecorder.setApplicationUtilizationMetric(123);
      call = client.streamCoreMetrics({report_interval: msToDuration(10)});
      call.on('error', () => {});
      let seenMetric = false;
      call.on('data', (report: OrcaLoadReport__Output) => {
        if (!seenMetric) {
          assert.strictEqual(report.application_utilization, 123);
          metricRecorder.deleteApplicationUtilizationMetric();
          seenMetric = true;
        } else {
          assert.strictEqual(report.application_utilization, 0);
          done();
        }
      });
    });
    it('Should set QPS metric', done => {
      metricRecorder.setQpsMetric(123);
      call = client.streamCoreMetrics({report_interval: msToDuration(10)});
      call.on('error', () => {});
      call.on('data', (report: OrcaLoadReport__Output) => {
        assert.strictEqual(report.rps_fractional, 123);
        done();
      });
    });
    it('Should delete QPS metric', done => {
      metricRecorder.setQpsMetric(123);
      call = client.streamCoreMetrics({report_interval: msToDuration(10)});
      call.on('error', () => {});
      let seenMetric = false;
      call.on('data', (report: OrcaLoadReport__Output) => {
        if (!seenMetric) {
          assert.strictEqual(report.rps_fractional, 123);
          metricRecorder.deleteQpsMetric();
          seenMetric = true;
        } else {
          assert.strictEqual(report.rps_fractional, 0);
          done();
        }
      });
    });
    it('Should set EPS metric', done => {
      metricRecorder.setEpsMetric(123);
      call = client.streamCoreMetrics({report_interval: msToDuration(10)});
      call.on('error', () => {});
      call.on('data', (report: OrcaLoadReport__Output) => {
        assert.strictEqual(report.eps, 123);
        done();
      });
    });
    it('Should delete QPS metric', done => {
      metricRecorder.setEpsMetric(123);
      call = client.streamCoreMetrics({report_interval: msToDuration(10)});
      call.on('error', () => {});
      let seenMetric = false;
      call.on('data', (report: OrcaLoadReport__Output) => {
        if (!seenMetric) {
          assert.strictEqual(report.eps, 123);
          metricRecorder.deleteEpsMetric();
          seenMetric = true;
        } else {
          assert.strictEqual(report.eps, 0);
          done();
        }
      });
    });
  });
});
