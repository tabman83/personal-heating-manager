
module.exports.routes = function (auth, heatingManager, server) {
	var HeatingStatusController = require('./../controllers/heating');
	var heatingStatusController = new HeatingStatusController(heatingManager);
	var routes = [{
		method: 'GET',
		path: '/heating',
		config: {
			auth: auth,
			handler: heatingStatusController.getStatus.bind(heatingStatusController)
		}
	}, {
		method: 'PUT',
		path: '/heating',
		config: {
			auth: auth,
			handler: heatingStatusController.putStatus.bind(heatingStatusController)
		}
	}, {
		method: 'GET',
		path: '/heating/stats',
		config: {
			auth: auth,
			handler: heatingStatusController.getStats.bind(heatingStatusController)
		}
	}];
	server.route(routes);
};
