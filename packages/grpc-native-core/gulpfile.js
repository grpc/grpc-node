const _gulp = require('gulp');
const help = require('gulp-help');

// gulp-help monkeypatches tasks to have an additional description parameter
const gulp = help(_gulp);

const jshint = require('gulp-jshint');
const mocha = require('gulp-mocha');
const exec = require('child_process').exec;
const path = require('path');

const nativeCoreDir = __dirname;
const srcDir = path.resolve(nativeCoreDir, 'src');
const testDir = path.resolve(nativeCoreDir, 'test');

const pkg = require('./package');
const jshintConfig = pkg.jshintConfig;

gulp.task('native.core.lint', 'Emits linting errors', () => {
  return gulp.src([`${nativeCoreDir}/index.js`, `${srcDir}/*.js`, `${testDir}/*.js`])
      .pipe(jshint(pkg.jshintConfig))
      .pipe(jshint.reporter('default'));
});

gulp.task('native.core.build', 'Build native package', (cb) => {
  return exec(`cd ${nativeCoreDir} && ${nativeCoreDir}/node_modules/.bin/node-pre-gyp build`, cb);
});

gulp.task('native.core.test', 'Run all tests', ['native.core.build'], () => {
  return gulp.src(`${testDir}/*.js`).pipe(mocha());
});
