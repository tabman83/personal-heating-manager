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
}, {
	method: 'GET',
	path: '/views/{path*}',
    handler: {
        directory: {
            path: './dist/views'
        }
    }
}];

module.exports.routes = function (server) {
	server.route(routes);
};
