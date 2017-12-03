//
// # SimpleServer
//
// A simple chat server using Socket.IO, Express, and Async.
//
var http = require('http');
var path = require('path');
var fs = require('fs');
var readline = require('readline');
var google = require('googleapis');
var googleAuth = require('google-auth-library');

var async = require('async');
var socketio = require('socket.io');
var express = require('express');
var request = require('request');


var router = express();
var server = http.createServer(router);
//var io = socketio.listen(server);

router.use(express.static(path.resolve(__dirname, 'client')));
router.engine('html', require('ejs').renderFile);
router.set('view engine', 'html');

router.get('/', function(req, res){
  console.log("OMG IT WORKED1");
  res.render('index')
});

router.get('/oAuth2Handler', function(req, res){
  fs.readFile('client_secret.json', function processClientSecrets(err, content) {
  if (err) {
    console.log('Error loading client secret file: ' + err);
    return;
  }
  var fileData = JSON.parse(content);
  var data = {};
  data.code = req.query.code; 
  data.client_id = fileData.web.client_id;
  data.client_secret = fileData.web.client_secret;
  data.redirect_uri = fileData.web.redirect_uri;
  data.grant_type = "authorization_code";
   request({
    method: 'POST',
    preambleCRLF: true,
    postambleCRLF: true,
    uri: 'https://accounts.google.com/o/oauth2/token',
    multipart: [
      {
        'content-type': 'application/x-www-form-urlencoded',
        body: JSON.stringify(data)
      }
    ]
    });
  });
});

// If modifying these scopes, delete your previously saved credentials
// at ~/.credentials/calendar-nodejs-quickstart.json
var SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];
var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
    process.env.USERPROFILE) + '/.credentials/';
var TOKEN_PATH = TOKEN_DIR + 'calendar-nodejs-quickstart.json';

// Load client secrets from a local file.
fs.readFile('client_secret.json', function processClientSecrets(err, content) {
  if (err) {
    console.log('Error loading client secret file: ' + err);
    return;
  }
  // Authorize a client with the loaded credentials, then call the
  // Google Calendar API.
  authorize(JSON.parse(content), null);
});

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 *
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(json, callback) {
  var clientSecret = json.web.client_secret;
  var clientId = json.web.client_id;
  var redirectUrl = json.web.redirect_uri;
  var auth = new googleAuth();
  var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);
  
  getNewToken(oauth2Client, callback);
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 *
 * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback to call with the authorized
 *     client.
 */
function getNewToken(oauth2Client, callback) {
  var authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES
  });
  request.get(authUrl);
  console.log('Authorize this app by visiting this url: ', authUrl);
}

server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("Chat server listening at", addr.address + ":" + addr.port);
});