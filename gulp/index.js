'use strict';

var fs = require('fs');
var onlyScripts = require('./util/scriptFilter');
var tasks = fs.readdirSync('./gulp/tasks/').filter(onlyScripts);

/**
 * loads all tasks in the ./tasks/ sub-directory.
 */
tasks.forEach(function(task) {
    require('./tasks/' + task);
});
