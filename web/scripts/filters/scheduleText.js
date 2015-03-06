/**
  * @file        scheduleText.js
  * @author      Antonino Parisi <tabman83@gmail.com>
  * @date        03/03/2015 16:15
  * @description A set of filters that turns a schedule object into human readable text
  */

(function(angular, undefined) {
    'use strict';

    angular.module('PHMApp').filter('scheduleTextWhen', ['$sce', function($sce) {
        return function(input) {
            var text = '';
            if(input.repetition.length && input.recurrence === 'weekly') {
                angular.forEach(input.repetition, function(dayValue) {
                    text += '<span class="label label-default">'+moment().day(dayValue).format('ddd')+'</span>';
                });
            } else {
                text += 'once';
            }
            return $sce.trustAsHtml(text);
        }
    }]);

    angular.module('PHMApp').filter('scheduleTextWhat', ['$sce', function($sce) {
        return function(input) {
            var text = '';
            switch(input.type) {
                case 'ON':
                    text += '<span class="label label-success">Switch ON @ ';
                    if(input.recurrence === 'oneTime') {
                        text += moment(input.startDate).format('LL')+' ';
                    }
                    text += moment(input.startDate).format('LT')+'</span>';
                    break;
                case 'OFF':
                    text += '<span class="label label-danger">Switch OFF @ ';
                    if(input.recurrence === 'oneTime') {
                        text += moment(input.startDate).format('LL') + ' ';
                    }
                    text += moment(input.startDate).format('LT')+'</span>';
                    break;
                case 'ONtoOFF':
                    text = '<span class="label label-success">Switch ON @ ';
                    if(input.recurrence === 'oneTime') {
                        text += moment(input.startDate).format('LL')+' ';
                    }
                    text += moment(input.startDate).format('LT')+'</span>';
                    text += ' <span class="label label-danger">Switch OFF @ ';
                    if(input.recurrence === 'oneTime') {
                        text += moment(input.endDate).format('LL')+ ' ';
                    }
                    text += moment(input.endDate).format('LT')+'</span>';
                    break;
                case 'OFFtoON':
                    text += '<span class="label label-danger">Switch OFF @';
                    if(input.recurrence === 'oneTime') {
                        text += moment(input.startDate).format('LL')+' ';
                    }
                    text += moment(input.startDate).format('LT')+'</span>';
                    text += ' <span class="label label-success">Switch OFF @ ';
                    if(input.recurrence === 'oneTime') {
                        text += moment(input.endDate).format('LL')+' ';
                    }
                    text += moment(input.endDate).format('LT')+ '</span>';
                    break;
            }

            return $sce.trustAsHtml(text);

        };

    }]);

})(angular);
