/*
file:           index.js
author:         Antonino Parisi
email:          tabman83@gmail.com
date:           05/03/2015 12:38
description:    index for routes
*/

var heating = require('./heating');
var humidity = require('./humidity');
var temperature = require('./temperature');
var schedule = require('./schedule');
var website = require('./website');

module.exports = function (server) {
	heating.routes(server);
	humidity.routes(server);
	temperature.routes(server);
	schedule.routes(server);
	website.routes(server);
};
