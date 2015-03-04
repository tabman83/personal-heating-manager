var isDebug = require('nconf').get('debug');
var HumidityController = require('./../controllers/humidity');
var humidityController = new HumidityController();

var routes = [{
	method: 'POST',
	path: '/humidities',
	config: {
		auth: isDebug ? null : 'simple',
		handler: humidityController.insertHumidity.bind(humidityController)
	}
}, {
	method: 'GET',
	path: '/humidities',
	config: {
		auth: isDebug ? null : 'simple',
		handler: humidityController.getHumidity.bind(humidityController)
	}
}];

module.exports.routes = function (server) {
	server.route(routes);
};
