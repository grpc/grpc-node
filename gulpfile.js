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
require('./packages/grpc-js-core/gulpfile');
require('./packages/grpc-native-core/gulpfile');
require('./test/gulpfile');

const root = __dirname;

gulp.task('install.all', 'Install dependencies for all subdirectory packages',
          ['js.core.install', 'native.core.install', 'health-check.install', 'internal.test.install']);

gulp.task('install.all.windows', 'Install dependencies for all subdirectory packages for MS Windows',
          ['js.core.install', 'native.core.install.windows', 'health-check.install']);

gulp.task('lint', 'Emit linting errors in source and test files',
          ['js.core.lint', 'native.core.lint']);

gulp.task('build', 'Build packages', ['js.core.compile', 'native.core.build']);

gulp.task('link.create', 'Initialize npm links to packages',
          ['native.core.link.create']);

gulp.task('link.only', 'Link packages together without rebuilding anything',
          ['health-check.link.add', 'internal.test.link.add']);

gulp.task('link', 'Link local packages together after building',
          ['link.create'], () => {
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
	   'internal.test.clean.all']);

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

gulp.task('doc.gen', 'Generate documentation', ['native.core.doc.gen']);

gulp.task('default', ['help']);
