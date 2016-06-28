//get username keys from config file
var config = require('../config.js');
//save.js to save json
var save = require('../save.js');
//request for simple http calls
var request = require('request');
// async to make batch HTTP easy
var async = require('async');
// twitter for ... twitter
var Twitter = require('twitter');

if (!config.social) return;

job('hn', function(done) {
	social = new Object;

	if (config.social.hackernews.id) {
		request('https://hacker-news.firebaseio.com/v0/user/'+ config.social.hackernews.id + '.json', function (error, response, data) {
			data = JSON.parse(data);
			social.hn = new Object;
			social.hn.karma = data.karma;
			social.hn.id = data.id;

			// determine amount of items to fetch
			if (data.submitted.length >= config.social.hackernews.recentItems) {
				items = config.social.hackernews.recentItems;
			} else {
				items = data.submitted.length;
			}

			social.hn.recent = [];

			// start an async queue for http requests
			var queue = async.queue(function (task, done) {
				request('https://hacker-news.firebaseio.com/v0/item/'+ task.item + '.json', function (error, response, data) {
					// remove username & kids from data
					data = JSON.parse(data);
					delete data.by;
					delete data.kids;

					if (data.deleted) {
						done();
					} else {
						// add item url 
						data.url = "http://news.ycombinator.com/item?id=" + task.item;
						social.hn.recent[task.order] = data;
						done();
					}
				});
			}, items);

			for (var i = 0; i < items; i++) {
				item = data.submitted[i];
				queue.push({item: item, order: i});
			};

			// when all are finished, save json

			queue.drain = function() {
				save.file("hn", social);
				console.log("Hacker News data updated.");
			}


		});
	}
}).every('1h');

job('twitter', function(done) {
	if(!config.social.twitter) return;
	var client = new Twitter({
	  consumer_key: config.social.twitter.consumer_key,
	  consumer_secret: config.social.twitter.consumer_secret,
	  access_token_key: config.social.twitter.access_token_key,
	  access_token_secret: config.social.twitter.access_token_secret
	});
	 
	client.get('statuses/user_timeline', function(error, data, response){
	  if (!error) {
	   tweets = new Object;
	   tweets.username = config.social.twitter.username;
	   tweets.url = "https://twitter.com/" + tweets.username;
	   tweets.recent = [];

	   for (var i = 0; i < data.length; i++) {
	   	tweet = new Object;
	   	tweet.text = data[i].text;
	   	tweet.favorite_count = data[i].favorite_count;
	   	tweet.retweet_count = data[i].retweet_count;
	   	tweet.time = data[i].created_at;

	   	// URL is different for retweets
	   	if (data[i].retweeted_status) {
	   		tweet.is_retweet = true;
	   		// find original user to create url
	   		user = data[i].retweeted_status.user.screen_name;
	   	} else {
	   		tweet.is_retweet = false
	   		user = tweets.username;
	   	}

	   	tweet.url = "https://twitter.com/" + user + "/status/" + data[i].id_str;

	   	tweets.recent[i] = tweet;
	   };

	   save.file("twitter", tweets);
	   console.log("Twitter data updated.");
	  }
	});

}).every("5m");

job("pinboard", function(done) {
	request.get("https://api.pinboard.in/v1/posts/all", {
		qs: {
			auth_token: config.pinboard.auth_token,
			format: "json",
			tag: config.pinboard.tag
		}
	}, function(error, response, data) {
		var pinboard = JSON.parse(data);
		save.file("posts", pinboard);
		console.log("Pinboard updated");
	})
}).every("5m");