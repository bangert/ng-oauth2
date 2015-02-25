'use strict';

var cache           = require('gulp-angular-templatecache');
var rename          = require('gulp-rename');
var filesize        = require('gulp-filesize');
var ngmin           = require('gulp-ngmin');
var concat          = require('gulp-concat');
var uglify          = require('gulp-uglify');
var gulp            = require('gulp');
var removeUseStrict = require("gulp-remove-use-strict");

// Dist JS
gulp.task('dist', ['clean', 'js'], function () {
    return gulp.src([
        'src/js/oauth/**/*.js'
    ])
        .pipe(concat('ng-oauth2.js'))
        .pipe(removeUseStrict())
        .pipe(filesize())
        .pipe(gulp.dest('dist'));
});