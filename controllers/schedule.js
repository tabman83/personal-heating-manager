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
		new Schedule(request.payload).save(function (err) {
			if (err) {
				console.error(err);
				reply( { message: 'Cannot save schedule.' } ).code(500);
				return;
			}

			scheduler.create(request.payload);
			reply( { message: 'Success.' } );
		});
	},

	getScheduleById: function (request, reply) {
		Schedule
			.findById(request.params.id, '-__v')
			.lean()
			.exec(queryCallback);

		function queryCallback (err, result) {
			if (err) {
				console.error(err);
				reply( { message: 'Error retrieving the specified schedule.' } ).code(500);
				return;
			}

			if(!result) {
				reply( { message: 'Cannot find the specified schedule.' } ).code(404);
				return;
			}

			reply(result);
		}
	},

	updateSchedule: function (request, reply) {
		Schedule.update({ _id: request.params.id }, request.payload, function(err) {
			if (err) {
				console.error(err);
				reply( { message: 'Error updating the specified schedule.' } ).code(500);
				return;
			}

			reply( { message: 'Success.' } );
		});
	},

	deleteSchedule: function (request, reply) {
		Schedule.remove({ _id: request.params.id }, function(err) {
			if (err) {
				console.error(err);
				reply( { message: err.message } ).code(500);
				return;
			}

			reply( { message: 'Success.' } );
		});
	},

	getSchedules: function (request, reply) {

		var limit = parseInt(request.query.limit, 10);
		if( typeof(limit) !== 'number' || isNaN(limit) ) {
			limit: -1;
		}

		Schedule
			.find()
			.sort({ created: 'desc' })
			.select({ __v: 0 })
			.limit(limit)
			.lean()
			.exec(queryCallback);

		function queryCallback(err, result) {
			if (err) {
				console.error(err);
				reply( { message: 'Cannot retrieve schedules.' } ).code(500);
				return;
			}

			reply(result);
		}

	}
}

module.exports = ScheduleController;
