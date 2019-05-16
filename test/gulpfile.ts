/*
 * Copyright 2019 gRPC authors.
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

import * as gulp from 'gulp';
import * as mocha from 'gulp-mocha';
import * as execa from 'execa';
import * as path from 'path';
import * as del from 'del';
import * as semver from 'semver';

const testDir = __dirname;
const apiTestDir = path.resolve(testDir, 'api');

const install = () => {
  return execa('npm', ['install'], {cwd: testDir, stdio: 'inherit'});
};

const cleanAll = () => Promise.resolve();

const test = () => {
  // run mocha tests matching a glob with a pre-required fixture,
  // returning the associated gulp stream
  if (!semver.satisfies(process.version, '>=10.10.0')) {
    console.log(`Skipping cross-implementation tests for Node ${process.version}`);
    return Promise.resolve();
  }
  const apiTestGlob = `${apiTestDir}/*.js`;
  const runTestsWithFixture = (server, client) => new Promise((resolve, reject) => {
    const fixture = `${server}_${client}`;
    console.log(`Running ${apiTestGlob} with ${server} server + ${client} client`);
    gulp.src(apiTestGlob)
      .pipe(mocha({
        reporter: 'mocha-jenkins-reporter',
        require: [`${testDir}/fixtures/${fixture}.js`]
      }))
      .resume() // put the stream in flowing mode
      .on('end', resolve)
      .on('error', reject);
  });
  var runTestsArgPairs;
  if (semver.satisfies(process.version, '^8.13.0 || >=10.10.0')) {
    runTestsArgPairs = [
      ['native', 'native'],
      ['native', 'js'],
      // ['js', 'native'],
      // ['js', 'js']
    ];
  } else {
    runTestsArgPairs = [
      ['native', 'native']
    ];
  }
  return runTestsArgPairs.reduce((previousPromise, argPair) => {
    return previousPromise.then(runTestsWithFixture.bind(null, argPair[0], argPair[1]));
  }, Promise.resolve());
};

export {
  install,
  cleanAll,
  test
};