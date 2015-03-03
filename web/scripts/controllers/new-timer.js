/**
  * @file        new-timer.js
  * @author      Antonino Parisi <tabman83@gmail.com>
  * @date        02/03/2015 20:06
  * @description Controller for the new timer view
  */

(function(angular, undefined) {
    'use strict';

    angular.module('PHMApp').controller('NewTimerController', ['$rootScope', '$scope', function($rootScope, $scope) {

        var weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

        function getAmoment(date, time) {
            return moment({
                year: date.getFullYear(),
                month: date.getMonth(),
                date: date.getDate(),
                hour: time.getHours(),
                minute: time.getMinutes(),
                second: time.getSeconds()
            });
        }

        var now = new Date();
        now.setSeconds(0,0);

        $scope.form = {
            repetition: [0],
            recurrence: 'oneTime',
            actionType: 'ON',
            date: now,
            time: now,
            startDate: now,
            startTime: now,
            endDate: now,
            endTime: now
        }


        $scope.$watchCollection('form', function(newValue) {
            console.log(newValue);
            var text;
            switch(newValue.actionType) {
                case 'ON':
                    text = 'Switch on ';
                    if(newValue.recurrence === 'oneTime') {
                        text += getAmoment(newValue.date, newValue.time).calendar();
                    } else {
                        text += moment(newValue.time).format('LT');
                    }
                    break;
                case 'OFF':
                    text = 'Switch off ';
                    if(newValue.recurrence === 'oneTime') {
                        text += getAmoment(newValue.date, newValue.time).calendar();
                    } else {
                        text += moment(newValue.time).format('LT');
                    }
                    break;
                case 'ONtoOFF':
                    text = 'Switch on ';
                    if(newValue.recurrence === 'oneTime') {
                        text += getAmoment(newValue.date, newValue.time).calendar();
                    } else {
                        text += moment(newValue.time).format('LT');
                    }
                    text += ' and off ';
                    if(newValue.recurrence === 'oneTime') {
                        text += getAmoment(newValue.date, newValue.time).calendar();
                    } else {
                        text += moment(newValue.time).format('LT');
                    }
                    break;
                case 'OFFtoON':
                    text = 'Switch off ';
                    if(newValue.recurrence === 'oneTime') {
                        text += getAmoment(newValue.date, newValue.time).calendar();
                    } else {
                        text += moment(newValue.time).format('LT');
                    }
                    text += ' and on ';
                    if(newValue.recurrence === 'oneTime') {
                        text += getAmoment(newValue.date, newValue.time).calendar();
                    } else {
                        text += moment(newValue.time).format('LT');
                    }
                    break;
            }

            if(newValue.repetition.length && newValue.recurrence === 'weekly') {
                var dayNames = newValue.repetition.map(function(dayValue) {
                    return weekDays[dayValue];
                });
                if( dayNames.length>1 ) {
                    text += ' every '+dayNames.slice(0,-1).join(', ')+' and '+dayNames.slice(-1);
                } else {
                    text += ' every '+dayNames[0];
                }
            }

            text += '.';

            $scope.executionLabel = text;
        });


    }]);

})(angular);
