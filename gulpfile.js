const _gulp = require('gulp');
const help = require('gulp-help');

// gulp-help monkeypatches tasks to have an additional description parameter
const gulp = help(_gulp);

require('./packages/grpc-health-check/gulpfile');
require('./packages/grpc-js-core/gulpfile');

gulp.task('lint', 'Emit linting errors in source and test files', ['js.core.lint']);

gulp.task('build', 'Build packages', ['js.core.compile']);

gulp.task('clean', 'Delete generated files', ['js.core.clean']);

gulp.task('test', 'Run all tests', ['js.core.test']);

gulp.task('default', ['help']);
