var HumidityController = require('./../controllers/humidity');
var humidityController = new HumidityController();

module.exports.routes = function (auth, server) {
	var routes = [{
		method: 'POST',
		path: '/humidities',
		config: {
			auth: auth,
			handler: humidityController.insertHumidity.bind(humidityController)
		}
	}, {
		method: 'GET',
		path: '/humidities',
		config: {
			auth: auth,
			handler: humidityController.getHumidity.bind(humidityController)
		}
	}];
	server.route(routes);
};
