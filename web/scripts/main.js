/**
  * @file        main.js
  * @author      Antonino Parisi <tabman83@gmail.com>
  * @date        24/02/2015 10:31
  * @description Main application module
  */

(function(angular, undefined) {
    'use strict';

    angular
        .module('PHMApp', ['ngRoute', 'angular-flot'])
        .config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
            $routeProvider.when('/status', {
                templateUrl: '/views/status.html'
            }).when('/timer', {
                templateUrl: 'views/timer.html'
            }).otherwise({
                redirectTo: '/status'
            });

            //$locationProvider.html5Mode(true);
        }]).run(['$rootScope', '$window', function($rootScope, $window) {

            // Hook success
            $rootScope.$on('$routeChangeSuccess', function() {
                // display new view from top
                $window.scrollTo(0, 0);
            });

        }]);

})(angular);
