/**
  * @file        status.js
  * @author      Antonino Parisi <tabman83@gmail.com>
  * @date        24/02/2015 10:38
  * @description Controller for the status view
  */

(function(angular, undefined) {
    'use strict';

    angular.module('PHMApp').controller('StatusController', ['$rootScope', '$scope', 'mqttClient', 'yahooWeatherClient', 'appSettings', function($rootScope, $scope, mqttClient, yahooWeatherClient, appSettings) {

        $scope.insideTemp = '?';
        $scope.outsideTemp = '?';
        $scope.insideHumidity = '?';
        $scope.outsideHumidity = '?';
        $scope.heaterStatus = '?';
        $scope.outsideWindChill = '?';
        $scope.weatherIcon = '?';
        $scope.weatherStatus = '?';

        var tempHandler = mqttClient.subscribe(appSettings.mqtt.topics.heater, function(value) {
            var value = Boolean(parseInt(value, 10));
            $scope.heaterStatus = value ? 'ON' : 'OFF';
        });

        var tempHandler = mqttClient.subscribe(appSettings.mqtt.topics.temperature, function(value) {
            var value = parseFloat(value);
            $scope.insideTemp = value;
        });

        var humidityHandler = mqttClient.subscribe(appSettings.mqtt.topics.humidity, function(value) {
            var value = parseFloat(value);
            $scope.insideHumidity = value;
        });

        yahooWeatherClient.getWeather().then(function(data) {
            console.log(data);
            $scope.outsideHumidity = data.atmosphere.humidity;
            $scope.outsideTemp = data.item.condition.temp;
            $scope.outsideWindChill = data.wind.chill;
            $scope.weatherIcon = yahooWeatherClient.getConditionIcon(data.item.condition.code);
            $scope.weatherStatus = data.item.condition.text;
        });


        $scope.$on("$destroy", function() {
            mqttClient.unsubscribe(tempHandler);
            mqttClient.unsubscribe(humidityHandler);
        });

    }]);

})(angular);
