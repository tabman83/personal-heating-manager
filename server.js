/*
file:           index.js
author:         Antonino Parisi
email:          tabman83@gmail.com
date:           22/02/2015 23:33
description:    main file
*/

var Hapi = require('hapi');

// load up routes
var heaterRoutes = require('./routes/heater');
var humidityRoutes = require('./routes/humidity');
var temperatureRoutes = require('./routes/temperature');
var webHttpRoutes = require('./routes/webHttp');

// Create a server with a host and port
var server = new Hapi.Server();
server.connection({ 
    host: process.env.HOST || 'localhost', 
    port: process.env.PORT || 3000 
});
heaterRoutes.routes(server);
humidityRoutes.routes(server);
temperatureRoutes.routes(server);
webHttpRoutes.routes(server);

// Start the server
server.start(function() {
	console.log("personal-heater-manager server started @ " + server.info.uri);
});
