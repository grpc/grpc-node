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
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.4/install.sh | bash

# Load NVM
. ~/.nvm/nvm.sh

set -e
repo_root=$(dirname $0)
cd $repo_root

if [ "x$node_versions" = "x" ] ; then
  node_versions="6 7 8"
fi

# TODO(mlumish): Add electron tests

for version in ${node_versions}
do
  cd $repo_root
  # Install and setup node for the version we want.
  set +e
  nvm install $version
  nvm use $version
  set -e

  # Install dependencies and link packages together.
  npm install
  ./node_modules/.bin/gulp setup

  # Rebuild libraries and run tests.
  JUNIT_REPORT_PATH="node$version/" JUNIT_REPORT_STACK=1 ./node_modules/.bin/gulp native.test || FAILED="true"
  cd node$version
  for file in * ; do
    mv $f $(echo $f | sed 's/\(.*\)\.xml/\1_sponge_log.xml/')
  done
done

if [ "$FAILED" != "" ]
then
  exit 1
fi
