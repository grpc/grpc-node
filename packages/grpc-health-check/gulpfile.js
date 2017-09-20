const _gulp = require('gulp');
const help = require('gulp-help');
const mocha = require('gulp-mocha');
const execa = require('execa');
const path = require('path');
const del = require('del');

const gulp = help(_gulp);

const healthCheckDir = __dirname;
const baseDir = path.resolve(healthCheckDir, '..', '..');
const testDir = path.resolve(healthCheckDir, 'test');

gulp.task('health-check.clean.links', 'Delete npm links', () => {
  return del(path.resolve(healthCheckDir, 'node_modules/grpc'));
});

gulp.task('health-check.clean.all', 'Delete all code created by tasks',
	  ['health-check.clean.links']);

gulp.task('health-check.install', 'Install health check dependencies', () => {
  return execa('npm', ['install', '--unsafe-perm'], {cwd: healthCheckDir, stdio: 'inherit'});
});

gulp.task('health-check.link.add', 'Link local copy of grpc', ['health-check.install'], () => {
  return execa('npm', ['link', 'grpc'], {cwd: healthCheckDir, stdio: 'inherit'});
});

gulp.task('health-check.test', 'Run health check tests',
          () => {
            return gulp.src(`${testDir}/*.js`).pipe(mocha({reporter: 'mocha-jenkins-reporter'}));
          });
