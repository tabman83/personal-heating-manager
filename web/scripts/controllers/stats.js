/**
  * @file        stats.js
  * @author      Antonino Parisi <tabman83@gmail.com>
  * @date        26/02/2015 8:22
  * @description Controller for the statistics view
  */

(function(angular, undefined) {
    'use strict';

    angular.module('PHMApp').controller('StatsController', ['$rootScope', '$scope', 'appSettings', function($rootScope, $scope, appSettings) {

        $scope.chartTypes = ['Overall', 'Monthly', 'Daily'];
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
            
        }

        $scope.myData = [ [ [1, 3], [2, 14.01], [3.5, 3.14] ] ]; /* [{
          "label": "Uniques",
          "color": "#768294",
          "data": [
            ["Mar", 70],
            ["Apr", 85],
            ["May", 59],
            ["Jun", 93],
            ["Jul", 66],
            ["Aug", 86],
            ["Sep", 60]
          ]
        }, {
          "label": "Recurrent",
          "color": "#1f92fe",
          "data": [
            ["Mar", 21],
            ["Apr", 12],
            ["May", 27],
            ["Jun", 24],
            ["Jul", 16],
            ["Aug", 39],
            ["Sep", 15]
          ]
      }];*/
        $scope.myChartOptions = {};
        /*
            series: {
                lines: {
                    show: false
                },
                points: {
                    show: true,
                    radius: 4
                },
                splines: {
                    show: true,
                    tension: 0.4,
                    lineWidth: 1,
                    fill: 0.5
                }
            },
            grid: {
                borderColor: '#eee',
                borderWidth: 1,
                hoverable: true,
                backgroundColor: '#fcfcfc'
            },
            tooltip: true,
            tooltipOpts: {
                content: function (label, x, y) { return x + ' : ' + y; }
            },
            xaxis: {
                tickColor: '#fcfcfc',
                mode: 'categories'
            },
            yaxis: {
                min: 0,
                max: 150, // optional: use it for a clear represetation
                tickColor: '#eee',
                tickFormatter: function (v) {
                    return v;
                }
            },
            shadowSize: 0
        };*/

    }]);

})(angular);
