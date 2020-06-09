#!/bin/sh
# Copyright 2020 gRPC authors.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

base=$(dirname $0)

./node_modules/.bin/proto-loader-gen-types --keepCase --longs String --enums String --defaults --oneofs --json\
 --includeDirs deps/envoy-api/ deps/udpa/ node_modules/protobufjs/ deps/googleapis/ deps/protoc-gen-validate/ \
 -O src/generated/ --grpcLib ../index envoy/service/discovery/v2/ads.proto envoy/api/v2/listener.proto envoy/api/v2/route.proto envoy/api/v2/cluster.proto envoy/api/v2/endpoint.proto