// Get github contributions every 5 min
// We don't use the GitHub api here because there's no contributions API

//request for simple http calls
var request = require('request');
//save.js to save json
var save = require('../save.js');
//get username from config file
var config = require('../config.js');

if (!config.github) return;

job('contributions', function(done) {

	//jQuery to scrape DOM
	$ = require('jquery');

	// set up array
	jsonData = new Object;
	//specify interval (in days) of data
	jsonData.interval = 365;

	//request gets my github profile
	request('https://github.com/'+ config.github.username + '/', function (error, response, html) {
	  if (!error && response.statusCode == 200) {
	  	//Use jQuery to scrape html
        var contributions = $(html).find('.contrib-number:first').text().replace(/^[^\d]*/,"").replace(/[^\d]*$/,"");
	 	//convert to number
	 	contributions = parseInt(contributions);
	 	//add to array
	 	jsonData.contributions = contributions;
	 	save.file('github-contributions', jsonData);
	 	console.log('GitHub contributions updated.');
	 	done(jsonData);
	  }
	});

}).every('5m');

job('lastCommit', function(done, contributions) {

	//http options
	var options = {
	    url: 'https://api.github.com/users/' + config.github.username +'/events',
	    headers: {
	        'User-Agent': 'api.me',
	        'Accept': 'Accept: application/vnd.github.v3+json'
	    }
	};

	request(options, function (error, response, data) {
	  if (!error && response.statusCode == 200) {
	  	// deserialize json
	  	data = JSON.parse(data);
	  	var keys = Object.keys(data);
	  	// iterate through keys
	  	 for(var i = 0, length = keys.length; i < length; i++) {
	  	 	//create object for current event
	  	 	currentEvent = data[keys[i]];
	  	 	if (currentEvent.type === "PushEvent") {
	  	 		lastPush = new Object;
	  	 		lastPush.repo_url = "https://github.com/" + currentEvent.repo.name;
	  	 		lastPush.commit_url = lastPush.repo_url + "/commit/" + currentEvent.payload.head;
	  	 		lastPush.commit_message = currentEvent.payload.commits[currentEvent.payload.commits.length -1].message;
	  	 		lastPush.time = currentEvent.created_at;
	  	 		lastPush.repo_name =  currentEvent.repo.name;
	

	  	 		//create github json file

	  	 		github = new Object;
	  	 		github.lastPush = lastPush;
	  	 		github.contributions = contributions.contributions;

	  	 		// save everything

	  	 		save.file('github', github);
	  	 		console.log('github.json updated');
	  	 		save.file('github-last', lastPush);
	  	 		console.log('Last github commit updated.');


	  	 		break;
	  	 	}
	  }
	}

	});
}).after('contributions')