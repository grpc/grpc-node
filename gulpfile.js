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

require('./packages/grpc-health-check/gulpfile');
require('./packages/grpc-js/gulpfile');
require('./packages/grpc-js-core/gulpfile');
require('./packages/grpc-native/gulpfile');
require('./packages/grpc-native-core/gulpfile');
require('./packages/grpc-surface/gulpfile');
require('./test/gulpfile');

const root = __dirname;

gulp.task('install.all', 'Install dependencies for all subdirectory packages',
          ['js.core.install', 'native.core.install', 'health-check.install',
           'js.install', 'native.install']);

gulp.task('install.all.windows', 'Install dependencies for all subdirectory packages for MS Windows',
          ['js.core.install', 'native.core.install.windows', 'health-check.install',
           'js.install', 'native.install']);

gulp.task('lint', 'Emit linting errors in source and test files',
          ['js.core.lint', 'native.core.lint']);

gulp.task('build', 'Build packages', ['js.core.compile', 'native.core.build']);

gulp.task('link.create', 'Initialize npm links',
          ['native.core.link.create', 'js.core.link.create', 'surface.link.create',
           'js.link.create', 'native.link.create']);

gulp.task('link.only', 'Link packages without rebuilding',
          ['js.link.add', 'native.link.add', 'health-check.link.add', 'internal.test.link.add']);

gulp.task('link', 'Link together packages', ['link.create'], () => {
  gulp.start('link.only');
});

gulp.task('setup', 'One-time setup for a clean repository', ['install.all'], () => {
        gulp.start('link');
});
gulp.task('setup.windows', 'One-time setup for a clean repository for MS Windows', ['install.all.windows'], () => {
        gulp.start('link');
});

gulp.task('clean', 'Delete generated files', ['js.core.clean', 'native.core.clean']);

gulp.task('clean.all', 'Delete all files created by tasks',
	  ['js.core.clean.all', 'native.core.clean.all', 'health-check.clean.all',
	   'internal.test.clean.all', 'js.clean.all', 'native.clean.all']);

gulp.task('native.test.only', 'Run tests of native code without rebuilding anything',
          ['native.core.test', 'internal.test.test', 'health-check.test']);

gulp.task('native.test', 'Run tests of native code', ['build'], () => {
  gulp.start('native.test.only');
});

gulp.task('test.only', 'Run tests without rebuilding anything',
          ['js.core.test', 'native.test.only']);

gulp.task('test', 'Run all tests', ['build'], () => {
  gulp.start('test.only');
});

gulp.task('default', ['help']);
