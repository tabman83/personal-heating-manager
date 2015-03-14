/*
file:           index.js
author:         Antonino Parisi
email:          tabman83@gmail.com
date:           25/02/2015 21:40
description:    MQTT logger
*/

var mqtt                = require('mqtt');
var nconf               = require('nconf');
var mongoose            = require('mongoose');
var LogItem             = mongoose.model('LogItem');
var Heating             = mongoose.model('Heating');
var temperatureTopic    = nconf.get('mqtt_topic_temperature');
var humidityTopic       = nconf.get('mqtt_topic_humidity');
var heatingTopic        = nconf.get('mqtt_topic_heating');

module.exports = new function() {

    var client = null;

    var onMessage = function(topic, message) {
        console.log('Received from '+topic);
        console.log(message);

        function cb(err) {
			if (err) {
				console.error(err);
			}
		}

        switch(topic) {
            case heatingTopic :
                var value = Boolean(message[0]);
                if(value) {
                    Heating.switchOn(cb);
                } else {
                    Heating.switchOff(cb);
                }
                break;
            default :
                new LogItem({
                    topic: topic,
                    value: message.readFloatBE(0)
                }).save(cb);
        }
    }

    this.start = function(cb) {
        client = mqtt.connect('mqtt://localhost');
        client.on('message', onMessage);
        client.subscribe(temperatureTopic);
        client.subscribe(humidityTopic);
        client.subscribe(heatingTopic);
        cb();
    }

}
