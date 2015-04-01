'use strict';

var path = require('path'),
    gulp = require('gulp'),
    replace = require('gulp-replace'),
    webpack = require('gulp-webpack-build');

var src = './',
    dest = '../bin/static/js',
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
        .pipe(gulp.dest(dest));
});

gulp.task('default', ['webpack'], function(){
   return gulp.src('index.html')
        .pipe(replace(/@@hash/g, Date.now()))
        .pipe(gulp.dest('../bin/templates'));
});

gulp.task('watch', function() {
    gulp.watch(path.join('./', '**/*.*')).on('change', function(event) {
        if (event.type === 'changed') {
            gulp.src(event.path)
                .pipe(webpack.closest())
                .pipe(webpack.watch(webpackOptions, function(stream, err, stats) {
                    stream
                        .pipe(webpack.proxy(err, stats))
                        .pipe(webpack.format({
                            verbose: true,
                            version: false
                        }))
                        .pipe(gulp.dest(dest));
                }));
        }
    });
});