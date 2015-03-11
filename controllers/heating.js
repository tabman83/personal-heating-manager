var HeatingStatus = require('mongoose').model('HeatingStatus');

function HeatingStatusController() { }

HeatingStatusController.prototype = {

	insertStatus: function (request, reply) {
		new HeatingStatus(request.payload).save(function (err) {
			if (err) {
				console.error(err);
				reply( { message: 'Cannot save heating status.' } ).code(500);
				return;
			}
			reply( { message: 'Success.' } );
		});
	},

	getStatus: function (request, reply) {

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
				reply( { message: 'Cannot retrieve the heating status.' } ).code(500);
				return;
			}
			reply( result );
		}
    },

	getStats: function (request, reply) {

		var aggregation = request.query.aggregation;
		var begin = request.query.begin ? new Date(request.query.begin) : new Date('2000-01-01');
		var end = request.query.end ? new Date(request.query.begin) : new Date('2100-01-01');

		var groupId;
		switch( aggregation ) {
			case 'monthly':
				groupId = {
					year: '$year',
					month: '$month'
				}
				break;
			case 'daily':
				groupId = {
					year: '$year',
					dayOfYear: '$dayOfYear'
				}
				break;
			default:
				groupId = null;
				aggregation = 'none';
		}


		HeatingStatus.aggregate([{
			$match: {
				date: {
					$gte: begin,
					$lte: end
				}
			}
		}, {
			$project: {
        		date: 1,
				year: { $year: '$date' },
        		month: { $month: '$date' },
				dayOfYear: { $dayOfYear: '$date' },
        		timestamp: { $cond: [ '$value', { $multiply: [-1, { $subtract: [ '$date', new Date('1970-01-01') ] }] }, { $multiply: [+1, { $subtract: [ '$date', new Date('1970-01-01') ] }] } ] }
    		}
		}, {
    		$group: {
				_id: groupId,
				duration: { $sum: '$timestamp' }
			}
		}], queryCallback)

		function queryCallback(err, result) {
			if (err) {
				console.error(err);
				reply( { message: 'Unable to compute heating statistics.' } ).code(500);
				return;
			}
			reply( {
				begin: begin,
				end: end,
				aggregation: aggregation,
				durations: result
			} );
		}
	}
}

module.exports = HeatingStatusController;
