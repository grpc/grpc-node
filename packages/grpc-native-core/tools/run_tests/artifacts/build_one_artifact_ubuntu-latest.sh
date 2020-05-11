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

# Expected environment variables:
# VERSION: the node version to build for
# ARCH: the processor architecture to build for
# RUNTIME: node or electron
# LIBC: the libc to build for, glibc or musl

set -ex
cd $(dirname $0)/../../../../..
base_dir=$(pwd)

export ARTIFACTS_OUT=$base_dir/artifacts

mkdir -p $ARTIFACTS_OUT

cd $base_dir/packages/grpc-native-core

case $ARCH in
  arm|arm64|s390x)
    docker build -t artifact-image $base_dir/tools/release/cross
    ;;
  *)
    case $LIBC in
      musl)
        docker build -t artifact-image $base_dir/tools/release/alpine_artifact
        ;;
      *)
        docker build -t artifact-image $base_dir/tools/release/native
        ;;
    esac
    ;;
esac

docker run -v /var/run/docker.sock:/var/run/docker.sock -v $base_dir:$base_dir -e ARCH -e VERSION -e RUNTIME -e LIBC -e ARTIFACTS_OUT artifact-image $base_dir/packages/grpc-native-core/tools/run_tests/artifacts/build_one_artifact_in_docker.sh