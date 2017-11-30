#!/bin/bash
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

source ~/.nvm/nvm.sh

nvm install 8
set -ex

cd $(dirname $0)
tool_dir=$(pwd)
cd $tool_dir/../../..
base_dir=$(pwd)

export ARTIFACTS_OUT=$base_dir/artifacts

rm -rf build || true

mkdir -p "${ARTIFACTS_OUT}"

docker build -t alpine_node_artifact $base_dir/tools/docker/alpine_artifact

$tool_dir/build_artifact_node.sh

$tool_dir/build_artifact_node_arm.sh

docker run -e ARTIFACTS_OUT=/var/grpc/artifacts -v $base_dir:/var/grpc alpine_node_artifact bash -c /var/grpc/tools/run_tests/artifacts/build_artifact_node.sh --with-alpine
