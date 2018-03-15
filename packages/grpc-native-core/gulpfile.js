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

// gulp-help monkeypatches tasks to have an additional description parameter
const gulp = help(_gulp);

const jsdoc = require('gulp-jsdoc3');
const jshint = require('gulp-jshint');
const mocha = require('gulp-mocha');
const execa = require('execa');
const path = require('path');
const del = require('del');

const nativeCoreDir = __dirname;
const srcDir = path.resolve(nativeCoreDir, 'src');
const testDir = path.resolve(nativeCoreDir, 'test');

const pkg = require('./package');
const jshintConfig = pkg.jshintConfig;

gulp.task('clean', 'Delete generated files', () => {
  return del([path.resolve(nativeCoreDir, 'build'),
	      path.resolve(nativeCoreDir, 'ext/node')]);
});

gulp.task('clean.all', 'Delete all files created by tasks',
	  ['clean']);

gulp.task('install', 'Install native core dependencies', () => {
  return execa('npm', ['install', '--build-from-source', '--unsafe-perm'],
               {cwd: nativeCoreDir, stdio: 'inherit'});
});

gulp.task('install.windows', 'Install native core dependencies for MS Windows', () => {
  return execa('npm', ['install', '--build-from-source'],
               {cwd: nativeCoreDir, stdio: 'inherit'}).catch(() => 
del(path.resolve(process.env.USERPROFILE, '.node-gyp', process.versions.node, 'include/node/openssl'), { force: true }).then(() =>
execa('npm', ['install', '--build-from-source'],
               {cwd: nativeCoreDir, stdio: 'inherit'})
               ))
});

gulp.task('lint', 'Emits linting errors', () => {
  return gulp.src([`${nativeCoreDir}/index.js`, `${srcDir}/*.js`, `${testDir}/*.js`])
      .pipe(jshint(pkg.jshintConfig))
      .pipe(jshint.reporter('default'));
});

gulp.task('build', 'Build native package', () => {
  return execa('npm', ['run', 'build'], {cwd: nativeCoreDir, stdio: 'inherit'});
});

gulp.task('test', 'Run all tests', ['build'], () => {
  return gulp.src(`${testDir}/*.js`).pipe(mocha({reporter: 'mocha-jenkins-reporter'}));
});

gulp.task('doc.gen', 'Generate docs', (cb) => {
  var config = require('./jsdoc_conf.json');
  gulp.src([`${nativeCoreDir}/README.md`, `${nativeCoreDir}/index.js`, `${srcDir}/*.js`], {read: false})
      .pipe(jsdoc(config, cb));
});
