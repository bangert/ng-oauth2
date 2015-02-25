/**
 * A Node Express Server config,
 * used to serve front-end app during development.
 *
 * Starting server locally:
 *  node server.js
 *
 * Now you can visit http://localhost:8000 to view your server
 */
var express = require('express');
var app = express();

/* Development */
app.use('/bower_components', express.static(__dirname + '/bower_components'));
app.use('/src/js', express.static(__dirname + '/src/js'));

app.all('/src*', function (req, res, next) {
    res.sendFile('src/index.html', {root: __dirname});
});

app.all('/', function (req, res, next) {
    res.redirect('src/index.html');
});

var server = app.listen(8000, function () {
    console.log('Express server listening on port %d', server.address().port);
});