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
cd $(dirname $0)

git submodule update --init
git submodule foreach --recursive git submodule update --init

node_versions="6 7 8"

# TODO(mlumish): Add electron tests

# Install dependencies and link packages together
npm install
./node_modules/.bin/gulp setup

for version in ${node_versions}
do
  nvm install $version
  # Rebuild libraries and run tests
  ./node_modules/.bin/gulp native.test || FAILED="true"
done

if [ "$FAILED" != "" ]
then
  exit 1
fi
