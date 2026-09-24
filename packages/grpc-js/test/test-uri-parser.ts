/*
 * Copyright 2020 gRPC authors.
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
import * as uriParser from '../src/uri-parser';
import * as resolver from '../src/resolver';

describe('URI Parser', function () {
  describe('parseUri', function () {
    const expectationList: {
      target: string;
      result: uriParser.GrpcUri | null;
    }[] = [
      {
        target: 'localhost',
        result: { scheme: undefined, authority: undefined, path: 'localhost' },
      },
      /* This looks weird, but it's OK because the resolver selection code will handle it */
      {
        target: 'localhost:80',
        result: { scheme: 'localhost', authority: undefined, path: '80' },
      },
      {
        target: 'dns:localhost',
        result: { scheme: 'dns', authority: undefined, path: 'localhost' },
      },
      {
        target: 'dns:///localhost',
        result: { scheme: 'dns', authority: '', path: 'localhost' },
      },
      {
        target: 'dns://authority/localhost',
        result: { scheme: 'dns', authority: 'authority', path: 'localhost' },
      },
      {
        target: '//authority/localhost',
        result: {
          scheme: undefined,
          authority: 'authority',
          path: 'localhost',
        },
      },
      // Regression test for https://github.com/grpc/grpc-node/issues/1359
      {
        target:
          'dns:foo-internal.aws-us-east-2.tracing.staging-edge.foo-data.net:443:443',
        result: {
          scheme: 'dns',
          authority: undefined,
          path: 'foo-internal.aws-us-east-2.tracing.staging-edge.foo-data.net:443:443',
        },
      },
    ];
    for (const { target, result } of expectationList) {
      it(target, function () {
        assert.deepStrictEqual(uriParser.parseUri(target), result);
      });
    }
  });

  describe('parseUri + mapUriDefaultScheme', function () {
    const expectationList: {
      target: string;
      result: uriParser.GrpcUri | null;
    }[] = [
      {
        target: 'localhost',
        result: { scheme: 'dns', authority: undefined, path: 'localhost' },
      },
      {
        target: 'localhost:80',
        result: { scheme: 'dns', authority: undefined, path: 'localhost:80' },
      },
      {
        target: 'dns:localhost',
        result: { scheme: 'dns', authority: undefined, path: 'localhost' },
      },
      {
        target: 'dns:///localhost',
        result: { scheme: 'dns', authority: '', path: 'localhost' },
      },
      {
        target: 'dns://authority/localhost',
        result: { scheme: 'dns', authority: 'authority', path: 'localhost' },
      },
      {
        target: 'unix:socket',
        result: { scheme: 'unix', authority: undefined, path: 'socket' },
      },
      {
        target: 'bad:path',
        result: { scheme: 'dns', authority: undefined, path: 'bad:path' },
      },
    ];
    for (const { target, result } of expectationList) {
      it(target, function () {
        assert.deepStrictEqual(
          resolver.mapUriDefaultScheme(
            uriParser.parseUri(target) ?? { path: 'null' }
          ),
          result
        );
      });
    }
  });

  describe('splitHostPort', function () {
    const expectationList: {
      path: string;
      result: uriParser.HostPort | null;
    }[] = [
      { path: 'localhost', result: { host: 'localhost' } },
      { path: 'localhost:123', result: { host: 'localhost', port: 123 } },
      { path: '12345:6789', result: { host: '12345', port: 6789 } },
      { path: '[::1]:123', result: { host: '::1', port: 123 } },
      { path: '[::1]', result: { host: '::1' } },
      { path: '[', result: null },
      { path: '[123]', result: null },
      // Regression test for https://github.com/grpc/grpc-node/issues/1359
      {
        path: 'foo-internal.aws-us-east-2.tracing.staging-edge.foo-data.net:443:443',
        result: {
          host: 'foo-internal.aws-us-east-2.tracing.staging-edge.foo-data.net:443:443',
        },
      },
    ];
    for (const { path, result } of expectationList) {
      it(path, function () {
        assert.deepStrictEqual(uriParser.splitHostPort(path), result);
      });
    }
  });

  describe('extractServiceName', function () {
    const expectationList: { methodName: string; expected: string }[] = [
      {
        methodName: '/google.spanner.v1.Spanner/ExecuteSql',
        expected: 'google.spanner.v1.Spanner',
      },
      { methodName: '/EchoService/Echo', expected: 'EchoService' },
      { methodName: '/serviceOnly', expected: 'serviceOnly' },
      { methodName: '/a/b/c', expected: 'a' },
      { methodName: 'noLeading/second/third', expected: 'second' },
      { methodName: 'noSlash', expected: '' },
      { methodName: '', expected: '' },
      { methodName: '/', expected: '' },
      { methodName: '//', expected: '' },
    ];
    for (const { methodName, expected } of expectationList) {
      it(methodName, function () {
        assert.strictEqual(uriParser.extractServiceName(methodName), expected);
      });
    }
  });

  describe('computeServiceUrl', function () {
    const expectationList: {
      host: string;
      methodName: string;
      expected: string;
    }[] = [
      {
        host: 'spanner.googleapis.com:443',
        methodName: '/google.spanner.v1.Spanner/ExecuteSql',
        expected: 'https://spanner.googleapis.com/google.spanner.v1.Spanner',
      },
      {
        host: 'localhost:50051',
        methodName: '/EchoService/Echo',
        expected: 'https://localhost/EchoService',
      },
      {
        host: '[::1]:50051',
        methodName: '/EchoService/Echo',
        expected: 'https://::1/EchoService',
      },
      {
        host: '127.0.0.1:8080',
        methodName: '/EchoService/Echo',
        expected: 'https://127.0.0.1/EchoService',
      },
      {
        host: '[',
        methodName: '/EchoService/Echo',
        expected: 'https://localhost/EchoService',
      },
    ];
    for (const { host, methodName, expected } of expectationList) {
      it(`${host} + ${methodName}`, function () {
        assert.strictEqual(
          uriParser.computeServiceUrl(host, methodName),
          expected
        );
      });
    }
  });
});
