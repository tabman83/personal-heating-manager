var TemperatureController = require('./../controllers/temperature');
var temperatureController = new TemperatureController();

module.exports.routes = function (auth, server) {
	var routes = [{
		method: 'POST',
		path: '/temperatures',
		config: {
			auth: auth,
			handler: temperatureController.insertTemperature.bind(temperatureController)
		}
	}, {
		method: 'GET',
		path: '/temperatures',
		config: {
			auth: auth,
			handler: temperatureController.getTemperature.bind(temperatureController)
		}
	}];
	server.route(routes);
};
