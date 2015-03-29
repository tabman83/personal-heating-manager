/*
file:           index.js
author:         Antonino Parisi
email:          tabman83@gmail.com
date:           04/03/2015 02:35
description:    scheduler
*/

(function () {
	var nodeScheduler = require('node-schedule');
	var moment = require('moment');

	function Scheduler(nconf, heatingManager) {
		if (!(this instanceof Scheduler)) return new Scheduler(nconf, heatingManager);

		this.nconf = nconf;
		this.heatingManager = heatingManager;

		this.reloadAllSchedules();
	}

	Scheduler.prototype.scheduleFunction = function(name, type) {
		var value = (type == 'ON' ? 1 : 0);
		console.log('Running schedule \''+name+'\' for '+type+' @ '+moment().format() );

		this.heatingManager.switch(value, 'schedule', function(err) {
			if(err) {
				console.error('Schedule run failed: ', err);
				return;
			}
			console.log('Schedule run successfully.');
		});
	}

	Scheduler.prototype.reloadAllSchedules = function(cb) {
		var that = this;
		var cb = cb || function() {};
		var Schedule = require('mongoose').model('Schedule');
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
				that.create(schedule);
			});
			cb(null);
		}
	}

	Scheduler.prototype.create = function(payload) {
		var rule, type;

		if(payload.recurrence === 'oneTime') {
			type = payload.type.split('to').slice(0,1);
			nodeScheduler.scheduleJob(moment(payload.startDate).toDate(), this.scheduleFunction.bind(this, payload.name, type) );
			if(payload.type === 'ONtoOFF' || payload.type === 'OFFtoON') {
				type = payload.type.split('to').slice(-1);
				nodeScheduler.scheduleJob(moment(payload.endDate).toDate(), this.scheduleFunction.bind(this, payload.name, type));
			}
		}
		if(payload.recurrence === 'weekly') {
			var rule = new nodeScheduler.RecurrenceRule();
			rule.dayOfWeek = payload.repetition.slice();
			rule.hour = moment(payload.startDate).hour();
			rule.minute = moment(payload.startDate).minute();
			type = payload.type.split('to').slice(0,1);
			nodeScheduler.scheduleJob(rule, this.scheduleFunction.bind(this, payload.name, type));

			if(payload.type === 'ONtoOFF' || payload.type === 'OFFtoON') {
				rule = new nodeScheduler.RecurrenceRule();
				rule.dayOfWeek = payload.repetition.slice();
				rule.hour = moment(payload.endDate).hour();
				rule.minute = moment(payload.endDate).minute();
				type = payload.type.split('to').slice(-1);
				nodeScheduler.scheduleJob(rule, this.scheduleFunction.bind(this, payload.name, type));
			}
		}
	}

	module.exports = Scheduler;

})();
