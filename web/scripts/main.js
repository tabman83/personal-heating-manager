/**
  * @file        main.js
  * @author      Antonino Parisi <tabman83@gmail.com>
  * @date        24/02/2015 10:31
  * @description Main application module
  */

(function(angular, undefined) {
    'use strict';

    angular
        .module('PHMApp', ['ngRoute', 'ngResource', 'ngTouch', 'angular-flot'])
        .config(['$routeProvider', function($routeProvider) {
            $routeProvider.when('/status', {
                templateUrl: '/views/status.html'
            }).when('/stats', {
                templateUrl: 'views/stats.html'
            }).when('/timer', {
                templateUrl: 'views/timer.html'
            }).otherwise({
                redirectTo: '/status'
            });

            //$locationProvider.html5Mode(true);
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

/* jshint ignore:start */
/**
 * ScrollFix v0.1
 * http://www.joelambert.co.uk
 *
 * Copyright 2011, Joe Lambert.
 * Free to use under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 */

var ScrollFix = function(elem) {
	// Variables to track inputs
	var startY, startTopScroll;

	elem = elem || document.querySelector(elem);

	// If there is no element, then do nothing
	if(!elem)
		return;

	// Handle the start of interactions
	elem.addEventListener('touchstart', function(event){
		startY = event.touches[0].pageY;
		startTopScroll = elem.scrollTop;

		if(startTopScroll <= 0)
			elem.scrollTop = 1;

		if(startTopScroll + elem.offsetHeight >= elem.scrollHeight)
			elem.scrollTop = elem.scrollHeight - elem.offsetHeight - 1;
	}, false);
};

$(function() {
    //new ScrollFix($('div.scrollable').get(0));
})


/* jshint ignore:end */
