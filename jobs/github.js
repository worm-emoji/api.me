// Get github contributions every 5 min
// We don't use the GitHub api here because there's no contributions API

job('contributions', function(done) {

	//request for simple http calls
	var request = require('request');
	//jQuery to scrape DOM
	$ = require('jquery');
	//save.js to save json
	save = require('../save.js');
	//get username from config file
	var config = require('../config.js');

	// set up array
	jsonData = new Object;

	//request gets my github profile
	request('https://github.com/'+ config.github.username + '/', function (error, response, html) {
	  if (!error && response.statusCode == 200) {
	  	//Use jQuery to scrape html
        var contributions = $(html).find('.contrib-number:first').text().replace(/^[^\d]*/,"").replace(/[^\d]*$/,"");
	 	//convert to number
	 	contributions = parseInt(contributions);
	 	//add to array
	 	jsonData.contributions = contributions;
	 	save.file('contributions', jsonData);
	 	console.log('GitHub contributions updated.');
	  }
	});

}).every('12h');