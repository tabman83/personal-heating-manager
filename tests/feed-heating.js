var nconf   = require('nconf');
nconf.file('../config.json');
// load all the models
require('../models/');
var mongoose = require('mongoose');
var readLine = require ('readline');
var moment = require('moment');

var Heating = mongoose.model('Heating');


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
/*
if (process.platform === "win32"){
    var rl = readLine.createInterface ({
        input: process.stdin,
        output: process.stdout
    });

    rl.on ("SIGINT", function (){
        process.emit ("SIGINT");
    });
}
*/
process.on('SIGINT', gracefulExit).on('SIGTERM', gracefulExit);

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function switchOn(m) {
    Heating.switchOn(+m, function(err) {
        if(err) {
            console.log(err);
        }
    });
}

function switchOff(m) {
    Heating.switchOff(+m, function(err) {
        if(err) {
            console.log(err);
        }
    });
}

function main() {
	console.log('Start...\n');


	var m = moment('2014-01-01');

    var today = moment().startOf('day');

	do {

        if(m.days() > 0 && m.days() < 6 ) {
            // weekdays
            m.hours(6).minutes(50).seconds(getRandomInt(0,59));
            switchOn(m);

            m.hours(7).minutes(30).seconds(getRandomInt(0,59));
            switchOff(m);
        } else {
            // weekend
            m.hours(10).minutes(30).seconds(getRandomInt(0,59));
            switchOn(m);

            m.hours(10).minutes(55).seconds(getRandomInt(0,59));
            switchOff(m);
        }

        // random switch on in the afternoon

		var a = getRandomInt(16,22);
		m.hours(a).minutes(getRandomInt(0,58)).seconds(getRandomInt(0,59));
        switchOn(m);
        //console.log('START: ',m.format());
		var b = getRandomInt(a,Math.min(a+1,23));
		if(a===b) {
			m.minutes(getRandomInt(m.minutes()+1,59)).seconds(getRandomInt(0,59));
		} else {
			m.hours(b).minutes(getRandomInt(0,59)).seconds(getRandomInt(0,59));
		}
        switchOff(m);

		if( Math.random() > 0.9 && b < 19 ) {
			var a = getRandomInt(b+1,23)
			m.hours(a).minutes(getRandomInt(0,58));
            switchOn(m);
            //console.log('START: ',m.format());
			var b = getRandomInt(a,23);
			if(a===b) {
				m.minutes(getRandomInt(m.minutes()+1,59));
			} else {
				m.hours(b).minutes(getRandomInt(0,59));
			}
            switchOff(m);
		}

        m.add(1,'days');


	} while( m.isBefore(today) )


	console.log('Stop.\n');
}

openDbConnection(main);
