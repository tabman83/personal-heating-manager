/*
file:           index.js
author:         Antonino Parisi
email:          tabman83@gmail.com
date:           22/02/2015 23:33
description:    main file
*/

var Hapi = require('hapi');
var app = require('./routes/app');

var port = process.env.PORT || 3000;
var host = process.env.HOST || 'localhost';

// Create a server with a host and port
var server = new Hapi.Server(host, port, { cors: true });
app.routes(server);

// Start the server
server.start(function() {
	console.log("personal-heater-manager server started @ " + server.info.uri);
});
