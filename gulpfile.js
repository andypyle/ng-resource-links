// Require Gulp & friends.
var gulp = require('gulp'),
    jade = require('gulp-jade'),
    sass = require('gulp-sass'),
    prefix = require('gulp-autoprefixer'),
    minify = require('gulp-minify-css')
    concat = require('gulp-concat'),
    rename = require('gulp-rename')
    gutil = require('gulp-util');

// Set up directories.
var sources = {
  'sass':{
    'in':'./app/src/sass/style.sass',
    'out':'./app/styles/',
    'opts':{
      'outputStyle': 'expanded'
    }
  },
  'jade':{
    'in':'./app/src/jade/index.jade',
    'out':'./app/',
    'opts':{
      'locals': {},
      'pretty': true
    }
  }
}

gulp.task('sass', function(){
  gulp.src(sources.sass.in)
    .pipe(sass(sources.sass.opts)
    .on('error', sass.logError))
    .pipe(prefix({
      browsers: [
                      '> 1%',
                      'last 2 versions',
                      'firefox >= 4',
                      'safari 7',
                      'safari 8',
                      'IE 8',
                      'IE 9',
                      'IE 10',
                      'IE 11'
                  ],
      cascade: true
    }))
    .pipe(rename('style.css'))
    .pipe(gulp.dest(sources.sass.out))
    .pipe(minify())
    .pipe(concat('style.min.css'))
    .pipe(gulp.dest(sources.sass.out));
});

gulp.task('jade', function(){
  gulp.src(sources.jade.in)
		.pipe(jade(sources.jade.opts))
		.pipe(gulp.dest(sources.jade.out));
});

gulp.task('watch', function(){
	gulp.watch(['./app/src/sass/**/*.sass', './app/src/jade/**/*.jade'], ['sass','jade']);
});

gulp.task('default', ['sass','jade', 'watch']);
