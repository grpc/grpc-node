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
import { PerRequestMetricsRecorder } from '../src/orca';
import { loadSync } from '@grpc/proto-loader';

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

let setMetrics: (metricsRecorder: PerRequestMetricsRecorder) => void = () => {};

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
});
