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

    }]);

})(angular);
