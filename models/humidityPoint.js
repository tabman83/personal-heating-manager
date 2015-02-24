/*
file:           humidityPoint.js
author:         Antonino Parisi
email:          tabman83@gmail.com
date:           24/02/2015 22:16
description:    humidity point model
*/

var mongoose = require('mongoose');

var humidityPointSchema = mongoose.Schema({
    value: Number,
	date: {
		type: Date,
		default: Date.now
	},
});

var HumidityPoint = mongoose.model('HumidityPoint', humidityPointSchema);

module.exports = HumidityPoint;
