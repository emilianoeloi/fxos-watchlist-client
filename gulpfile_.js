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

var header = '\
  <title>(1)Globo App Server Mock</title> \
  <meta charset="UTF-8"> \
';

var templates = ' \
<script id="mtch-header" type="x-tmpl-mustache"> \
  <h3 style="display: none; background-color: {{color}}">{{productName}} <a href="{{hrefEditorial}}">{{productEditorial}}</a></h3> \
  <h4 style="display: none; background-color: {{color}}">{{productSubeditorial}}</h4> \
  <span style="display: none" id="logoHref">{{logoHref}}</span> \
  <p>Plataforma: {{platformName}}</p> \
  <p>NavTo: <span id="nav-to"></span></p> \
  <p>Ações da Régua: <span class="message">aguardando...</span></p> \
  <p>Menu aberto: <span class="status_menu">{{status_menu}}</span></p> \
</script> \
<script id="mtch-products" type="x-tmpl-mustache"> \
  <ol> \
  {{#.}} \
    <li> \
      <a href="{{link}}">{{productName}} - {{linkDescription}}</a> \
    </li> \
  {{/.}} \
  </ol> \
</script>';

var scripts = ' \
  <script src="//code.jquery.com/jquery-1.11.3.min.js"></script> \
  <script src="/js/vendor/mustache.js?_=3"></script> \
  <script src="/js/vendor/contentloaded.js?_=3"></script> \
  <script src="/js/all.min.js?_=3"></script> \
';

var styles = ' \
  <link rel="stylesheet" href="http://s.glbimg.com/en/ho/static/CACHE/css/1bb8d3bb72f3.css" /> \
  <link rel="stylesheet" href="/css/all.min.css?_=4" /> \
\
';

var ruler = ' \
    <ul style="display:none"> \
      <li> \
        <a href="#logo" class="ruler-button" data-name="glb.casa.clicked">Logo</a> \
      </li> \
      <li> \
        <a href="#menu" class="ruler-button" data-name="glb.cardapio.open">Menu</a> \
      </li> \
      <li> \
        <a href="#search" class="ruler-button" data-name="glb.busca.open">Busca</a> \
      </li> \
      <li> \
        <a href="#account" class="ruler-button" data-name="glb.usuario.open">Usuário</a> \
      </li> \
    </ul> \
';

var paths = {
  styles: './src/styles/**/*.scss',
  scripts: './src/scripts/**/*.coffee',
  scriptsVendor: './src/scripts/vendor/**/*.js',
  templates: './src/templates/**/*.mustache',
  srcStatic: './src/static/**/*.*',
  srcJson: './src/api/**/**.json',
  buildJS: './public/js',
  buildJSVendor: './public/js/vendor',
  buildCSS: './public/css',
  buildHTML: './public',
  buildStatic: './public/static',
  buildJson: './public/api'
};

gulp.task('scripts_vendor', function(){
  gulp.src(paths.scriptsVendor)
  .pipe(uglify())
  .pipe(gulp.dest(paths.buildJSVendor));
});

gulp.task('scripts', ['scripts_vendor'], function() {
  gulp.src(paths.scripts)
    .pipe(coffee({bare: true}).on('error', gutil.log))
    .pipe(uglify())
    .pipe(concat('all.min.js'))
    .pipe(gulp.dest(paths.buildJS));
});

gulp.task('styles', function(){
  gulp.src(paths.styles)
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(concat('all.min.css'))
    .pipe(gulp.dest(paths.buildCSS));
});

gulp.task('html', function(){
  gulp.src(paths.templates)
      .pipe(mustache({
        'header' : header,
        'templates' : templates,
        'scripts': scripts,
        'styles': styles,
        'ruler': ruler
      }))
    	.pipe(rename({
        extname: '.html'
      }))
      .pipe(gulp.dest(paths.buildHTML));
});

gulp.task('json', function(){
  gulp.src(paths.srcJson)
  .pipe(gulp.dest(paths.buildJson));
});

gulp.task('static', function(){
  gulp.src(paths.srcStatic)
      .pipe(gulp.dest(paths.buildStatic));
});

gulp.task('compile', ['styles', 'scripts', 'html', 'static', 'json']);

gulp.task('default', ['compile'], function(){
  gulp.watch(paths.styles, ['styles']);
  gulp.watch(paths.scripts, ['scripts']);
  gulp.watch(paths.scriptsVendor, ['scripts_vendor']);
  gulp.watch(paths.templates, ['html']);
  gulp.watch(paths.srcStatic, ['static']);
  gulp.watch(paths.srcJson, ['json']);
});
