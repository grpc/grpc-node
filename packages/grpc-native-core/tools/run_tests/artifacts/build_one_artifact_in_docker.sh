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

[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

npm install -g npm
# https://github.com/mapbox/node-pre-gyp/issues/362
npm install -g node-gyp

set -ex

cd $(dirname $0)/../../../../..
base_dir=$(pwd)
cd $base_dir/packages/grpc-native-core

npm update

# $ARCH should only have one of these values if the script is being called in
# an environment with these cross compiler packages installed
case $ARCH in
  arm)
    export CC=arm-linux-gnueabihf-gcc
    export CXX=arm-linux-gnueabihf-g++
    export CXX=arm-linux-gnueabihf-g++
    ;;
  arm64)
    export CC=aarch64-linux-gnu-gcc
    export CXX=aarch64-linux-gnu-g++
    export LD=aarch64-linux-gnu-g++
    ;;
  s390x)
    export CC=s390x-linux-gnu-gcc
    export CXX=s390x-linux-gnu-g++
    export LD=s390x-linux-gnu-g++
    ;;
esac

case $RUNTIME in
  electron)
    export HOME=~/.electron-gyp
    export npm_config_disturl=https://atom.io/download/electron
    ;;
esac

./node_modules/.bin/node-pre-gyp configure rebuild package --target=$VERSION --target_arch=$ARCH --runtime=$RUNTIME --target_libc=$LIBC
cp -r build/stage/* "${ARTIFACTS_OUT}"/