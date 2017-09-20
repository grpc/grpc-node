#!/bin/sh
# Copyright 2017 gRPC authors.
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
#
# This script updates the gRPC submodule to a given reference and run tests

# cd to gRPC-node root directory
cd $(dirname $0)

cd packages/grpc-native-core/deps/grpc/

# PR references are needed to test PRs from grpc/grpc
git fetch --tags --progress https://github.com/grpc/grpc.git +refs/pull/*:refs/remotes/origin/pr/*
git checkout $@
git submodule update --init
cd ../../../..

packages/grpc-native-core/tools/buildgen/generate_projects.sh

./run-tests.sh
