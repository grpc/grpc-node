const _gulp = require('gulp');
const help = require('gulp-help');
const run = require('gulp-run');

// gulp-help monkeypatches tasks to have an additional description parameter
const gulp = help(_gulp);

gulp.task('internal.test.link', 'Link local copies of grpc packages', () => {
  return run(`npm link ${__dirname}/../packages/grpc-native-core`).exec()
      .pipe(gulp.dest('output'));
});
