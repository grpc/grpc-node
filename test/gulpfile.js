const _gulp = require('gulp');
const help = require('gulp-help');
const mocha = require('gulp-mocha');
const execa = require('execa');
const path = require('path');

// gulp-help monkeypatches tasks to have an additional description parameter
const gulp = help(_gulp);

const testDir = __dirname;
const apiTestDir = path.resolve(testDir, 'api');

gulp.task('internal.test.link.add', 'Link local copies of grpc packages', () => {
  return execa('npm', ['link', 'grpc'], {cwd: testDir, stdio: 'inherit'});
});

gulp.task('internal.test.test', 'Run API-level tests', () => {
  return gulp.src(`${apiTestDir}/*.js`).pipe(mocha());
});
