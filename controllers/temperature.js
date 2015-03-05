var temperatureTopic = require('nconf').get('mqtt_topic_temperature');
var LogItem = require('mongoose').model('LogItem');


function TemperatureController() { }

TemperatureController.prototype = {

	insertTemperature: function (request, reply) {
		new LogItem({
			topic: temperatureTopic,
			value: request.payload.value
		}).save(function (err) {
			if (err) {
				console.error(err);
				reply( { message: 'Cannot save temperature.' } ).code(500);
				return;
			}
			reply( { message: 'Success.' } );
		});
	},

	getTemperature: function (request, reply) {

		var limit = parseInt(request.query.limit, 10);
		if( typeof(limit) !== 'number' || isNaN(limit) ) {
			limit: -1;
		}

		LogItem
			.find({ topic: temperatureTopic })
			.sort({ date: 'desc' })
			.select({ __v: 0 })
			.limit(limit)
			.lean()
			.exec(queryCallback);

		function queryCallback(err, result) {
			if (err) {
				console.error(err);
				reply( { message: 'Cannot retrieve temperatures.' } ).code(500);
				return;
			}
			reply(result);
		}
	}
}

module.exports = TemperatureController;
