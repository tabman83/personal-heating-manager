/*
file:           schedule.js
author:         Antonino Parisi
email:          tabman83@gmail.com
date:           03/03/2015 13:56
description:    schedule model
*/

var mongoose = require('mongoose');

var scheduleSchema = mongoose.Schema({
    name: String,
    recurrence: String,
    type: String,
    startDate: Date,
    endDate: Date,
    created: {
        type: Date,
        default: Date.now
    }
});

var Schedule = mongoose.model('Schedule', scheduleSchema);

module.exports = Schedule;
