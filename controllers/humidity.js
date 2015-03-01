module.exports = HumidityController;

var HumidityPoint = require('../models/humidityPoint');

function HumidityController() { }

HumidityController.prototype = {

	insertHumidity: function (request, reply) {
		var value = parseInt(request.payload.value, 10);
		if( typeof(value) !== 'number' || isNaN(value) ) {
			reply( { message: 'The parameter \'value\' is not a number.' } ).code(301);
		} else {
			var humidityPoint = new HumidityPoint({
				value: value
			});
			humidityPoint.save(function (err) {
				if (err) {
					console.error(err);
					reply( { message: 'Cannot save humidity.' } ).code(500);
				} else {
					reply( { message: 'Success.' } );
				}
			});
		}
	},

	getHumidity: function (request, reply) {

		var limit = parseInt(request.query.limit, 10);
		if( typeof(value) !== 'number' ) {
			limit: 24*30;
		}

		HumidityPoint
			.find()
			.sort({ date: 'desc' })
			.select({ __v: 0 })
			.limit(limit)
			.exec(queryCallback);

		function queryCallback(err, humidityPoints) {
			if (err) {
				console.error(err);
				reply( { message: 'Cannot retrieve humidities.' } ).code(500);
			} else {
				reply(humidityPoints);
			}
		}
	}


}
