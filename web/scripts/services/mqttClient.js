/**
  * @file        mqttClient.js
  * @author      Antonino Parisi <tabman83@gmail.com>
  * @date        26/02/2015 12:19
  * @description MQTT client
  */

(function(angular, undefined) {
    'use strict';

    angular.module('PHMApp').factory('mqttClient', ['$q', function($q) {

        var mqttClient = function() {

            console.log('mqttClient initialized');
            var handlers = {};
            var connectionEstablishedDefer = $q.defer();
            var client = new Paho.MQTT.Client(location.hostname, 3001, 'webSocketClient');

            // set callback handlers
            client.onConnectionLost = onConnectionLost;
            client.onMessageArrived = onMessageArrived;

            // connect the client
            client.connect({onSuccess:onConnect});

            // called when the client connects
            function onConnect() {
                // Once a connection has been made, make a subscription and send a message.
                console.log('WS MQTT connection successful.');
                connectionEstablishedDefer.resolve();
                /*
                message = new Paho.MQTT.Message("Hello");
                message.destinationName = "PHM/heater";
                client.send(message);
                */
            }

            // called when the client loses its connection
            function onConnectionLost(responseObject) {
                if (responseObject.errorCode !== 0) {
                    console.log('WS MQTT connection lost due to '+responseObject.errorMessage);
                }
            }

            // called when a message arrives
            function onMessageArrived(message) {
                var callbacks = handlers[message.destinationName];
                angular.forEach(callbacks, function(callback) {
                    callback(message.payloadString);
                });
            }

            this.unsubscribe = function(handler) {
                handlers[handler.queueName].splice(handler.index, 1);
            }

            this.subscribe = function(queueName, callback) {
                if( handlers[queueName] === undefined) {
                    connectionEstablishedDefer.promise.then( function() {
                        client.subscribe(queueName);
                    });
                    handlers[queueName] = [];
                }
                var index = handlers[queueName].length;
                handlers[queueName].push(callback);
                return {
                    queueName: queueName,
                    index: index
                };
            }

        }

        return new mqttClient();

    }]);

})(angular);
