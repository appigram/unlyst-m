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
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
var livereload = require('gulp-livereload');
var nodemon = require('gulp-nodemon');
var open = require("gulp-open");

var paths = {
  clean: [
    './client/scss/**/*.scss'
  ],
  sass: [
    './client/scss/**/*.scss',
    './client/www/lib/leaflet/dist/leaflet.css'
  ],
  html: [
    './client/www/view/**/*.html',
    './client/www/*.html'
  ],
  js: [
    './client/www/js/**/*.js'
  ]
};

gulp.task('default', ['sass','watch','nodemon','open']);

gulp.task('sass', function () {
  gulp.src(paths.sass)
  .pipe(sourcemaps.init())
  .pipe(sass())
  .pipe(autoprefixer({                  // Autoprefix for target browsers
    browsers: ['last 2 versions'],
    cascade: true
  }))
  .pipe(concat('unlyst.css'))
  .pipe(sourcemaps.write())
  .pipe(gulp.dest('./client/www/css/'))
  .pipe(livereload());
});

gulp.task('html', function () {
  gulp.src(paths.html)
  .pipe(livereload());
});

gulp.task('js', function () {
  gulp.src(paths.js)
  .pipe(livereload());
});

gulp.task('sass-minify', function () {
  gulp.src(paths.sass)
  .pipe(sass())
  .pipe(autoprefixer({                  // Autoprefix for target browsers
    browsers: ['last 2 versions'],
    cascade: true
  }))
  .pipe(concat('unlyst.css'))
  .pipe(gulp.dest('./client/www/css/'))
  .pipe(minifyCss({
    keepSpecialComments: 0
  }))
  .pipe(rename({extname: '.min.css'}))
  .pipe(gulp.dest('./client/www/css/'))
});

gulp.task('images', function () {
  return gulp.src('./image/**/*')
  .pipe(changed('./client/www/img')) //changed only works on different directories and identical files
  .pipe(imagemin({
    progressive: true,
    svgoPlugins: [{removeViewBox: false}],
    use: [pngquant()]
  }))
  .pipe(gulp.dest('./client/www/img'));
});

gulp.task('watch', function () {
  livereload.listen();
  gulp.watch(paths.sass, ['sass']);
  gulp.watch(paths.html, ['html']);
  gulp.watch(paths.js, ['js']);

});


/**
 * Nodemon Task
 */

gulp.task('nodemon', function (cb) {
  livereload.listen();
  var called = false;
  nodemon({
    script: 'server.js',
    verbose: false,
    env: {'NODE_ENV': 'development'},
    // nodeArgs: ['--debug']
    ext: 'js',
    ignore: [
      'gulpfile.js',
      'node_modules/**',
      'client/www/lib/**',
      'client/node_modules/**',
      'client/www/css/**'
    ]
  });
  //.on('start', function () {
  //  setTimeout(function () {
  //    if (!called) {
  //      called = true;
  //      cb();
  //    }
  //  }, 1000);  // wait for start
  //})
  //.on('restart', function () {
  //  setTimeout(function () {
  //    livereload.changed('/');
  //  }, 1000);  // wait for restart
  //});
});

gulp.task("open", function(){
  gulp.src("./client/www/index.html")
  .pipe(open());
});
gulp.task("open", function(){
  var options = {
    url: "http://localhost:5000",
    app: "chrome"
  };
  // A file must be specified or gulp will skip the task
  gulp.src("./client/www/index.html")
  .pipe(open("", options));
});
//Production tasks below
// Production gulp for minification
gulp.task('heroku:production', ['html-prod', 'config','sass-minify']);

gulp.task('heroku:development', ['html-dev', 'config','sass-minify']);

gulp.task('html-prod', function () {
  gulp.src('./client/www/index.html')
    //To set variables in-line based on environment
  .pipe(preprocess({
    context: {
      NODE_ENV: process.env.NODE_ENV,
      LIVE: true,
      CSS: '<link href=\"css/unlyst.min.css\" rel=\"stylesheet\">'
    }
  }))
  .pipe(gulp.dest('./client/www/'))
});

gulp.task('html-dev', function () {
  gulp.src('./client/www/index.html')
    //To set variables in-line based on environment
  .pipe(preprocess({
    context: {
      NODE_ENV: process.env.NODE_ENV,
      LIVE: true,
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
