var HeatingStatus = require('mongoose').model('HeatingStatus');

function HeatingStatusController() { }

HeatingStatusController.prototype = {

	insertHeatingStatus: function (request, reply) {
		new HeatingStatus(request.payload).save(function (err) {
			if (err) {
				console.error(err);
				reply( { message: 'Cannot save heating status.' } ).code(500);
				return;
			}
			reply( { message: 'Success.' } );
		});
	},

	getHeatingStatus: function (request, reply) {

        var limit = parseInt(request.query.limit, 10);
		if( typeof(limit) !== 'number' || isNaN(limit) ) {
			limit: -1;
		}

		HeatingStatus
            .find()
            .sort({ date: 'desc' })
            .select({__v: 0 })
            .limit(limit)
            .exec(queryCallback);

		function queryCallback(err, result) {
			if (err) {
				console.error(err);
				reply( { message: 'Cannot retrieve the heater status.' } ).code(500);
				return;
			}
			reply( result );
		}

    }
}

module.exports = HeatingStatusController;
