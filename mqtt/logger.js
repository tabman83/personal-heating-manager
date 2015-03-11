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
var HeatingStatus       = mongoose.model('HeatingStatus');
var temperatureTopic    = nconf.get('mqtt_topic_temperature');
var humidityTopic       = nconf.get('mqtt_topic_humidity');
var heatingTopic        = nconf.get('mqtt_topic_heating');

module.exports = new function() {

    var client = null;

    var onMessage = function(topic, message) {
        console.log('Received from '+topic);
        console.log(message);
        var item = null;
        switch(topic) {
            case heatingTopic :
                item = new HeatingStatus();
                item.value = Boolean(message[0]);
                break;
            default :
                item = new LogItem();
                item.topic = topic;
                item.value = message.readFloatBE(0);
        }
        item.save(function (err) {
			if (err) {
				console.error(err);
			}
		});
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
