/*
file:           heatingStatus.js
author:         Antonino Parisi
email:          tabman83@gmail.com
date:           28/02/2015 15:43
description:    heating status model
*/

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var queue = require("seq-queue").createQueue();

var HeatingSchema = new Schema({
    switchedOn: {
        type: Date,
        required: true,
        index: true
    },
    switchedOff: {
        type: Date,
        required: false,
        default: null,
        index: true
    },
    duration: {
        type: Number,
        default: 0,
        required: true,
    }
});

HeatingSchema.virtual('isSwitchedOn').get(function () {
    return this.switchedOff === null;
});

HeatingSchema.virtual('isSwitchedOff').get(function () {
    return this.switchedOff !== null;
});

HeatingSchema.statics.findLast = function findLast(cb) {
    return this.findOne( {}, {}, {
        sort: {
            switchedOn: -1
        }
    }).exec(cb);
}

HeatingSchema.statics.switchOn = function switchOn (time, cb) {

    var that = this;
    queue.push(function(task) {

        if(arguments.length === 1 && 'function' === typeof time) {
            cb = time;
            time = Date.now();
        }
        that.findLast(function(err, last) {
            if(err) {
                cb(err);
                task.done();
                return;
            }
            if(last && last.isSwitchedOn) {
                // heating is already on
                cb(new Error('Heating is already on.'));
                task.done();
            } else {
                // no heating status or heating off
                var Model = that.model('Heating');
                new Model({
                    switchedOn: time
                }).save(function(result) {
                    cb(result);
                    task.done();
                });
            }
        });

    });
    return this;
}

HeatingSchema.statics.switchOff = function switchOff (time, cb) {

    var that = this;
    queue.push(function(task) {

        if(arguments.length === 1 && 'function' === typeof time) {
            cb = time;
            time = Date.now();
        }
        that.findLast(function(err, last) {
            if(err) {
                cb(err);
                task.done();
                return;
            }
            if( last && last.isSwitchedOn ) {
                // heating is on, then switch off
                last.switchedOff = time;
                last.duration = last.switchedOff - last.switchedOn;
                last.save(function(result) {
                    cb(result);
                    task.done();
                });
            } else {
                // heating is off or no status is present
                cb(new Error('Heating is already off.'));
                task.done();
            }
        });

    });
    return this;
}

module.exports = mongoose.model('Heating', HeatingSchema);
