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
            format: '[Total until ] LLLL'
        }, {
            name: 'Monthly',
            fn: 'monthly',
            format: 'MMM YYYY'
        }, {
            name: 'Daily',
            fn: 'daily',
            format: 'ddd D'
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
            Stats[$scope.selectedChartType.fn]({
                //begin: '2015-03-02',
                //end: '2015-03-11'
            },function(result) {



                chart.data = {
                    cols: [{
                        id: 'period', label: 'Period', type: 'date' //date
                    }, {
                        id: 'heating', label: 'Heating', type: 'number'
                    }],
                    rows: []
                };


                angular.forEach(result.durations, function(duration) {
                    var time = duration._id || new Date().getTime();
                    var row = {
                        c: [{
                            v: new Date(time),
                            f: moment(time).format($scope.selectedChartType.format) //$scope.selectedChartType.format(duration._id)
                        }, {
                            v: duration.value/1000/60/60,
                            f: formatDuration(duration.value)
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
                title: 'Time (hours)',
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

        function formatDuration(value) {
            var d = moment.duration(value);
            var h = d.hours();
            var m = d.minutes();
            var result = [];
            if( h === 1) {
                result.push('1 hour');
            }
            if( h > 1) {
                result.push(h + ' hours');
            }
            if( m === 1) {
                result.push('1 minute');
            }
            if( m > 1) {
                result.push(m + ' minutes');
            }
            return result.join(' ');
        }
    }]);

})(angular);
