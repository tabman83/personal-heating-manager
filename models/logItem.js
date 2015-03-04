/*
file:           logItem.js
author:         Antonino Parisi
email:          tabman83@gmail.com
date:           04/03/2015 10:19
description:    log item model
*/

var mongoose = require('mongoose');

var logItemSchema = mongoose.Schema({
    name: String,
    value: Number,
    date: {
        type: Date,
        default: Date.now
    }
});

var LogItem = mongoose.model('LogItem', logItemSchema);

module.exports = LogItem;
