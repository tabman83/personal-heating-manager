var Joi = require("joi");
var TemperatureController = require('./../controllers/temperature');

var temperatureController = new TemperatureController();

var routes = [{
	method: 'POST',
	path: '/temperatures',
	config: {
		handler: temperatureController.insertTemperature.bind(temperatureController),
		validate: {
			payload: {
				value: Joi.number().precision(2).min(1).max(5)
			} 
		}
	}
}];

module.exports.routes = function (server) {
	server.route(routes);
};