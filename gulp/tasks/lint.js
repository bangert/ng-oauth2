'use strict';

var gulp        = require('gulp');
var jshint      = require('gulp-jshint');

/**
 * Run JsHint against all of your code to check for syntax errors and potential problems.
 **/
gulp.task('lint', function () {

    return gulp.src(['./src/js/**/*.js', './test/**/*.js', './gulp/**/*.js'])
        .pipe(jshint())
        .pipe(jshint.reporter(require('jshint-stylish')));
});