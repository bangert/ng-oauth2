'use strict';

var vendordeps = require('wiredep')().js;
var applicationFiles = [
    'src/js/**/*.js'
];
var testFiles = [
    'test/unit/**/*.js'
];

var files = vendordeps.concat(applicationFiles.concat(testFiles));

module.exports = function (config) {
    config.set({

        files: files,

        preprocessors: {
            'src/js/**/*.js': ['coverage']
        },

        exclude: [
            'src/js/stubs/**/*.js'
        ],

        autoWatch: true,

        frameworks: ['jasmine'],

        browsers: ['Chrome'],

        plugins: [
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-jasmine',
            'karma-junit-reporter',
            'karma-teamcity-reporter',
            'karma-coverage',
            'karma-allure-reporter'
        ],

        reporters: ['progress'],

        coverageReporter: {
            reporters: [
                {type: 'html', dir: 'test_results/coverage/', subdir: 'html'},
                {type: 'teamcity'},
                {type: 'text-summary'},
                {type: 'cobertura', dir: 'test_results/coverage/', subdir: 'cobertura'},
                {type: 'json', dir: 'test_results/coverage/', subdir: 'json'},
            ]
        },

        junitReporter: {
            outputFile: 'test_results/unit/unit.xml',
            suite: 'unit'
        },

        allureReport: {
            reportDir: 'test_results/allure-results'
        }

    });
};
