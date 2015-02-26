'use strict';

var vendordeps = require('wiredep')().js;
var applicationFiles = [
    'src/js/oauth/oauthProvider.js',
    'src/js/oauth/**/*.js',
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
            'src/js/stub/**/*.js',
            'src/js/oauth/oauthStartup.js'
        ],

        autoWatch: true,

        frameworks: ['jasmine'],

        browsers: ['PhantomJS'],

        plugins: [
            'karma-phantomjs-launcher',
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
