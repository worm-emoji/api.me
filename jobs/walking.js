job('walking', function(done) {
	//get api keys from config file
	var config = require('../config.js');
	//get fitbit api client
	Fitbit = require('fitbit');
	//save.js to save json
	save = require('../save.js')

	//populate client with all keys
	client = new Fitbit(
	    config.fitbit.client_key
	  , config.fitbit.client_secret
	  , { 
	        accessToken: config.fitbit.access_token
	      , accessTokenSecret: config.fitbit.access_secret
	      , unitMeasure: config.fitbit.units
	    }
	);

	// Fetch activities so far today
	client.getActivities(function (err, activities) {
	  if (err) {
	    // Take action
	    return;
	  }

	  // set up array
	  jsonData = new Object;
	  jsonData.steps = activities.steps();
	  //get current distance for today
	  jsonData.distance = activities._attributes.summary.distances[0].distance;
	  //add unit system
	  jsonData.units = config.fitbit.units;
	  //save json
	  save.file('walking', jsonData);
	  console.log('Walking data updated.');

});

}).every('15m');