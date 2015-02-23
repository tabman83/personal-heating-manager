var temperatureController = require('./../controllers/temperature');
var humidityController = require('./../controllers/humidity');

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
}, {
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