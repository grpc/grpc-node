#!/bin/bash

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
  docker build -t alpine_node_artifact $base_dir/tools/docker/alpine_artifact

  # Cross build for arm
  $tool_dir/build_artifact_node_arm.sh
  docker run -e JOBS=8 -e ARTIFACTS_OUT=/var/grpc/artifacts -v $base_dir:/var/grpc alpine_node_artifact /var/grpc/tools/run_tests/artifacts/build_artifact_node.sh --with-alpine

  # Cross build for s390x
  $tool_dir/build_artifact_node_s390x.sh
  docker run -e JOBS=8 -e ARTIFACTS_OUT=/var/grpc/artifacts -v $base_dir:/var/grpc alpine_node_artifact /var/grpc/tools/run_tests/artifacts/build_artifact_node.sh --with-alpine
fi
