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

npm install

for dir in $(node -p "require('./repositories.json').join('\n')"); do
  pushd libs
  if [ ! -d $dir ]; then
    git clone https://github.com/googleapis/$dir
    pushd $dir
    npm install
    popd
  fi
  popd
  SMOKE_TEST_PROJECT=$GCLOUD_PROJECT node --require ./use-grpc-js.js $(npm bin)/_mocha --timeout 60000 libs/$dir/system-test/*.js
done
