
var express = require('express'); // Express web server framework
var request = require('request'); // "Request" library
var google = require('googleapis'); // google apis
var OAuth2 = google.auth.OAuth2; // Auth
var app = express();
var access = {};

var oauth2Client = new OAuth2(
  '918275310607-1rln3gdapg4o6dog2dn2hls94fdub7jd.apps.googleusercontent.com',
  'D_JudSZKHd1mWWlJfUymltyZ',
  'https://localhost:6969/oAuth2Handler'
);

// generate a url that asks permissions for Google+ and Google Calendar scopes
var scopes = [
  'https://www.googleapis.com/auth/plus.me',
  'https://www.googleapis.com/auth/calendar'
];

var url = oauth2Client.generateAuthUrl({
  // 'online' (default) or 'offline' (gets refresh_token)
  access_type: 'offline',
  // If you only need one scope you can pass it as a string
  scope: scopes,
  // Optional property that passes state parameters to redirect URI
  // state: 'foo'
});

app.engine('html', require('ejs').renderFile);

app.set('view engine', 'html');

app.use(express.static(__dirname + '/public'))

app.get('/', function(req, res){
  console.log("OMG IT WORKED1");
  console.log(url);
  res.redirect(url);
 // res.render('index')
});

app.get('/authCallback', function(req, res){
  var data = {};
  data.code = req.query.code; 
  console.log(data.code);
});

console.log('Listening on 6969');
app.listen(6969);