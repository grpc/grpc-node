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

[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
nvm install 10
nvm use 10
npm install -g npm
# https://github.com/mapbox/node-pre-gyp/issues/362
npm install -g node-gyp

DO_NATIVE=true
DO_CROSS=true
DO_ELECTRON=true
DO_NODEJS=true

while [ $# -gt 0 ] ; do
  case $1 in
    --native-only)
      DO_CROSS=false
      ;;
    --cross-only)
      DO_NATIVE=false
      DO_ELECTRON=false
      ;;
    --electron-only)
      DO_NODEJS=false
      DO_CROSS=false
      ;;
    --nodejs-only)
      DO_ELECTRON=false
      ;;
  esac
  shift
done

set -ex

cd $(dirname $0)
tool_dir=$(pwd)
cd $tool_dir/../../..
base_dir=$(pwd)

export ARTIFACTS_OUT=$base_dir/artifacts
export JOBS=8

rm -rf build || true

mkdir -p "${ARTIFACTS_OUT}"

if [ "$DO_NATIVE" = "true" ] ; then
  if [ "$DO_ELECTRON" = "true" ] ; then
    $tool_dir/build_artifact_electron.sh
  fi
  if [ "$DO_NODEJS" = "true" ] ; then
    $tool_dir/build_artifact_node.sh
  fi
fi

if [ "$DO_CROSS" = "true" ] ; then
  $tool_dir/build_artifact_node_arm.sh

  docker build -t alpine_node_artifact $base_dir/tools/docker/alpine_artifact
  docker run -e JOBS=8 -e ARTIFACTS_OUT=/var/grpc/artifacts -v $base_dir:/var/grpc alpine_node_artifact /var/grpc/tools/run_tests/artifacts/build_artifact_node.sh --with-alpine
fi
