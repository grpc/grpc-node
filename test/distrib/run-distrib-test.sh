#!/bin/bash
# Copyright 2022 gRPC authors.
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

set -ex

cd $(dirname $0)
base=$(pwd)

cd ../../packages/grpc-js
npm pack
cd ../grpc-js-xds
npm pack
cd ../proto-loader
npm pack

cd $base
npm install ../../packages/grpc-js/grpc-grpc-js-*.tgz
npm install ../../packages/grpc-js-xds/grpc-grpc-js-xds-*.tgz
npm install ../../packages/proto-loader/grpc-proto-loader-*.tgz

node ./distrib-test.js
