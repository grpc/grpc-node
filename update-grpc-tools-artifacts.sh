#!/bin/bash
#
# This script is only meant to be run on a darwin-arm64 ("M" series Mac).
# It builds the grpc-tools artifact for darwin-arm64 from source and
# fills in other architectures' artifacts from Google's precompiled binaries
# site. This repo can thus be used as a complete mirror of grpc-tools
# precompiled binaries.
# This repo should be synced from upstream and this script should be re-run
# whenever there's a new version of the grpc-tools package. As of 2022-01-03,
# the most recent version was from 2021-06, so this isn't a frequent thing.
#
# This whole repo fork should be deleted once Google releases the darwin-arm64
# binaries for themselves. See https://github.com/grpc/grpc-node/issues/1880

set -x
set -e

# build the darwin-arm64 version and put it in artifacts/
brew install cmake
script_dir=$(cd -P -- "$(dirname -- "$0")" && pwd -P)
cd "${script_dir}/packages/grpc-tools"
git submodule update --init --recursive
./build_binaries.sh

cd "${script_dir}"
version=$(grep \"version\" packages/grpc-tools/package.json | grep -oG "[0-9.]*")
site=https://node-precompiled-binaries.grpc.io
for arch in darwin-x64 linux-x64 win32-x64; do
    wget -N ${site}/grpc-tools/v${version}/${arch}.tar.gz -P artifacts/grpc-tools/v${version}/
done

