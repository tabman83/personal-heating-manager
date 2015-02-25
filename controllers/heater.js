var mqttClient = require('../mqtt/mqttClient');
var nconf = require('nconf');
var heaterTopic = nconf.get('mqtt_topic_heater');

function HeaterController() { }

HeaterController.prototype = {

    setHeater: function (request, reply) {
        var value = !!request.payload.value;
		try {
			mqttClient.publish(heaterTopic, value.toString());
			reply( { message: 'Heater status successfully set.' } );
		} catch( err ) {
			console.error(err);
			reply( { message: 'Cannot set Heater status.' } ).code(500);
		}
    },

	getHeater: function (request, reply) {
		reply({
			status: true
		});
    }
}

module.exports = HeaterController;
