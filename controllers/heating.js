var moment = require('moment');
var Heating = require('mongoose').model('Heating');

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

		Heating.findLast(queryCallback);

		function queryCallback(err, result) {
			if (err) {
				console.error(err);
				reply( { message: 'Cannot retrieve the heating status.' } ).code(500);
				return;
			}

			if(result) {
				reply({
					status: result.isSwitchedOn,
					date: result.isSwitchedOn ? result.switchedOn : result.switchedOff
				});
			} else {
				reply({
					status: false,
					date: moment(0).startOf('year').toDate()
				});
			}
		}
    },

	getStats: function (request, reply) {

		var aggregation = request.query.aggregation;
		var begin = request.query.begin ? new Date(request.query.begin) : new Date('2000-01-01');
		var end = request.query.end ? new Date(request.query.end) : new Date('2100-01-01');


		var grouping = {};
		switch(aggregation) {
			case 'day':
				grouping = { dayOfYear: '$_id.dayOfYear', year: '$_id.year' };
				break;
			case 'month':
				grouping = { month: '$_id.month', year: '$_id.year' };
				break;
			case 'week':
				grouping = { dayOfWeek: '$_id.week', year: '$_id.year' };
				break;
			default:
				grouping = null;
				aggregation = 'none';
		}


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
				week: { $week: '$switchedOn' },
		        dayOfYear: { $dayOfYear: '$switchedOn' },
		        month: { $month: '$switchedOn' },
		        year: { $year: '$switchedOn' },
			}
	    };
		var stageGrouping = {
			$group : {
		        _id : {
		            dayOfYear: '$dayOfYear',
					week: '$week',
		            month: '$month',
		            year: '$year',
		            duration: '$duration',
		            switchedOn: '$switchedOn',
		            switchedOff: '$switchedOff'
		        }
			}
		}
		var stageMidSort = {
			$sort: { '_id.switchedOn': 1 }
		}
		var stagePush = {
		    $group : {
		        _id : grouping,
		        dates: {
		            $push: {
		                switchedOff: '$_id.switchedOff',
		                switchedOn: '$_id.switchedOn',
		                duration: '$_id.duration'
		            }
		        },
				date: { $first: '$_id.switchedOn' },
		        duration: { $sum : '$_id.duration' }
		    }
		};
		var stageSort = { $sort: { 'date': 1 } };

		Heating.aggregate([stageMatch, stageProject, stageGrouping, stageMidSort, stagePush, stageSort], queryCallback);

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
