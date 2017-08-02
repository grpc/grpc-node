const gulp = require('gulp');
const merge2 = require('merge2');
const path = require('path');
const sourcemaps = require('gulp-sourcemaps');
const tslint = require('gulp-tslint');
const typescript = require('gulp-typescript');

const tslintPath = './tslint.json'
const tsconfigPath = './tsconfig.json';
const outDir = 'build';
const srcGlob = 'src/**/*.ts';

function onError() {}

function makeCompileFn(dev) {
  const tsSettings = dev ? {
    noEmitOnError: false,
    noUnusedParameters: false
  } : {};
  return () => {
    const { dts, js } = gulp.src(srcGlob)
      .pipe(sourcemaps.init())
      .pipe(typescript.createProject(tsconfigPath, tsSettings)())
      .on('error', onError);
    const jsMap = js.pipe(sourcemaps.write('.', {
      includeContent: false,
      sourceRoot: path.relative(outDir, 'src')
    }));
    return merge2([
      js.pipe(gulp.dest(`${outDir}/src`)),
      dts.pipe(gulp.dest(`${outDir}/types`)),
      jsMap.pipe(gulp.dest(`${outDir}/src`))
    ]);
  };
}

/**
 * Runs tslint on files in src/, with linting rules defined in tslint.json.
 */
gulp.task('lint', () => {
  const program = require('tslint').Linter.createProgram(tsconfigPath);
  gulp.src(srcGlob)
    .pipe(tslint({
      configuration: tslintPath,
      formatter: 'prose',
      program
    }))
    .pipe(tslint.report())
    .on('warning', onError);
});

/**
 * Transpiles TypeScript files in src/ to JavaScript according to the settings
 * found in tsconfig.json.
 * Currently, all errors are emitted twice. This is being tracked here:
 * https://github.com/ivogabe/gulp-typescript/issues/438
 */
gulp.task('compile', makeCompileFn(false));

/**
 * Starts watching files in src/, running the 'compile' step whenever a file
 * changes.
 */
gulp.task('watch', () => {
  gulp.start(['compile']);
  return gulp.watch(srcGlob, ['compile']);
});

/**
 * Transpiles source code with relaxed requirements:
 * - Emit output even if there are type-checking errors (this is a workaround
 *   for the twice-emitted errors in the 'compile' step)
 * - Do not emit errors for unused parameters
 */
gulp.task('dev.compile', makeCompileFn(true));

/**
 * Watches files similar to the 'watch' step, but runs the 'dev.compile' step
 * instead.
 */
gulp.task('dev.watch', () => {
  gulp.start(['dev.compile']);
  return gulp.watch(srcGlob, ['dev.compile']);
});

gulp.task('default', ['compile']);
