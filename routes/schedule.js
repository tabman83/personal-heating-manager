/**
  * @file        schedule.js
  * @author      Antonino Parisi <tabman83@gmail.com>
  * @date        03/03/2015 13:53
  * @description Route for schedules
  */

module.exports.routes = function (auth, scheduler, server) {

	var ScheduleController = require('./../controllers/schedule');
	var scheduleController = new ScheduleController(scheduler);

	var routes = [{
		method: 'POST',
		path: '/schedules',
		config: {
			auth: auth,
			handler: scheduleController.insertSchedule.bind(scheduleController)
		}
	}, {
		method: 'GET',
		path: '/schedules',
		config: {
			auth: auth,
			handler: scheduleController.getSchedules.bind(scheduleController)
		}
	}, {
		method: 'GET',
		path: '/schedules/{id}',
		config: {
			auth: auth,
			handler: scheduleController.getScheduleById.bind(scheduleController)
		}
	}, {
		method: 'PUT',
		path: '/schedules/{id}',
		config: {
			auth: auth,
			handler: scheduleController.updateSchedule.bind(scheduleController)
		}
	}, {
		method: 'DELETE',
		path: '/schedules/{id}',
		config: {
			auth: auth,
			handler: scheduleController.deleteSchedule.bind(scheduleController)
		}
	}];
	server.route(routes);
};
