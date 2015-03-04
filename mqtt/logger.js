/*
file:           index.js
author:         Antonino Parisi
email:          tabman83@gmail.com
date:           25/02/2015 21:40
description:    MQTT logger
*/

var mqtt    = require('mqtt');
var nconf   = require('nconf');
var logItem = require('../models/logItem');
var temperatureTopic    = nconf.get('mqtt_topic_temperature');
var humidityTopic       = nconf.get('mqtt_topic_humidity');
var heaterTopic         = nconf.get('mqtt_topic_heater');

module.exports = new function() {

    var client = null;

    var onMessage = function(topic, message) {
        var type = 'unknown';
        var messageParts = message.split(':');
        var name = null;
        switch(topic) {
            case temperatureTopic :
                type = 'temperature';
                name = messageParts.slice(0,1);
                break;
            case humidityTopic :
                type = 'humidity';
                name = messageParts.slice(0,1);
                break;
            case heaterTopic :
                type = 'heater';
                break;
            default :
        }
        var value = messageParts.slice(-1);
        var logItem = new LogItem({
            name:
            type: type,
            value: value
        });
        logItem.save(function (err) {
			if (err) {
				console.error(err);
			} else {
                console.log([topic, message].join(': '));
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
