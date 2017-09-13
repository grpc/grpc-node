const _gulp = require('gulp');
const help = require('gulp-help');
const mocha = require('gulp-mocha');
const exec = require('child_process').exec;
const path = require('path');

const gulp = help(_gulp);

const hcCoreDir = __dirname;
const baseDir = path.resolve(hcCoreDir, '..', '..');
const testDir = path.resolve(hcCoreDir, 'test');

gulp.task('health-check.link', 'Link local copy of grpc', (cb) => {
  return exec(`cd ${hcCoreDir} && npm link ${baseDir}/packages/grpc-native-core`, cb);
});

gulp.task('health-check.test', 'Run health check tests', ['health-check.link'],
          () => {
            return gulp.src(`${testDir}/*.js`).pipe(mocha());
          });
