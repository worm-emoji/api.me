//get api keys from config file
var config = require('../config.js');
//save.js to save json
var save = require('../save.js');
// fs to open json
var fs = require('fs');
// untappd
var untappd = require('untappd');

if (!config.untappd) return;

job('beer', function(done) {
	var data = {};

	untappd.fetchUserStats(config.untappd.username, function (stats) {
	  data.stats = stats;
	  untappd.fetchLatestCheckin(config.untappd.username, function (latest) {
	    data.latest = latest;
	    untappd.fetchHighestRatedBeers(config.untappd.username, function (highest) {
	      data.highest = highest[0];
	      save.file("beer", data);
	      console.log("Untappd data updated.");

	    });
	  });
	});
}).every('3h');
