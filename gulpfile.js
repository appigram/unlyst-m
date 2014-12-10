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
gulp.task('heroku:production', ['prod-sass','html-prod']);

gulp.task('html-prod', function() {
  gulp.src('./client/www/index.html')
  .pipe(preprocess({context: { NODE_ENV: 'production', DEBUG: true}})) //To set environment variables in-line
  .pipe(gulp.dest('./client/www/'))
});

// This does not work on heroku somehow, but work locally
//gulp.task('prod-sass', function () {
//  gulp.src('./client/www/css/unlyst.css')
//  .pipe(minifyCss({
//    keepSpecialComments: 0
//  }))
//  .pipe(rename({extname: '.min.css'}))
//  .pipe(gulp.dest('./client/www/css/'));
//});
