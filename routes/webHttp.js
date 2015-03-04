var isDebug = require('nconf').get('debug');

var routes = [{
    method: 'GET',
    path: '/{path}',
    config: {
        auth: isDebug ? null : 'simple',
    },
    handler: {
        directory: {
            path: './dist',
			index: true
        }
    }
}, {
    method: 'GET',
    path: '/{path*}',
    config: {
        auth: isDebug ? null : 'simple',
    },
    handler: {
        directory: {
            path: './dist',
			index: true
        }
    }
}, {
	method: 'GET',
	path: '/styles/{path*}',
    config: {
        auth: isDebug ? null : 'simple',
    },
    handler: {
        directory: {
            path: './dist/styles'
        }
    }
}, {
	method: 'GET',
	path: '/views/{path*}',
    config: {
        auth: isDebug ? null : 'simple',
    },
    handler: {
        directory: {
            path: './dist/views'
        }
    }
}, {
	method: 'GET',
	path: '/scripts/{path*}',
    config: {
        auth: isDebug ? null : 'simple',
    },
    handler: {
        directory: {
            path: './dist/scripts'
        }
    }
}, {
	method: 'GET',
	path: '/fonts/{path*}',
    config: {
        auth: isDebug ? null : 'simple',
    },
    handler: {
        directory: {
            path: './dist/fonts'
        }
    }
}];

module.exports.routes = function (server) {
	server.route(routes);
};
