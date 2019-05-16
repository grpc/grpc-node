/*
 * Copyright 2017 gRPC authors.
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

const xml2js = require('xml2js');
const fs = require('fs');
const path = require('path');
const util = require('util');
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const readDir = util.promisify(fs.readdir);

const rootDir = __dirname;

// Fake test suite log with a failure if log parsing failed
const parseFailureLog = [
  {
    $: {
      name: 'Unknown Test Suite',
      tests: '1',
      failures: '1',
    },
    testcase: [
      {
        $: {
          classname: 'Test Log Parsing',
          name: 'Test Log Parsing',
          failure: {
            $: {
              message: "Log parsing failed"
            }
          }
        }
      }
    ]
  }
];

readDir(rootDir + '/reports')
    .then((dirNames) =>
          Promise.all(dirNames.map((dirName) =>
                                   readDir(path.resolve(rootDir, 'reports', dirName))
                                   .then((fileNames) =>
                                         Promise.all(fileNames.map((name) =>
                                                                   readFile(path.resolve(rootDir, 'reports', dirName, name))
                                                                   .then((content) => {
                                                                     let parser = new xml2js.Parser();
                                                                     const parseString = util.promisify(parser.parseString.bind(parser));
                                                                     return parseString(content);
                                                                   })
                                                                  ))
                                        )
                                   .then((objects) => {
                                     let merged = objects[0];
                                     merged.testsuites.testsuite = Array.prototype.concat.apply([], objects.map((obj) => {
                                                                                                                if (obj) {
                                                                                                                  return obj.testsuites.testsuite;
                                                                                                                } else {
                                                                                                                  return parseFailureLog;
                                                                                                                }}));
                                     let builder = new xml2js.Builder();
                                     let xml = builder.buildObject(merged);
                                     let resultName = path.resolve(rootDir, 'reports', dirName, 'sponge_log.xml');
                                     console.log(`Writing ${resultName}`);
                                     return writeFile(resultName, xml);
                                   })
                                  ))
         )
    .catch((error) => {
      console.error(error);
    });
