const _gulp = require('gulp');
const help = require('gulp-help');
const mocha = require('gulp-mocha');
const execa = require('execa');
const path = require('path');
const del = require('del');

// gulp-help monkeypatches tasks to have an additional description parameter
const gulp = help(_gulp);

const testDir = __dirname;
const apiTestDir = path.resolve(testDir, 'api');

gulp.task('internal.test.clean.links', 'Delete npm links', () => {
  return del(path.resolve(testDir, 'node_modules/grpc'));
});

gulp.task('internal.test.clean.all', 'Delete all files created by tasks',
	  ['internal.test.clean.links']);

gulp.task('internal.test.link.add', 'Link local copies of grpc packages', () => {
  return execa('npm', ['link', 'grpc'], {cwd: testDir, stdio: 'inherit'});
});

gulp.task('internal.test.test', 'Run API-level tests', () => {
  return gulp.src(`${apiTestDir}/*.js`).pipe(mocha({reporter: 'mocha-jenkins-reporter'}));
});
