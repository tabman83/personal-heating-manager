/*
file:           index.js
author:         Antonino Parisi
email:          tabman83@gmail.com
date:           22/02/2015 23:33
description:    main file
*/

var Hapi = require('hapi');
var mongoose = require('mongoose');
var nconf = require('nconf');
var mosca = require('mosca');
var async = require('async');
var readLine = require ("readline");

nconf.file('./config.json');

// load up routes
var heaterRoutes = require('./routes/heater');
var humidityRoutes = require('./routes/humidity');
var temperatureRoutes = require('./routes/temperature');
var webHttpRoutes = require('./routes/webHttp');

// Create a server with a host and port
var server = new Hapi.Server();
server.connection({
    host: nconf.get('server_host') || localhost,
    port: nconf.get('server_port') || 3000
});
heaterRoutes.routes(server);
humidityRoutes.routes(server);
temperatureRoutes.routes(server);
webHttpRoutes.routes(server);

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
        mongoose.connect(nconf.get('db_host') || 'mongodb://localhost/PHM', options);
    } catch (err) {
        console.log('Could not connect to database.', err);
        cb(err);
    }
}

function startMqttBroker(cb) {
    var pubsubsettings = {
        //using ascoltatore
        type: 'mongo',
        url: 'mongodb://localhost:27017/mqtt',
        pubsubCollection: 'ascoltatori',
        mongo: {}
    };

    var moscaSettings = {
        port: 1883,           //mosca (mqtt) port
        backend: pubsubsettings   //pubsubsettings is the object we created above
    };

    // mqtt publish -h localhost -t 'test' -m '25'
    // mqtt subscribe -v -h localhost -t 'test'

    function onMoscaServerReady() {
        console.log('MQTT broker is up and running.');
        cb(null);
    }

    try {
        var moscaServer = new mosca.Server(moscaSettings);   //here we start mosca
        moscaServer.on('ready', onMoscaServerReady);  //on init it fires up setup()
    } catch(err) {
        cb(err);
    }
}

function startHapiServer(cb) {
    // Start the server
    server.start(function() {
        console.log('personal-heater-manager server started @ ' + server.info.uri);
        cb(null);
    });
}

function gracefulExit () {
    mongoose.connection.close(function () {
        console.log('Mongoose default connection is disconnected through app termination');
        process.exit(0);
    });
}

if (process.platform === "win32"){
    var rl = readLine.createInterface ({
        input: process.stdin,
        output: process.stdout
    });

    rl.on ("SIGINT", function (){
        process.emit ("SIGINT");
    });

}
process.on('SIGINT', gracefulExit).on('SIGTERM', gracefulExit);

async.series([openDbConnection, startMqttBroker, startHapiServer]);
