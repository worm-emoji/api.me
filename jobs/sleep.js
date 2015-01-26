// parse to parse sleep spreadsheet
var parse = require('csv-parse');
//save.js to save json
var save = require('../save.js');
// google
var google = require('googleapis');
var OAuth2 = google.auth.OAuth2;
// moment to parse time
var moment = require('moment');
//get api keys from config file
var config = require('../config.js');
var request = require('request');

job('sleep', function(done) {

    var oauth2Client = new OAuth2(config.google.client_id, config.google.client_secret);
    var drive = google.drive({
        version: 'v2',
        auth: oauth2Client
    });

    // Retrieve tokens via token exchange explained above or set them:
    oauth2Client.setCredentials({
        refresh_token: config.google.refresh_token
    });

    // refresh token and get file
    oauth2Client.refreshAccessToken(function(err, tokens) {
    	// download file metadata 
        drive.files.get({
            fileId: config.google.sleepFileId,
            auth: oauth2Client
        }, function(err, response) {
            if (!err) {
            	// download from metadata
            	// use access token to authenticate
                var options = {
                    url: response.downloadUrl,
                    headers: {
                        'User-Agent': 'api.lukemil.es',
                        'Authorization': 'Bearer ' + tokens.access_token
                    }
                };
                // send to next function if it is fetches correctly
                request(options, function(error, response, body) {
                    if (!error && response.statusCode == 200) {
                        parseSleepCSV(body);
                    }

                });
            }
        });
    });

    function parseSleepCSV(csv) {
        //parse CSV
        parse(csv, {
            auto_parse: true
        }, function(err, sleep) {
            //get keys
            var sleepKeys = Object.keys(sleep);
            // create object for days recent sleep data
            var recentSleep = new Object;
            // array for days
            recentSleep.days = [];
            // create variable for total time
            recentSleep.total = 0;
            recentSleep.countedDays = 0;

            // oldest time in unix time that we will accept (default is past two weeks)
            recentSleep.oldest = moment().subtract(config.sleep.days, 'days');

            // console.log(sleepKeys);
            for (var i = 0, length = sleepKeys.length; i < length; i++) {
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
                        recentSleep.days[recentSleep.countedDays] = {time: parseInt(currentDay.format("X")), hours: sleepNumber};
                        recentSleep.total += sleepNumber;
                        // add counted days for average
                        recentSleep.countedDays++;
                    } else {
                        break;
                    }
                }
                // console.log(sleep);
            };
            recentSleep.interval = recentSleep.countedDays;
            // faster method of rounding
            recentSleep.average = Math.round((recentSleep.total / recentSleep.countedDays) * 100) / 100;
            // change last date into unix time
            recentSleep.oldest = parseInt(recentSleep.oldest.format("X"));

            console.log("Sleep data updated.");
            save.file('sleep', recentSleep);

            // console.log("Total: " + totalSleep.toFixed(2) + " hours, with " + sleepTime.length + " entries. Average entry is " + (totalSleep / sleepTime.length).toFixed(2));
            // Need to parse date in this format: 15. 01. 2015 14:16
            // console.log("Woke up at " + moment(currentEntry[4], "DD. MM. YYYY HH:mm").format("dddd, MMMM Do YYYY, h:mm:ss a") + " after sleeping for " + sleep[3][5] + " hours.");

        });

    }

}).every('5m');