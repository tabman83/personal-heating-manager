/**
  * @file        schedule.js
  * @author      Antonino Parisi <tabman83@gmail.com>
  * @date        28/02/2015 16:41
  * @description Schedule data provider
  */

(function(angular, undefined) {
    'use strict';

    angular.module('PHMApp').factory('Schedule', ['$resource', 'appSettings', function($resource, appSettings) {
        var baseUrl = window.location.protocol + '//' + window.location.hostname + ':' + appSettings.api.port;
        return $resource(baseUrl+'/schedules/:id', {
            id: '@_id'
        }, {
            update: {
                method: 'PUT'
            }
        });
    }]);

})(angular);
