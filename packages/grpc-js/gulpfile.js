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

const execa = require('execa');
const path = require('path');
const del = require('del');
const linkSync = require('../../util').linkSync;

const jsDir = __dirname;

gulp.task('js.clean.links', 'Delete npm links', () => {
  return del([path.resolve(jsDir, 'node_modules/@grpc/js-core'),
              path.resolve(jsDir, 'node_modules/@grpc/surface')]);
});

gulp.task('js.clean.all', 'Delete all files created by tasks',
          ['js.clean.links']);

gulp.task('js.install', 'Install dependencies', () => {
  return execa('npm', ['install', '--unsafe-perm'], {cwd: jsDir, stdio: 'inherit'});
});

gulp.task('js.link.add', 'Link local copies of dependencies', () => {
  linkSync(jsDir, './node_modules/@grpc/js-core', '../grpc-js-core');
  linkSync(jsDir, './node_modules/@grpc/surface', '../grpc-surface');
});
