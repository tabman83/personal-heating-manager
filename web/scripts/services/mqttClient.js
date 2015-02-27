/**
  * @file        mqttClient.js
  * @author      Antonino Parisi <tabman83@gmail.com>
  * @date        26/02/2015 12:19
  * @description MQTT client
  */

(function(angular, undefined) {
    'use strict';

    angular.module('PHMApp').factory('mqttClient', ['$q', '$timeout', 'appSettings', function($q, $timeout, appSettings) {

        var mqttClient = function() {

            console.log('mqttClient initialized');
            var handlers = {};
            var connectionEstablishedDefer = $q.defer();
            var client = new Paho.MQTT.Client(location.hostname, appSettings.mqtt.port, 'webSocketClient');

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
                    $timeout( callback.bind(this, message.payloadString) );
                }, this);
            }

            this.publish = function(queueName, message) {
                connectionEstablishedDefer.promise.then( function() {
                    var pahoMessage = new Paho.MQTT.Message("Hello");
                    pahoMessage.destinationName = queueName;
                    client.send(pahoMessage);
                });
            }

            this.unsubscribe = function(handler) {
                handlers[handler.queueName].splice(handler.index, 1);
                if(handlers[handler.queueName].length === 0 ) {
                    client.unsubscribe(handler.queueName);
                    delete handlers[handler.queueName];
                }
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
