#!/bin/bash

npm install

for dir in $(node -p "require('./repositories.json').join('\n')"); do
  if [ ! -d $dir ]; then
    git clone https://github.com/googleapis/$dir
  fi
  pushd $dir
  npm install
  popd
  node --require ./use-grpc-js.js $(npm bin)/_mocha --timeout 60000 $dir/system-test/*.js
done
