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

const gulp = require('gulp');
const healthCheck = require('./packages/grpc-health-check/gulpfile');
const jsCore = require('./packages/grpc-js/gulpfile');
const nativeCore = require('./packages/grpc-native-core/gulpfile');
const protobuf = require('./packages/proto-loader/gulpfile');
const internalTest = require('./test/gulpfile');

const installAll = gulp.parallel(jsCore.install, nativeCore.install, healthCheck.install, protobuf.install, internalTest.install);

const installAllWindows = gulp.parallel(jsCore.install, nativeCore.installWindows, healthCheck.install, protobuf.install, internalTest.install);

const lint = gulp.parallel(jsCore.lint, nativeCore.lint);

const build = gulp.parallel(jsCore.compile, nativeCore.build, protobuf.compile);

const link = gulp.series(healthCheck.linkAdd);

const setup = gulp.series(installAll, link);

const setupWindows = gulp.series(installAllWindows, link);

const setupPureJSInterop = gulp.parallel(jsCore.install, protobuf.install, internalTest.install);

const clean = gulp.parallel(jsCore.clean, nativeCore.clean, protobuf.clean);

const cleanAll = gulp.parallel(jsCore.cleanAll, nativeCore.cleanAll, healthCheck.cleanAll, internalTest.cleanAll, protobuf.cleanAll);

const nativeTestOnly = gulp.parallel(nativeCore.test, healthCheck.test);

const nativeTest = gulp.series(build, nativeTestOnly);

const testOnly = gulp.parallel(jsCore.test, nativeTestOnly, protobuf.test);

const test = gulp.series(build, testOnly, internalTest.test);

const docGen = gulp.series(nativeCore.docGen);

module.exports = {
  installAll,
  installAllWindows,
  lint,
  build,
  link,
  setup,
  setupWindows,
  setupPureJSInterop,
  clean,
  cleanAll,
  nativeTestOnly,
  nativeTest,
  test,
  docGen
};
