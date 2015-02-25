'use strict';

var gulp        = require('gulp');
var enforcer    = require("gulp-istanbul-enforcer");

gulp.task('enforce-coverage', function () {
    var options = {
        thresholds: {
            statements: 80,
            branches: 80,
            lines: 80,
            functions: 80
        },
        coverageDirectory: 'test_results/coverage/report',
        rootDirectory: ''
    };
    return gulp
        .src('test_results/coverage/json/**/*.*')
        .pipe(enforcer(options));
});