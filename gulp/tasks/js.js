'use strict';

var concat          = require('gulp-concat');
var uglify          = require('gulp-uglify');
var rename          = require('gulp-rename');
var filesize        = require('gulp-filesize');
var gulp            = require('gulp');
var vendorjs        = require('wiredep')().js;
var removeUseStrict = require("gulp-remove-use-strict");

/**
 * Concatenate and minify the all application specific Javascript files into a single file for production.
 */
gulp.task('js', function () {
    return gulp.src([
        'src/js/oauth/**/*.js'
        ])
        .pipe(removeUseStrict())
        .pipe(concat('ng-oauth2.js'))
        .pipe(filesize())
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify({mangle: true}))
        .pipe(filesize())
        .pipe(gulp.dest('dist'));
});