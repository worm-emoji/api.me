var express = require('express');
var router = express.Router();
var config = require('../config.js');
// moment to parse time
var moment = require('moment');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'api.me' });
});

router.get('/v1/', function(req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
	// calculate age with moment
	age = moment().diff(config.me.birthDate, 'years', true);
    if (moment().format("MMDD") == moment(config.me.birthDate).format("MMDD")) {
        birthday = true;
    } else {
        birthday = false;
    }
    res.json({
    	status: 200,
        name: config.me.name,
        age: age,
        birthday: birthday,
        interests: config.me.interests,
        location: config.me.location,
        endpoints: ['/v1/github', '/v1/github/contributions', '/v1/github/last', '/v1/music', '/v1/music/recent', '/v1/music/weekly', '/v1/sleep', '/v1/walking']
    });
});

module.exports = router;