/*
 * Copyright 2019 gRPC authors.
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

// Allow `any` data type for testing runtime type checking.
// tslint:disable no-any
import * as assert from 'assert';
import * as fs from 'fs';
import * as path from 'path';

import * as grpc from '../src';
import { ServerCredentials } from '../src';
import { ServiceError } from '../src/call';
import { ServiceClient, ServiceClientConstructor } from '../src/make-client';
import { Server } from '../src/server';
import { sendUnaryData, ServerUnaryCall } from '../src/server-call';

import { loadProtoFile } from './common';

const ca = fs.readFileSync(path.join(__dirname, 'fixtures', 'ca.pem'));
const key = fs.readFileSync(path.join(__dirname, 'fixtures', 'server1.key'));
const cert = fs.readFileSync(path.join(__dirname, 'fixtures', 'server1.pem'));
function noop(): void {}

describe('Server', () => {
  describe('constructor', () => {
    it('should work with no arguments', () => {
      assert.doesNotThrow(() => {
        new Server(); // tslint:disable-line:no-unused-expression
      });
    });

    it('should work with an empty object argument', () => {
      assert.doesNotThrow(() => {
        new Server({}); // tslint:disable-line:no-unused-expression
      });
    });

    it('should be an instance of Server', () => {
      const server = new Server();

      assert(server instanceof Server);
    });
  });

  describe('bindAsync', () => {
    it('binds with insecure credentials', done => {
      const server = new Server();

      server.bindAsync(
        'localhost:0',
        ServerCredentials.createInsecure(),
        (err, port) => {
          assert.ifError(err);
          assert(typeof port === 'number' && port > 0);
          server.tryShutdown(done);
        }
      );
    });

    it('binds with secure credentials', done => {
      const server = new Server();
      const creds = ServerCredentials.createSsl(
        ca,
        [{ private_key: key, cert_chain: cert }],
        true
      );

      server.bindAsync('localhost:0', creds, (err, port) => {
        assert.ifError(err);
        assert(typeof port === 'number' && port > 0);
        server.tryShutdown(done);
      });
    });

    it('throws if bind is called after the server is started', () => {
      const server = new Server();

      server.bindAsync(
        'localhost:0',
        ServerCredentials.createInsecure(),
        (err, port) => {
          assert.ifError(err);
          server.start();
          assert.throws(() => {
            server.bindAsync(
              'localhost:0',
              ServerCredentials.createInsecure(),
              noop
            );
          }, /server is already started/);
        }
      );
    });

    it('throws on invalid inputs', () => {
      const server = new Server();

      assert.throws(() => {
        server.bindAsync(null as any, ServerCredentials.createInsecure(), noop);
      }, /port must be a string/);

      assert.throws(() => {
        server.bindAsync('localhost:0', null as any, noop);
      }, /creds must be an object/);

      assert.throws(() => {
        server.bindAsync(
          'localhost:0',
          ServerCredentials.createInsecure(),
          null as any
        );
      }, /callback must be a function/);
    });
  });

  describe('tryShutdown', () => {
    it('calls back with an error if the server is not running', done => {
      const server = new Server();

      server.tryShutdown(err => {
        assert(err !== undefined && err.message === 'server is not running');
        done();
      });
    });
  });

  describe('start', () => {
    let server: Server;

    beforeEach(done => {
      server = new Server();
      server.bindAsync('localhost:0', ServerCredentials.createInsecure(), done);
    });

    afterEach(done => {
      server.tryShutdown(done);
    });

    it('starts without error', () => {
      assert.doesNotThrow(() => {
        server.start();
      });
    });

    it('throws if started twice', () => {
      server.start();
      assert.throws(() => {
        server.start();
      }, /server is already started/);
    });

    it('throws if the server is not bound', () => {
      const server = new Server();

      assert.throws(() => {
        server.start();
      }, /server must be bound in order to start/);
    });
  });

  describe('addService', () => {
    const mathProtoFile = path.join(__dirname, 'fixtures', 'math.proto');
    const mathClient = (loadProtoFile(mathProtoFile).math as any).Math;
    const mathServiceAttrs = mathClient.service;
    const dummyImpls = { div() {}, divMany() {}, fib() {}, sum() {} };
    const altDummyImpls = { Div() {}, DivMany() {}, Fib() {}, Sum() {} };

    it('succeeds with a single service', () => {
      const server = new Server();

      assert.doesNotThrow(() => {
        server.addService(mathServiceAttrs, dummyImpls);
      });
    });

    it('fails to add an empty service', () => {
      const server = new Server();

      assert.throws(() => {
        server.addService({}, dummyImpls);
      }, /Cannot add an empty service to a server/);
    });

    it('fails with conflicting method names', () => {
      const server = new Server();

      server.addService(mathServiceAttrs, dummyImpls);
      assert.throws(() => {
        server.addService(mathServiceAttrs, dummyImpls);
      }, /Method handler for .+ already provided/);
    });

    it('supports method names as originally written', () => {
      const server = new Server();

      assert.doesNotThrow(() => {
        server.addService(mathServiceAttrs, altDummyImpls);
      });
    });

    it('fails if the server has been started', done => {
      const server = new Server();

      server.bindAsync(
        'localhost:0',
        ServerCredentials.createInsecure(),
        (err, port) => {
          assert.ifError(err);
          server.start();
          assert.throws(() => {
            server.addService(mathServiceAttrs, dummyImpls);
          }, /Can't add a service to a started server\./);
          server.tryShutdown(done);
        }
      );
    });
  });

  it('throws when unimplemented methods are called', () => {
    const server = new Server();

    assert.throws(() => {
      server.addProtoService();
    }, /Not implemented. Use addService\(\) instead/);

    assert.throws(() => {
      server.forceShutdown();
    }, /Not yet implemented/);

    assert.throws(() => {
      server.addHttp2Port();
    }, /Not yet implemented/);

    assert.throws(() => {
      server.bind('localhost:0', ServerCredentials.createInsecure());
    }, /Not implemented. Use bindAsync\(\) instead/);
  });

  describe('Default handlers', () => {
    let server: Server;
    let client: ServiceClient;

    const mathProtoFile = path.join(__dirname, 'fixtures', 'math.proto');
    const mathClient = (loadProtoFile(mathProtoFile).math as any).Math;
    const mathServiceAttrs = mathClient.service;

    beforeEach(done => {
      server = new Server();
      server.addService(mathServiceAttrs, {});
      server.bindAsync(
        'localhost:0',
        ServerCredentials.createInsecure(),
        (err, port) => {
          assert.ifError(err);
          client = new mathClient(
            `localhost:${port}`,
            grpc.credentials.createInsecure()
          );
          server.start();
          done();
        }
      );
    });

    it('should respond to a unary call with UNIMPLEMENTED', done => {
      client.div(
        { divisor: 4, dividend: 3 },
        (error: ServiceError, response: any) => {
          assert(error);
          assert.strictEqual(error.code, grpc.status.UNIMPLEMENTED);
          done();
        }
      );
    });

    it('should respond to a client stream with UNIMPLEMENTED', done => {
      const call = client.sum((error: ServiceError, response: any) => {
        assert(error);
        assert.strictEqual(error.code, grpc.status.UNIMPLEMENTED);
        done();
      });

      call.end();
    });

    it('should respond to a server stream with UNIMPLEMENTED', done => {
      const call = client.fib({ limit: 5 });

      call.on('data', (value: any) => {
        assert.fail('No messages expected');
      });

      call.on('error', (err: ServiceError) => {
        assert(err);
        assert.strictEqual(err.code, grpc.status.UNIMPLEMENTED);
        done();
      });
    });

    it('should respond to a bidi call with UNIMPLEMENTED', done => {
      const call = client.divMany();

      call.on('data', (value: any) => {
        assert.fail('No messages expected');
      });

      call.on('error', (err: ServiceError) => {
        assert(err);
        assert.strictEqual(err.code, grpc.status.UNIMPLEMENTED);
        done();
      });

      call.end();
    });
  });
});

describe('Echo service', () => {
  let server: Server;
  let client: ServiceClient;

  before(done => {
    const protoFile = path.join(__dirname, 'fixtures', 'echo_service.proto');
    const echoService = loadProtoFile(protoFile)
      .EchoService as ServiceClientConstructor;

    server = new Server();
    server.addService(echoService.service, {
      echo(call: ServerUnaryCall<any, any>, callback: sendUnaryData<any>) {
        callback(null, call.request);
      },
    });

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

  it('should echo the recieved message directly', done => {
    client.echo(
      { value: 'test value', value2: 3 },
      (error: ServiceError, response: any) => {
        assert.ifError(error);
        assert.deepStrictEqual(response, { value: 'test value', value2: 3 });
        done();
      }
    );
  });
});

describe('Generic client and server', () => {
  function toString(val: any) {
    return val.toString();
  }

  function toBuffer(str: string) {
    return Buffer.from(str);
  }

  function capitalize(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  const stringServiceAttrs = {
    capitalize: {
      path: '/string/capitalize',
      requestStream: false,
      responseStream: false,
      requestSerialize: toBuffer,
      requestDeserialize: toString,
      responseSerialize: toBuffer,
      responseDeserialize: toString,
    },
  };

  describe('String client and server', () => {
    let client: ServiceClient;
    let server: Server;

    before(done => {
      server = new Server();

      server.addService(stringServiceAttrs as any, {
        capitalize(
          call: ServerUnaryCall<any, any>,
          callback: sendUnaryData<any>
        ) {
          callback(null, capitalize(call.request));
        },
      });

      server.bindAsync(
        'localhost:0',
        ServerCredentials.createInsecure(),
        (err, port) => {
          assert.ifError(err);
          server.start();
          const clientConstr = grpc.makeGenericClientConstructor(
            stringServiceAttrs as any,
            'unused_but_lets_appease_typescript_anyway'
          );
          client = new clientConstr(
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

    it('Should respond with a capitalized string', done => {
      client.capitalize('abc', (err: ServiceError, response: string) => {
        assert.ifError(err);
        assert.strictEqual(response, 'Abc');
        done();
      });
    });
  });
});
