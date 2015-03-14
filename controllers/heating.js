var Heating = require('mongoose').model('Heating');

var noAggregationProjectionDate = 1;

var dailyAggregationProjectionDate = {
	$subtract: [ '$date', {
		$add: [ '$ml', { $multiply: [ '$s', 1000 ] }, { $multiply: [ '$m', 60, 1000 ] }, { $multiply: [ '$h', 60, 60, 1000 ] } ]
	}]
}

var monthlyAggregationProjectionDate = {
	$subtract: [ '$date', {
		$add: [ '$ml', { $multiply: [ '$s', 1000 ] }, { $multiply: [ '$m', 60, 1000 ] }, { $multiply: [ '$h', 60, 60, 1000 ] }, { $multiply: [ { $subtract: ['$d', 1] }, 24, 60, 60, 1000 ] } ]
	}]
}

var dailyAggregationProjection = {
	date: 1,
	h: { $hour: '$date' },
	m: { $minute: '$date' },
	s: { $second: '$date' },
	ml: { $millisecond: '$date' },
	timestamp: { $cond: [ '$value', { $multiply: [-1, { $subtract: [ '$date', new Date('1970-01-01') ] }] }, { $multiply: [+1, { $subtract: [ '$date', new Date('1970-01-01') ] }] } ] }
};

var monthlyAggregationProjection = {
	date: 1,
	d: { $dayOfMonth: '$date' },
	h: { $hour: '$date' },
	m: { $minute: '$date' },
	s: { $second: '$date' },
	ml: { $millisecond: '$date' },
	timestamp: { $cond: [ '$value', { $multiply: [-1, { $subtract: [ '$date', new Date('1970-01-01') ] }] }, { $multiply: [+1, { $subtract: [ '$date', new Date('1970-01-01') ] }] } ] }
};

var noAggregationProjection = {
	timestamp: { $cond: [ '$value', { $multiply: [-1, { $subtract: [ '$date', new Date('1970-01-01') ] }] }, { $multiply: [+1, { $subtract: [ '$date', new Date('1970-01-01') ] }] } ] }
};

function HeatingStatusController() { }

HeatingStatusController.prototype = {

	insertStatus: function (request, reply) {
		new Heating(request.payload).save(function (err) {
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

		Heating
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
		var end = request.query.end ? new Date(request.query.end) : new Date('2100-01-01');

		Heating.aggregate([{
			$match: {
				date: {
					$gte: begin,
					$lte: end
				}
			}
		}, {
			$project: {
				date: 1,
				d: { $dayOfMonth: '$date' },
				h: { $hour: '$date' },
				m: { $minute: '$date' },
				s: { $second: '$date' },
				ml: { $millisecond: '$date' },
				timestamp: { $cond: [ '$value', { $multiply: [-1, { $subtract: [ '$date', new Date('1970-01-01') ] }] }, { $multiply: [+1, { $subtract: [ '$date', new Date('1970-01-01') ] }] } ] }
			}
		}, {
    		$project: {
        		value: 1,
				timestamp: 1,
        		day : {
					$subtract: [ '$date', {
						$add: [ '$ml', { $multiply: [ '$s', 1000 ] }, { $multiply: [ '$m', 60, 1000 ] }, { $multiply: [ '$h', 60, 60, 1000 ] } ]
					}]
				},
				month : {
					$subtract: [ '$date', {
						$add: [ '$ml', { $multiply: [ '$s', 1000 ] }, { $multiply: [ '$m', 60, 1000 ] }, { $multiply: [ '$h', 60, 60, 1000 ] }, { $multiply: [ { $subtract: ['$d', 1] }, 24, 60, 60, 1000 ] } ]
					}]
				}
			}
		}, {
			$group : {
        		_id : {
            		day: '$day',
					month: '$month',
            		date: '$date',
            		timestamp: '$timestamp',
            		value: '$value'
        		}
    		}
		}, {
		    $group : {
		        _id :  '$_id.'+aggregation,
		        dates: {
		            $push: {
		                date:'$_id.date',
		                value:'$_id.value',
		                timestamp:'$_id.timestamp'
		            }
		        },
		        duration: { $sum : '$_id.timestamp' }
			}
	    }, {
			$sort: { _id: -1 }
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
