#!/bin/bash

set -ex

# https://github.com/mapbox/node-pre-gyp/issues/362
npm install -g node-gyp

cd $(dirname $0)/../../..

rm -rf build || true

mkdir -p "${ARTIFACTS_OUT}"

npm update

node_versions=( 4.0.0 5.0.0 6.0.0 7.0.0 8.0.0 9.0.0 10.0.0 11.0.0 12.0.0 13.0.0 )

for version in ${node_versions[@]}
do
  # Cross compile for s390x on x64
  # Requires debian or ubuntu packages "g++-s390x-linux-gnu".
  CC=s390x-linux-gnu-gcc CXX=s390x-linux-gnu-g++ LD=s390x-linux-gnu-g++ ./node_modules/.bin/node-pre-gyp configure rebuild package testpackage --target=$version --target_arch=s390x
  cp -r build/stage/* "${ARTIFACTS_OUT}"/
done
