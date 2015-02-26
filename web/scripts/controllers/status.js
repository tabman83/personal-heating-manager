/**
  * @file        status.js
  * @author      Antonino Parisi <tabman83@gmail.com>
  * @date        24/02/2015 10:38
  * @description Controller for the status view
  */

(function(angular, undefined) {
    'use strict';

    angular.module('PHMApp').controller('StatusController', ['$rootScope', '$scope', 'mqttClient', function($rootScope, $scope, mqttClient) {

        console.log('StatusController initialized');
        $scope.insideTemp = 11;

        var topics = {
            mqtt_topic_heater: 'PHM/heater',
            mqtt_topic_temperature: 'PHM/temperature',
            mqtt_topic_humidity: 'PHM/humidity'
        }

        var tempHandler = mqttClient.subscribe(topics.mqtt_topic_temperature, function(value) {
            var value = parseFloat(value);
            $scope.$apply(function () {
                $scope.insideTemp = value;
            });
            console.log('Temp: ',value);
        });

        var humidityHandler = mqttClient.subscribe(topics.mqtt_topic_humidity, function(value) {
            var value = parseFloat(value);
            $scope.$apply(function () {
                $scope.insideHumidity = value;
            });
            console.log('Humidity: ',value);
        });

        $scope.$on("$destroy", function() {
            console.log('StatusController destroyed');
            mqttClient.unsubscribe(tempHandler);
            mqttClient.unsubscribe(humidityHandler);
        });


    }]);

})(angular);
