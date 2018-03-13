#!/bin/sh
# Copyright 2018 gRPC authors.
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
cd $(dirname $0)/../..
base_dir=$(pwd)

# Install gRPC and its submodules.
git submodule update --init
git submodule foreach --recursive git submodule update --init

pip install mako
./packages/grpc-native-core/tools/buildgen/generate_projects.sh

OS=`uname`

case $OS in
Linux)
    sudo apt-get update
    sudo apt-get install -y linux-libc-dev:i386 g++-aarch64-linux-gnu g++-arm-linux-gnueabihf
    ./packages/grpc-native-core/tools/run_tests/artifacts/build_all_linux_artifacts.sh
    mv packages/grpc-native-core/artifacts .
    ;;
Darwin)
    ARTIFACTS_OUT=$base_dir/artifacts ./packages/grpc-native-core/tools/run_tests/artifacts/build_artifact_node.sh
    ;;
esac
