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

import * as gulp from 'gulp';

import * as mocha from 'gulp-mocha';
import * as path from 'path';
import * as execa from 'execa';
import * as pify from 'pify';
import * as semver from 'semver';
import { ncp } from 'ncp';

const ncpP = pify(ncp);

Error.stackTraceLimit = Infinity;

const jsCoreDir = __dirname;
const outDir = path.resolve(jsCoreDir, 'build');

const pkgPath = path.resolve(jsCoreDir, 'package.json');
const supportedVersionRange = require(pkgPath).engines.node;
const versionNotSupported = () => {
  console.log(`Skipping grpc-js task for Node ${process.version}`);
  return () => { return Promise.resolve(); };
};
const identity = (value: any): any => value;
const checkTask = semver.satisfies(process.version, supportedVersionRange) ?
    identity : versionNotSupported;

const execNpmVerb = (verb: string, ...args: string[]) =>
  execa('npm', [verb, ...args], {cwd: jsCoreDir, stdio: 'inherit'});
const execNpmCommand = execNpmVerb.bind(null, 'run');

const install = checkTask(() => execNpmVerb('install', '--unsafe-perm'));

/**
 * Runs tslint on files in src/, with linting rules defined in tslint.json.
 */
const lint = checkTask(() => execNpmCommand('check'));

const cleanFiles = checkTask(() => execNpmCommand('clean'));

const clean = gulp.series(install, cleanFiles);

const cleanAll = gulp.parallel(clean);

/**
 * Transpiles TypeScript files in src/ to JavaScript according to the settings
 * found in tsconfig.json.
 */
const compile = checkTask(() => execNpmCommand('compile'));

const copyTestFixtures = checkTask(() => ncpP(`${jsCoreDir}/test/fixtures`, `${outDir}/test/fixtures`));

const runTests = checkTask(() => {
  return gulp.src(`${outDir}/test/**/*.js`)
    .pipe(mocha({reporter: 'mocha-jenkins-reporter',
                 require: ['ts-node/register']}));
});

const test = gulp.series(install, copyTestFixtures, runTests);

export {
  install,
  lint,
  clean,
  cleanAll,
  compile,
  test
}
