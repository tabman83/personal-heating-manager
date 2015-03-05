var humidityTopic = require('nconf').get('mqtt_topic_humidity');
var LogItem = require('mongoose').model('LogItem');

function HumidityController() { }

HumidityController.prototype = {

	insertHumidity: function (request, reply) {
		new LogItem({
			topic: humidityTopic,
			value: request.payload.value
		}).save(function (err) {
			if (err) {
				console.error(err);
				reply( { message: 'Cannot save humidity.' } ).code(500);
				return;
			}
			reply( { message: 'Success.' } );
		});
	},

	getHumidity: function (request, reply) {

		var limit = parseInt(request.query.limit, 10);
		if( typeof(limit) !== 'number' || isNaN(limit) ) {
			limit: -1;
		}

		LogItem
			.find({ topic: humidityTopic })
			.sort({ date: 'desc' })
			.select({ __v: 0 })
			.limit(limit)
			.lean()
			.exec(queryCallback);

		function queryCallback(err, result) {
			if (err) {
				console.error(err);
				reply( { message: 'Cannot retrieve humidities.' } ).code(500);
				return;
			}
			reply(result);
		}
	}
}

module.exports = HumidityController;
