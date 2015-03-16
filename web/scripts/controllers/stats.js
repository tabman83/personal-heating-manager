/**
  * @file        stats.js
  * @author      Antonino Parisi <tabman83@gmail.com>
  * @date        26/02/2015 8:22
  * @description Controller for the statistics view
  */

(function(angular, undefined) {
    'use strict';

    angular.module('PHMApp').controller('StatsController', ['$rootScope', '$scope', 'appSettings', 'Stats', function($rootScope, $scope, appSettings, Stats) {

        $scope.showBreakdown = false;

        var serverData = {};

        $scope.chartTypes = [{
            name: 'Overall',
            fn: 'overall',
            format: '[Total until ] LLLL'
        }, {
            name: 'Monthly',
            fn: 'monthly',
            format: 'MMM YYYY'
        }, {
            name: 'Weekly',
            fn: 'weekly',
            format: 'wo YYYY'
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
        for( var im=appSettings.charts.initialYear; im<=moment().year(); im++ ) {
            var datem = null;
            for( var j=0; j<12; j++ ) {
                datem = moment().year(im).month(j);
                $scope.months.unshift({
                    year: im,
                    name: datem.format('MMMM'),
                    begin: datem.startOf('month'),
                    end: datem.endOf('month')
                });
            }
            $scope.months.unshift({
                year: im,
                name: 'All',
                begin: datem.startOf('year'),
                end: datem.endOf('year')
            });
        }

        $scope.selectedMonth = $scope.months[0];

        $scope.$watchGroup(['selectedChartType', 'selectedYear', 'selectedMonth'], function() {
            $scope.showBreakdown = false;
            Stats[$scope.selectedChartType.fn]({
                //begin: '2015-03-02',
                //end: '2015-03-11'
            },function(result) {

                serverData = result.durations;

                chart.data = {
                    cols: [{
                        id: 'period', label: 'Period', type: 'date' //date
                    }, {
                        id: 'heating', label: 'Heating', type: 'number'
                    }],
                    rows: []
                };

                angular.forEach(result.durations, function(el) {

                    var mTime = moment(el.date);
                    var row = {
                        c: [{
                            v: mTime.toDate(),
                            f: mTime.format($scope.selectedChartType.format) //$scope.selectedChartType.format(duration._id)
                        }, {
                            v: el.duration/1000/60/60,
                            f: formatDuration(el.duration)
                        }]
                    };
                    chart.data.rows.push(row);

                });

            });
        });

        var chart = {};
        chart.type = 'ColumnChart';

        chart.options = {
            title: 'Aggregation',
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


        var timeline = {};
        timeline.type = 'Timeline';

        timeline.options = {
            title: 'Timeline',
            vAxis: {
                title: 'Time (hours)',
                format: '#'
            },
            hAxis: {
                title: 'Date'
            }
        };

        timeline.formatters = {};

        $scope.timeline = timeline;

        $scope.onSelectRowFunction = function(selectedItem){
            var dates = serverData[selectedItem.row].dates;

            var m1 = moment(dates[0].switchedOn);
            var m2 = moment(dates[dates.length-1].switchedOn);
            $scope.timelineHeight = 41*(m2.diff(m1,'days'))+120;

            timeline.data = {
                cols: [{
                    id: 'Date', type: 'string' //date
                }, {
                    id: 'Start', type: 'date'
                }, {
                    id: 'End', type: 'date'
                }],
                rows: []
            };

            angular.forEach( dates, function( aDate ) {

                var start = moment(aDate.switchedOn).dayOfYear(1).year(2000).toDate();
                var end = moment(aDate.switchedOff).dayOfYear(1).year(2000).toDate();
                //console.log(start +" - "+end);
                var row = {
                    c: [{
                        v: moment(aDate.switchedOn).format('ddd ll')
                    }, {
                        v: start
                    }, {
                        v: end
                    }]
                };

                timeline.data.rows.push(row);

            });
            $scope.showBreakdown = true;
        };

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
