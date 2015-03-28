/*
file:           index.js
author:         Antonino Parisi
email:          tabman83@gmail.com
date:           26/03/2015 20:38
description:    GPIOs manager
*/

var mqtt                = require('mqtt');
var nconf               = require('nconf');
var heatingTopic        = nconf.get('mqtt_topic_heating');
var heatingActuatorPin  = nconf.get('heating_actuator_pin');


module.exports = new function() {

	var Gpio = null;
	var heatingActuator = null;

	this.start = function(cb) {
		if(/^linux/.test(process.platform)) {
			Gpio = require('onoff').Gpio;
			heatingActuator = new Gpio(heatingActuatorPin, 'out');
			heatingActuator.writeSync(0);
			//console.log('GPIOs successfully initialized.')
		} else {
			console.error('Could not initialize the GPIOs.');
		}
		cb(null);
	}

	this.setHeating = function(val) {
		if(Gpio) {
			//console.log('Writing to GPIO '+heatingActuatorPin);
			heatingActuator.writeSync(val);
		}
	}

	this.close = function(cb) {
		if(Gpio) {
			//console.log('Unexporting GPIO.');
			heatingActuator.unexport();
		}
		cb(null);
	}

}
