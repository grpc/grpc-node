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

if [ -z $NODE_H2 ]; then
  echo "\$NODE_H2 must point to a node binary"
  exit 1
fi
if [ -z $NVM_DIR ]; then
  echo "nvm must be installed"
  exit 1
fi

NVM_H2_DIR=$NVM_DIR/versions/node/v9.0.0-pre
cp -r $NVM_DIR/versions/node/v8.2.1 $NVM_H2_DIR
rm -r $NVM_H2_DIR/bin
mkdir $NVM_H2_DIR/bin
echo $NODE_H2 '--expose-http2 "$@"' > $NVM_H2_DIR/bin/node
ln -s $NVM_H2_DIR/lib/node_modules/npm/bin/npm-cli.js $NVM_H2_DIR/bin/npm
ln -s $NVM_H2_DIR/lib/node_modules/npm/bin/npx-cli.js $NVM_H2_DIR/bin/npx
chmod +x $NVM_H2_DIR/bin/node

[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
nvm use v9.0.0-pre 2>/dev/null
nvm use --delete-prefix v9.0.0-pre
