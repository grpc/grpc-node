const _gulp = require('gulp');
const help = require('gulp-help');

// gulp-help monkeypatches tasks to have an additional description parameter
const gulp = help(_gulp);

require('./packages/grpc-health-check/gulpfile');
require('./packages/grpc-js-core/gulpfile');
require('./packages/grpc-native-core/gulpfile');
require('./test/gulpfile');

gulp.task('lint', 'Emit linting errors in source and test files',
          ['js.core.lint', 'native.core.lint']);

gulp.task('link', 'Link local packages together',
          ['health-check.link', 'internal.test.link']);

gulp.task('build', 'Build packages',
          ['js.core.compile', 'native.core.build', 'link']);

gulp.task('clean', 'Delete generated files', ['js.core.clean']);

gulp.task('test.only', 'Run tests without rebuilding anything',
          ['js.core.test', 'native.core.test', 'internal.test.test', 'health-check.test']);

gulp.task('test', 'Run all tests', ['build', 'link'], () => {
  gulp.start('test.only');
});

gulp.task('default', ['help']);
