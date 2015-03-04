var heaterTopic = require('nconf').get('mqtt_topic_heater');
var HeaterStatus = require('mongoose').model('HeaterStatus');

function HeaterController() { }

HeaterController.prototype = {

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
