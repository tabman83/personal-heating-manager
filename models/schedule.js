/*
file:           schedule.js
author:         Antonino Parisi
email:          tabman83@gmail.com
date:           03/03/2015 13:56
description:    schedule model
*/

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var scheduleSchema = new Schema({
    name: String,
    recurrence: String,
    type: String,
    startDate: Date,
    endDate: Date,
    repetition: Array,
    created: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Schedule', scheduleSchema);
