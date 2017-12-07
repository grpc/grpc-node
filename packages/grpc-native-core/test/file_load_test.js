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
var grpc = require('..');

describe('File loader', function() {
  it('Should load a proto file by default', function() {
    assert.doesNotThrow(function() {
      grpc.load(__dirname + '/test_service.proto');
    });
  });
  it('Should load a proto file with the proto format', function() {
    assert.doesNotThrow(function() {
      grpc.load(__dirname + '/test_service.proto', 'proto');
    });
  });
  it('Should load a json file with the json format', function() {
    assert.doesNotThrow(function() {
      grpc.load(__dirname + '/test_service.json', 'json');
    });
  });
});
