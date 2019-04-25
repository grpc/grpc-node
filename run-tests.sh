#!/bin/sh
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

# Install NVM
ROOT=`pwd`
cd ~
export NVM_DIR=`pwd`/.nvm
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.4/install.sh | bash

# Load NVM
. $NVM_DIR/nvm.sh

set -ex
cd $ROOT

if [ ! -n "$node_versions" ] ; then
  node_versions="6 7 8 9 10 11 12"
fi

set +ex
nvm install 8
nvm install lts/*
nvm use lts/*
set -ex

npm_config_fetch_retries=5

npm install --unsafe-perm

mkdir -p reports
export JOBS=8
export JUNIT_REPORT_STACK=1

OS=$(uname)

# TODO(mlumish): Add electron tests

FAILED="false"

for version in ${node_versions}
do
  # Install and setup node for the version we want.
  set +ex
  echo "Switching to node version $version"
  nvm install $version
  nvm use $version
  set -ex

  export JUNIT_REPORT_PATH="reports/node$version/"

  # https://github.com/mapbox/node-pre-gyp/issues/362
  npm install -g node-gyp

  mkdir -p "reports/node$version"

  node -e 'process.exit(process.version.startsWith("v'$version'") ? 0 : -1)'

  # Install dependencies and link packages together.
  ./node_modules/.bin/gulp cleanAll
  ./node_modules/.bin/gulp setup

  # npm test calls nyc gulp test
  npm test || FAILED="true"
done

set +ex
nvm use 8
set -ex

node merge_kokoro_logs.js

if [ "$FAILED" = "true" ]
then
  exit 1
else
  if [ "$OS" = "Linux" ]
  then
    # If we can't download the token file, just skip reporting coverage
    gsutil cp gs://grpc-testing-secrets/coveralls_credentials/grpc-node.rc /tmp || exit 0
    set +x
    . /tmp/grpc-node.rc
    set -x
    export COVERALLS_REPO_TOKEN
    export COVERALLS_SERVICE_NAME=Kokoro
    export COVERALLS_SERVICE_JOB_ID=$KOKORO_BUILD_ID
    npm run coverage
  fi
fi
