/*
file:           index.js
author:         Antonino Parisi
email:          tabman83@gmail.com
date:           04/03/2015 02:35
description:    scheduler
*/
var nodeScheduler = require('node-schedule');
var moment = require('moment');
var mqtt    = require('mqtt');
var nconf = require('nconf');
var heaterTopic = nconf.get('mqtt_topic_heater');

module.exports = new function() {

	var client = mqtt.connect('mqtt://localhost');

	var scheduleFunction = function(type) {		
		if(type==='ON') {
			client.publish(heaterTopic, '1');
		}
		if(type==='OFF') {
			client.publish(heaterTopic, '0');
		}
		console.log("Executing schedule for "+type+" @ "+moment().format() );
	}


	this.create = function(payload) {
		var rule, type;

		if(payload.recurrence === 'oneTime') {
			type = payload.type.split('to').slice(0,1);
			nodeScheduler.scheduleJob(moment(payload.startDate).toDate(), scheduleFunction.bind(null, type) );
			if(payload.type === 'ONtoOFF' || payload.type === 'OFFtoON') {
				type = payload.type.split('to').slice(-1);
				nodeScheduler.scheduleJob(moment(payload.endDate).toDate(), scheduleFunction.bind(null, type));
			}
		}
		if(payload.recurrence === 'weekly') {
			var rule = new nodeScheduler.RecurrenceRule();
			rule.dayOfWeek = payload.repetition.slice();
			rule.hour = moment(payload.startDate).hour();
			rule.minute = moment(payload.startDate).minute();
			type = payload.type.split('to').slice(0,1);
			nodeScheduler.scheduleJob(rule, scheduleFunction.bind(null, type));

			if(payload.type === 'ONtoOFF' || payload.type === 'OFFtoON') {
				rule = new nodeScheduler.RecurrenceRule();
				rule.dayOfWeek = payload.repetition.slice();
				rule.hour = moment(payload.endDate).hour();
				rule.minute = moment(payload.endDate).minute();
				type = payload.type.split('to').slice(-1);
				nodeScheduler.scheduleJob(rule, scheduleFunction.bind(null, type));
			}
		}
	}

};
