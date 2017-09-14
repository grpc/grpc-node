const _gulp = require('gulp');
const help = require('gulp-help');
const mocha = require('gulp-mocha');
const exec = require('child_process').exec;
const path = require('path');

const gulp = help(_gulp);

const healthCheckDir = __dirname;
const baseDir = path.resolve(healthCheckDir, '..', '..');
const testDir = path.resolve(healthCheckDir, 'test');

gulp.task('health-check.install', 'Install health check dependencies', (cb) => {
  return exec(`cd ${healthCheckDir} && npm install`, cb);
});

gulp.task('health-check.link.add', 'Link local copy of grpc', ['health-check.install'], (cb) => {
  return exec(`cd ${healthCheckDir} && npm link grpc`, cb);
});

gulp.task('health-check.test', 'Run health check tests', ['health-check.install', 'health-check.link.add'],
          () => {
            return gulp.src(`${testDir}/*.js`).pipe(mocha());
          });
