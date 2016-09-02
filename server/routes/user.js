var express = require('express');
var router = express.Router();
var passport = require('passport');
var path = require('path');

// Handles Ajax request for user information if user is authenticated
router.get('/', function(req, res) {
  console.log('get /user route');
  // check if logged in
  if(req.isAuthenticated()) {
    //req.isAuthenticated has to be ran for the server to be able to authenticate the status of the session
    // send back user object from database
    //sends in that cookie with the request to passport and checks if they are matching
    //this method is supplied by passport(ask are they authenticated)
    //authenticate the user before you give out any data, that if they are authenticated then send the data!!!
    //checks if our session cookie matches the users cookie
    //isAuthenticated sends a response and finishes our initial get request.
    console.log('logged in');
    res.send(req.user);
    //sends user back to the client
    //req.user is the user object from the DATABASE
  } else {
    // failure best handled on the server. do redirect here.
    console.log('not logged in');
    res.sendFile(path.join(__dirname, '../public/views/index.html'));
    res.send(false);
  }
});

// clear all server session information about this user
router.get('/logout', function(req, res) {
  // Use passport's built-in method to log out the user
  console.log('Logged out');
  req.logOut();
  //calls that method on the request and logs you out
  //passports invalidates the cookie/session (destroys it on the browser and the record on the server)
  //removes any notion of the session(session is the only way it knows which browser it talks to)
  //cookie connects the server with the browser so we can authetnicate shit/user/browser
  res.sendStatus(200);
});


module.exports = router;
