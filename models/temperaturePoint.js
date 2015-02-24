/*
file:           temperaturePoint.js
author:         Antonino Parisi
email:          tabman83@gmail.com
date:           24/02/2015 15:00
description:    temperature point model
*/

var mongoose = require('mongoose');

var temperaturePointSchema = mongoose.Schema({
    value: Number,
	date: {
		type: Date,
		default: Date.now
	}
});

var TemperaturePoint = mongoose.model('TemperaturePoint', temperaturePointSchema);

module.exports = TemperaturePoint;
