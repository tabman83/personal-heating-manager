module.exports = TemperatureController;

var TemperaturePoint = require('../models/temperaturePoint');

function TemperatureController() { }

TemperatureController.prototype = {

	insertTemperature: function (request, reply) {
		var value = parseInt(request.params.value, 10);
		if( typeof(value) === 'number' ) {
			reply( { message: '\'value\' parameter is not a number.' } ).code(301);
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

		var queryExec = function (err, temperaturePoints) {
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
			.exec(queryExec);
	}
}
