/**
  * @file        boolean-on-off.js
  * @author      Antonino Parisi <tabman83@gmail.com>
  * @date        01/03/2015 15:51
  * @description A filter that transforms a boolean value to the ON/OFF string
  */

(function(angular, undefined) {
    'use strict';

    angular.module('PHMApp').filter('booleanOnOff', [function() {

        return function(input) {
            if( typeof(input) === 'undefined' || input === null ) {
                return '?';
            }
            return input ? 'ON' : 'OFF';
        };

    }]);

})(angular);
