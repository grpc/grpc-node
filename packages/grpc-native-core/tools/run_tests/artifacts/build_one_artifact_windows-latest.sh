#!/bin/bash
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

npm install -g npm
# https://github.com/mapbox/node-pre-gyp/issues/362
npm install -g node-gyp

set -ex

cd $(dirname $0)/../../../../..
base_dir=$(pwd)

cd $base_dir/packages/grpc-native-core

export JOBS=8
export ARTIFACTS_OUT=$base_dir/artifacts

mkdir -p ${ARTIFACTS_OUT}

rm -rf build || true

npm update

case $RUNTIME in
  electron)
    export HOME=~/.electron-gyp
    export npm_config_disturl=https://atom.io/download/electron
    ;;
  node)
esac

./node_modules/.bin/node-pre-gyp configure rebuild package --target=$VERSION --target_arch=$ARCH --runtime=$RUNTIME && exit 0 || true
# Try again after removing openssl headers
rm -rf ~/.node-gyp/$VERSION/include/node/openssl
rm -rf ~/.node-gyp/iojs-$VERSION/include/node/openssl
./node_modules/.bin/node-pre-gyp configure rebuild package --target=$VERSION --target_arch=$ARCH --runtime=$RUNTIME