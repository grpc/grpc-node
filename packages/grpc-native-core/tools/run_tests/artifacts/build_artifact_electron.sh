#!/bin/bash
# Copyright 2016 gRPC authors.
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

arch_list=( ia32 x64 )
electron_versions=( 1.0.0 1.1.0 1.2.0 1.3.0 1.4.0 1.5.0 1.6.0 1.7.0 1.8.0 2.0.0 3.0.0 3.1.0 4.1.0 5.0.0 )

umask 022

cd $(dirname $0)/../../..

rm -rf build || true

mkdir -p "${ARTIFACTS_OUT}"

npm update

for arch in ${arch_list[@]}
do
  for version in ${electron_versions[@]}
  do
    HOME=~/.electron-gyp ./node_modules/.bin/node-pre-gyp configure rebuild package --runtime=electron --target=$version --target_arch=$arch --disturl=https://atom.io/download/electron
    cp -r build/stage/* "${ARTIFACTS_OUT}"/
  done
done

rm -rf build || true
