var gulp = require('gulp');
var gutil = require('gulp-util');
var coffee = require('gulp-coffee');
var mustache = require("gulp-mustache");
var concat = require("gulp-concat");
var uglify = require("gulp-uglify");
var sourcemaps = require("gulp-sourcemaps");
var rename = require("gulp-rename");
var del = require("del");
var fs = require("fs");
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var folders = require('gulp-folders');
var path = require('path');
var copy = require('gulp-copy');
var flatten = require('gulp-flatten');
var clean = require('gulp-clean');

var appVars = {"name":"FxOS WatchList Client"};

var buildblocksROOT = './src/bower_components/building-blocks/'; 

var paths = {
  buildblocksJS: buildblocksROOT + 'js/**/*.js',
  buildblocksCSS: buildblocksROOT + '**/*.css',
  buildblocksCSS_IMG: buildblocksROOT + '**/*.{png,svg}',
  buildblocksIMG: buildblocksROOT + 'style/**/*.{png,svg}',
  buildblocksFonts: buildblocksROOT + 'fonts/**/*.*',
  templates: './src/templates/**/*.mustache',
  buildHTML: './build',
  buildJS: './build/js',
  buildCSS: './build/css',
  buildFonts: './build/css/fonts',
  buildPhotos: './build/images',
};

gulp.task('html', function(){
  gulp.src(paths.templates)
      .pipe(mustache({
        'appVars' : appVars
      }))
    	.pipe(rename({
        extname: '.html'
      }))
      .pipe(gulp.dest(paths.buildHTML));
});

gulp.task('bb_scripts', function() {
  console.log(paths.buildblocksJS);
  gulp.src(paths.buildblocksJS)
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(concat('bb.min.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.buildJS));
});

gulp.task('bb_styles', ['bb_styles_imgs'], function(){
  gulp.src(paths.buildblocksCSS)
    .pipe(sourcemaps.init())
    .pipe(minifyCss())
    .pipe(concat('bb.min.css'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.buildCSS));
});

gulp.task('bb_styles_imgs', function(){
  gulp.src(paths.buildblocksCSS_IMG)
    .pipe(gulp.dest(paths.buildCSS));
});

gulp.task('gaia_fonts', function(){
  gulp.src(paths.buildblocksCSS)
    .pipe(sourcemaps.init())
    .pipe(minifyCss())
    .pipe(concat('bb.min.css'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.buildCSS));
});

gulp.task('bb_images', ['bb_images_style'], function(){
  gulp.src(paths.buildblocksIMG)
    .pipe(flatten({ includeParents: 10} ))
    .pipe(gulp.dest(paths.buildCSS));
});

gulp.task('bb_images_style', function(){
  gulp.src(paths.buildblocksIMG)
    .pipe(flatten({ includeParents: 10} ))
    .pipe(gulp.dest(paths.buildCSS + '/style'));
});

gulp.task('bb_fonts', function(){
  gulp.src(paths.buildblocksFonts)
    .pipe(flatten({ includeParents: 10} ))
    .pipe(gulp.dest(paths.buildFonts));
});

gulp.task('bb_photos', function(){
  gulp.src(buildblocksROOT + '**/*.jpg')
    .pipe(gulp.dest(paths.buildHTML));
});

gulp.task('clear', function () {
    return gulp.src(paths.buildHTML, {read: false})
        .pipe(clean());
});

gulp.task('compile', ['html', 'bb_scripts', 'bb_styles', 'bb_images', 'bb_fonts', 'bb_photos']);

gulp.task('default', ['compile'], function(){
  gulp.watch(paths.templates, ['html']);
});
