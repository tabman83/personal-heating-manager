/*
file:           logItem.js
author:         Antonino Parisi
email:          tabman83@gmail.com
date:           04/03/2015 10:19
description:    log item model
*/

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var logItemSchema = new Schema({
    topic: String,
    value: Schema.Types.Mixed,
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('LogItem', logItemSchema);
