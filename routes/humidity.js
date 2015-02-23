var Joi = require("joi");
var HumidityController = require('./../controllers/humidity');

var humidityController = new HumidityController();

var routes = [{
	method: 'POST',
	path: '/humidities',
	config: {
		handler: humidityController.insertHumidity.bind(humidityController),
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