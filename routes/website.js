module.exports.routes = function (auth, server) {
    var routes = [{
        method: 'GET',
        path: '/{path}',
        config: {
            auth: auth
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
            auth: auth
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
            auth: auth
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
            auth: auth
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
            auth: auth
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
            auth: auth
        },
        handler: {
            directory: {
                path: './dist/fonts'
            }
        }
    }];
	server.route(routes);
};
