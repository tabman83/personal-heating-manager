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

module.exports = function (nconf, heatingManager, scheduler, server) {
	var auth = nconf.get('debug') ? null : 'simple';
	heating.routes(auth, heatingManager, server);
	humidity.routes(auth, server);
	temperature.routes(auth, server);
	schedule.routes(auth, scheduler, server);
	website.routes(auth, server);
};
