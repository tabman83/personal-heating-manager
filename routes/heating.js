var isDebug = require('nconf').get('debug');
var HeatingStatusController = require('./../controllers/heating');
var heatingStatusController = new HeatingStatusController();

var routes = [{
	method: 'GET',
	path: '/heating',
	config: {
		auth: isDebug ? null : 'simple',
		handler: heatingStatusController.getHeatingStatus.bind(heatingStatusController)
	}
}];

module.exports.routes = function (server) {
	server.route(routes);
};
