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
}, {
	method: 'GET',
	path: '/scripts/{path*}',
    handler: {
        directory: {
            path: './dist/scripts'
        }
    }
}, {
	method: 'GET',
	path: '/fonts/{path*}',
    handler: {
        directory: {
            path: './dist/fonts'
        }
    }
}];

module.exports.routes = function (server) {
	server.route(routes);
};
