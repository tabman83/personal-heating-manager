/*
file:           mqttClient.js
author:         Antonino Parisi
email:          tabman83@gmail.com
date:           25/02/2015 21:40
description:    MQTT client
*/

var mqtt    = require('mqtt');
var client  = null;
var nconf = require('nconf');
var temperatureTopic = nconf.get('mqtt_topic_temperature');
var humidityTopic = nconf.get('mqtt_topic_humidity');

module.exports = {
    publish: function(topic, message) {
        client.publish(topic, message);
    },
    listen: function(cb) {
        client = mqtt.connect('mqtt://localhost');
        client.subscribe(temperatureTopic);
        client.subscribe(humidityTopic);
        client.on('message', function (topic, message) {
            // message is Buffer
            console.log([topic, message].join(': '));
        });
        cb(null);
    }
}
