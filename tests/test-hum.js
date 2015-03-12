var mqtt    = require('mqtt');
var nconf   = require('nconf');
nconf.file('../config.json');
var topic = nconf.get('mqtt_topic_humidity');

var client = mqtt.connect('mqtt://localhost');

var message = new Buffer(4);
var num = Math.random()*100;
message.writeFloatBE(num, 0);
client.publish(topic, message, function(err) {
	if(err) {
		console.log('Error: ',err);
	} else {
		console.log('Processed.');
	}
	client.end();
});
