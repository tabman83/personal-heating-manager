/**
  * @file        heating.js
  * @author      Antonino Parisi <tabman83@gmail.com>
  * @date        28/02/2015 16:41
  * @description Heating data provider
  */

(function(angular, undefined) {
    'use strict';

    angular.module('PHMApp').factory('Heating', ['$resource', 'appSettings', function($resource, appSettings) {
        var baseUrl = window.location.protocol + '//' + window.location.hostname + ':' + appSettings.api.port;
        return $resource(baseUrl+'/heating', {}, {
            status: {
                method: 'GET'
            }, {
                switchOn: {
                    method: 'PUT',
                    params: {
                        value: true
                    }
                },
                switchOff: {
                    method: 'PUT',
                    params: {
                        value: false
                    }
                }
            }
        });
    }]);

})(angular);
