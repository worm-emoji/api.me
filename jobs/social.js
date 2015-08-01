//get username keys from config file
var config = require('../config.js');
//save.js to save json
var save = require('../save.js');
//request for simple http calls
var request = require('request');
// async to make batch HTTP easy
var async = require('async');

if (!config.social) return;

job('social', function(done) {
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

					// add item url 
					data.url = "http://news.ycombinator.com/item?id=" + task.item;
					social.hn.recent[task.order] = data;
					done();
				});
			}, items);

			for (var i = 0; i < items; i++) {
				item = data.submitted[i];
				queue.push({item: item, order: i});
			};

			// when all are finished, save json

			queue.drain = function() {
				save.file("social", social);
				console.log("Hacker News data updated.");
			}


		});
	}
}).every('1h');