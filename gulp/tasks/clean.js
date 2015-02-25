'use strict';

var rimraf      = require('gulp-rimraf');
var gulp        = require('gulp');

/**
 * Clean all build and dist folders. Used as primary task in preparation for a full build.
 */
gulp.task('clean', function () {
    return gulp.src(
        [
            './dist',
            './test_results'
        ]).pipe(rimraf());
});
