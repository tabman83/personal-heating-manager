/**
  * @file        schedules.js
  * @author      Antonino Parisi <tabman83@gmail.com>
  * @date        02/03/2015 20:06
  * @description Controller for the schedules view
  */

(function(angular, undefined) {
    'use strict';

    angular.module('PHMApp').controller('SchedulesController', ['$rootScope', '$scope', '$location', 'Schedule', function($rootScope, $scope, $location, Schedule) {

        $scope.schedules = [];
        $scope.schedules = Schedule.query();

        $scope.go = function(where) {
            $location.path(where);
        };

        $scope.isActive = function(schedule) {
            if(schedule.type === 'ONtoOFF' || schedule.type === 'OFFtoON' ) {
                return moment().isBetween(schedule.startDate, schedule.endDate);
            }
        };

        $scope.isOutdated = function(schedule) {
            if(schedule.type === 'ONtoOFF' || schedule.type === 'OFFtoON' ) {
                return moment().isAfter(schedule.endDate);
            }
            if(schedule.type === 'ON' || schedule.type === 'OFF' ) {
                return moment().isAfter(schedule.startDate);
            }
        };

    }]);

})(angular);
