var mqtt    = require('mqtt');
var nconf   = require('nconf');
nconf.file('./config.json');
var heaterTopic = nconf.get('mqtt_topic_heater');

var client = mqtt.connect('mqtt://localhost');
client.publish(heaterTopic, new Buffer([1]), function(err) {
	if(err) {
		console.log('Error: ',err);
		client.end();
	} else {
		console.log('Processed (1/2).');

		setTimeout(function() {
			client.publish(heaterTopic, new Buffer([0]), function(err) {
				if(err) {
					console.log('Error: ',err);
				} else {
					console.log('Processed (2/2).');
				}
				client.end();
			});
		}, 2000);
	}
});
