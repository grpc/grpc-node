import * as assert from 'assert';
import * as http2 from 'http2';
import * as path from 'path';

import * as grpc from '../src';
import { Server, ServerCredentials } from '../src';
import { ServiceClient, ServiceClientConstructor } from '../src/make-client';
import { sendUnaryData, ServerUnaryCall } from '../src/server-call';

import { loadProtoFile } from './common';
import { Response__Output } from './generated/Response';
import * as Package from '../package.json';

const { HTTP2_HEADER_USER_AGENT } = http2.constants;
const clientVersion = Package.version;

describe('Handling of user-agent in gRPC Requests', () => {
  let server: Server;
  let client: ServiceClient;
  let lastCallMetadata: grpc.Metadata; // Store the metadata from the last call

  const protoFile = path.join(__dirname, 'fixtures', 'echo_service.proto');
  const echoService = loadProtoFile(protoFile)
    .EchoService as ServiceClientConstructor;

  const serviceImplementation = {
    echo(call: ServerUnaryCall<any, any>, callback: sendUnaryData<any>) {
      lastCallMetadata = call.metadata;
      callback(null, call.request);
    },
  };

  before(done => {
    server = new Server();
    server.addService(echoService.service, serviceImplementation);

    server.bindAsync(
      'localhost:0',
      ServerCredentials.createInsecure(),
      (err, port) => {
        assert.ifError(err);
        client = new echoService(
          `localhost:${port}`,
          grpc.credentials.createInsecure()
        );
        server.start();
        done();
      }
    );
  });

  after(done => {
    client.close();
    server.tryShutdown(done);
  });

  it('should set default user-agent if not set in metadata', done => {
    const metadata = new grpc.Metadata();

    client.echo(
      { value: 'test value', value2: 3 },
      metadata,
      (err: grpc.ServiceError, response: Response__Output) => {
        if (err) {
          done(err);
        } else {
          assert.strictEqual(
            lastCallMetadata.get(HTTP2_HEADER_USER_AGENT)[0],
            `grpc-node-js/${clientVersion}`
          );
          done();
        }
      }
    );
  });

  it('should not override user-agent if set in metadata', done => {
    const metadata = new grpc.Metadata();
    metadata.set(HTTP2_HEADER_USER_AGENT, 'custom-user-agent');

    client.echo(
      { value: 'test value', value2: 3 },
      metadata,
      (err: grpc.ServiceError, response: Response) => {
        if (err) {
          done(err);
        } else {
          assert.strictEqual(
            lastCallMetadata.get(HTTP2_HEADER_USER_AGENT)[0],
            'custom-user-agent'
          );
          done();
        }
      }
    );
  });
});
