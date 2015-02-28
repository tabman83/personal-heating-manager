/*
file:           heaterStatus.js
author:         Antonino Parisi
email:          tabman83@gmail.com
date:           28/02/2015 15:43
description:    heating status model
*/

var mongoose = require('mongoose');

var heaterStatusSchema = mongoose.Schema({
    value: Boolean,
	date: {
		type: Date,
		default: Date.now
	},
});

var HeaterStatus = mongoose.model('HeaterStatus', heaterStatusSchema);

module.exports = HeaterStatus;
