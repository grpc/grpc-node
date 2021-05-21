#!/bin/bash
# Copyright 2021 The gRPC Authors
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
cd $(dirname $0)/..

test/aarch64/prepare_qemu.sh

# better update submodules here. We could update the submodule when running
# under an emulator as well, but it comes with performance penalty.
git submodule update --init --recursive

if [[ -t 0 ]]; then
  DOCKER_TTY_ARGS="-it"
else
  # The input device on kokoro is not a TTY, so -it does not work.
  DOCKER_TTY_ARGS=
fi

# the test command to run under an emulated aarch64 docker container.
# we only run tests for a single version of node, since tests under an emulator are significantly slower.
TEST_NODE_COMMAND="node_versions='12' ./run-tests.sh"

# use an actual aarch64 docker image (with a real aarch64 node) to run build & test grpc-js under an emulator
# * mount the protobuf root as /work to be able to access the crosscompiled files
# * to avoid running the process inside docker as root (which can pollute the workspace with files owned by root), we force
#   running under current user's UID and GID. To be able to do that, we need to provide a home directory for the user
#   otherwise the UID would be homeless under the docker container (which can lead to various issues). For simplicity,
#   we just run map the user's home to a throwaway temporary directory.
# TODO(jtattermusch): we're using arm64v8/node:12-stretch instead of arm64v8/node:12-buster because the buster-based image
# has a newer version of ssl that considers some of the ssl keys used for testing too short, making the tests
# fails with "error:140AB18F:SSL routines:SSL_CTX_use_certificate:ee key too small".
# See https://github.com/grpc/grpc-node/issues/1795
docker run $DOCKER_TTY_ARGS --rm --user "$(id -u):$(id -g)" -e "HOME=/home/fake-user" -v "$(mktemp -d):/home/fake-user" -v "$(pwd)":/work -w /work arm64v8/node:12-stretch bash -c "$TEST_NODE_COMMAND"
