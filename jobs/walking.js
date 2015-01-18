job('walking', function(done) {
	//get api keys from config file
	var config = require('../config.js');
	//get fitbit api client
	Fitbit = require('fitbit');
	//save.js to save json
	var save = require('../save.js')

	//populate client with all keys
	client = new Fitbit(
	  config.fitbit.client_key,
	  config.fitbit.client_secret,
	  { 
	      accessToken: config.fitbit.access_token,
	      accessTokenSecret: config.fitbit.access_secret,
	      unitMeasure: config.fitbit.units
	  }
	);

	// Fetch activities so far today
	client.getActivities(function (err, activities) {
	  if (err) {
	    // Take action
	    return;
	  }

	  // set up array
	  fitnessData = new Object;
	  fitnessData.steps = activities.steps();
	  //add interval of data
	  fitnessData.interval = 1;
	  //get current distance for today
	  fitnessData.distance = activities._attributes.summary.distances[0].distance;
	  //add unit system
	  fitnessData.units = config.fitbit.units;
	  //save json
	  save.file('walking', fitnessData);
	  console.log('Walking data updated.');

});

}).every('5m');