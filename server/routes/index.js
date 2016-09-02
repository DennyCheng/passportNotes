var express = require('express');
var router = express.Router();
var passport = require('passport');
var path = require('path');

// Handles login form POST from index.html
router.post('/',
    passport.authenticate('local', {
      //parameter 'local' is indicating to use the local strategy
      //we have to authenticate method and use our local strategy(goes to a different file)
      //if you download custom strategies this is where you would pass them in
        // request stays within node/express and is routed as a new request
        successRedirect: '/user',   // goes to routes/user.js(get request) goes to same page
        //successRedirect is hit after we run passport.serializeUser
        //when it redirects it still stays on the server and creates a new GET request goes to app.js(Serverside)
        failureRedirect: '/'        // goes to get '/' route below(request stays within node/request)
        //both of these requests still stays on the server(goes to /user routes)
    })
);

// Handle index file separately
// Also catches any other request not explicitly matched elsewhere
router.get('/', function(req, res) {
  console.log("request for index");
  res.sendFile(path.join(__dirname, '../public/views/index.html'));
});

module.exports = router;
