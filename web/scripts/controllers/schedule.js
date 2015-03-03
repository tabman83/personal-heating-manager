/**
  * @file        new-schedule.js
  * @author      Antonino Parisi <tabman83@gmail.com>
  * @date        02/03/2015 20:06
  * @description Controller for the new timer view
  */

(function(angular, undefined) {
    'use strict';

    angular.module('PHMApp').controller('ScheduleController', ['$rootScope', '$scope', function($rootScope, $scope) {

        var weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

        $scope.execution = [];

        $scope.$watch('execution', function(val) {
            if(val.length === 0) {
                $scope.executionLabel = 'once';
            } else {
                var dayNames = $scope.execution.map(function(dayValue) {
                    return weekDays[dayValue];
                });
                $scope.executionLabel = 'every '+dayNames.join(', ');
            }
        });


    }]);

})(angular);
