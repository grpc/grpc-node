/*
 *
 * Copyright 2015 gRPC authors.
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

'use strict';

var assert = require('assert');
var fs = require('fs');
var path = require('path');

var grpc = require('..');

var key_data, pem_data, ca_data;

before(function() {
  var key_path = path.join(__dirname, './data/server1.key');
  var pem_path = path.join(__dirname, './data/server1.pem');
  var ca_path = path.join(__dirname, './data/ca.pem');
  key_data = fs.readFileSync(key_path);
  pem_data = fs.readFileSync(pem_path);
  ca_data = fs.readFileSync(ca_path);
});

describe('channel credentials', function() {
  describe('#createSsl', function() {
    it('works with no arguments', function() {
      var creds;
      assert.doesNotThrow(function() {
        creds = grpc.credentials.createSsl();
      });
      assert.notEqual(creds, null);
    });
    it('works with just one Buffer argument', function() {
      var creds;
      assert.doesNotThrow(function() {
        creds = grpc.credentials.createSsl(ca_data);
      });
      assert.notEqual(creds, null);
    });
    it('works with 3 Buffer arguments', function() {
      var creds;
      assert.doesNotThrow(function() {
        creds = grpc.credentials.createSsl(ca_data, key_data, pem_data);
      });
      assert.notEqual(creds, null);
    });
    it('works if the first argument is null', function() {
      var creds;
      assert.doesNotThrow(function() {
        creds = grpc.credentials.createSsl(null, key_data, pem_data);
      });
      assert.notEqual(creds, null);
    });
    it('fails if the first argument is a non-Buffer value', function() {
      assert.throws(function() {
        grpc.credentials.createSsl('test');
      }, TypeError);
    });
    it('fails if the second argument is a non-Buffer value', function() {
      assert.throws(function() {
        grpc.credentials.createSsl(null, 'test', pem_data);
      }, TypeError);
    });
    it('fails if the third argument is a non-Buffer value', function() {
      assert.throws(function() {
        grpc.credentials.createSsl(null, key_data, 'test');
      }, TypeError);
    });
    it('fails if only 1 of the last 2 arguments is provided', function() {
      assert.throws(function() {
        grpc.credentials.createSsl(null, key_data);
      });
      assert.throws(function() {
        grpc.credentials.createSsl(null, null, pem_data);
      });
    });
  });
});

describe('server credentials', function() {
  describe('#createSsl', function() {
    it('accepts a buffer and array as the first 2 arguments', function() {
      var creds;
      assert.doesNotThrow(function() {
        creds = grpc.ServerCredentials.createSsl(ca_data, []);
      });
      assert.notEqual(creds, null);
    });
    it('accepts a boolean as the third argument', function() {
      var creds;
      assert.doesNotThrow(function() {
        creds = grpc.ServerCredentials.createSsl(ca_data, [], true);
      });
      assert.notEqual(creds, null);
    });
    it('accepts an object with two buffers in the second argument', function() {
      var creds;
      assert.doesNotThrow(function() {
        creds = grpc.ServerCredentials.createSsl(null,
                                                 [{private_key: key_data,
                                                   cert_chain: pem_data}]);
      });
      assert.notEqual(creds, null);
    });
    it('accepts multiple objects in the second argument', function() {
      var creds;
      assert.doesNotThrow(function() {
        creds = grpc.ServerCredentials.createSsl(null,
                                                 [{private_key: key_data,
                                                   cert_chain: pem_data},
                                                  {private_key: key_data,
                                                   cert_chain: pem_data}]);
      });
      assert.notEqual(creds, null);
    });
    it('fails if the second argument is not an Array', function() {
      assert.throws(function() {
        grpc.ServerCredentials.createSsl(ca_data, 'test');
      }, TypeError);
    });
    it('fails if the first argument is a non-Buffer value', function() {
      assert.throws(function() {
        grpc.ServerCredentials.createSsl('test', []);
      }, TypeError);
    });
    it('fails if the third argument is a non-boolean value', function() {
      assert.throws(function() {
        grpc.ServerCredentials.createSsl(ca_data, [], 'test');
      }, TypeError);
    });
    it('fails if the array elements are not objects', function() {
      assert.throws(function() {
        grpc.ServerCredentials.createSsl(ca_data, 'test');
      }, TypeError);
    });
    it('fails if the object does not have a Buffer private_key', function() {
      assert.throws(function() {
        grpc.ServerCredentials.createSsl(null,
                                         [{private_key: 'test',
                                           cert_chain: pem_data}]);
      }, TypeError);
    });
    it('fails if the object does not have a Buffer cert_chain', function() {
      assert.throws(function() {
        grpc.ServerCredentials.createSsl(null,
                                         [{private_key: key_data,
                                           cert_chain: 'test'}]);
      }, TypeError);
    });
  });
});