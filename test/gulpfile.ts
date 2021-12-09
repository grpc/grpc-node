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

/* The native library has some misbehavior in specific tests when running in
 * Node 14 and above. */
const NATIVE_SUPPORT_RANGE = '<14';

const runInstall = () => {
  return execa('npm', ['install'], {cwd: testDir, stdio: 'inherit'});
};

const runRebuild = () => execa('npm', ['rebuild', '--unsafe-perm'], {cwd: testDir, stdio: 'inherit'});

const install = gulp.series(runInstall, runRebuild);

const cleanAll = () => Promise.resolve();

const runTestsWithFixture = (server, client) => () => new Promise((resolve, reject) => {
  const fixture = `${server}_${client}`;
  gulp.src(`${apiTestDir}/*.js`)
    .pipe(mocha({
      reporter: 'mocha-jenkins-reporter',
      require: [`${testDir}/fixtures/${fixture}.js`]
    }))
    .resume() // put the stream in flowing mode
    .on('end', resolve)
    .on('error', reject);
});

const testJsClientNativeServer = runTestsWithFixture('native', 'js');
const testNativeClientJsServer = runTestsWithFixture('js', 'native');
const testJsClientJsServer = runTestsWithFixture('js', 'js');

const test = semver.satisfies(process.version, NATIVE_SUPPORT_RANGE)? gulp.series(
               testJsClientJsServer,
               testJsClientNativeServer,
               testNativeClientJsServer
              ) : testJsClientJsServer;

export {
  install,
  cleanAll,
  test
};
