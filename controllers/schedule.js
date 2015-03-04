/*
file:           schedule.js
author:         Antonino Parisi
email:          tabman83@gmail.com
date:           03/03/2015 14:52
description:    schedule controller
*/
var Schedule = require('mongoose').model('Schedule');
var scheduler = require('../scheduler/');

function ScheduleController() { }

ScheduleController.prototype = {

	insertSchedule: function (request, reply) {
		var schedule = new Schedule(request.payload);
		schedule.save(function (err) {
			if (err) {
				console.error(err);
				reply( { message: 'Cannot save schedule.' } ).code(500);
			} else {
				scheduler.create(request.payload);
				reply( { message: 'Success.' } );
			}
		});
	},

	getScheduleById: function (request, reply) {
		Schedule.findById(request.params.id, '-__v', function(err, schedule) {
			if (err) {
				console.log(err);
				reply( { message: err.message } ).code(500);
			} else {
				if(!schedule) {
					reply( { message: 'Cannot find the specified schedule.' } ).code(404);
				} else {
					reply(schedule);
				}
			}
		});
	},

	updateSchedule: function (request, reply) {
		//Model.findByIdAndUpdate(id, [update], [options], [callback])
		Schedule.findByIdAndUpdate(request.params.id, request.payload, function(err, schedule) {
			if (err) {
				console.log(err);
				reply( { message: err.message } ).code(500);
			} else {
				reply( { message: 'Success.' } );
			}
		});
	},

	getSchedules: function (request, reply) {

		var limit = parseInt(request.query.limit, 10);
		if( typeof(value) !== 'number' ) {
			limit: 500;
		}

		function queryCallback(err, schedule) {
			if (err) {
				console.error(err);
				reply( { message: 'Cannot retrieve schedules.' } ).code(500);
			} else {
				reply(schedule);
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

module.exports = ScheduleController;
