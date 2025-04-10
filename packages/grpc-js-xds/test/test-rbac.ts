/*
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

import { Metadata } from '@grpc/grpc-js';
import * as rbac from '../src/rbac';
import * as assert from 'assert';
import { ExactValueMatcher, HeaderMatcher } from '../src/matcher';

interface TestCase {
  rule: rbac.RbacRule<any>,
  input: any,
  expectedResult: boolean
}

function createMetadata(key: string, value: string): Metadata {
  const metadata = new Metadata();
  metadata.set(key, value);
  return metadata;
}

const testCases: TestCase[] = [
  {
    rule: new rbac.AnyRule(),
    input: {},
    expectedResult: true
  },
  {
    rule: new rbac.NoneRule(),
    input: {},
    expectedResult: false
  },
  {
    rule: new rbac.OrRules([new rbac.NoneRule(), new rbac.NoneRule(), new rbac.NoneRule()]),
    input: {},
    expectedResult: false
  },
  {
    rule: new rbac.OrRules([new rbac.NoneRule(), new rbac.NoneRule(), new rbac.AnyRule()]),
    input: {},
    expectedResult: true
  },
  {
    rule: new rbac.AndRules([new rbac.AnyRule(), new rbac.AnyRule(), new rbac.AnyRule()]),
    input: {},
    expectedResult: true
  },
  {
    rule: new rbac.AndRules([new rbac.AnyRule(), new rbac.AnyRule(), new rbac.NoneRule()]),
    input: {},
    expectedResult: false
  },
  {
    rule: new rbac.NotRule(new rbac.NoneRule()),
    input: {},
    expectedResult: true
  },
  {
    rule: new rbac.NotRule(new rbac.AnyRule()),
    input: {},
    expectedResult: false
  },
  {
    rule: new rbac.DestinationIpPermission({addressPrefix: '127.0.0.0', prefixLen: 8}),
    input: {
      headers: new Metadata(),
      urlPath: '/',
      destinationIp: '127.0.0.1',
      destinationPort: 443
    },
    expectedResult: true
  },
  {
    rule: new rbac.DestinationIpPermission({addressPrefix: '127.0.0.0', prefixLen: 8}),
    input: {
      headers: new Metadata(),
      urlPath: '/',
      destinationIp: '10.0.0.1',
      destinationPort: 443
    },
    expectedResult: false
  },
  {
    rule: new rbac.DestinationPortPermission(443),
    input: {
      headers: new Metadata(),
      urlPath: '/',
      destinationIp: '127.0.0.1',
      destinationPort: 443
    },
    expectedResult: true
  },
  {
    rule: new rbac.DestinationPortPermission(443),
    input: {
      headers: new Metadata(),
      urlPath: '/',
      destinationIp: '127.0.0.1',
      destinationPort: 80
    },
    expectedResult: false
  },
  {
    rule: new rbac.UrlPathPermission(new ExactValueMatcher('/', false)),
    input: {
      headers: new Metadata(),
      urlPath: '/',
      destinationIp: '127.0.0.1',
      destinationPort: 443
    },
    expectedResult: true
  },
  {
    rule: new rbac.UrlPathPermission(new ExactValueMatcher('/', false)),
    input: {
      headers: new Metadata(),
      urlPath: '/service/method',
      destinationIp: '127.0.0.1',
      destinationPort: 443
    },
    expectedResult: false
  },
  {
    rule: new rbac.HeaderPermission(new HeaderMatcher('test', new ExactValueMatcher('value', false), false)),
    input: {
      headers: createMetadata('test', 'value'),
      urlPath: '/',
      destinationIp: '127.0.0.1',
      destinationPort: 443
    },
    expectedResult: true
  },
  {
    rule: new rbac.HeaderPermission(new HeaderMatcher('test', new ExactValueMatcher('value', false), false)),
    input: {
      headers: createMetadata('test', 'incorrect'),
      urlPath: '/',
      destinationIp: '127.0.0.1',
      destinationPort: 443
    },
    expectedResult: false
  },
  {
    rule: new rbac.MetadataPermission(),
    input: {
      headers: new Metadata(),
      urlPath: '/',
      destinationIp: '127.0.0.1',
      destinationPort: 443
    },
    expectedResult: false
  },
  {
    rule: new rbac.RequestedServerNamePermission(new ExactValueMatcher('', false)),
    input: {
      headers: new Metadata(),
      urlPath: '/',
      destinationIp: '127.0.0.1',
      destinationPort: 443
    },
    expectedResult: true
  },
  {
    rule: new rbac.RequestedServerNamePermission(new ExactValueMatcher('test', false)),
    input: {
      headers: new Metadata(),
      urlPath: '/',
      destinationIp: '127.0.0.1',
      destinationPort: 443
    },
    expectedResult: false
  },
  {
    rule: new rbac.AuthenticatedPrincipal(null),
    input: {
      tls: true,
      peerCertificate: null,
      sourceIp: '127.0.0.1',
      headers: new Metadata(),
      urlPath: '/'
    },
    expectedResult: true
  },
  {
    rule: new rbac.AuthenticatedPrincipal(null),
    input: {
      tls: false,
      peerCertificate: null,
      sourceIp: '127.0.0.1',
      headers: new Metadata(),
      urlPath: '/'
    },
    expectedResult: false
  },
  {
    rule: new rbac.AuthenticatedPrincipal(new ExactValueMatcher('test', false)),
    input: {
      tls: true,
      peerCertificate: {
        subject: {
          C: '',
          ST: '',
          L: '',
          O: '',
          OU: '',
          CN: ''
        },
        subjectaltname: 'URI:test'
      },
      sourceIp: '127.0.0.1',
      headers: new Metadata(),
      urlPath: '/'
    },
    expectedResult: true
  },
  {
    rule: new rbac.AuthenticatedPrincipal(new ExactValueMatcher('test', false)),
    input: {
      tls: true,
      peerCertificate: {
        subject: {
          C: '',
          ST: '',
          L: '',
          O: '',
          OU: '',
          CN: ''
        },
        subjectaltname: 'DNS:test'
      },
      sourceIp: '127.0.0.1',
      headers: new Metadata(),
      urlPath: '/'
    },
    expectedResult: true
  },
  {
    rule: new rbac.AuthenticatedPrincipal(new ExactValueMatcher('test', false)),
    input: {
      tls: true,
      peerCertificate: {
        subject: {
          C: '',
          ST: '',
          L: '',
          O: '',
          OU: '',
          CN: ''
        },
        subjectaltname: 'URI:incorrect, DNS:test'
      },
      sourceIp: '127.0.0.1',
      headers: new Metadata(),
      urlPath: '/'
    },
    expectedResult: false
  },
  {
    rule: new rbac.AuthenticatedPrincipal(new ExactValueMatcher('test', false)),
    input: {
      tls: true,
      peerCertificate: {
        subject: {
          C: '',
          ST: '',
          L: '',
          O: '',
          OU: '',
          CN: 'test'
        },
      },
      sourceIp: '127.0.0.1',
      headers: new Metadata(),
      urlPath: '/'
    },
    expectedResult: true
  },
  {
    rule: new rbac.SourceIpPrincipal({addressPrefix: '127.0.0.0', prefixLen: 8}),
    input: {
      tls: true,
      peerCertificate: null,
      sourceIp: '127.0.0.1',
      headers: new Metadata(),
      urlPath: '/'
    },
    expectedResult: true
  },
  {
    rule: new rbac.SourceIpPrincipal({addressPrefix: '127.0.0.0', prefixLen: 8}),
    input: {
      tls: true,
      peerCertificate: null,
      sourceIp: '10.0.0.1',
      headers: new Metadata(),
      urlPath: '/'
    },
    expectedResult: false
  },
  {
    rule: new rbac.HeaderPrincipal(new HeaderMatcher('test', new ExactValueMatcher('value', false), false)),
    input: {
      tls: true,
      peerCertificate: null,
      sourceIp: '127.0.0.1',
      headers: createMetadata('test', 'value'),
      urlPath: '/'
    },
    expectedResult: true
  },
  {
    rule: new rbac.HeaderPrincipal(new HeaderMatcher('test', new ExactValueMatcher('value', false), false)),
    input: {
      tls: true,
      peerCertificate: null,
      sourceIp: '127.0.0.1',
      headers: createMetadata('test', 'incorrect'),
      urlPath: '/'
    },
    expectedResult: false
  },
  {
    rule: new rbac.UrlPathPrincipal(new ExactValueMatcher('/', false)),
    input: {
      tls: true,
      peerCertificate: null,
      sourceIp: '127.0.0.1',
      headers: new Metadata(),
      urlPath: '/'
    },
    expectedResult: true
  },
  {
    rule: new rbac.UrlPathPrincipal(new ExactValueMatcher('/', false)),
    input: {
      tls: true,
      peerCertificate: null,
      sourceIp: '127.0.0.1',
      headers: new Metadata(),
      urlPath: '/service/method'
    },
    expectedResult: false
  },
  {
    rule: new rbac.MetadataPrincipal(),
    input: {
      tls: true,
      peerCertificate: null,
      sourceIp: '127.0.0.1',
      headers: new Metadata(),
      urlPath: '/'
    },
    expectedResult: false
  },
];

describe('RBAC engine', () => {
  for (const testCase of testCases) {
    it(`rule=${testCase.rule.toString()} input=${JSON.stringify(testCase.input)} result=${testCase.expectedResult}`, () => {
      assert.strictEqual(testCase.rule.apply(testCase.input), testCase.expectedResult);
    });
  }
});
