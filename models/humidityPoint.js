/*
file:           humidityPoint.js
author:         Antonino Parisi
email:          tabman83@gmail.com
date:           24/02/2015 22:16
description:    humidity point model
*/

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var humidityPointSchema = new Schema({
    value: Number,
	date: {
		type: Date,
		default: Date.now
	},
});

module.exports = mongoose.model('HumidityPoint', humidityPointSchema);
