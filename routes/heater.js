var HeaterController = require('./../controllers/heater');

var heaterController = new HeaterController();

var routes = [{
	method: 'GET',
	path: '/heater',
	config: {
		auth: 'simple',
		handler: heaterController.getHeater.bind(heaterController)
	}
}];

module.exports.routes = function (server) {
	server.route(routes);
};
