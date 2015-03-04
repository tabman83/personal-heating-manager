/**
  * @file        status.js
  * @author      Antonino Parisi <tabman83@gmail.com>
  * @date        24/02/2015 10:38
  * @description Controller for the status view
  */

(function(angular, undefined) {
    'use strict';

    angular.module('PHMApp').controller('StatusController', ['$rootScope', '$scope', '$timeout', 'mqttClient', 'yahooWeatherClient', 'apiClient', 'appSettings', function($rootScope, $scope, $timeout, mqttClient, yahooWeatherClient, apiClient, appSettings) {

        $scope.insideTemp = '?';
        $scope.outsideTemp = '?';
        $scope.insideHumidity = '?';
        $scope.outsideHumidity = '?';
        $scope.outsideWindChill = '?';
        $scope.weatherIcon = '?';
        $scope.weatherStatus = '?';
        $scope.heaterButtonDisabled = false;

        $scope.switchHeating = function() {
            if( $scope.heaterStatus !== undefined ) {
                mqttClient.publish( appSettings.mqtt.topics.heater, !$scope.heaterStatus );
                $scope.heaterButtonDisabled = true;
                $timeout(function() {
                    $scope.heaterButtonDisabled = false;
                }, 2000);
            }
        };

        var heaterHandler = mqttClient.subscribe(appSettings.mqtt.topics.heater, function(buffer) {
            $scope.heaterStatus = Boolean(buffer[0]);
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
            mqttClient.unsubscribe(heaterHandler);
            mqttClient.unsubscribe(tempHandler);
            mqttClient.unsubscribe(humidityHandler);
        });

        apiClient.HeaterStatus.query({limit: 1}, function(result) {
            $scope.heaterStatus = result[0].value;
        });

        apiClient.Temperature.query({limit: 1}, function(result) {
            $scope.insideTemp = result[0].value;
        });

        apiClient.Humidity.query({limit: 1}, function(result) {
            $scope.insideHumidity = result[0].value;
        });

    }]);

})(angular);
