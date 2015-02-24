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

mongoose.connection.on('error', function(error) {
    console.error('Could not connect to database.');
    console.error(error);
});

mongoose.connection.once('open', function (callback) {
    // Start the server
    server.start(function() {
        console.log("personal-heater-manager server started @ " + server.info.uri);

        var TemperaturePoint = require('./models/temperaturePoint');
        var temperaturePoint = new TemperaturePoint({ value: 24.81 });
        temperaturePoint.save(function (err) {
          if (err) {
              console.log(err);
          }
        });
    });
});

mongoose.connect(nconf.get('db_host') || 'mongodb://localhost/PHM');
