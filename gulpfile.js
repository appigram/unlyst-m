var gulp = require('gulp');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var autoprefixer = require('gulp-autoprefixer');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var changed = require('gulp-changed');
var preprocess = require('gulp-preprocess');

var paths = {
  clean: [
    './client/scss/**/*.scss'
  ],
  sass: [
    '!./client/scss/production.scss',
    './client/scss/**/*.scss'
  ]
};
// Production gulp for minification
gulp.task('heroku:production', ['html-prod', 'config']);

gulp.task('html-prod', function () {
  gulp.src('./client/www/index.html')
    //To set variables in-line based on environment
  .pipe(preprocess({
    context: {
      NODE_ENV: process.env.NODE_ENV,
      DEBUG: true,
      CSS: '<link href=\"css/unlyst.css\" rel=\"stylesheet\">'
    }
  }))
  .pipe(gulp.dest('./client/www/'))
});

gulp.task('config', function () {
  gulp.src('./client/www/js/services.js')
  .pipe(preprocess({
    context: {
      NODE_ENV: process.env.NODE_ENV,
      FIREBASE: 'https://fiery-heat-1976.firebaseio.com/valuations-prod'
    }
  }))
  .pipe(gulp.dest('./client/www/js/'))
});

// This does not work on heroku somehow, but work locally
//gulp.task('prod-sass', function () {
//  gulp.src('./client/www/css/unlyst.css')
//  .pipe(minifyCss({
//    keepSpecialComments: 0
//  }))
//  .pipe(rename({extname: '.min.css'}))
//  .pipe(gulp.dest('./client/www/css/'));
//});.
