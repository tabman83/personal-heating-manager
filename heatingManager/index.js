/*
file:           index.js
author:         Antonino Parisi
email:          tabman83@gmail.com
date:           28/03/2015 19:50
description:    Heating manager
*/

(function () {

	var async = require('async');

	function HeatingManager(nconf, io) {
		if (!(this instanceof HeatingManager)) return new HeatingManager(nconf, io);

		this.nconf = nconf;
		this.io = io;

		if(/^linux/.test(process.platform)) {
			var Gpio = require('onoff').Gpio;
			var heatingActuatorPin = nconf.get('heating_actuator_pin');
			this.heatingGpio = new Gpio(heatingActuatorPin, 'out');
			this.heatingGpio.writeSync(0);
			//console.log('GPIOs successfully initialized.')
		} else {
			console.error('Could not initialize the GPIOs.');
		}
	}

	HeatingManager.prototype.switchOn = function(reason, cb) {
		// database, sockets, gpio
		var heatingModel = require('mongoose').model('Heating');

		var tasks = [];

		if(this.heatingGpio) {
			tasks.push( heatingGpio.write.bind(heatingGpio, 1) );
		}

		tasks.push( heatingModel.switchOn.bind(heatingModel, reason) );

		tasks.push( function(cb) {
			this.io.emit('ON');
			cb(null);
		}.bind(this) );

		async.parallel(tasks, cb);
	}

	HeatingManager.prototype.switchOn = function(reason, cb) {

		var heatingModel = require('mongoose').model('Heating');

		var tasks = [];

		if(this.heatingGpio) {
			tasks.push( heatingGpio.write.bind(heatingGpio, 0) );
		}

		tasks.push( heatingModel.switchOff.bind(heatingModel, reason) );

		tasks.push( function(cb) {
			this.io.emit('OFF');
			cb(null);
		}.bind(this) );

		async.parallel(tasks, cb);
	}

	HeatingManager.prototype.switch = function(switchOnOff, reason, cb) {
		var cb = cb || function() {};
		var switchOnOff = Boolean(switchOnOff);
		if(switchOnOff) {
			this.switchOn(cb);
		} else {
			this.switchOff(cb);
		}
	}

	module.exports = HeatingManager;

})();
