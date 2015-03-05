/**
  * @file        status.js
  * @author      Antonino Parisi <tabman83@gmail.com>
  * @date        24/02/2015 10:38
  * @description Controller for the status view
  */

(function(angular, undefined) {
    'use strict';

    angular.module('PHMApp').controller('StatusController', ['$rootScope', '$scope', '$timeout', 'mqttClient', 'yahooWeatherClient', 'appSettings', 'HeatingStatus', 'Temperature', 'Humidity', 'Schedule', function($rootScope, $scope, $timeout, mqttClient, yahooWeatherClient, appSettings, HeatingStatus, Temperature, Humidity, Schedule) {

        $scope.insideTemp = '?';
        $scope.outsideTemp = '?';
        $scope.insideHumidity = '?';
        $scope.outsideHumidity = '?';
        $scope.outsideWindChill = '?';
        $scope.weatherIcon = '?';
        $scope.weatherStatus = '?';
        $scope.heatingButtonDisabled = false;
        $scope.nextEventWhat = 'None';
        $scope.nextEventWhen = '';

        $scope.switchHeating = function() {

            if( $scope.heatingStatus !== undefined ) {
                var message = new Uint8Array(1);
                message[0] = Number(!$scope.heatingtatus);
                mqttClient.publish( appSettings.mqtt.topics.heating, message );
                $scope.heatingButtonDisabled = true;
                $timeout(function() {
                    $scope.heatingButtonDisabled = false;
                }, 2000);
            }
        };

        var heatingHandler = mqttClient.subscribe(appSettings.mqtt.topics.heating, function(buffer) {
            $scope.heatingStatus = Boolean(buffer[0]);
        });

        var tempHandler = mqttClient.subscribe(appSettings.mqtt.topics.temperature, function(buffer) {
            var dataview = new DataView(new ArrayBuffer(4));
            for(var i=0; i<buffer.length; i++) {
                dataview.setUint8(i,buffer[i]);
            }
            $scope.insideTemp = dataview.getFloat32(0);
        });

        var humidityHandler = mqttClient.subscribe(appSettings.mqtt.topics.humidity, function(buffer) {
            var dataview = new DataView(new ArrayBuffer(4));
            for(var i=0; i<buffer.length; i++) {
                dataview.setUint8(i,buffer[i]);
            }
            $scope.insideHumidity = dataview.getFloat32(0);
        });

        yahooWeatherClient.getWeather().then(function(data) {
            $scope.outsideHumidity = data.atmosphere.humidity;
            $scope.outsideTemp = data.item.condition.temp;
            $scope.outsideWindChill = data.wind.chill;
            $scope.weatherIcon = yahooWeatherClient.getConditionIcon(data.item.condition.code);
            $scope.weatherStatus = data.item.condition.text;
        });


        $scope.$on('$destroy', function() {
            mqttClient.unsubscribe(heatingHandler);
            mqttClient.unsubscribe(tempHandler);
            mqttClient.unsubscribe(humidityHandler);
        });

        Schedule.query({limit: 1}, function(result) {
            if(result.length) {
                var schedule = result[0];
                var date = moment(schedule.startDate);
                if(moment().isBefore(date)) {
                    $scope.nextEventWhat = schedule.type.split('to').slice(0,1).pop();
                    $scope.nextEventWhen = date.format('ddd lll');
                }
            }
        })

        HeatingStatus.query({limit: 1}, function(result) {
            $scope.heatingStatus = result.length ? result[0].value : null;
        });

        Temperature.query({limit: 1}, function(result) {
            $scope.insideTemp = result.length ? result[0].value : null;
        });

        Humidity.query({limit: 1}, function(result) {
            $scope.insideHumidity = result.length ? result[0].value : null;
        });

    }]);

})(angular);
