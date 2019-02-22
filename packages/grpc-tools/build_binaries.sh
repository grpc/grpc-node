#!/bin/bash

set -e

uname -a

cd $(dirname $0)
base=$(pwd)
protobuf_base=$base/deps/protobuf

tools_version=$(jq '.version' < package.json | tr -d '"')

# Note: $ARTIFACTS_OUT should not be in this directory
out_dir=$ARTIFACTS_OUT/grpc-tools/v$tools_version
mkdir -p "$out_dir"

case $(uname -s) in
  Linux)
    platform=linux
    arch_list=( ia32 x64 )
    ;;
  Darwin)
    platform=darwin
    arch_list=( x64 )
    ;;
esac

for arch in "${arch_list[@]}"; do
  case $arch in
    ia32)
      toolchain_flag=-DCMAKE_TOOLCHAIN_FILE=linux_32bit.toolchain.cmake
      ;;
    *)
      toolchain_flag=-DCMAKE_TOOLCHAIN_FILE=linux_64bit.toolchain.cmake
      ;;
  esac
  rm -f $base/build/bin/protoc
  rm -f $base/build/bin/grpc_node_plugin
  rm -f $base/CMakeCache.txt
  rm -rf $base/CMakeFiles
  rm -f $protobuf_base/CMakeCache.txt
  rm -rf $protobuf_base/CMakeFiles
  cmake $toolchain_flag . && cmake --build . --target clean && cmake --build . -- -j 12
  mkdir -p "$base/build/bin"
  cp -L $protobuf_base/protoc $base/build/bin/protoc
  cp $base/grpc_node_plugin $base/build/bin/
  file $base/build/bin/*
  cd $base/build
  tar -czf "$out_dir/$platform-$arch.tar.gz" bin/
  cd $base
done