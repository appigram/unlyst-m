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
    './client/www/js/**/*.js',
    '!./client/www/js/unlyst.js',
    '!./client/www/js/unlyst.min.js'
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
  .pipe(gulp.dest('./client/www/css/'))
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
  .pipe(gulp.dest('./client/www/css/'))
  .pipe(minifyCss({
    keepSpecialComments: 0
  }))
  .pipe(rename({extname: '.min.css'}))
  .pipe(gulp.dest('./client/www/css/'))
});

//minify all images
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

/**
 * Process Scripts
 */

gulp.task('scripts', function () {
  return gulp.src(paths.js)               // Read .js files
  .pipe(sourcemaps.init())
  .pipe(concat('unlyst'+ '.js'))          // Concatenate .js files
  .pipe(sourcemaps.write())
  .pipe(gulp.dest('./client/www/js'))
  .pipe(rename({ suffix: '.min' }))       // Add .min suffix
  .pipe(uglify())                         // Minify the .js
  .pipe(gulp.dest('./client/www/js'))         // Save minified .js
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

gulp.task('heroku:development', ['html-dev', 'config','sass-minify','scripts']);

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
