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

const execNpmVerb = (verb: string, ...args: string[]) =>
  execa('npm', [verb, ...args], {cwd: jsDir, stdio: 'inherit'});
const execNpmCommand = execNpmVerb.bind(null, 'run');

gulp.task('clean.links', 'Delete npm links', () => {
  return del([path.resolve(jsDir, 'node_modules/@grpc/js-core'),
              path.resolve(jsDir, 'node_modules/@grpc/surface')]);
});

gulp.task('clean.all', 'Delete all files created by tasks', ['clean.links']);

/**
 * Transpiles TypeScript files in src/ to JavaScript according to the settings
 * found in tsconfig.json.
 */
gulp.task('compile', 'Transpiles src/.', () => execNpmCommand('compile'));

gulp.task('install', 'Install dependencies', () => execNpmVerb('install'));

gulp.task('link.add', 'Link local copies of dependencies', () => {
  linkSync(jsDir, './node_modules/@grpc/js-core', '../grpc-js-core');
  linkSync(jsDir, './node_modules/@grpc/surface', '../grpc-surface');
});
