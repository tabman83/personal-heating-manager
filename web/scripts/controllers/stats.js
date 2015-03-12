/**
  * @file        stats.js
  * @author      Antonino Parisi <tabman83@gmail.com>
  * @date        26/02/2015 8:22
  * @description Controller for the statistics view
  */

(function(angular, undefined) {
    'use strict';

    angular.module('PHMApp').controller('StatsController', ['$rootScope', '$scope', 'appSettings', 'Stats', function($rootScope, $scope, appSettings, Stats) {

        $scope.chartTypes = [{
            name: 'Overall',
            fn: 'overall',
            format: function() {
                return 'Total';
            }
        }, {
            name: 'Monthly',
            fn: 'monthly',
            format: function(val) {
                return moment(val).format('MMM YYYY');
            }
        }, {
            name: 'Daily',
            fn: 'daily',
            format: function(val) {
                return moment(val).format('ddd D');
            }
        }];
        $scope.selectedChartType = $scope.chartTypes[0];

        $scope.years = [];
        for( var i=appSettings.charts.initialYear; i<=moment().year(); i++ ) {
            var date = moment().year(i);
            $scope.years.unshift({
                text: i,
                begin: date.startOf('year'),
                end: date.endOf('year')
            });
        }
        $scope.years.unshift({
            text: 'All',
            begin: moment().year(appSettings.charts.initialYear).startOf('year'),
            end: moment().endOf('year')
        });
        $scope.selectedYear = $scope.years[0];

        $scope.months = [];
        for( var i=appSettings.charts.initialYear; i<=moment().year(); i++ ) {
            for( var j=0; j<12; j++ ) {
                var date = moment().year(i).month(j);
                $scope.months.unshift({
                    year: i,
                    name: date.format('MMMM'),
                    begin: date.startOf('month'),
                    end: date.endOf('month')
                });
            }
            $scope.months.unshift({
                year: i,
                name: 'All',
                begin: date.startOf('year'),
                end: date.endOf('year')
            });
        }

        $scope.selectedMonth = $scope.months[0];

        $scope.apply = function() {
            Stats[$scope.selectedChartType.fn](function(result) {

                chart.data = {
                    cols: [{
                        id: 'period', label: 'Period', type: 'date' //date
                    }, {
                        id: 'heating', label: 'Heating', type: 'number'
                    }],
                    rows: []
                };


                angular.forEach(result.durations, function(duration) {
                    var row = {
                        c: [{
                            v: new Date(duration._id),
                            f: moment(duration._id).format('MMM YYYY') //$scope.selectedChartType.format(duration._id)
                        }, {
                            v: duration.value/1000/60/60,
                            f: moment.duration(duration.value).asHours().toPrecision(3)+' hours'
                        }]
                    }
                    chart.data.rows.push(row);

                });

            });
        }

        var chart = {};
        chart.type = 'ColumnChart';

        chart.options = {
            //'title': 'Sales per month',
            //'isStacked': 'true',
            //fill: 20,
            //displayExactValues: true,
            vAxis: {
                title: 'Time (h)',
                format: '#',
                gridlines: {
                    count: -1
                }
            },
            hAxis: {
                title: 'Date',
                type: 'category',
                gridlines: {
                    count: -1
                }
            }
        };

        chart.formatters = {};

        $scope.chart = chart;
    }]);

})(angular);
