/**
  * @file        new-schedule.js
  * @author      Antonino Parisi <tabman83@gmail.com>
  * @date        02/03/2015 20:06
  * @description Controller for the new schedule view
  */

(function(angular, undefined) {
    'use strict';

    angular.module('PHMApp').controller('NewScheduleController', ['$rootScope', '$scope', '$location', 'apiClient', function($rootScope, $scope, $location, apiClient) {

        var weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

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

        $scope.isDisabled = false;
        $scope.isErrored = false;

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
                        text += moment(newValue.date).format('LL');
                    }
                    text += ' at ';
                    text += moment(newValue.time).format('LT');
                    break;
                case 'OFF':
                    text = 'Switch off ';
                    if(newValue.recurrence === 'oneTime') {
                        text += moment(newValue.date).format('LL');
                    }
                    text += ' at ';
                    text += moment(newValue.time).format('LT');
                    break;
                case 'ONtoOFF':
                    text = 'Switch on ';
                    if(newValue.recurrence === 'oneTime') {
                        text += moment(newValue.startDate).format('LL');
                    }
                    text += ' at ';
                    text += moment(newValue.startTime).format('LT');
                    text += ' and off ';
                    if(newValue.recurrence === 'oneTime') {
                        text += moment(newValue.endDate).format('LL');
                    }
                    text += ' at ';
                    text += moment(newValue.endTime).format('LT');
                    break;
                case 'OFFtoON':
                    text = 'Switch off ';
                    if(newValue.recurrence === 'oneTime') {
                        text += moment(newValue.startDate).format('LL');
                    }
                    text += ' at ';
                    text += moment(newValue.startTime).format('LT');
                    text += ' and on ';
                    if(newValue.recurrence === 'oneTime') {
                        text += moment(newValue.endDate).format('LL');
                    }
                    text += ' at ';
                    text += moment(newValue.endTime).format('LT');
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
                var schedule = new apiClient.Schedule({
                    name: $scope.form.name,
                    type: $scope.form.type,
                    recurrence: $scope.form.recurrence,
                    repetition: []
                });
                if($scope.form.recurrence === 'weekly') {
                    schedule.repetition = $scope.form.repetition.map(Number);
                }
                if( $scope.form.type === 'ON' || $scope.form.type === 'OFF' ) {
                    schedule.startDate = getAmoment($scope.form.date, $scope.form.time).utc();
                }
                if( $scope.form.type === 'ONtoOFF' || $scope.form.type === 'OFFtoON' ) {
                    schedule.startDate = getAmoment($scope.form.startDate, $scope.form.startTime).utc();
                    schedule.endDate = getAmoment($scope.form.endDate, $scope.form.endTime).utc();
                }

                //console.log(data);
                $scope.isDisabled = true;
                $scope.isErrored = false;
                schedule.$save(function(result) {
                    $location.path('/schedule');
                }, function(error) {
                    $scope.isErrored = true;
                    $scope.errorText = error.statusText || 'Cannot contact server';
                }).finally(function() {
                    $scope.isDisabled = false;
                });
            } else {
                console.log($scope.scheduleForm.$error);
            }
        }

    }]);

})(angular);
