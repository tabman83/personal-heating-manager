/*
file:           heatingStatus.js
author:         Antonino Parisi
email:          tabman83@gmail.com
date:           28/02/2015 15:43
description:    heating status model
*/

var moment = require('moment');
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
    reason: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
        default: 0,
        required: true,
    },
    creation: {
        type: Date,
        default: Date.now,
        required: true,
        index: true
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

// fix when the switch off span multiple days
// fix when the switch on is for a different reason

// syntax: reason, [time], cb
HeatingSchema.statics.switchOn = function switchOn (reason, time, cb) {

    var that = this;
    var Model = that.model('Heating');

    if(arguments.length === 2 && 'function' === typeof time) {
        cb = time;
        time = +moment();
    }

    if(arguments.length === 2 && 'function' !== typeof time) {
        cb = function() {};
    }

    if(arguments.length === 1) {
        time = new Date()
        cb = function() {};
    }

    if(arguments.length === 0) {
        throw new Error('Please specify the \'reason\'.');
    }

    time = +moment(time);

    queue.push(function(task) {

        that.findLast(function(err, last) {
            if(err) {
                cb(err);
                task.done();
                return;
            }
            if(last && last.isSwitchedOn) {
                // heating is already on
                if(last.reason !== reason) {
                    last.switchedOff = time-1;
                    last.duration = last.switchedOff - last.switchedOn;
                    last.save(function(err) {
                        if(err) {
                            cb(err)
                            task.done();
                            return;
                        }
                        new Model({
                            switchedOn: time,
                            reason: reason
                        }).save(function(err) {
                            cb(err)
                            task.done();
                        })
                    })
                } else {
                    cb(null)
                    task.done();
                }
            } else {
                // no heating status or heating off
                new Model({
                    switchedOn: time,
                    reason: reason
                }).save(function(err, result) {
                    if(err) {
                        console.error(err);
                        cb(err);
                        task.done();
                        return;
                    }
                    cb(null);
                    task.done();
                });
            }
        });

    });
    return this;
}

HeatingSchema.statics.switchOff = function switchOff (reason, time, cb) {

    var that = this;
    var Model = that.model('Heating');

    if(arguments.length === 2 && 'function' === typeof time) {
        cb = time;
        time = +moment();
    }

    if(arguments.length === 2 && 'function' !== typeof time) {
        cb = function() {};
    }

    if(arguments.length === 1) {
        time = new Date()
        cb = function() {};
    }

    if(arguments.length === 0) {
        throw new Error('Please specify the \'reason\'.');
    }

    time = +moment(time);


    queue.push(function(task) {

        that.findLast(function(err, last) {
            if(err) {
                cb(err);
                task.done();
                return;
            }
            if( last && last.isSwitchedOn ) {
                // heating is on, then switch off
                if( !moment(time).isSame(last.switchedOn, 'day') ) {
                    // switching off is across midnight
                    last.switchedOff = +moment(last.switchedOn).endOf('day');
                    last.duration = last.switchedOff - last.switchedOn;
                    last.save(function(err) {
                        if(err) {
                            cb(err);
                            task.done();
                            return;
                        }
                        new Model({
                            switchedOn: +moment(time).startOf('day'),
                            switchedOff: time,
                            duration: time-(+moment(time).startOf('day')),
                            reason: last.reason
                        }).save(function(err, result) {
                            if(err) {
                                console.error(err);
                                cb(err);
                                task.done();
                                return;
                            }
                            cb(null);
                            task.done();
                        });

                    });


                } else {
                    last.switchedOff = time;
                    last.duration = last.switchedOff - last.switchedOn;
                    last.save(function(err) {
                        cb(err);
                        task.done();
                    });
                }
            } else {
                // heating is off or no status is present
                cb(null);
                task.done();
            }
        });

    });
    return this;
}

module.exports = mongoose.model('Heating', HeatingSchema);
