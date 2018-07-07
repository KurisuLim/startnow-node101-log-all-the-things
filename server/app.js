const express = require('express');
const morgan = require('morgan');
const fs = require('fs');
const app = express();
const moment = require('moment');
var dataLog = []

// Add Middleware
app.use(morgan('dev'));


// Check file access
fs.access('/log.csv',fs.constants.R_OK | fs.constants.W_OK, (err) => {
  console.log(err ? 'no access!' : 'can read/write');
});

app.use((req, res, next) => {
// write your logging code here
  var agent = req.headers['user-agent'];
  var date = new Date();
  var dateIso = date.toISOString();
  var method = req.method;
  var path = req._parsedUrl.path;
  var version = 'HTTP/' + req.httpVersion;
  var statusCode = 200;
  var dataInfo = agent + ',' + dateIso + ','+
  method + ',' + path + ',' + version + ',' +
  statusCode + ',' + '\n';

  
  var log = {
    'Agent': req.headers['user-agent'],
    'Time': dateIso,
    'Method': req.method,
    'Resource' : req._parsedUrl.path,
    'Version': 'HTTP/' + req.httpVersion,
    'Status' : 200
  }
  dataLog.push(log);

  console.log(dataInfo)

  fs.appendFile('server/log.csv', dataInfo, (err) => {
    if (err) throw err;
    //console.log('The "data to append" was append to file');
});

  next();
});

app.get('/', (req, res) => {
// write your code to respond "ok" here
  res.send('OK');
});

app.get('/logs', (req, res) => {
  // write your code to return a json object containing the log data here
 
    res.json(dataLog);
  
});

module.exports = app;
