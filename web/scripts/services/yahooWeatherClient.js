/**
  * @file        yahooWeatherClient.js
  * @author      Antonino Parisi <tabman83@gmail.com>
  * @date        27/02/2015 08:41
  * @description Yahoo Weather client
  */

(function(angular, undefined) {
    'use strict';

    angular.module('PHMApp').factory('yahooWeatherClient', ['$http', '$q', 'appSettings', function($http, $q, appSettings) {

        var yahooWeatherClient = function() {

            var conditionCode = {
            	'0': 'wi-tornado',
            	'1': 'wi-day-storm-showers',
            	'2': 'wi-hurricane',
            	'3': 'wi-thunderstorm',
            	'4': 'wi-day-thunderstorm',
            	'5': 'wi-day-sleet',
            	'6': 'mixed rain and sleet',
            	'7': 'mixed snow and sleet',
            	'8': 'freezing drizzle',
            	'9': 'wi-day-rain-mix',
            	'10': 'wi-rain-mix',
            	'11': 'wi-showers',
            	'12': 'wi-showers',
            	'13': 'wi-day-snow-thunderstorm',
            	'14': 'wi-day-sleet',
            	'15': 'wi-snow-wind',
            	'16': 'wi-snow',
            	'17': 'wi-hail',
            	'18': 'wi-sleet',
            	'19': 'wi-dust',
            	'20': 'wi-fog',
            	'21': 'wi-day-haze',
            	'22': 'wi-smoke',
            	'23': 'wi-day-windy',
            	'24': 'wi-cloudy-windy',
            	'25': 'wi-snowflake-cold',
            	'26': 'wi-cloudy',
            	'27': 'wi-night-cloudy',
            	'28': 'wi-day-cloudy',
            	'29': 'night-partly-cloudy',
            	'30': 'wi-day-sunny-overcast',
            	'31': 'wi-night-clear',
            	'32': 'wi-day-sunny',
            	'33': 'wi-night-clear',
            	'34': 'wi-day-sunny',
            	'35': 'wi-rain-mix',
            	'36': 'wi-hot',
            	'37': 'wi-day-thunderstorm',
            	'38': 'wi-thunderstorm',
            	'39': 'wi-thunderstorm',
            	'40': 'wi-showers',
            	'41': 'wi-day-snow-thunderstorm',
            	'42': 'wi-day-snow',
            	'43': 'wi-day-snow-thunderstorm',
            	'44': 'wi-day-cloudy',
            	'45': 'wi-storm-showers',
            	'46': 'wi-day-snow',
            	'47': 'wi-day-storm-showers',
            	'3200': 'wi-meteor'
            };

            var deferred = $q.defer();
            var query = 'select * from weather.forecast where woeid in (select woeid from geo.places(1) where text="{0}") and u="c"';
            var url = 'https://query.yahooapis.com/v1/public/yql?format=json&q='+query.replace('{0}', appSettings.weather.location);

            $http.get(url).success(function(data) {
                if(data.query.results === null) {
                    deferred.reject('Cannot find the location');
                } else {
                    deferred.resolve(data.query.results.channel);
                }
            }).error(function(err){
                deferred.reject(err);
            });

            this.getConditionIcon = function(code) {
                return conditionCode[code];
            }

            this.getWeather = function() {
                return deferred.promise;
            }
        }

        return new yahooWeatherClient();

    }]);

})(angular);
