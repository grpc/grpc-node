#!/bin/bash

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
