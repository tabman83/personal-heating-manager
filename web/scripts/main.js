/**
  * @file        main.js
  * @author      Antonino Parisi <tabman83@gmail.com>
  * @date        24/02/2015 10:31
  * @description Main application module
  */

(function(angular, undefined) {
    'use strict';

    angular
        .module('PHMApp', ['ngRoute', 'ngResource', 'ngTouch', 'googlechart', 'btford.socket-io'])
        .config(['$routeProvider', function($routeProvider) {
            $routeProvider.when('/status', {
                templateUrl: '/views/status.html'
            }).when('/stats', {
                templateUrl: 'views/stats.html'
            }).when('/schedules', {
                templateUrl: 'views/schedules.html'
            }).when('/schedule', {
                templateUrl: 'views/schedule.html'
            }).when('/schedule/:id', {
                templateUrl: 'views/schedule.html'
            }).otherwise({
                redirectTo: '/status'
            });

            $.fn.datepicker.defaults.format = 'yyyy-mm-dd';

            //$locationProvider.html5Mode(true);
            
        }]).factory('socket', ['socketFactory', function (socketFactory) {
            return socketFactory();
        }]).run(['$rootScope', '$window', '$document', function($rootScope, $window, $document) {

            // Hook success
            $rootScope.$on('$routeChangeSuccess', function() {
                // display new view from top
                $window.scrollTo(0, 0);
            });

            // overscroll fix
            var scrollable = angular.element('.scrollable').get(0);
            var startY, startTopScroll;
            scrollable.addEventListener('touchstart', function(event) {
                startY = event.touches[0].pageY;
        		startTopScroll = scrollable.scrollTop;
        		if(startTopScroll <= 0) {
                    scrollable.scrollTop = 1;
                }
        		if(startTopScroll + scrollable.offsetHeight >= scrollable.scrollHeight) {
                    scrollable.scrollTop = scrollable.scrollHeight - scrollable.offsetHeight - 1;
                }
            }, false);

            $document.get(0).addEventListener('touchmove', function(event) {
                var fixedHeader = angular.element(event.target).closest('.navbar-fixed-top');
                if(fixedHeader.length > 0) {
                   event.preventDefault();
               }
           }, false);

        }]);

})(angular);
