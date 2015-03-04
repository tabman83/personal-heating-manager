/**
  * @file        schedule.js
  * @author      Antonino Parisi <tabman83@gmail.com>
  * @date        03/03/2015 13:53
  * @description Route for schedules
  */
var isDebug = require('nconf').get('debug');
var ScheduleController = require('./../controllers/schedule');
var scheduleController = new ScheduleController();

var routes = [{
	method: 'POST',
	path: '/schedules',
	config: {
		auth: isDebug ? null : 'simple',
		handler: scheduleController.insertSchedule.bind(scheduleController)
	}
}, {
	method: 'GET',
	path: '/schedules',
	config: {
		auth: isDebug ? null : 'simple',
		handler: scheduleController.getSchedules.bind(scheduleController)
	}
}, {
	method: 'GET',
	path: '/schedules/{id}',
	config: {
		auth: isDebug ? null : 'simple',
		handler: scheduleController.getScheduleById.bind(scheduleController)
	}
}, {
	method: 'PUT',
	path: '/schedules/{id}',
	config: {
		auth: isDebug ? null : 'simple',
		handler: scheduleController.updateSchedule.bind(scheduleController)
	}
}, {
	method: 'DELETE',
	path: '/schedules/{id}',
	config: {
		auth: isDebug ? null : 'simple',
		handler: scheduleController.deleteSchedule.bind(scheduleController)
	}
}];

module.exports.routes = function (server) {
	server.route(routes);
};
