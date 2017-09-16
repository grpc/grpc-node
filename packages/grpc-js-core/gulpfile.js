const _gulp = require('gulp');
const help = require('gulp-help');

// gulp-help monkeypatches tasks to have an additional description parameter
const gulp = help(_gulp);

const del = require('del');
const mocha = require('gulp-mocha');
const sourcemaps = require('gulp-sourcemaps');
const tslint = require('gulp-tslint');
const typescript = require('gulp-typescript');
const util = require('gulp-util');
const merge2 = require('merge2');
const path = require('path');
const through = require('through2');
const execa = require('execa');

Error.stackTraceLimit = Infinity;

const jsCoreDir = __dirname;
const tslintPath = path.resolve(jsCoreDir, 'node_modules/google-ts-style/tslint.json');
const tsconfigPath = path.resolve(jsCoreDir, 'tsconfig.json');
const outDir = path.resolve(jsCoreDir, 'build');
const srcDir = path.resolve(jsCoreDir, 'src');
const testDir = path.resolve(jsCoreDir, 'test');

function onError() {}

// Coalesces all specified --file parameters into a single array
const files = !util.env.file ? [] :
      Array.isArray(util.env.file) ? util.env.file : [util.env.file];

// If --dev is passed, override certain ts config options
var tsDevOptions = {};
if (util.env.dev) {
  tsDevOptions = {
    allowUnreachableCode: true,
    noUnusedParameters: false,
    noImplicitAny: false,
    noImplicitThis: false,
    noEmitOnError: false
  };
}

/**
 * Helper function that creates a gulp task function that opens files in a
 * directory that match a certain glob pattern, transpiles them, and writes them
 * to an output directory.
 * @param {Object} globs
 * @param {string=} globs.transpile The glob pattern for files to transpile.
 *   Defaults to match all *.ts files in baseDir (incl. subdirectories).
 * @param {string=} globs.copy The glob pattern for files to transpile.
 *   Defaults to match all but *.ts files in baseDir (incl. subdirectories).
 * @return A gulp task function.
 */
function makeCompileFn(globs) {
  const transpileGlob = globs.transpile || `${srcDir}/**/*.ts`;
  const copyGlob = globs.copy || '!(**/*)';
  return () => {
    const tsProject = typescript.createProject(tsconfigPath, tsDevOptions)();
    const data = gulp.src(transpileGlob, { base: jsCoreDir })
          .pipe(sourcemaps.init())
          .pipe(tsProject)
          .on('error', onError);
    const dts = data.dts
    const js = data.js
    const jsmap = js.pipe(sourcemaps.write(jsCoreDir, {
      includeContent: false,
      sourceRoot: path.resolve(jsCoreDir, '..')
    }));
    const copy = gulp.src(copyGlob, { base: jsCoreDir });
    return merge2([
      js.pipe(gulp.dest(`${outDir}`)),
      dts.pipe(gulp.dest(`${outDir}/types`)),
      jsmap.pipe(gulp.dest(`${outDir}`)),
      copy.pipe(gulp.dest(`${outDir}`))
    ]);
  };
}

gulp.task('js.core.install', 'Install native core dependencies', () => {
  return execa('npm', ['install'], {cwd: jsCoreDir, stdio: 'inherit'});
});

/**
 * Runs tslint on files in src/, with linting rules defined in tslint.json.
 */
gulp.task('js.core.lint', 'Emits linting errors found in src/ and test/.', () => {
  const program = require('tslint').Linter.createProgram(tsconfigPath);
  gulp.src([`${srcDir}/**/*.ts`, `${testDir}/**/*.ts`])
      .pipe(tslint({
        configuration: tslintPath,
        formatter: 'codeFrame',
        program
      }))
      .pipe(tslint.report())
      .on('warning', onError);
});

gulp.task('js.core.clean', 'Deletes transpiled code.', () => {
  return del(outDir);
});

/**
 * Transpiles TypeScript files in src/ to JavaScript according to the settings
 * found in tsconfig.json.
 * Currently, all errors are emitted twice. This is being tracked here:
 * https://github.com/ivogabe/gulp-typescript/issues/438
 */
gulp.task('js.core.compile', 'Transpiles src/.',
          makeCompileFn({ transpile: [`${srcDir}/**/*.ts`] }));

/**
 * Transpiles TypeScript files in both src/ and test/.
 */
gulp.task('js.core.test.compile', 'After dep tasks, transpiles test/.', ['js.core.compile'],
          makeCompileFn({ transpile: [`${testDir}/**/*.ts`], copy: `${testDir}/**/!(*.ts)` }));

/**
 * Transpiles src/ and test/, and then runs all tests.
 */
gulp.task('js.core.test', 'After dep tasks, runs all tests.',
          ['js.core.test.compile'], () => {
            return gulp.src(`${outDir}/test/**/*.js`)
                .pipe(mocha());
          }
          );

/**
 * Transpiles individual files, specified by the --file flag.
 */
gulp.task('js.core.compile.single', 'Transpiles individual files specified by --file.',
          makeCompileFn({
            transpile: files.map(f => path.relative('.', f))
          })
          );

/**
 * Run individual tests, specified by their pre-transpiled source path (as
 * supplied through the '--file' flag). This is intended to be used as part of a
 * VS Code "Gulp task" launch configuration; setting the "args" field to
 * ["test.single", "--file", "${file}"] makes it possible for one to debug the
 * currently open TS mocha test file in one step.
 */
gulp.task('js.core.test.single', 'After dep tasks, runs individual files specified ' +
          'by --file.', ['js.core.compile', 'js.core.compile.single'], () => {
            // util.env contains CLI arguments for the gulp task.
            // Determine the path to the transpiled version of this TS file.
            const getTranspiledPath = (file) => {
              const dir = path.dirname(path.relative('.', file));
              const basename = path.basename(file, '.ts');
              return `${outDir}/${dir}/${basename}.js`;
            };
            // Construct an instance of Mocha's runner API and feed it the path to the
            // transpiled source.
            return gulp.src(files.map(getTranspiledPath))
                .pipe(through.obj((file, enc, cb) => {
                  // Construct a new Mocha runner instance.
                  const Mocha = require('mocha');
                  const runner = new Mocha();
                  // Add the path to the test file to debug.
                  runner.addFile(file.path);
                  // Run the test suite.
                  runner.run((failures) => {
                    if (failures > 0) {
                      cb(new Error(`Mocha: ${failures} failures in ${file.path}]`));
                    } else {
                      cb(null);
                    }
                  });
                }));
          }
          );
