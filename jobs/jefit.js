//get api keys from config file
var config = require('../config.js');
//save.js to save json
var save = require('../save.js');
// jefit
var jefit = require('jefit');

if (!config.jefit) return;

job('fitness', function(done) {
  jefit.fetchMostRecent(config.jefit.userId, function (fitness) {
    save.file("fitness", fitness);
    console.log("Fitness data updated.");
  });
}).every('3h');
