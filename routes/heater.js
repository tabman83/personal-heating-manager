var Joi = require("joi");
var HeaterController = require('./../controllers/heater');

var heaterController = new HeaterController();

var routes = [{
	method: 'GET',
	path: '/heater',
	config: {
		handler: heaterController.getHeater.bind(heaterController)
	}
}, {
	method: 'PUT',
	path: '/heater',
	config: {
		handler: heaterController.setHeater.bind(heaterController),
		validate: {
			payload: {
				value: Joi.boolean()
			} 
		}
	}
}];

module.exports.routes = function (server) {
	server.route(routes);
};