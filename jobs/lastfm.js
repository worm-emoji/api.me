//require last.fm api client
var LastFmNode = require('lastfm').LastFmNode;
//get api keys from config file
var config = require('../config.js');
//save.js to save json
var save = require('../save.js');
// fs to open json
var fs = require('fs');

//initialize api client
var lastfm = new LastFmNode({
  api_key: config.lastfm.key,    // sign-up for a key at http://www.last.fm/api
  secret: config.lastfm.secret,
  useragent: 'api.lukemil.es' // optional. defaults to lastfm-node.
});

// This job returns weekly last.fm play data. 
job('music-weekly', function(done) {
	//get user's weekly artist chart to do weekly play count
	var request = lastfm.request("user.getWeeklyArtistChart", {
	    user: config.lastfm.username,
	    handlers: {
	        success: function(data) {

	        	//create object to later save
	        	var weeklySongs = new Object;
	        	weeklySongs.interval = 7;

	        	//eliminate unneeded data
	        	data = data.weeklyartistchart.artist;
	            //get list of keys
	            var artistkeys = Object.keys(data);
	            // initialize plays variable
	            weeklySongs.plays = 0;
	            //initialize top artist variable
	            weeklySongs.topArtist = new Object;
	            // add number of unique artists to object
	            weeklySongs.uniqueArtists = artistkeys.length;
	            // iterate through keys
	             for( var i = 0, length = artistkeys.length; i < length; i++ ) {
	             	//we have to do parseInt() because the JSON has the number as a string
	                weeklySongs.plays = parseInt(data[artistkeys[ i ] ].playcount) + weeklySongs.plays;

	                // save artist which is number 1
	                if (parseInt(data[artistkeys[i]]['@attr'].rank) === 1) {
	                	weeklySongs.topArtist.name = data[artistkeys[i]].name;
	                	weeklySongs.topArtist.count = parseInt(data[artistkeys[i]].playcount);
	               }
	             }

	             save.file("music-weekly", weeklySongs);

	             console.log('Weekly last.fm data updated.');
	        },
	        error: function(error) {
	            return;
	        }
	    }
	});


}).every('1h');

// gets recent last fm data
job('music-recent', function(done) {
	var request = lastfm.request("user.getRecentTracks", {
		user: config.lastfm.username,
		handlers: {
		    success: function(data) {
		    	//create object to later save
	        	var recentSongs = new Object;
	        	// create object of just songs
	        	recentSongs.songs = [];
	        	recentSongs.interval = 1;
	        	//eliminate unneeded data
	        	recentSongs.nowPlaying = (data.recenttracks.track[0]["@attr"]) ? true : false;
	        	data = data.recenttracks.track;
	            //iterate through artist data...
	            //get list of keys
	            var keys = Object.keys(data);
	            // iterate through keys
	             for(var i = 0, length = keys.length; i < length; i++) {
	             	//create temport object for song 
	             	song = new Object;
	             	// create temporary object for working song from api
	             	lastSong = data[keys[i]];

	             	//scoop up the data we want
	                song.artist = lastSong.artist["#text"];
	                song.name = lastSong.name;
	                song.album = lastSong.album["#text"];
	                song.image = lastSong.image[lastSong.image.length - 1]["#text"];
	                song.url = lastSong.url;
	                // convert spaces to plusses and construct URL
	                song.artistUrl = "http://www.last.fm/music/" + lastSong.artist["#text"].replace(/\s+/g, '+');


	                // cannot figure out why this line creates the error
	                // [TypeError: Cannot read property '#time' of undefined]
	                // it worked at first during my testing and stopped
	                // song["time"] = lastSong["date"]["#time"];
	                // song.date_unix = lastSong["date"].uts

	                //store data in main object
	                recentSongs.songs[keys[i]] = song;

	             }

	             save.file("music-recent", recentSongs);
	             console.log('Recent last.fm data updated.');
	             done(recentSongs);
		    },
		    error: function(error) {
		    	console.log(error);
		    	return;
		    }

		}
	});
}).every('90s');

job('music-combine', function(done, musicRecent) {
	// only combine file if music-weekly exists
	path = "json/music-weekly.json";

	fs.exists(path, function(exists) {
		  if (exists) {
		  	// synchronously open the weekly file
		  	var musicWeekly = JSON.parse(fs.readFileSync(path).toString());
		  	// create new object to dump data in
		  	var music = new Object;

		  	// merge files into one object
		  	music.nowPlaying = musicRecent.nowPlaying;
		  	music.recent = musicRecent.songs;
		  	music.weeklyPlays = musicWeekly.plays;
		  	music.weeklyTopArtist = musicWeekly.topArtist;
		  	music.weeklyUniqueArtists = musicWeekly.uniqueArtists;


		  	// save to music.json
		  	console.log('music.json updated');
		  	save.file("music", music);
		  }
	  });

}).after('music-recent');
