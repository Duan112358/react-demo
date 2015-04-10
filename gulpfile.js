'use strict';

var path = require('path'),
    gulp = require('gulp'),
    replace = require('gulp-replace'),
    less = require('gulp-less'),
    cssmin = require('gulp-minify-css'),
    webpack = require('gulp-webpack-build');

var config = require('./config.json');
var webpackConfig = require('./webpack.config.js');

var src = './',
    dest = 'build' + config.static + '/js',
    webpackOptions = {
        watchDelay: 200,
        isConfigFile: function(file) {
            return file && file.path.indexOf(webpack.config.CONFIG_FILENAME) >= 0;
        },
        isConfigObject: function(config) {
            return config && !config.ignore;
        },
        useMemoryFs: false
    };

gulp.task('webpack', function() {
    return gulp.src(src + webpack.config.CONFIG_FILENAME)
        .pipe(webpack.compile(webpackOptions))
        .pipe(webpack.format({
            version: false,
            timings: true
        }))
        .pipe(webpack.failAfter({
            errors: true,
            warnings: true
        }))
        .pipe(replace(/@@static/g, config.static))
        .pipe(gulp.dest('.'));
});

// Production build
gulp.task("build", ["less", "html", "img"]);

gulp.task("img", function(){
    gulp.src(['img/**/*.png', 'img/**/*.svg', 'img/**/*.jpg'])
    .pipe(gulp.dest('build' + config.static + '/img'));
});

gulp.task('less', function(){
    return gulp.src('less/app.less')
        .pipe(less())
        .pipe(replace(/@@static/g, config.static))
        .pipe(cssmin())
        .pipe(gulp.dest('build' + config.static + '/css'));
});

gulp.task('html', function(){
   return gulp.src('index.html')
        .pipe(replace(/@@hash/g, Date.now()))
        .pipe(replace(/@@static/g, config.static))
        .pipe(gulp.dest('build'));
});

gulp.task('default', ['webpack', 'less', 'html', 'img'], function() {
    gulp.watch('less/**/*.less', ['less']);
    gulp.watch('js/**/*.js', ['webpack']);
    gulp.watch('index.html', ['html']);
});
