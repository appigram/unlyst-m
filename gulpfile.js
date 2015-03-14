var gulp = require('gulp');
    concat = require('gulp-concat');
    sass = require('gulp-sass');
    minifyCss = require('gulp-minify-css');
    rename = require('gulp-rename');
    autoprefixer = require('gulp-autoprefixer');
    imagemin = require('gulp-imagemin');
    pngquant = require('imagemin-pngquant');
    changed = require('gulp-changed');
    preprocess = require('gulp-preprocess');
    concat = require('gulp-concat');
    sourcemaps = require('gulp-sourcemaps');
    livereload = require('gulp-livereload');
    nodemon = require('gulp-nodemon');
    open = require("gulp-open");
    jshint = require('gulp-jshint');
    uglify = require('gulp-uglify');
    plumber = require('gulp-plumber');

var paths = {
  clean: [
    './client/www/dist/css/unlyst.css',
    './client/www/dist/css/unlyst.min.css',
    './client/www/dist/js/unlyst.js',
    './client/www/dist/js/unlyst.min.js'
  ],
  sass: [
    './client/scss/**/*.scss',
    './client/www/lib/leaflet/dist/leaflet.css'
  ],
  html: [
    './client/www/**/*.html',
    '!./client/lib/**/*.html'
  ],
  js: [
    //TODO: fix app.js to be the first file to load
    './client/www/src/common/*.js',
    './client/www/src/**/*.js'
  ]
};

gulp.task('default', ['sass','scripts','watch','nodemon','open']);

//build scss
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
  .pipe(gulp.dest('./client/www/dist/css/'))
  .pipe(livereload());
});

//reload html
gulp.task('html', function () {
  gulp.src(paths.html)
  .pipe(livereload());
});


//minify css for test and production servers only
gulp.task('sass-minify', function () {
  gulp.src(paths.sass)
  .pipe(sass())
  .pipe(autoprefixer({                  // Autoprefix for target browsers
    browsers: ['last 2 versions'],
    cascade: true
  }))
  .pipe(concat('unlyst.css'))
  .pipe(gulp.dest('./client/www/dist/css/'))
  .pipe(minifyCss({
    keepSpecialComments: 0
  }))
  .pipe(rename({extname: '.min.css'}))
  .pipe(gulp.dest('./client/www/dist/css/'))
});

//minify all images
gulp.task('images', function () {
  return gulp.src('./client/image/**/*')
  .pipe(changed('./client/www/dist/img')) //changed only works on different directories and identical files
  .pipe(imagemin({
    progressive: true,
    svgoPlugins: [{removeViewBox: false}],
    use: [pngquant()]
  }))
  .pipe(gulp.dest('./client/www/dist/img'));
});

gulp.task('tempImages', function () {
  return gulp.src('./tempImages/**/*')
  .pipe(imagemin({
    progressive: true,
    svgoPlugins: [{removeViewBox: false}],
    use: [pngquant()]
  }))
  .pipe(gulp.dest('./tempImages/minified'));
});

/**
 * Process Scripts
 */

gulp.task('scripts', function () {
  return gulp.src(paths.js)               // Read .js files
  .pipe(sourcemaps.init())
  .pipe(plumber())
  .pipe(concat('unlyst'+ '.js'))          // Concatenate .js files
  .pipe(sourcemaps.write())
  .pipe(gulp.dest('./client/www/dist/js'))
  .pipe(rename({ suffix: '.min' }))       // Add .min suffix
  .pipe(uglify())                         // Minify the .js
  .pipe(gulp.dest('./client/www/dist/js'))         // Save minified .js
  .pipe(livereload());                    // Initiate a reload
});

gulp.task('lint', function () {
  return gulp.src(paths.js)               // Read .js files
  .pipe(jshint())                       // lint .js files
  .pipe(jshint.reporter());
});

gulp.task('watch', function () {
  livereload.listen();
  gulp.watch(paths.sass, ['sass']);
  gulp.watch(paths.html, ['html']);
  gulp.watch(paths.js, ['scripts']);

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
      'client/www/dist/css/**'
    ]
  });
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
gulp.task('heroku:production', ['html-prod', 'config','sass-minify','scripts']);

gulp.task('heroku:development', ['config','sass-minify','scripts']);

gulp.task('html-prod', function () {
  gulp.src('./client/www/index.html')
    //To set variables in-line based on environment
  .pipe(rename('./client/www/index-dev.html'))
  .pipe(gulp.dest('./'))
  gulp.src('./client/www/index-prod.html')
    //To set variables in-line based on environment
  .pipe(rename('./client/www/index.html'))
  .pipe(gulp.dest('./'))
});


gulp.task('config', function () {
  gulp.src('./client/www/src/common/services.js')
  .pipe(preprocess({
    context: {
      NODE_ENV: process.env.NODE_ENV,
      FIREBASE: 'https://fiery-heat-1976.firebaseio.com/valuations-prod'
    }
  }))
  .pipe(gulp.dest('./client/www/src/common/'))
});

