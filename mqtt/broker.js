/*
file:           index.js
author:         Antonino Parisi
email:          tabman83@gmail.com
date:           25/02/2015 16:17
description:    MQTT broker wrapper
*/

var mosca = require('mosca');
var nconf = require('nconf');

module.exports = new function() {

    var moscaServer = null;

    this.start = function(cb) {
        var pubsubsettings = {
            //using ascoltatore
            type: 'mongo',
            url: nconf.get('db_host') || 'mongodb://localhost:27017/mqtt',
            pubsubCollection: 'mqtt',
            mongo: {}
        };

        var moscaSettings = {
            http: {
                port: nconf.get('mqtt_ws_port') || 3001,
                bundle: true,
                static: './'
            },
            port: nconf.get('mqtt_port') || 1883,           //mosca (mqtt) port
            backend: pubsubsettings   //pubsubsettings is the object we created above
        };

        // mqtt publish -h localhost -t temperature -m '25'
        // mqtt subscribe -v -h localhost -t temperature

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
