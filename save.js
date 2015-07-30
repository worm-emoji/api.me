var fs = require('fs');
//moment to record time
var moment = require('moment');

//saves json to disk to be analyzed later
exports.file = function (filename, data) {

	//add 200 status code
	data.status = 200;

	data.lastUpdated = moment().format("dddd, MMMM Do YYYY, h:mm:ss a Z");

	//convert object to json
	json = JSON.stringify(data);

  var filenameFormatted = '/' + apiVersion + '/' + filename.replace('-','/');
  if(typeof routeList[filenameFormatted] === 'undefined') {
    routeList.push(filenameFormatted);
    routeList.sort();
  }

	fs.writeFile("json/" + filename + '.json', json, function(err) {
	    if(err) {
	        console.log(err);
	    } 
	}); 
}