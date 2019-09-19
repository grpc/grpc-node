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

const gulp = require('gulp');
const mocha = require('gulp-mocha');
const path = require('path');
const execa = require('execa');
const semver = require('semver');

Error.stackTraceLimit = Infinity;

const protojsDir = __dirname;
const outDir = path.resolve(protojsDir, 'build');

const execNpmVerb = (verb, ...args) =>
  execa('npm', [verb, ...args], {cwd: protojsDir, stdio: 'inherit'});
const execNpmCommand = execNpmVerb.bind(null, 'run');

const install = () => execNpmVerb('install', '--unsafe-perm');

/**
 * Runs tslint on files in src/, with linting rules defined in tslint.json.
 */
const lint = () => execNpmCommand('check');

const cleanFiles = () => execNpmCommand('clean');

const clean = gulp.series(install, cleanFiles);

const cleanAll = gulp.parallel(clean);

/**
 * Transpiles TypeScript files in src/ and test/ to JavaScript according to the settings
 * found in tsconfig.json.
 */
const compile = () => execNpmCommand('compile');

/**
 * Transpiles src/ and test/, and then runs all tests.
 */
const runTests = () => {
  if (semver.satisfies(process.version, ">=6")) {
    return gulp.src(`${outDir}/test/**/*.js`)
      .pipe(mocha({reporter: 'mocha-jenkins-reporter',
                    require: ['ts-node/register']}));
  } else {
    console.log(`Skipping proto-loader tests for Node ${process.version}`);
    return Promise.resolve(null);
  }
}

const test = gulp.series(install, runTests);

module.exports = {
  install,
  lint,
  clean,
  cleanAll,
  compile,
  test
};
