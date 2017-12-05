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

// gulp-help monkeypatches tasks to have an additional description parameter
const gulp = help(_gulp);

const testDir = __dirname;
const apiTestDir = path.resolve(testDir, 'api');

gulp.task('install', 'Install test dependencies', () => {
  return execa('npm', ['install'], {cwd: testDir, stdio: 'inherit'});
});

gulp.task('clean.all', 'Delete all files created by tasks', () => {});

gulp.task('test', 'Run API-level tests', () => {
  // run mocha tests matching a glob with a pre-required fixture,
  // returning the associated gulp stream
  const apiTestGlob = `${apiTestDir}/*.js`;
  const runTestsWithFixture = (server, client) => new Promise((resolve, reject) => {
    const fixture = `${server}_${client}`;
    console.log(`Running ${apiTestGlob} with ${server} server + ${client} client`);
    gulp.src(apiTestGlob)
      .pipe(mocha({
        reporter: 'mocha-jenkins-reporter',
        require: `${testDir}/fixtures/${fixture}.js`
      }))
      .resume() // put the stream in flowing mode
      .on('end', resolve)
      .on('error', reject);
  });
  const runTestsArgPairs = [
    ['native', 'native'],
    // ['native', 'js'],
    // ['js', 'native'],
    // ['js', 'js']
  ];
  return runTestsArgPairs.reduce((previousPromise, argPair) => {
    return previousPromise.then(runTestsWithFixture.bind(null, argPair[0], argPair[1]));
  }, Promise.resolve());
});
