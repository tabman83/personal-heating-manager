/**
  * @file        schedule.js
  * @author      Antonino Parisi <tabman83@gmail.com>
  * @date        03/03/2015 13:53
  * @description Route for schedules
  */

var ScheduleController = require('./../controllers/schedule');

var scheduleController = new ScheduleController();

var routes = [{
	method: 'POST',
	path: '/schedules',
	config: {
		//auth: 'simple',
		handler: scheduleController.insertSchedule.bind(scheduleController)
	}
}, {
	method: 'GET',
	path: '/schedules',
	config: {
		//auth: 'simple',
		handler: scheduleController.getSchedule.bind(scheduleController)
	}
}];

module.exports.routes = function (server) {
	server.route(routes);
};
