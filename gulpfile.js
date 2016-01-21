var gulp = require('gulp');
var sass = require('gulp-sass');
var debug = require('gulp-debug');
var cssnano = require('gulp-cssnano');
var sourcemaps = require('gulp-sourcemaps');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var uglify = require('gulp-uglify');
var replace = require('gulp-replace-path');
var bourbon = require('node-bourbon');

gulp.task('default',
  [ 'scripts', 'images', 'sass', 'html' ]
);

gulp.task('scripts', function() {
  return gulp.src('themes/**/scripts/**/*')
      .pipe(debug())
      .pipe(sourcemaps.init())
      .pipe(uglify())
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest('web'));
});

gulp.task('images', function() {
  return gulp.src('themes/**/images/**/*')
      .pipe(debug())
      .pipe(imagemin({
        progressive: true,
        svgoPlugins: [{removeViewBox: false}],
        use: [pngquant({quality: '65-80', speed: 4})]
      }))
      .pipe(gulp.dest('web'));
});

gulp.task('html', function() {
  return gulp.src('themes/**/*.html')
    .pipe(debug())
    .pipe(gulp.dest('web'));
})

gulp.task('sass', function() {
  return gulp.src('themes/**/styles/**/*.scss')
    .pipe(debug())
    .pipe(sourcemaps.init())
    .pipe(sass({
      includePaths: bourbon.with(require('node-normalize-scss').includePaths)
    })
    .on('error', sass.logError))
    .pipe(cssnano())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('web'));
});

gulp.watch('themes/**/*', [ 'default' ]).on('change', function (event) {
  console.log("[%s] %s", event.type, event.path);
});
