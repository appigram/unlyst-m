var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');
var autoprefixer = require('gulp-autoprefixer');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var changed = require('gulp-changed');
var preprocess = require('gulp-preprocess');

var paths = {
  clean: [
    './scss/**/*.scss'
  ],
  sass: [
    '!./scss/production.scss',
    './scss/**/*.scss'
  ]
};

gulp.task('default', ['sass','html']);

gulp.task('sass', function (done) {
  gulp.src(paths.sass)
  .pipe(sass())
  .pipe(autoprefixer({                  // Autoprefix for target browsers
    browsers: ['last 2 versions'],
    cascade: true
  }))
  .pipe(gulp.dest('./www/css/'))
  .on('end', done);
});

gulp.task('html', function() {
  gulp.src('./www/index.html')
  .pipe(preprocess({context: { NODE_ENV: 'development', DEBUG: true}})) //To set environment variables in-line
  .pipe(rename('production.html'))
  .pipe(gulp.dest('./www/'))
});

gulp.task('images', function () {
  return gulp.src('./www/img/**/*')
  //.pipe(changed('./www/img/**/*')) //changed only works on different directories and identical files
  .pipe(imagemin({
    progressive: true,
    svgoPlugins: [{removeViewBox: false}],
    use: [pngquant()]
  }))
  .pipe(gulp.dest('./www/img/'));
});

gulp.task('watch', function () {
  gulp.watch(paths.sass, ['sass','html']);
});

gulp.task('install', ['git-check'], function () {
  return bower.commands.install()
  .on('log', function (data) {
    gutil.log('bower', gutil.colors.cyan(data.id), data.message);
  });
});

gulp.task('git-check', function (done) {
  if (!sh.which('git')) {
    console.log(
    '  ' + gutil.colors.red('Git is not installed.'),
    '\n  Git, the version control system, is required to download Ionic.',
    '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
    '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});

// Production gulp for minification
gulp.task('prod', ['prod-sass','html-prod']);

gulp.task('html-prod', function() {
  gulp.src('./www/index.html')
  .pipe(preprocess({context: { NODE_ENV: 'production', DEBUG: true}})) //To set environment variables in-line
  .pipe(rename('production.html'))
  .pipe(gulp.dest('./www/'))
});

gulp.task('prod-sass', function () {
  gulp.src('./scss/production.scss')
  .pipe(sass())
  .pipe(autoprefixer({                  // Autoprefix for target browsers
    browsers: ['last 2 versions'],
    cascade: true
  }))
  .pipe(minifyCss({
    keepSpecialComments: 0
  }))
  .pipe(rename({extname: '.min.css'}))
  .pipe(gulp.dest('./www/production/'));
});
