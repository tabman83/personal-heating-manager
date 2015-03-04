/*
file:           index.js
author:         Antonino Parisi
email:          tabman83@gmail.com
date:           25/02/2015 21:40
description:    MQTT logger
*/

var mqtt    = require('mqtt');
var nconf = require('nconf');
var temperatureTopic = nconf.get('mqtt_topic_temperature');
var humidityTopic = nconf.get('mqtt_topic_humidity');
var heaterTopic = nconf.get('mqtt_topic_heater');

module.exports = new function() {

    var client = null;

    var onMessage = function(topic, message) {
        // message is Buffer
        console.log([topic, message].join(': '));
    }

    this.start = function() {
        client = mqtt.connect('mqtt://localhost');
        client.on('message', onMessage);
        client.subscribe(temperatureTopic);
        client.subscribe(humidityTopic);
        client.subscribe(heaterTopic);
    }

}
