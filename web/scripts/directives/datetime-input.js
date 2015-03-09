/**
  * @file        active-class.js
  * @author      Antonino Parisi <tabman83@gmail.com>
  * @date        24/02/2015 11:39
  * @description Directive to automatically add an active class to menu items depending on the current active route
  */

(function(angular, undefined) {
    'use strict';

    angular.module('PHMApp').directive('input', [function() {

        return {
            restrict: 'E',
            require: 'ngModel',
            link: function(scope, element, attrs) {
                if(attrs.type === 'date' && !Modernizr.inputtypes.date) {
                    element
                        .attr('readonly', true)
                        .datepicker();
                }
                if(attrs.type === 'time' && !Modernizr.inputtypes.date) {
                    element
                        .attr('readonly', true)
                        .timepicker({
                            showMeridian: false,
                            minuteStep: 1,
                            showSeconds: false
                        });
                    scope.$watch(attrs.ngModel, function (current) {
                        element.timepicker('setTime', current);
                    });
                }
            }
        };

    }]);

})(angular);
