/**
  * @file        schedules.js
  * @author      Antonino Parisi <tabman83@gmail.com>
  * @date        02/03/2015 20:06
  * @description Controller for the schedules view
  */

(function(angular, undefined) {
    'use strict';

    angular.module('PHMApp').controller('SchedulesController', ['$rootScope', '$scope', '$location', 'apiClient', function($rootScope, $scope, $location, apiClient) {

        $scope.schedules = [];
        apiClient.Schedule.query(function(data) {
            $scope.schedules = data;
        });

        $scope.edit = function(id) {
            $location.path('/edit-schedule/'+id);
        }

        $scope.isActive = function(schedule) {
            if(schedule.type === 'ONtoOFF' || schedule.type === 'OFFtoON' ) {
                return moment().isBetween(schedule.startDate, schedule.endDate);
            }
        }

        $scope.isOutdated = function(schedule) {
            if(schedule.type === 'ONtoOFF' || schedule.type === 'OFFtoON' ) {
                return moment().isAfter(schedule.endDate);
            }
            if(schedule.type === 'ON' || schedule.type === 'OFF' ) {
                return moment().isAfter(schedule.startDate);
            }
        }

    }]);

})(angular);