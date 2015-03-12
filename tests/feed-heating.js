var nconf   = require('nconf');
nconf.file('../config.json');
// load all the models
require('../models/');
var mongoose = require('mongoose');
var readLine = require ('readline');
var moment = require('moment');

var HeatingStatus = require('mongoose').model('HeatingStatus');


function openDbConnection(cb) {
    mongoose.connection.on('error', function(err) {
        console.error('Could not connect to database.', err);
        cb(err);
    });
    mongoose.connection.once('open', function (callback) {
        console.log('Database connection successfully established.');
        cb(null);
    });
    var options = {
        server: {
            socketOptions: {
                keepAlive: 1
            }
        },
        replset: {
            socketOptions: {
                keepAlive: 1
            }
        }
    }
    try {
        mongoose.connect(nconf.get('db_host') || 'mongodb://localhost/PHM', options);
    } catch (err) {
        console.log('Could not connect to database.', err);
        cb(err);
    }
}

function gracefulExit () {
    mongoose.connection.close(function () {
        console.log('Mongoose default connection is disconnected through app termination');
        process.exit(0);
    });
}

if (process.platform === "win32"){
    var rl = readLine.createInterface ({
        input: process.stdin,
        output: process.stdout
    });

    rl.on ("SIGINT", function (){
        process.emit ("SIGINT");
    });

}
process.on('SIGINT', gracefulExit).on('SIGTERM', gracefulExit);

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function addOn(m) {
    var hs = new HeatingStatus({
		value: true,
		date: m
	});
    hs.save();
}

function addOff(m) {
    var hs = new HeatingStatus({
		value: false,
		date: m
	});
    hs.save();
}

function main() {
	console.log('Start...\n');
	/*
	var hs = new HeatingStatus({
		value:
		date:
	});*/
	var m = moment('2014-01-01');

    var today = moment().startOf('day');

	do {

		m.hours(6).minutes(50).seconds(0);
        addOn(m);
		//console.log('START: ',m.format());

		m.hours(7).minutes(30).seconds(0);
        addOff(m);
        //console.log('STOP: ',m.format());

		var a = getRandomInt(16,22);
		m.hours(a).minutes(getRandomInt(0,59));
        addOn(m);
        //console.log('START: ',m.format());
		var b = getRandomInt(a,Math.min(a+1,23));
		if(a===b) {
			m.add(getRandomInt(0,59), 'minutes');
		} else {
			m.hours(b).minutes(getRandomInt(0,59));
		}
        addOff(m);
        //console.log('STOP: ',m.format());


		if( Math.random() > 0.85 && b < 19 ) {
			var a = getRandomInt(b+1,23)
			m.hours(a).minutes(getRandomInt(0,59));
            addOn(m);
            //console.log('START: ',m.format());
			var b = getRandomInt(a,23);
			if(a===b) {
				m.add(getRandomInt(0,59), 'minutes');
			} else {
				m.hours(b).minutes(getRandomInt(0,59));
			}
            addOff(m);
            //console.log('STOP: ',m.format());
		}

        m.add(1,'days');


	} while( m.isBefore(today) )


	console.log('Stop.\n');
}

openDbConnection(main);
