'use strict';

const path = require('path');
const fs = require('fs');

const sourceDir = path.join(__dirname, 'deps/protobuf/src/google/protobuf');
const destDir = path.join(__dirname, 'bin/google/protobuf');

fs.mkdirSync(path.join(destDir, 'compiler'), {recursive: true});

const wellKnownProtos=['any', 'api', 'compiler/plugin', 'descriptor', 'duration', 'empty',
                       'field_mask', 'source_context', 'struct', 'timestamp', 'type', 'wrappers'];
for (const proto of wellKnownProtos) {
  fs.copyFileSync(path.join(sourceDir, proto + '.proto'), path.join(destDir, proto + '.proto'));
}