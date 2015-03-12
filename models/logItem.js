/*
file:           logItem.js
author:         Antonino Parisi
email:          tabman83@gmail.com
date:           05/03/2015 10:58
description:    log item model
*/

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var logItemSchema = new Schema({
    topic: {
        type: String,
        required: true
    },
    value: {
        type: Number,
        required: true
    },
    created: {
        type: Date,
        default: Date.now,
        index: true
    }
});

module.exports = mongoose.model('LogItem', logItemSchema);
