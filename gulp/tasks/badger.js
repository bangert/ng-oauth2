'use strict';

var gulp        = require('gulp');
var badger      = require('istanbul-cobertura-badger');

gulp.task('coverage-badger', function () {
    badger("test_results/coverage/cobertura/cobertura-coverage.xml", "test_results/coverage/", function () {
        console.log("Created badge for code coverage");
    });
});