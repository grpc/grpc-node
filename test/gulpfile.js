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

const _gulp = require('gulp');
const help = require('gulp-help');
const mocha = require('gulp-mocha');
const execa = require('execa');
const path = require('path');
const del = require('del');
const linkSync = require('../util').linkSync;
const merge = require('merge2');

// gulp-help monkeypatches tasks to have an additional description parameter
const gulp = help(_gulp);

const testDir = __dirname;
const apiTestDir = path.resolve(testDir, 'api');

gulp.task('internal.test.clean.links', 'Delete npm links', () => {
  return del([
    path.resolve(testDir, 'node_modules/@grpc/js'),
    path.resolve(testDir, 'node_modules/@grpc/native')
  ]);
});

gulp.task('internal.test.install', 'Install test dependencies', () => {
  return execa('npm', ['install'], {cwd: testDir, stdio: 'inherit'});
});

gulp.task('internal.test.clean.all', 'Delete all files created by tasks',
	  ['internal.test.clean.links']);

gulp.task('internal.test.link.add', 'Link local copies of dependencies', () => {
  linkSync(testDir, './node_modules/@grpc/js', '../packages/grpc-js');
  linkSync(testDir, './node_modules/grpc', '../packages/grpc-native-core');
});

gulp.task('internal.test.test', 'Run API-level tests', () => {
  // run mocha tests matching a glob with a pre-required fixture,
  // returning the associated gulp stream
  const runTestsWithFixture = (glob, fixture) => gulp
    .src(glob)
    .pipe(mocha({
      reporter: 'mocha-jenkins-reporter',
      require: `${testDir}/fixtures/${fixture}.js`
    }));
  const interopTest = `${testDir}/interop/interop_test.js`;
  const tasks = [].concat(
    ['native_native'/*, 'js_js'*/]
      .map((fixture) => runTestsWithFixture(`${apiTestDir}/*.js`, fixture)),
    ['native_native', 'native_js'/*, 'js_native', 'js_js'*/]
      .map((fixture) => runTestsWithFixture(interopTest, fixture)))
  return merge(tasks);
});
