/*
file:           temperaturePoint.js
author:         Antonino Parisi
email:          tabman83@gmail.com
date:           24/02/2015 15:00
description:    temperature point model
*/

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var temperaturePointSchema = new Schema({
    value: Number,
	date: {
		type: Date,
		default: Date.now
	},
});

module.exports = mongoose.model('TemperaturePoint', temperaturePointSchema);
