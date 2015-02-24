var Joi = require("joi");
var HumidityController = require('./../controllers/humidity');

var humidityController = new HumidityController();

var routes = [{
	method: 'POST',
	path: '/humidities',
	config: {
		handler: humidityController.insertHumidity.bind(humidityController)
	}
}, {
	method: 'GET',
	path: '/humidities',
	config: {
		handler: humidityController.getHumidity.bind(humidityController)
	}
}];

module.exports.routes = function (server) {
	server.route(routes);
};
