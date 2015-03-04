/*
file:           index.js
author:         Antonino Parisi
email:          tabman83@gmail.com
date:           04/03/2015 02:35
description:    scheduler
*/
var nodeScheduler = require('node-schedule');
var moment = require('moment');

module.exports = new function() {
	/*
	{ name: 'New schedule',
  type: 'ON',
  recurrence: 'oneTime',
  repetition: [],
  startDate: '2015-03-04T02:32:00.000Z'
  }
*/
	var scheduleFunction = function(type) {
		console.log("Executing schedule for "+type+" @ "+moment());
	}


	this.create = function(payload) {
		if(payload.recurrence === 'oneTime') {
			nodeScheduler.scheduleJob(moment(payload.startDate).toDate(), scheduleFunction.bind(this, payload.type));
			if(payload.type === 'ONtoOFF' || payload.type === 'OFFtoON') {
				nodeScheduler.scheduleJob(moment(payload.endDate).toDate(), scheduleFunction.bind(this, payload.type));
			}
		}
		if(payload.recurrence === 'weekly') {
			var rule = new nodeScheduler.RecurrenceRule();
			rule.dayOfWeek = payload.repetition.slice();
			rule.hour = moment(payload.startDate).hour();
			rule.minute = moment(payload.startDate).minute();
			nodeScheduler.scheduleJob(rule, scheduleFunction.bind(this, payload.type));

			if(payload.type === 'ONtoOFF' || payload.type === 'OFFtoON') {
				rule = new nodeScheduler.RecurrenceRule();
				rule.dayOfWeek = payload.repetition.slice();
				rule.hour = moment(payload.endDate).hour();
				rule.minute = moment(payload.endDate).minute();
				nodeScheduler.scheduleJob(rule, scheduleFunction.bind(this, payload.type));
			}
		}
	}

};
