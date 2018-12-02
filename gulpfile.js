const gulp = require('gulp'),
      sass = require('gulp-sass'),
      concat = require('gulp-concat'),
      argv = require('yargs').argv,
      browserify = require('browserify'),
      babelify = require('babelify'),
      uglify = require('gulp-uglify'),
      streamify = require('gulp-streamify'),
      source = require('vinyl-source-stream'),
      watchify = require('watchify'),
      buffer = require('buffer');

gulp.task('scss', function() {
   gulp.src(['src/entrypoint/scss/bootstrap.scss'])
   .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
   .pipe(concat('bundle.css'))
   .pipe(gulp.dest('./dist'));
});

function buildScript() {
  var bundler = watchify(browserify(
    './src/entrypoint/react/main.js',
    {
      debug: true,
      cache: {}, // required for watchify
      packageCache: {}, // required for watchify
      fullPaths: true // required to be true only for watchify
    }
  ).transform(babelify, {
    presets: ['es2017', 'react'],
    plugins: [
      'transform-es2015-modules-commonjs',
      'transform-object-rest-spread',
      'transform-runtime'
    ]
  }));

  function rebundle() {
    return bundler.bundle()
    .on('error', (e) => {
      console.log(e)
    })
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('./dist'));
  }

  bundler.on('update', function() {
    rebundle();
    console.log(`[${new Date().toLocaleString()}] Updating 🎉`);
  });

  rebundle();
}

gulp.task('watch-scss', function() {
  gulp.watch([
    'src/**/*.scss',
    'src/*.scss'
  ], ['scss']);
});

gulp.task('build', function() {
  return buildScript();
});

gulp.task('default', ['watch-scss', 'build']);

// if(argv.dev) {
//   gulp.task('default', [ 'init', 'watch-scss', 'watch-js' ]);
// }
// else {
//   gulp.task('default', ['init']);
// }
