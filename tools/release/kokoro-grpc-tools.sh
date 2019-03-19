#!/bin/bash
# Copyright 2019 gRPC authors.
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

set -e
cd $(dirname $0)/../..
base_dir=$(pwd)

OS=$(uname)

git submodule update --init --recursive

uname -a

case $OS in
Linux)
  docker build -t kokoro-native-image tools/release/native
  docker run -v /var/run/docker.sock:/var/run/docker.sock -v $base_dir:$base_dir -e ARTIFACTS_OUT=$base_dir/artifacts kokoro-native-image $base_dir/packages/grpc-tools/build_binaries.sh
  ;;
Darwin)
  ARTIFACTS_OUT=$base_dir/artifacts ./packages/grpc-tools/build_binaries.sh
  ;;
esac