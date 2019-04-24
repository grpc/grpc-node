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
 import * as jsdoc from 'gulp-jsdoc3';
 import * as jshint from 'gulp-jshint';
 import * as mocha from 'gulp-mocha';
 import * as execa from 'execa';
 import * as path from 'path';
 import * as del from 'del';

const nativeCoreDir = __dirname;
const srcDir = path.resolve(nativeCoreDir, 'src');
const testDir = path.resolve(nativeCoreDir, 'test');

const pkg = require('./package');
const jshintConfig = pkg.jshintConfig;

const clean = () => del([path.resolve(nativeCoreDir, 'build'),
	                       path.resolve(nativeCoreDir, 'ext/node')]);

const cleanAll = gulp.parallel(clean);

const install = () => {
  return execa('npm', ['install', '--build-from-source', '--unsafe-perm'],
               {cwd: nativeCoreDir, stdio: 'inherit'});
};

const installWindows = () => {
  return execa('npm', ['install', '--build-from-source'],
               {cwd: nativeCoreDir, stdio: 'inherit'}).catch(() => 
del(path.resolve(process.env.USERPROFILE, '.node-gyp', process.versions.node, 'include/node/openssl'), { force: true }).then(() =>
execa('npm', ['install', '--build-from-source'],
               {cwd: nativeCoreDir, stdio: 'inherit'})
               ));
};

const lint = () => {
  return gulp.src([`${nativeCoreDir}/index.js`, `${srcDir}/*.js`, `${testDir}/*.js`])
      .pipe(jshint(pkg.jshintConfig))
      .pipe(jshint.reporter('default'));
};

const build = () => {
  return execa('npm', ['run', 'build'], {cwd: nativeCoreDir, stdio: 'inherit'});
};

const runTests = () => {
  return gulp.src(`${testDir}/*.js`).pipe(mocha({timeout: 5000, reporter: 'mocha-jenkins-reporter'}));
}

const test = gulp.series(build, runTests);

const docGen = (cb) => {
  var config = require('./jsdoc_conf.json');
  return gulp.src([`${nativeCoreDir}/README.md`, `${nativeCoreDir}/index.js`, `${srcDir}/*.js`], {read: false})
             .pipe(jsdoc(config, cb));
};

export {
  clean,
  cleanAll,
  install,
  installWindows,
  lint,
  build,
  test,
  docGen
};