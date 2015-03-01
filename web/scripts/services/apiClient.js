/**
  * @file        apiClient.js
  * @author      Antonino Parisi <tabman83@gmail.com>
  * @date        28/02/2015 16:41
  * @description API client
  */

(function(angular, undefined) {
    'use strict';

    angular.module('PHMApp').factory('apiClient', ['$resource', 'appSettings', function($resource, appSettings) {

        var baseUrl = window.location.protocol + '//' + window.location.hostname + ':' + appSettings.api.port;

        return {
            HeaterStatus: $resource(baseUrl+'/heater'),
            Temperature: $resource(baseUrl+'/temperatures'),
            Humidity: $resource(baseUrl+'/humidities')
        };

    }]);

})(angular);
