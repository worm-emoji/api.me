// parse to parse sleep spreadsheet
var parse = require('csv-parse');
//save.js to save json
var save = require('../save.js');
// filesystem
var fs = require('fs');
// moment to parse time
var moment = require('moment');



job('sleep', function(done) {

	// synchronously open the sleep file
	var sleep = fs.readFileSync("json/sleep.csv").toString();
	//parse CSV
	parse(sleep, {auto_parse: true}, function(err, output){
		// Need to parse date in this format: 15. 01. 2015 14:16
	 	console.log("Woke up at " + moment(output[3][4], "DD. MM. YYYY HH:mm").format("dddd, MMMM Do YYYY, h:mm:ss a") + " after sleeping for " + output[3][5] + " hours.");
	});

}).every('20m');