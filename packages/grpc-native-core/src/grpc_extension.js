/**
 * @license
 * Copyright 2016 gRPC authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

/**
 * @module
 * @private
 */

'use strict';

var binary = require('node-pre-gyp/lib/pre-binding');
var path = require('path');
var binding_path =
    binary.find(path.resolve(path.join(__dirname, '../package.json')));
var binding;
try {
  binding = require(binding_path);
} catch (e) {
  var fs = require('fs');
  var searchPath = path.dirname(path.dirname(binding_path));
  var searchName = path.basename(path.dirname(binding_path));
  var foundNames = fs.readdirSync(searchPath);
  if (foundNames.indexOf(searchName) === -1) {
    var message = `Failed to load gRPC binary module because it was not installed for the current system
Expected directory: ${searchName}
Found: [${foundNames.join(', ')}]
This problem can often be fixed by running "npm rebuild" on the current system
Original error: ${e.message}`;
    var error = new Error(message);
    error.code = e.code;
    throw error;
  } else {
    throw e;
  }
}

module.exports = binding;
