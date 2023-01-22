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

uname -a

cd "$(dirname "$0")"
base=$(pwd)
protobuf_base=$base/deps/protobuf

tools_version=$(jq '.version' <package.json | tr -d '"')

# Note: artifacts should not be output in the package directory
out_dir=$base/../../artifacts/grpc-tools/v$tools_version
mkdir -p "$out_dir"

build() {
  cmake_flag=$*

  rm -rf "$base/build/bin"
  rm -f "$base/CMakeCache.txt"
  rm -rf "$base/CMakeFiles"
  rm -f "$protobuf_base/CMakeCache.txt"
  rm -rf "$protobuf_base/CMakeFiles"

  cmake -DCMAKE_TOOLCHAIN_FILE=linux.toolchain.cmake $cmake_flag . && cmake --build . --target clean && cmake --build . -- -j 12

  mkdir -p "$base/build/bin"

  cp -L "$protobuf_base/protoc" "$base/build/bin/protoc"
  cp "$base/grpc_node_plugin" "$base/build/bin/"

  file "$base/build/bin"/*
}

artifacts() {
  platform=$1
  arch=$2
  dir=$3
  case $(uname -s) in
  Linux)
    tar -czf "$out_dir/$platform-$arch.tar.gz" -C "$(dirname "$dir")" "$(basename "$dir")"
    ;;
  Darwin)
    tar --format=gnutar -czf "$out_dir/$platform-$arch.tar.gz" -C "$(dirname "$dir")" "$(basename "$dir")"
    ;;
  esac
}

case $(uname -s) in
Linux)
  build -DGRPC_TOOLS_TARGET=i686
  artifacts linux ia32 "$base/build/bin"
  build -DGRPC_TOOLS_TARGET=x86_64
  artifacts linux x64 "$base/build/bin"
  build -DGRPC_TOOLS_TARGET=aarch64
  artifacts linux arm64 "$base/build/bin"
  ;;
Darwin)
  build -DGRPC_TOOLS_TARGET=x86_64 -DCMAKE_OSX_ARCHITECTURES="arm64;x86_64"

  for arch in "x64" "arm64"; do
    mkdir "$base/build/bin/$arch"
    for bin in protoc grpc_node_plugin; do
      lipo -extract x86_64 "$base/build/bin/$bin" -o "$base/build/bin/$arch/$bin"
      otool -l "$base/build/bin/$arch/$bin" | grep minos
    done
    artifacts darwin $arch "$base/build/bin/$arch/"
  done
  ;;
esac
