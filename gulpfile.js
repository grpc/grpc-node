const del = require('del');
const gulp = require('gulp');
const mocha = require('gulp-mocha');
const sourcemaps = require('gulp-sourcemaps');
const tslint = require('gulp-tslint');
const typescript = require('gulp-typescript');
const util = require('gulp-util');
const merge2 = require('merge2');
const path = require('path');
const through = require('through2');

const tslintPath = './node_modules/google-ts-style/tslint.json';
const tsconfigPath = './tsconfig.json';
const outDir = 'build';

function onError() {}

// If --dev is passed, override certain ts config options
let tsDevOptions = {};
if (util.env.dev) {
  tsDevOptions = {
    allowUnreachableCode: true,
    noUnusedParameters: false
  };
}

/**
 * Helper function that creates a gulp task function that opens files in a
 * directory that match a certain glob pattern, transpiles them, and writes them
 * to an output directory.
 * @param {string} baseDir The name of the directory containing the files.
 * @param {Object} globs
 * @param {string=} globs.transpile The glob pattern for files to transpile.
 *   Defaults to match all *.ts files in baseDir (incl. subdirectories).
 * @param {string=} globs.copy The glob pattern for files to transpile.
 *   Defaults to match all but *.ts files in baseDir (incl. subdirectories).
 * @return A gulp task function.
 */
function makeCompileFn(baseDir, globs) {
  const transpileGlob = globs.transpile || '**/*.ts';
  const copyGlob = globs.copy || '**/!(*.ts)';
  return () => {
    const tsProject = typescript.createProject(tsconfigPath, tsDevOptions)();
    const { dts, js } = gulp.src(`${baseDir}/${transpileGlob}`)
      .pipe(sourcemaps.init())
      .pipe(tsProject)
      .on('error', onError);
    const jsmap = js.pipe(sourcemaps.write('.', {
      includeContent: false,
      sourceRoot: path.relative(`${outDir}/${baseDir}`, baseDir)
    }));
    const copy = gulp.src(`${baseDir}/${copyGlob}`);
    return merge2([
      js.pipe(gulp.dest(`${outDir}/${baseDir}`)),
      dts.pipe(gulp.dest(`${outDir}/types`)),
      jsmap.pipe(gulp.dest(`${outDir}/${baseDir}`)),
      copy.pipe(gulp.dest(`${outDir}/${baseDir}`))
    ]);
  };
}

/**
 * Runs tslint on files in src/, with linting rules defined in tslint.json.
 */
gulp.task('lint', () => {
  const program = require('tslint').Linter.createProgram(tsconfigPath);
  gulp.src(['src/**/*.ts', 'test/**/*.ts'])
    .pipe(tslint({
      configuration: tslintPath,
      formatter: 'prose',
      program
    }))
    .pipe(tslint.report())
    .on('warning', onError);
});

gulp.task('clean', () => {
  return del(outDir);
});

/**
 * Transpiles TypeScript files in src/ to JavaScript according to the settings
 * found in tsconfig.json.
 * Currently, all errors are emitted twice. This is being tracked here:
 * https://github.com/ivogabe/gulp-typescript/issues/438
 */
gulp.task('compile', makeCompileFn('src',
  { transpile: '**/*.ts' }));

/**
 * Transpiles TypeScript files in both src/ and test/.
 */
gulp.task('test.compile', ['compile'],
  makeCompileFn('test', { transpile: '**/*.ts' }));

/**
 * Starts watching files in src/, running the 'compile' step whenever a file
 * changes.
 */
gulp.task('watch', () => {
  gulp.start(['compile']);
  return gulp.watch(srcGlob, ['compile']);
});

/**
 * Transpiles src/ and test/, and then runs all tests.
 */
gulp.task('test', ['test.compile'], () => {
  return gulp.src(`${outDir}/test/**/*.js`)
    .pipe(mocha());
});

/**
 * Compiles a single test file. Only intended as a pre-requisite for
 * 'test.single'.
 * @private
 */
gulp.task('.compileSingleTestFile', util.env.file ?
  makeCompileFn('test', { transpile: path.relative('test', util.env.file) }) :
  () => { throw new Error('No file specified'); });

/**
 * Run a single test, specified by its pre-transpiled source path (as supplied
 * through the '--file' flag). This is intended to be used as part of a VS Code
 * "Gulp task" launch configuration; setting the "args" field to
 * ["test.single", "--file", "${file}"] makes it possible for one to debug the
 * currently open TS mocha test file in one step.
 */
gulp.task('test.single', ['compile', '.compileSingleTestFile'], () => {
  // util.env contains CLI arguments for the gulp task.
  const { file } = util.env;
  // Determine the path to the transpiled version of this TS file.
  const dirWithinTest = path.dirname(path.relative('./test', file));
  const basename = path.basename(file, '.ts');
  const transpiledPath = `${outDir}/test/${dirWithinTest}/${basename}.js`;
  // Construct an instance of Mocha's runner API and feed it the path to the
  // transpiled source.
  return gulp.src(transpiledPath)
    .pipe(through.obj((file, enc, cb) => {
      // Construct a new Mocha runner instance.
      const Mocha = require('mocha');
      const runner = new Mocha();
      // Add the path to the test file to debug.
      runner.addFile(file.path);
      // "Load" the test file.
      // This is a no-op hack so that VS Code is informed that breakpoints set
      // in this file should be hit.
      // Because mocha's global-scope variables aren't loaded, this will throw.
      try { require(file.path); } catch (e) {};
      // Run the test suite.
      runner.run((failures) => {
        if (failures > 0) {
          cb(new Error(`Mocha: ${failures} failures in ${file.path}]`));
        } else {
          cb(null);
        }
      });
    }));
});

gulp.task('help', () => {
  console.log(`
gulp help: Prints this message.
gulp clean: Deletes transpiled code.
gulp compile: Transpiles src.
gulp lint: Emits linting errors found in src/ and test/.
gulp test.compile: Transpiles src and test.
gulp test: Runs \`gulp test.compile\`, and then runs all tests.
gulp test.single --file $FILE: Transpiles src and $FILE, and runs only the transpiled $FILE. (See also: #5)
gulp * --color: Prints output in color; particularly useful for tests.
gulp * --dev: Runs the task with relaxed TS compiler options.
  `.trim());
});

gulp.task('default', ['help']);
