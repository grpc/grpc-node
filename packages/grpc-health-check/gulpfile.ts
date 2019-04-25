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
import {linkSync} from '../../util';

const healthCheckDir = __dirname;
const baseDir = path.resolve(healthCheckDir, '..', '..');
const testDir = path.resolve(healthCheckDir, 'test');

const cleanLinks = () => del(path.resolve(healthCheckDir, 'node_modules/grpc'));

const cleanAll = gulp.parallel(cleanLinks);

const runInstall = () => execa('npm', ['install', '--unsafe-perm'], {cwd: healthCheckDir, stdio: 'inherit'});

const install = gulp.series(cleanLinks, runInstall);

const linkAdd = (callback) => {
  linkSync(healthCheckDir, './node_modules/grpc', '../grpc-native-core');
  callback();
}

const test = () => gulp.src(`${testDir}/*.js`).pipe(mocha({reporter: 'mocha-jenkins-reporter'}));

export {
  cleanLinks,
  cleanAll,
  install,
  linkAdd,
  test
}