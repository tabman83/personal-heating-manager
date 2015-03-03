/**
  * @file        scheduleText.js
  * @author      Antonino Parisi <tabman83@gmail.com>
  * @date        03/03/2015 16:15
  * @description A filter that a schedule object into human readable text
  */

(function(angular, undefined) {
    'use strict';

    angular.module('PHMApp').filter('scheduleText', ['$sce', function($sce) {
        var weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return function(input) {

            var text = '';
            switch(input.type) {
                case 'ON':
                    text += '<span class="label label-success">Switch on ';
                    if(input.recurrence === 'oneTime') {
                        text += moment(input.startDate).format('LL');
                    }
                    text += ' at ';
                    text += moment(input.startDate).format('LT');
                    text += '</span>';
                    break;
                case 'OFF':
                    text += '<span class="label label-danger">Switch off ';
                    if(input.recurrence === 'oneTime') {
                        text += moment(input.startDate).format('LL');
                    }
                    text += ' at ';
                    text += moment(input.startDate).format('LT');
                    text += '</span>';
                    break;
                case 'ONtoOFF':
                    text = '<span class="label label-success">Switch on ';
                    if(input.recurrence === 'oneTime') {
                        text += moment(input.startDate).format('LL');
                    }
                    text += ' at ';
                    text += moment(input.startDate).format('LT');
                    text += '</span> <span class="label label-default">and</span> ';
                    text += '<span class="label label-danger">off ';
                    if(input.recurrence === 'oneTime') {
                        text += moment(input.endDate).format('LL');
                    }
                    text += ' at ';
                    text += moment(input.endDate).format('LT');
                    text += '</span>';
                    break;
                case 'OFFtoON':
                    text += '<span class="label label-danger">Switch off ';
                    if(input.recurrence === 'oneTime') {
                        text += moment(input.startDate).format('LL');
                    }
                    text += ' at ';
                    text += moment(input.startDate).format('LT');
                    text += '</span> <span class="label label-default">and</span> ';
                    text += '<span class="label label-success">off ';
                    if(input.recurrence === 'oneTime') {
                        text += moment(input.endDate).format('LL');
                    }
                    text += ' at ';
                    text += moment(input.endDate).format('LT');
                    text += '</span>';
                    break;
            }

            if(input.repetition.length && input.recurrence === 'weekly') {
                var dayNames = input.repetition.map(function(dayValue) {
                    return weekDays[dayValue];
                });
                text += ' <span class="label label-default">';
                if( dayNames.length>1 ) {
                    text += 'every '+dayNames.slice(0,-1).join(', ')+' and '+dayNames.slice(-1);
                } else {
                    text += 'every '+dayNames[0];
                }
                text += '</span>';
            }

            return $sce.trustAsHtml(text);

        };

    }]);

})(angular);
