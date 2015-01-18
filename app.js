var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routes = require('./routes/index');
var app = express();
var Tonic = require('tonic');
var tonic = new Tonic();
var fs = require('fs');
//add timestamps in front of log messages
require('console-stamp')(console, '[HH:MM:ss]');

//start tonic task engine
tonic.jobs('jobs');
tonic.start();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', routes);

// function to serve json if it exists
// based on supplied path
function serveJSON(path, res) {
    // allow any script to fetch response
    res.setHeader("Access-Control-Allow-Origin", "*");

    //serve up file only if it exists
    fs.exists(path, function(exists) {
      if (exists) {
        //get file from json directory
        res.sendFile(path, {"root": __dirname});
      } else {
        res.status(404).sendFile('./json/error.json', {"root": __dirname});
      }
      
    });
}


// serve up API

app.get('/v1/:endpoint/', function(req, res){

    file = req.params.endpoint;
    path = "json/" + file + ".json";
    serveJSON(path,res);

 });

// add music endpoints

app.get('/v1/:category/:endpoint', function(req, res){

    file = req.params.endpoint;
    path = "json/" + req.params.category + "-" + file + ".json";
    serveJSON(path, res);

  });
 
// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;