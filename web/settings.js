/**
  * @file        settings.js
  * @author      Antonino Parisi <tabman83@gmail.com>
  * @date        27/02/2015 8:29
  * @description Application settings
  */


;(function(angular, undefined) {
    'use strict';

    var appSettings = {

        api: {
            port: 3000
        },
        mqtt: {
            port: 3001,
            topics: {
                heating: 'PHM/heating',
                temperature: 'PHM/temperature',
                humidity: 'PHM/humidity'
            }
        },
        weather: {
            location: 'Swords, Dublin'
        }

    }

    angular.module('PHMApp').constant('appSettings', appSettings);

})(angular);
