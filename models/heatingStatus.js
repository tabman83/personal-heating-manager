/*
file:           heatingStatus.js
author:         Antonino Parisi
email:          tabman83@gmail.com
date:           28/02/2015 15:43
description:    heating status model
*/

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var heatingStatusSchema = new Schema({
    value: Boolean,
	date: {
		type: Date,
		default: Date.now
	},
});

heatingStatusSchema.pre('save', function (next) {

    var actualStatusValue = this.value;

    mongoose.model('HeatingStatus').find().sort({ date: 'desc' }).limit(1).exec(function(err,lastHeatingStatus) {
        var lastStatusValue = lastHeatingStatus.pop().value;
        if(actualStatusValue === lastStatusValue) {
            var err = new Error('Duplicate last value for heating status.');
            next(err);
        } else {
            next(null);
        }
    });
});

module.exports = mongoose.model('HeatingStatus', heatingStatusSchema);
