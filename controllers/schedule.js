/*
file:           schedule.js
author:         Antonino Parisi
email:          tabman83@gmail.com
date:           03/03/2015 14:52
description:    schedule controller
*/

module.exports = ScheduleController;

var Schedule = require('../models/schedule');

function ScheduleController() { }

ScheduleController.prototype = {

	insertSchedule: function (request, reply) {
		var schedule = new Schedule(request.payload);
		schedule.save(function (err) {
			if (err) {
				console.error(err);
				reply( { message: 'Cannot save schedule.' } ).code(500);
			} else {
				reply( { message: 'Success.' } );
			}
		});
	},

	getSchedule: function (request, reply) {

		var limit = parseInt(request.query.limit, 10);
		if( typeof(value) !== 'number' ) {
			limit: 500;
		}

		function queryCallback(err, temperaturePoints) {
			if (err) {
				console.error(err);
				reply( { message: 'Cannot retrieve schedules.' } ).code(500);
			} else {
				reply(temperaturePoints);
			}
		}

		Schedule
			.find()
			.sort({ created: 'desc' })
			.select({ __v: 0 })
			.limit(limit)
			.exec(queryCallback);
	}
}
