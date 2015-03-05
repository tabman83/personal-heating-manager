/**
  * @file        schedule.js
  * @author      Antonino Parisi <tabman83@gmail.com>
  * @date        05/03/2015 14:28
  * @description Controller for the new and edit schedule views
  */

(function(angular, undefined) {
    'use strict';

    angular.module('PHMApp').controller('ScheduleController', ['$rootScope', '$scope', '$routeParams', '$location', 'Schedule', function($rootScope, $scope, $routeParams, $location, Schedule) {

        $scope.isEditMode = $routeParams.id !== undefined;
        $scope.isNewMode = $routeParams.id === undefined;

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

        var now = moment().startOf('minute').toDate();
        $scope.minDate = moment().format('YYYY-MM-DD');

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

        var schedule = new Schedule();

        if( $scope.isEditMode ) {
            schedule = Schedule.get({
                id: $routeParams.id
            }, function() {

                $scope.form.name = schedule.name;
                $scope.form.repetition = schedule.repetition;
                $scope.form.recurrence = schedule.recurrence;
                $scope.form.type = schedule.type;

                if(schedule.type === 'ON' || schedule.type === 'OFF') {
                    $scope.form.date = moment(schedule.startDate).startOf('day').toDate();
                    $scope.form.time = moment(schedule.startDate).startOf('minute').toDate();
                }
                if(schedule.type === 'ONtoOFF' || schedule.type === 'OFFtoON') {
                    $scope.form.startDate = moment(schedule.startDate).startOf('day').toDate();
                    $scope.form.startTime = moment(schedule.startDate).startOf('minute').toDate();
                    $scope.form.endDate = moment(schedule.endDate).startOf('day').toDate();
                    $scope.form.endTime = moment(schedule.endDate).startOf('minute').toDate();
                }

            }, function() {
                $location.path('/schedules');
            });
        }

        $scope.delete = function() {
            if(!confirm('Are you sure you want to delete this schedule ?')) {
                return;
            }

            $scope.isDisabled = true;
            $scope.isErrored = false;
            schedule.$delete(function() {
                $location.path('/schedules');
            }, function(error) {
                $scope.isErrored = true;
                $scope.errorText = error.statusText || 'Cannot contact server';
            }).finally(function() {
                $scope.isDisabled = false;
            });
        }

        $scope.save = function() {
            if($scope.scheduleForm.$invalid) {
                console.error($scope.scheduleForm.$error);
                return;
            }

            schedule.name = $scope.form.name;
            schedule.type = $scope.form.type;
            schedule.recurrence = $scope.form.recurrence;
            schedule.repetition = [];

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

            $scope.isDisabled = true;
            $scope.isErrored = false;

            schedule[$scope.isEditMode ? '$update' : '$save'](function() {
                $location.path('/schedules');
            }, function(error) {
                $scope.isErrored = true;
                if(error.code = 11000) {
                    $scope.errorText = 'A schedule with the same name already exists.';
                } else {
                    $scope.errorText = error.data.message || error.statusText || 'Cannot contact server';
                }
            }).finally(function() {
                $scope.isDisabled = false;
            });
        }

    }]);

})(angular);
