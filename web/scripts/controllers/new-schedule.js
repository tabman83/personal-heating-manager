/**
  * @file        new-schedule.js
  * @author      Antonino Parisi <tabman83@gmail.com>
  * @date        02/03/2015 20:06
  * @description Controller for the new schedule view
  */

(function(angular, undefined) {
    'use strict';

    angular.module('PHMApp').controller('NewScheduleController', ['$rootScope', '$scope', '$location', function($rootScope, $scope, $location) {

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

        $scope.minDate = moment(now).format('YYYY-MM-DD');

        $scope.form = {
            name: 'New schedule',
            repetition: [0],
            recurrence: 'oneTime',
            type: 'ON',
            date: now,
            time: now,
            startDate: now,
            startTime: now,
            endDate: now,
            endTime: now
        }


        $scope.$watch('form.startDate', function(newValue) {
            $scope.minEndDate = moment(newValue).format('YYYY-MM-DD');
            if( moment($scope.form.endDate).isBefore($scope.minEndDate) ) {
                $scope.form.endDate = moment(newValue).toDate();
            }
        });


        $scope.$watchCollection('form', function(newValue) {
            var text = '';
            switch(newValue.type) {
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

        $scope.createSchedule = function() {
            if($scope.scheduleForm.$valid) {
                var data = {
                    name: $scope.form.name,
                    type: $scope.form.type,
                    recurrence: $scope.form.recurrence,
                }
                if($scope.form.recurrence === 'oneTime') {
                    data.date = getAmoment($scope.form.date, $scope.form.time).utc();
                }
                if($scope.form.recurrence === 'weekly') {
                    data.startDate = getAmoment($scope.form.startDate, $scope.form.startTime).utc();
                    data.endDate = getAmoment($scope.form.endDate, $scope.form.endTime).utc();
                }
                console.log(data);

                //$location.path('/schedule');
            } else {
                console.log($scope.scheduleForm.$error);
            }
        }

    }]);

})(angular);
