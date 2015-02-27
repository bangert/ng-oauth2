'use strict';

var gulp        = require('gulp');
var enforcer    = require("gulp-istanbul-enforcer");

gulp.task('enforce-coverage', function () {
    var options = {
        thresholds: {
            statements: 95,
            branches: 95,
            lines: 95,
            functions: 95
        },
        coverageDirectory: 'test_results/coverage/report',
        rootDirectory: ''
    };
    return gulp
        .src('test_results/coverage/json/**/*.*')
        .pipe(enforcer(options));
});