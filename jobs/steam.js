//get api keys from config file
var config = require('../config.js');
//save.js to save json
var save = require('../save.js');
var fs = require('fs');

var steam = require('steam-web');

if (!config.steam) return;

var s = new steam({
  apiKey: config.steam.apiKey,
  format: 'json'
});

job('gaming-recent', function(done) {
	s.getRecentlyPlayedGames({
	  steamid: config.steam.steamID64,
	  callback: function(err,gameData) {

	  	var data = gameData.response;

	  	save.file("gaming-recent", data);

    	console.log("Gaming recent updated.");
	  }
	});
}).every('1d');

job('gaming-status', function(done) {
	s.getPlayerSummaries({
	  steamids: [config.steam.steamID64],
	  callback: function(err,gameData) {

	  	var status = {}
	  	var gameData = gameData.response.players[0];
	  	// console.log(JSON.stringify(data.personastate));
	  	// status = new Object;
	  	var state = "";
	  	if (gameData.personastate === 0)
	  		state = "Offline";
	  	else if (gameData.personastate === 1)
	  		state = "Online";
	  	else if (gameData.personastate === 2)
	  		state = "Busy";
	  	else if (gameData.personastate === 3)
	  		state = "Away";
	  	else if (gameData.personastate === 4)
	  		state = "Snooze";

	  	status.state = state;
	  	status.isPlayingGame = false;

	  	if (gameData.gameid) {
	  		status.isPlayingGame = true
	  		status.game = {
	  			id: gameData.gameid,
	  			name: gameData.gameextrainfo
	  		}
	  	}

	  	save.file("gaming-status", status);

    	console.log("Gaming status updated.");
    	done(status);
	  }
	});
}).every('5m');

job('gaming-combine', function(done, gamingStatus) {
	// only combine file if music-weekly exists
	path = "json/gaming-recent.json";

	fs.exists(path, function(exists) {
	  if (exists) {
	  	// synchronously open the recent file
	  	var recentGames = JSON.parse(fs.readFileSync(path).toString());
	  	// create new object to dump data in
	  	var gaming = new Object;

	  	// merge files into one object
	  	gaming.state = gamingStatus.state;
	  	gaming.isPlayingGame = gamingStatus.isPlayingGame;
	  	gaming.currentGame = gamingStatus.game;
	  	gaming.recent = {
	  		count: recentGames.total_count,
	  		games: recentGames.games
	  	};

	  	// save to music.json
	  	console.log('gaming.json updated');
	  	save.file("gaming", gaming);
	  }
  });

}).after('gaming-status');
