const _gulp = require('gulp');
const help = require('gulp-help');
const run = require('gulp-run');

const gulp = help(_gulp);

gulp.task('health-check.test.link', 'Link local copy of grpc', () => {
  return run(`npm link ${__dirname}/grpc-native-core`).exec()
      .pipe(gulp.dest('output'));
});
