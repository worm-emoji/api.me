// config.js

// about me

me = new Object;
me.name = "Luke Miles"
me.birthDate = "1997-06-09";
me.interests = ["Coffee", "Programming", "Photography"];
me.location = "San Francisco Bay Area";
exports.me = me;

//fitbit keys
fitbit = new Object;
fitbit['client_key'] = "";
fitbit['client_secret'] = "";
fitbit['access_token'] = "";
fitbit['access_secret'] = "";

// whether you want your units in metric or standard
// en_GB gives metric (meters/kilometers)
// en_US is standard (miles)
fitbit['units'] = 'en_US';
//export data
exports.fitbit = fitbit;

//github username
github = new Object;
github.username = "lukemiles";
//export data
exports.github = github;

//last.fm data
lastfm = new Object;
lastfm.key = "";
lastfm.secret = "";
lastfm.username = "notlukemiles";
exports.lastfm = lastfm;

sleep = new Object;
sleep.days = 14;
exports.sleep = sleep;

google = new Object;
google.client_id = "apps.googleusercontent.com";
google.client_secret = "";
google.refresh_token = "";
google.sleepFileId = "";
exports.google = google;

social = new Object;
social.hackernews = new Object;
social.hackernews.id = "firloop";
social.hackernews.recentItems = 10;

social.twitter = new Object;
social.twitter.consumer_key = "";
social.twitter.consumer_secret = "";
social.twitter.access_token_key = "";
social.twitter.access_token_secret = "";
// no @ symbol here
social.twitter.username = "2y4u_";
exports.social = social;

untappd = new Object;
untappd.username = "";

steam = new Object;
steam.apiKey = "";
steam.steamID64 = "";

jefit = new Object;
jefit.userId = "";

pinboard = new Object;
pinboard.auth_token = "lukemiles:null";
pinboard.tag = "publish"
exports.pinboard = pinboard;