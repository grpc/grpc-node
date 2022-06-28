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

var _get = require('lodash.get');
var _clone = require('lodash.clone')

var health_messages = require('./v1/health_pb');
var health_service = require('./v1/health_grpc_pb');

// https://github.com/grpc/grpc-node/blob/master/packages/grpc-js/src/constants.ts
const NOT_FOUND_STATUS_CODE = 5;

function HealthImplementation(statusMap) {
  this.statusMap = _clone(statusMap);
}

HealthImplementation.prototype.setStatus = function(service, status) {
  this.statusMap[service] = status;
};

HealthImplementation.prototype.check = function(call, callback){
  var service = call.request.getService();
  var status = _get(this.statusMap, service, null);
  if (status === null) {
    callback({ code: NOT_FOUND_STATUS_CODE });
  } else {
    var response = new health_messages.HealthCheckResponse();
    response.setStatus(status);
    callback(null, response);
  }
};

module.exports = {
  Client: health_service.HealthClient,
  messages: health_messages,
  service: health_service.HealthService,
  Implementation: HealthImplementation
};
