/*
file:           index.js
author:         Antonino Parisi
email:          tabman83@gmail.com
date:           22/02/2015 23:33
description:    main file
*/

// load the configuration
var nconf = require('nconf').file('./config.json');

// load all the models
require('./models/');

var Hapi = require('hapi');
var mongoose = require('mongoose');
var async = require('async');
var readLine = require ('readline');
var Bcrypt = require('bcrypt');
var hapiAuthBasic = require('hapi-auth-basic');
var mqttBroker = require('./mqtt/broker');
var mqttLogger = require('./mqtt/logger');
var gpioManager = require('./gpioManager/');
var routes = require('./routes/');
var scheduler = require('./scheduler/');

function openDbConnection(cb) {
    mongoose.connection.on('error', function(err) {
        console.error('Could not connect to database.', err);
        cb(err);
    });
    mongoose.connection.once('open', function (callback) {
        console.log('Database connection successfully established.');
        cb(null);
    });
    var options = {
        server: {
            socketOptions: {
                keepAlive: 1
            }
        },
        replset: {
            socketOptions: {
                keepAlive: 1
            }
        }
    }
    try {
        mongoose.connect(nconf.get('db') || 'mongodb://localhost/PHM', options);
    } catch (err) {
        console.log('Could not connect to database.', err);
        cb(err);
    }
}

function startHapiServer(cb) {

    // Create a server with a host and port
    var server = new Hapi.Server();
    server.connection({
        host: nconf.get('web_server_address') || '0.0.0.0',
        port: nconf.get('web_server_port') || 3000,
        routes: { cors: true }
    });

    var users = nconf.get('users');
    var validate = function (username, password, callback) {
        var storedPassword = users[username];
        if (!storedPassword) {
            return callback(null, false);
        }
        Bcrypt.compare(password, storedPassword, function (err, isValid) {
            callback(err, isValid, { username: username });
        });
    };
    server.register(hapiAuthBasic, function (err) {
        server.auth.strategy('simple', 'basic', {validateFunc: validate});
        //server.auth.default('simple');
    });

    routes(server);
    // Start the server
    server.start(function(err) {
        if(err) {
            cb(err);
            return;
        }
        console.log('personal-heating-manager server started @ ' + server.info.uri);
        cb(null);
    });

}

function gracefulExit () {
    gpioManager.close(function() {
        mongoose.connection.close(function () {
            console.log('Mongoose default connection is disconnected through app termination');
            process.exit(0);
        });
    });
}

if (process.platform === "win32"){
    var rl = readLine.createInterface ({
        input: process.stdin,
        output: process.stdout
    });

    rl.on("SIGINT", function (){
        process.emit ("SIGINT");
    });

}
process.on('SIGINT', gracefulExit).on('SIGTERM', gracefulExit);

async.series([openDbConnection, mqttBroker.start, scheduler.reloadAllSchedules, mqttLogger.start, gpioManager.start, startHapiServer], function(err, results){
    if(err) {
        console.error(err);
        gracefulExit();
    }
});
