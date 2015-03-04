/*
file:           index.js
author:         Antonino Parisi
email:          tabman83@gmail.com
date:           25/02/2015 21:40
description:    MQTT logger
*/

var mqtt    = require('mqtt');
var nconf   = require('nconf');
var LogItem = require('../models/logItem');
var temperatureTopic    = nconf.get('mqtt_topic_temperature');
var humidityTopic       = nconf.get('mqtt_topic_humidity');
var heaterTopic         = nconf.get('mqtt_topic_heater');

module.exports = new function() {

    var client = null;

    var onMessage = function(topic, message) {
        console.log('Received from '+topic);
        console.log(message);
        var value = null;
        switch(topic) {
            case temperatureTopic :
                value = message.readFloatBE(0);
                break;
            case humidityTopic :
                value = message.readFloatBE(0);
                break;
            case heaterTopic :
                var value = Boolean(message[0]);
                break;
            default :
        }
        var logItem = new LogItem({
            topic: topic,
            value: value
        });
        logItem.save(function (err) {
			if (err) {
				console.error(err);
			}
		});
    }

    this.start = function() {
        client = mqtt.connect('mqtt://localhost');
        client.on('message', onMessage);
        client.subscribe(temperatureTopic);
        client.subscribe(humidityTopic);
        client.subscribe(heaterTopic);
    }

}
