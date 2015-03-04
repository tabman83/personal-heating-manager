var TemperaturePoint = require('mongoose').model('TemperaturePoint');

function TemperatureController() { }

TemperatureController.prototype = {

	insertTemperature: function (request, reply) {
		var value = parseInt(request.payload.value, 10);
		if( typeof(value) !== 'number' || isNaN(value) ) {
			reply( { message: 'The parameter \'value\' is not a number.' } ).code(301);
		} else {
			var temperaturePoint = new TemperaturePoint({ value: value });
			temperaturePoint.save(function (err) {
				if (err) {
					console.error(err);
					reply( { message: 'Cannot save temperature.' } ).code(500);
				} else {
					reply( { message: 'Success.' } );
				}
			});
		}
	},

	getTemperature: function (request, reply) {

		var limit = parseInt(request.query.limit, 10);
		if( typeof(value) !== 'number' ) {
			limit: 24*30;
		}

		function queryCallback(err, temperaturePoints) {
			if (err) {
				console.error(err);
				reply( { message: 'Cannot retrieve temperatures.' } ).code(500);
			} else {
				reply(temperaturePoints);
			}
		}

		TemperaturePoint
			.find()
			.sort({ date: 'desc' })
			.select({ _id: 0, __v: 0 })
			.limit(limit)
			.exec(queryCallback);
	}
}

module.exports = TemperatureController;
