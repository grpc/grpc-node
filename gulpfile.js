const _gulp = require('gulp');
const help = require('gulp-help');
const exec = require('child_process').exec;

// gulp-help monkeypatches tasks to have an additional description parameter
const gulp = help(_gulp);

require('./packages/grpc-health-check/gulpfile');
require('./packages/grpc-js-core/gulpfile');
require('./packages/grpc-native-core/gulpfile');
require('./test/gulpfile');

const root = __dirname;

gulp.task('install.all', 'Install dependencies for all subdirectory packages',
          ['js.core.install', 'native.core.install', 'health-check.install']);

gulp.task('lint', 'Emit linting errors in source and test files',
          ['js.core.lint', 'native.core.lint']);

gulp.task('build.only', 'Build packages without doing any installation',
          ['js.core.compile', 'native.core.build']);

gulp.task('build', 'Build packages', ['install.all'], () => {
  gulp.start('build.only');
});

gulp.task('link.create.only', 'Initialize npm links to packages without rebuilding',
          ['native.core.link.create']);

gulp.task('link.create', 'Initialize npm links to packages', ['build'], () => {
  gulp.start('link.create.only');
});

gulp.task('link.only', 'Link packages together without rebuilding anything',
          ['health-check.link.add', 'internal.test.link.add']);

gulp.task('link', 'Link local packages together after building',
          ['build', 'link.create.only'], () => {
            gulp.start('link.only');
          });

gulp.task('clean', 'Delete generated files', ['js.core.clean']);

gulp.task('native.test.only', 'Run tests of native code without rebuilding anything',
          ['native.core.test', 'internal.test.test', 'health-check.test']);

gulp.task('native.test', 'Run tests of native code', ['build', 'link'], () => {
  gulp.start('native.test.only');
});

gulp.task('test.only', 'Run tests without rebuilding anything',
          ['js.core.test', 'native.test.only']);

gulp.task('test', 'Run all tests', ['build', 'link'], () => {
  gulp.start('test.only');
});

gulp.task('default', ['help']);
