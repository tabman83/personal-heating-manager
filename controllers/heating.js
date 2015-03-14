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

		var stageMatch = {
			$match: {
				switchedOn: {
					$gte: begin,
					$lte: end
				}
			}
		};
		var stageProject = {
			$project: {
		        switchedOn: 1,
		        switchedOff: 1,
		        duration: 1,
		        dayOfYear: { $dayOfYear: '$switchedOn' },
		        month: { $month: '$switchedOn' },
		        year: { $year: '$switchedOn' },
			}
	    };
		var stageGrouping = {
			$group : {
		        _id : {
		            dayOfYear: '$dayOfYear',
		            month: '$month',
		            year: '$year',
		            duration: '$duration',
		            switchedOn: '$switchedOn',
		            switchedOff: '$switchedOff'
		        }
			}
		}
		var stagePush = {
		    $group : {
		        _id :  {
		            dayOfYear: '$_id.dayOfYear',
		            year: '$_id.year'
		        },
		        dates: {
		            $push: {
		                switchedOff:'$_id.switchedOff',
		                switchedOn:'$_id.switchedOn',
		                duration:'$_id.duration'
		            }
		        },
		        duration: { $sum : '$_id.duration' }
		    }
		};
		var stageSort = {
			$sort: {
		        '_id.year': -1,
		        '_id.dayOfYear': -1
		    }
		};

		Heating.aggregate([stageMatch, stageProject, stageGrouping, stagePush, stageSort], queryCallback);

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
