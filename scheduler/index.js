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
var Schedule = require('mongoose').model('Schedule');
var heatingTopic = nconf.get('mqtt_topic_heating');

module.exports = new function() {

	var self = this;

	var scheduleFunction = function(name, type) {
		var client = mqtt.connect('mqtt://localhost');
		var message = new Buffer([type == 'ON' ? 1 : 0]);
		console.log('Running schedule \''+name+'\' for '+type+' @ '+moment().format() );
		client.publish(heatingTopic, message, function(err) {
			if(err) {
				console.error('Schedule run failed: ', err);
			} else {
				console.log('Schedule run successfully.');
			}
			client.end();
		});
	}

	this.reloadAllSchedules = function(cb) {
		Schedule
			.find()
			.sort({ created: 'desc' })
			.select({ __v: 0 })
			.lean()
			.exec(queryCallback);

		function queryCallback(err, result) {
			if (err) {
				console.error(err);
				cb(err);
				return;
			}
			result.forEach(function(schedule) {
				self.create(schedule);
			});
			cb(null);
		}
	}

	this.create = function(payload) {
		var rule, type;

		if(payload.recurrence === 'oneTime') {
			type = payload.type.split('to').slice(0,1);
			nodeScheduler.scheduleJob(moment(payload.startDate).toDate(), scheduleFunction.bind(null, payload.name, type) );
			if(payload.type === 'ONtoOFF' || payload.type === 'OFFtoON') {
				type = payload.type.split('to').slice(-1);
				nodeScheduler.scheduleJob(moment(payload.endDate).toDate(), scheduleFunction.bind(null, payload.name, type));
			}
		}
		if(payload.recurrence === 'weekly') {
			var rule = new nodeScheduler.RecurrenceRule();
			rule.dayOfWeek = payload.repetition.slice();
			rule.hour = moment(payload.startDate).hour();
			rule.minute = moment(payload.startDate).minute();
			type = payload.type.split('to').slice(0,1);
			nodeScheduler.scheduleJob(rule, scheduleFunction.bind(null, payload.name, type));

			if(payload.type === 'ONtoOFF' || payload.type === 'OFFtoON') {
				rule = new nodeScheduler.RecurrenceRule();
				rule.dayOfWeek = payload.repetition.slice();
				rule.hour = moment(payload.endDate).hour();
				rule.minute = moment(payload.endDate).minute();
				type = payload.type.split('to').slice(-1);
				nodeScheduler.scheduleJob(rule, scheduleFunction.bind(null, payload.name, type));
			}
		}
	}

};
