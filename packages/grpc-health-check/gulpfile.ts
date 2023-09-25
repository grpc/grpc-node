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

const healthCheckDir = __dirname;
const outDir = path.resolve(healthCheckDir, 'build');

const execNpmVerb = (verb: string, ...args: string[]) =>
  execa('npm', [verb, ...args], {cwd: healthCheckDir, stdio: 'inherit'});
const execNpmCommand = execNpmVerb.bind(null, 'run');

const install = () => execNpmVerb('install', '--unsafe-perm');

/**
 * Transpiles TypeScript files in src/ to JavaScript according to the settings
 * found in tsconfig.json.
 */
const compile = () => execNpmCommand('compile');

const runTests = () => {
  return gulp.src(`${outDir}/test/**/*.js`)
    .pipe(mocha({reporter: 'mocha-jenkins-reporter',
                 require: ['ts-node/register']}));
};

const test = gulp.series(install, runTests);

export {
  install,
  compile,
  test
}
