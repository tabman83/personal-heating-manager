/*
file:           mqttBroker.js
author:         Antonino Parisi
email:          tabman83@gmail.com
date:           25/02/2015 16:17
description:    MQTT broker wrapper
*/

var mosca = require('mosca');

var moscaServer = null;

module.exports = {

    startMqttBroker: function(cb) {
        var pubsubsettings = {
            //using ascoltatore
            type: 'mongo',
            url: 'mongodb://localhost:27017/mqtt',
            pubsubCollection: 'ascoltatori',
            mongo: {}
        };

        var moscaSettings = {
            port: 1883,           //mosca (mqtt) port
            backend: pubsubsettings   //pubsubsettings is the object we created above
        };

        // mqtt publish -h localhost -t 'test' -m '25'
        // mqtt subscribe -v -h localhost -t 'test'

        function onMoscaServerReady() {
            console.log('MQTT broker is up and running.');
            cb(null);
        }

        try {
            moscaServer = new mosca.Server(moscaSettings);   //here we start mosca
            moscaServer.on('ready', onMoscaServerReady);  //on init it fires up setup()
        } catch(err) {
            cb(err);
        }
    }
}
