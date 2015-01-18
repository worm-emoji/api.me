// parse to parse sleep spreadsheet
var parse = require('csv-parse');
//save.js to save json
var save = require('../save.js');
// filesystem
var fs = require('fs');
// google
var google = require('googleapis');
// moment to parse time
var moment = require('moment');
//get api keys from config file
var config = require('../config.js');
// require plugin to parse moments
require('moment-duration-format');



job('sleep', function(done) {


	// synchronously open the sleep file
	var csv = fs.readFileSync("json/sleep.csv").toString();
	//parse CSV
	parse(csv, {auto_parse: true}, function(err, sleep){
		//get keys
		var sleepKeys = Object.keys(sleep);
		// create object for days recent sleep data
		var recentSleep = new Object;
		// object for days
		recentSleep.days = new Object;
		// create variable for total time
		recentSleep.total = 0;
		recentSleep.countedDays = 0;
		recentSleep["Sunday"] = 0;
		recentSleep["Monday"] = 0;
		recentSleep["Tuesday"] = 0;
		recentSleep["Wednesday"] = 0;
		recentSleep["Thursday"] = 0;
		recentSleep["Friday"] = 0;
		recentSleep["Saturday"] = 0;
		recentSleep.days["Sunday"] = 0;
		recentSleep.days["Monday"] = 0;
		recentSleep.days["Tuesday"] = 0;
		recentSleep.days["Wednesday"] = 0;
		recentSleep.days["Thursday"] = 0;
		recentSleep.days["Friday"] = 0;
		recentSleep.days["Saturday"] = 0;

		// oldest time in unix time that we will accept (default is past two weeks)
		recentSleep.oldest = moment().subtract(config.sleep.days, 'days');

		// console.log(sleepKeys);
		for( var i = 0, length = sleepKeys.length; i < length; i ++ ) {
			currentEntry = sleep[sleepKeys[i]];
			// only look at odd rows because spreadsheet alternates header rows
			// this isn't perfect so we do other validation
			if (currentEntry[0] != "Id" && currentEntry[0] != "") {
				// We only want to look at a subset of the data so we're parsing the time of the row
				// and making sure that it is before the above number. If you want all the data, comment
				// out this conditional.
				// To do this, first get current day.
				currentDay = moment(currentEntry[3], "DD. MM. YYYY h:mm").startOf('day');
				if (currentDay.isAfter(recentSleep.oldest)) {
					// convert time for hours into float
					sleepNumber = parseFloat(currentEntry[5]);

					// iterate to see if there's any more data for the current day
					// this is what catches naps and combines it into one value

					while (moment(sleep[sleepKeys[i + 2]][3], "DD. MM. YYYY h:mm").isAfter(currentDay)) {
						sleepNumber += parseFloat(sleep[sleepKeys[i + 2]][5]);
						i += 2;
					}

					// console.log(currentDay.format("X") + " - " + sleepNumber.toFixed(2) + " hours");
					recentSleep.days[currentDay.format("X")] = sleepNumber;
					recentSleep.days[currentDay.format("dddd")] += sleepNumber;
					recentSleep[currentDay.format("dddd")]++;
					recentSleep.total+= sleepNumber;
					// add counted days for average
					recentSleep.countedDays++;
				}
				else {
					break;
				}
			}
			// console.log(sleep);
		};
		recentSleep.interval = config.sleep.days;

		console.log("Average sleep past " + config.sleep.days + " days: " + (recentSleep.total / recentSleep.countedDays).toFixed(2) + " hours");
		console.log("Average sleep past " + recentSleep["Sunday"] + " Sundays: " + (recentSleep.days["Sunday"] / recentSleep["Sunday"]).toFixed(2));
		console.log("Average sleep past " + recentSleep["Monday"] + " Mondays: " + (recentSleep.days["Monday"] / recentSleep["Monday"]).toFixed(2));
		console.log("Average sleep past " + recentSleep["Tuesday"] + " Tuesdays: " + (recentSleep.days["Tuesday"] / recentSleep["Tuesday"]).toFixed(2));
		console.log("Average sleep past " + recentSleep["Wednesday"] + " Wednesdays: " + (recentSleep.days["Wednesday"] / recentSleep["Wednesday"]).toFixed(2));
		console.log("Average sleep past " + recentSleep["Thursday"] + " Thursdays: " + (recentSleep.days["Thursday"] / recentSleep["Thursday"]).toFixed(2));
		console.log("Average sleep past " + recentSleep["Friday"] + " Fridays: " + (recentSleep.days["Friday"] / recentSleep["Friday"]).toFixed(2));
		console.log("Average sleep past " + recentSleep["Saturday"] + " Saturdays: " + (recentSleep.days["Saturday"] / recentSleep["Saturday"]).toFixed(2));

		// console.log("Total: " + totalSleep.toFixed(2) + " hours, with " + sleepTime.length + " entries. Average entry is " + (totalSleep / sleepTime.length).toFixed(2));
		// Need to parse date in this format: 15. 01. 2015 14:16
	 	// console.log("Woke up at " + moment(currentEntry[4], "DD. MM. YYYY HH:mm").format("dddd, MMMM Do YYYY, h:mm:ss a") + " after sleeping for " + sleep[3][5] + " hours.");
	});

}).every('20m');
