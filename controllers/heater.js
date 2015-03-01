var mqttClient = require('../mqtt/mqttClient');
var nconf = require('nconf');
var heaterTopic = nconf.get('mqtt_topic_heater');
var HeaterStatus = require('../models/HeaterStatus');

function HeaterController() { }

HeaterController.prototype = {

    setHeater: function (request, reply) {
        if(request.payload.value === undefined) {
            reply( { message: 'Missing parameter \'value\'.' } ).code(422);
            return;
        }

        var value = !!request.payload.value;
		try {
			mqttClient.publish(heaterTopic, value.toString());
		} catch( err ) {
			console.error(err);
			reply( { message: 'Cannot publish the heater status.' } ).code(500);
            return;
		}

        var heaterStatus = new HeaterStatus({
            value: value,
            date: new Date
        });
        heaterStatus.save(function (err) {
            if (err) {
                console.error(err);
                reply( { message: 'Cannot save the heater status.' } ).code(500);
            } else {
                reply( { message: 'Heater status successfully set.' } );
            }
        });
    },

	getHeater: function (request, reply) {

        var limit = parseInt(request.query.limit, 10);
		if( typeof(value) !== 'number' ) {
			limit: 24*30;
		}

        HeaterStatus
            .find()
            .sort({ date: 'desc' })
            .select({__v: 0 })
            .limit(limit)
            .exec(queryCallback);

		function queryCallback(err, heaterStatuses) {
			if (err) {
				console.error(err);
				reply( { message: 'Cannot retrieve the heater status.' } ).code(500);
			} else {
				reply( heaterStatuses );
			}
		}

    }
}

module.exports = HeaterController;
