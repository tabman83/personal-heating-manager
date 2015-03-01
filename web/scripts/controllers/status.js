/**
  * @file        status.js
  * @author      Antonino Parisi <tabman83@gmail.com>
  * @date        24/02/2015 10:38
  * @description Controller for the status view
  */

(function(angular, undefined) {
    'use strict';

    angular.module('PHMApp').controller('StatusController', ['$rootScope', '$scope', 'mqttClient', 'yahooWeatherClient', 'apiClient', 'appSettings', function($rootScope, $scope, mqttClient, yahooWeatherClient, apiClient, appSettings) {

        $scope.insideTemp = '?';
        $scope.outsideTemp = '?';
        $scope.insideHumidity = '?';
        $scope.outsideHumidity = '?';
        $scope.outsideWindChill = '?';
        $scope.weatherIcon = '?';
        $scope.weatherStatus = '?';

        var tempHandler = mqttClient.subscribe(appSettings.mqtt.topics.heater, function(value) {
            $scope.heaterStatus = Boolean(parseInt(value, 10));
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
