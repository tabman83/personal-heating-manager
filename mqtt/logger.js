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
var HeaterStatus        = mongoose.model('HeaterStatus');
var HumidityPoint       = mongoose.model('HumidityPoint');
var TemperaturePoint    = mongoose.model('TemperaturePoint');
var temperatureTopic    = nconf.get('mqtt_topic_temperature');
var humidityTopic       = nconf.get('mqtt_topic_humidity');
var heaterTopic         = nconf.get('mqtt_topic_heater');

module.exports = new function() {

    var client = null;

    var onMessage = function(topic, message) {
        console.log('Received from '+topic);
        console.log(message);
        var value = null;
        var item = null;
        switch(topic) {
            case temperatureTopic :
                item = new TemperaturePoint({
                    value: message.readFloatBE(0)
                });
                break;
            case humidityTopic :
                item = new HumidityPoint({
                    value: message.readFloatBE(0)
                });
                break;
            case heaterTopic :
                item = new HeaterStatus({
                    value: Boolean(message[0])
                });
                break;
            default :
        }
        item.save(function (err) {
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
