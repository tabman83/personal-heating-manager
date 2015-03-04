var isDebug = require('nconf').get('debug');
var HeaterController = require('./../controllers/heater');
var heaterController = new HeaterController();

var routes = [{
	method: 'GET',
	path: '/heater',
	config: {
		auth: isDebug ? null : 'simple',
		handler: heaterController.getHeater.bind(heaterController)
	}
}];

module.exports.routes = function (server) {
	server.route(routes);
};
