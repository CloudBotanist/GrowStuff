'use strict';

/**
 * Module dependencies.
 */
var express = require('express'),
    fs = require('fs'),
    passport = require('passport'),
    logger = require('mean-logger'),
    io = require('socket.io');

/**
 * Main application entry file.
 * Please note that the order of loading is important.
 */

// Load configurations
// Set the node enviornment variable if not set before
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// Initializing system variables

var config = require('./config/config'),
    mongoose = require('mongoose');

// Bootstrap db connection
var db = mongoose.connect(config.db);

// Bootstrap models
var models_path = __dirname + '/app/models';
var walk = function(path) {
    fs.readdirSync(path).forEach(function(file) {
        var newPath = path + '/' + file;
        var stat = fs.statSync(newPath);
        if (stat.isFile()) {
            if (/(.*)\.(js$|coffee$)/.test(file)) {
                require(newPath);
            }
        } else if (stat.isDirectory()) {
            walk(newPath);
        }
    });
};
walk(models_path);

// Bootstrap passport config
require('./config/passport')(passport);

var app = express();

// Express settings
require('./config/express')(app, passport, db);

// Bootstrap routes
var routes_path = __dirname + '/app/routes';
var walk = function(path) {
    fs.readdirSync(path).forEach(function(file) {
        var newPath = path + '/' + file;
        var stat = fs.statSync(newPath);
        if (stat.isFile()) {
            if (/(.*)\.(js$|coffee$)/.test(file)) {
                require(newPath)(app, passport);
            }
        // We skip the app/routes/middlewares directory as it is meant to be
        // used and shared by routes as further middlewares and is not a
        // route by itself
        } else if (stat.isDirectory() && file !== 'middlewares') {
            walk(newPath);
        }
    });
};
walk(routes_path);


/**
 * Server creation
 */
var port = process.env.PORT || config.port;
var server = require('http').createServer(app);

// Socket creation
var sio = io.listen(server);

// Socket configuration
sio.set('log level',1);
sio.configure(function () {
    sio.set('transports', ['xhr-polling']);
    sio.set('polling duration', 10);
});

var connected_user = {};
sio.sockets.on('connection', function (socket) {
    var user = null;
    var lastStatus = null;

    socket.on('identification', function (data) {
        user = data.mac_adress;
        lastStatus = data.status;

        console.log('New connection from :' + user);

        connected_user[user] = socket;

        console.log('Send Init');
        var bob = function () {
            setTimeout(function() {
                socket.emit('watering', 5);
                bob();
            }, 3000);
        };
    });

    socket.on('status', function(status) {
        console.log('Status update :');
        console.log(status);

        console.log('Send watering message');
        socket.emit('watering', 5);
    });
});

server.listen(port);
console.log('Express app started on port ' + port);

// Initializing logger
logger.init(app, passport, mongoose);

// Expose app
exports = module.exports = app;
