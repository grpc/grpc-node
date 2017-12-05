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

import * as _gulp from 'gulp';
import * as help from 'gulp-help';

// gulp-help monkeypatches tasks to have an additional description parameter
const gulp = help(_gulp);

const runSequence = require('run-sequence');

/**
 * Require a module at the given path with a patched gulp object that prepends
 * the given prefix to each task name.
 * @param path The path to require.
 * @param prefix The string to use as a prefix. This will be prepended to a task
 *               name with a '.' separator.
 */
function loadGulpTasksWithPrefix(path: string, prefix: string) {
  const gulpTask = gulp.task;
  gulp.task = ((taskName: string, ...args: any[]) => {
    // Don't create a task for ${prefix}.help
    if (taskName === 'help') {
      return;
    }
    // The only array passed to gulp.task must be a list of dependent tasks.
    const newArgs = args.map(arg => Array.isArray(arg) ?
      arg.map(dep => `${prefix}.${dep}`) : arg);
    gulpTask(`${prefix}.${taskName}`, ...newArgs);
  });
  const result = require(path);
  gulp.task = gulpTask;
  return result;
}

[
  ['./packages/grpc-health-check/gulpfile', 'health-check'],
  ['./packages/grpc-js/gulpfile', 'js'],
  ['./packages/grpc-js-core/gulpfile', 'js.core'],
  ['./packages/grpc-native/gulpfile', 'native'],
  ['./packages/grpc-native-core/gulpfile', 'native.core'],
  ['./packages/grpc-surface/gulpfile', 'surface'],
  ['./test/gulpfile', 'internal.test']
].forEach((args) => loadGulpTasksWithPrefix(args[0], args[1]));

const root = __dirname;

gulp.task('install.all', 'Install dependencies for all subdirectory packages',
          ['js.install', 'js.core.install', 'native.core.install', 'surface.install', 'health-check.install', 'internal.test.install']);

gulp.task('install.all.windows', 'Install dependencies for all subdirectory packages for MS Windows',
          ['js.core.install', 'native.core.install.windows', 'surface.install', 'health-check.install', 'internal.test.install']);

gulp.task('lint', 'Emit linting errors in source and test files',
          ['js.core.lint', 'native.core.lint']);

gulp.task('build', 'Build packages', ['js.compile', 'js.core.compile', 'native.core.build']);

gulp.task('link.core', 'Add links to core packages without rebuilding',
          ['js.link.add', 'native.link.add']);

gulp.task('link.surface', 'Link to surface packages',
          ['health-check.link.add']);

gulp.task('link', 'Link together packages', (callback) => {
  /**
   * We use workarounds for linking in some modules. See npm/npm#18835
   */
  runSequence('link.core', 'link.surface',
              callback);
});

gulp.task('setup', 'One-time setup for a clean repository', (callback) => {
  runSequence('install.all', 'link', callback);
});
gulp.task('setup.windows', 'One-time setup for a clean repository for MS Windows', (callback) => {
  runSequence('install.all.windows', 'link', callback);
});

gulp.task('clean', 'Delete generated files', ['js.core.clean', 'native.core.clean']);

gulp.task('clean.all', 'Delete all files created by tasks',
	  ['js.core.clean.all', 'native.core.clean.all', 'health-check.clean.all',
	   'internal.test.clean.all', 'js.clean.all', 'native.clean.all']);

gulp.task('native.test.only', 'Run tests of native code without rebuilding anything',
          ['native.core.test', 'internal.test.test', 'health-check.test']);

gulp.task('native.test', 'Run tests of native code', (callback) => {
  runSequence('build', 'native.test.only', callback);
});

gulp.task('test.only', 'Run tests without rebuilding anything',
          ['js.core.test', 'native.test.only']);

gulp.task('test', 'Run all tests', (callback) => {
  runSequence('build', 'test.only', callback);
});

gulp.task('doc.gen', 'Generate documentation', ['native.core.doc.gen']);

gulp.task('default', ['help']);
