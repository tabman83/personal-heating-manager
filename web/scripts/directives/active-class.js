/**
  * @file        active-class.js
  * @author      Antonino Parisi <tabman83@gmail.com>
  * @date        24/02/2015 11:39
  * @description Directive to automatically add an active class to menu items depending on the current active route
  */

(function(angular, undefined) {
    'use strict';

    angular.module('PHMApp').directive('activeClass', [function() {

        return {
            link: function(scope, element, attrs) {

                var anchorLink = element.find('a')[0].getAttribute('ng-href') || element.find('a')[0].getAttribute('href');
                anchorLink = anchorLink.replace(/^#/, '');
                scope.$on('$routeChangeSuccess', function (event, current) {
                    if (current.$$route && current.$$route.originalPath === anchorLink) {
                        element.addClass(attrs.activeClass);
                    }
                    else {
                        element.removeClass(attrs.activeClass);
                    }
                });
            }
        };

    }]);

})(angular);
