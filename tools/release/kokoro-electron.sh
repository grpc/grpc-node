#!/bin/bash
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

# Deleting Ruby.
rm -rf ~/.rvm

ln -sf /bin/bash /bin/sh

curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

nvm install 10
nvm use 10
npm install -g npm
# https://github.com/mapbox/node-pre-gyp/issues/362
npm install -g node-gyp@3

set -ex
cd $(dirname $0)/../..
base_dir=$(pwd)

# Install gRPC and its submodules.
git submodule update --init --recursive

pip install mako
./packages/grpc-native-core/tools/buildgen/generate_projects.sh

OS=`uname`

case $OS in
Linux)
    docker build -t kokoro-native-image tools/release/native
    docker run -v /var/run/docker.sock:/var/run/docker.sock -v $base_dir:$base_dir kokoro-native-image $base_dir/packages/grpc-native-core/tools/run_tests/artifacts/build_all_linux_artifacts.sh --native-only --electron-only
    cp -rv packages/grpc-native-core/artifacts .
    ;;
Darwin)
    JOBS=8 ARTIFACTS_OUT=$base_dir/artifacts ./packages/grpc-native-core/tools/run_tests/artifacts/build_artifact_electron.sh
    ;;
esac
