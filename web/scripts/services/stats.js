/**
  * @file        stats.js
  * @author      Antonino Parisi <tabman83@gmail.com>
  * @date        12/03/2015 08:17
  * @description Stats data provider
  */

(function(angular, undefined) {
    'use strict';

    angular.module('PHMApp').factory('Stats', ['$resource', 'appSettings', function($resource, appSettings) {
        var baseUrl = window.location.protocol + '//' + window.location.hostname + ':' + appSettings.api.port;
        return $resource(baseUrl+'/heating/stats', {}, {
            overall: {
                params: {}
            },
            daily: {
                params: {
                    aggregation: 'daily'
                }
            },
            monthly: {
                params: {
                    aggregation: 'monthly'
                }
            },
        });
    }]);

})(angular);
