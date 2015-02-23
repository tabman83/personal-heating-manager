var routes = [{
    method: 'GET',
    path: '/{path*}',
    handler: {
        directory: {
            path: './dist',
			index: true
        }
    }
}, {
	method: 'GET',
	path: '/styles/{path*}',
    handler: {
        directory: {
            path: './dist/styles'
        }
    }
}];

module.exports.routes = function (server) {
	server.route(routes);
};