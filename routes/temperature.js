var TemperatureController = require('./../controllers/temperature');

var temperatureController = new TemperatureController();

var routes = [{
	method: 'POST',
	path: '/temperatures',
	config: {
		handler: temperatureController.insertTemperature.bind(temperatureController)
	}
}, {
	method: 'GET',
	path: '/temperatures',
	config: {
		handler: temperatureController.getTemperature.bind(temperatureController)
	}
}];

module.exports.routes = function (server) {
	server.route(routes);
};
